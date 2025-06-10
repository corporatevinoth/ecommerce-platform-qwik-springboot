import { component$, useSignal, useTask$ } from '@builder.io/qwik';

// Define a simple Product interface matching your Spring Boot Product model
// Adjust these types if your actual Product model has more/different fields.
interface Product {
  id: string; // Assuming Spring Boot returns ID as string (UUID) or Long
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  // Add other fields like 'image' if your Product service provides them
}

export default component$(() => {
  const products = useSignal<Product[]>([]);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  // Access the product service URL from environment variables
  const PRODUCT_SERVICE_API_URL = import.meta.env.VITE_PRODUCT_SERVICE_API_URL;

  // useTask$ is used for data fetching on component load
  useTask$(async ({ track }) => {
    // Re-run this task if the API URL changes (though it's usually static)
    track(() => PRODUCT_SERVICE_API_URL);

    if (!PRODUCT_SERVICE_API_URL) {
      error.value = "Product Service API URL is not defined in environment variables.";
      loading.value = false;
      return;
    }

    // Log the URL that Qwik is attempting to fetch from.
    // This will appear in the terminal where `npm run dev` is running.
    console.log('Qwik attempting to fetch products from:', PRODUCT_SERVICE_API_URL);

    try {
      loading.value = true;
      error.value = null; // Clear previous errors

      const response = await fetch(PRODUCT_SERVICE_API_URL);

      // --- ADDED FOR MORE DEBUGGING ---
      console.log('Response Status:', response.status);
      console.log('Response Content-Type:', response.headers.get('Content-Type'));
      const responseText = await response.text(); // Read the response body as text
      console.log('Raw Response Text:', responseText.substring(0, 500)); // Log first 500 chars
      // --- END ADDED FOR MORE DEBUGGING ---

      if (!response.ok) {
        // Handle HTTP errors based on the status and responseText
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      // Try to parse the text as JSON
      const data = JSON.parse(responseText); 
      products.value = data; // Assign fetched data to the signal
    } catch (e: any) {
      console.error('Failed to fetch products:', e);
      error.value = `Failed to load products: ${e.message || 'Unknown error'}. Please check backend service.`;
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>

      {loading.value && (
        <div class="flex justify-center items-center h-32">
          <p class="text-gray-600">Loading products...</p>
        </div>
      )}

      {error.value && (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Error: </strong>
          <span class="block sm:inline">{error.value}</span>
        </div>
      )}

      {!loading.value && !error.value && products.value.length === 0 && (
        <p class="text-gray-600">No products found.</p>
      )}

      {!loading.value && !error.value && products.value.length > 0 && (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.value.map((product) => (
            <div key={product.id} class="bg-white rounded-lg shadow-md overflow-hidden p-4">
              <h2 class="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p class="text-gray-600 text-sm">{product.description}</p>
              <p class="text-xl font-bold text-pink-600 mt-2">${product.price.toFixed(2)}</p>
              {/* You can add more product details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
