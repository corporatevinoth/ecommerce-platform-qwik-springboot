import { component$, useSignal, useTask$, useContext, $ } from '@builder.io/qwik'; // <<< ENSURE '$' IS INCLUDED HERE
import { Link } from '@builder.io/qwik-city';

import { cn } from '../../lib/utils';

import { CART_CONTEXT, CartItem } from '../../context/cart';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export default component$(() => {
  const products = useSignal<Product[]>([]);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  // Use absolute URL for SSR via Vite proxy
  const QWIK_DEV_BASE_URL = 'http://localhost:5173';
  const PRODUCT_SERVICE_API_URL = `${QWIK_DEV_BASE_URL}/api/products`;

  // Get the cart signal from context
  const cartSignal = useContext(CART_CONTEXT);

  // Wrap handleAddToCart with $() to make it a QRL
  const handleAddToCart = $((product: Product) => {
    cartSignal.value = {
      ...cartSignal.value,
      items: cartSignal.value.items.some(item => item.id === product.id)
        ? cartSignal.value.items.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...cartSignal.value.items, { id: product.id, name: product.name, price: product.price, quantity: 1 }],
    };
    console.log('Cart updated:', cartSignal.value.items);
  });

  useTask$(async ({ track }) => {
    track(() => PRODUCT_SERVICE_API_URL);

    if (!PRODUCT_SERVICE_API_URL) {
      error.value = "Product Service API URL is not defined.";
      loading.value = false;
      return;
    }

    console.log('Qwik attempting to fetch products from (via proxy):', PRODUCT_SERVICE_API_URL);

    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(PRODUCT_SERVICE_API_URL);

      console.log('Response Status:', response.status);
      console.log('Response Content-Type:', response.headers.get('Content-Type'));
      const responseText = await response.text();
      console.log('Raw Response Text (first 500 chars):', responseText.substring(0, 500));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      products.value = data;
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
          {products.value.map((product) => {
            const isProductInCart = cartSignal.value.items.some(item => item.id === product.id);
            return (
              <Link key={product.id} href={`/products/${product.id}`} class="block hover:shadow-lg transition-shadow">
                <div class="bg-white rounded-lg shadow-md overflow-hidden p-4">
                  <h2 class="text-lg font-semibold text-gray-800">{product.name}</h2>
                  <p class="text-gray-600 text-sm">{product.description}</p>
                  <p class="text-xl font-bold text-pink-600 mt-2">{formatCurrency(product.price)}</p>
                  <div class="mt-4 flex items-center justify-between">
                    <button
                      onClick$={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={isProductInCart}
                      class={cn(
                        "bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors",
                        isProductInCart && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isProductInCart ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 inline-block"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                          Added
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 inline-block"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button class="text-gray-600 hover:text-pink-600 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});