import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';

// Define the Product interface to match your Spring Boot Product model
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export default component$(() => {
  // useSignal creates a reactive signal to hold the products data
  const products = useSignal<Product[]>([]);
  // useSignal to handle loading state
  const isLoading = useSignal(true);
  // useSignal to handle error state
  const error = useSignal<string | null>(null);

  // useVisibleTask$ runs when the component becomes visible in the browser
  // This is where we'll fetch data
  useVisibleTask$(async ({ cleanup }) => {
    console.log('Fetching products...');
    try {
      // Ensure this URL matches your Spring Boot Product Service port
      const response = await fetch('https://turbo-orbit-x9j9j95pvv5c49p-8081.app.github.dev/api/products');

      if (!response.ok) {
        // If response is not OK (e.g., 404, 500), throw an error
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      products.value = data; // Update the signal with fetched data
    } catch (e: any) {
      console.error('Failed to fetch products:', e);
      error.value = e.message || 'An unknown error occurred while fetching products.';
    } finally {
      isLoading.value = false; // Set loading to false once fetch is complete (or errors out)
    }

    // Optional cleanup function (e.g., to cancel ongoing requests)
    cleanup(() => {
      console.log('Product fetch task cleaning up...');
    });
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Product Catalog</h1>

      {isLoading.value && <p>Loading products...</p>}
      {error.value && <p style={{ color: 'red' }}>Error: {error.value}</p>}

      {!isLoading.value && !error.value && products.value.length === 0 && (
        <p>No products available. Add some using the API (e.g., via `curl`).</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {products.value.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>{product.name}</h2>
            <p style={{ color: '#555', marginBottom: '5px' }}>{product.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#007bff' }}>Price: ${product.price.toFixed(2)}</p>
            <p style={{ fontSize: '0.9em', color: '#888' }}>Stock: {product.stockQuantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
});