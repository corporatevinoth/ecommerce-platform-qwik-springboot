import { component$, useSignal, useTask$, useContext, $ } from '@builder.io/qwik'; // <<< ENSURE '$' IS INCLUDED HERE
import { useLocation } from '@builder.io/qwik-city';

import { cn } from '../../../lib/utils';

import { CART_CONTEXT, CartItem } from '../../../context/cart';

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
  const loc = useLocation();
  const productId = useSignal<string | null>(null);
  const product = useSignal<Product | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  const QWIK_DEV_BASE_URL = 'http://localhost:5173';
  const PRODUCT_SERVICE_BASE_API_URL = `${QWIK_DEV_BASE_URL}/api/products`;

  const cartSignal = useContext(CART_CONTEXT);

  const handleAddToCart = $((prod: Product) => {
    cartSignal.value = {
      ...cartSignal.value,
      items: cartSignal.value.items.some(item => item.id === prod.id)
        ? cartSignal.value.items.map(item =>
            item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...cartSignal.value.items, { id: prod.id, name: prod.name, price: prod.price, quantity: 1 }],
    };
    console.log('Cart updated:', cartSignal.value.items);
  });


  useTask$(({ track }) => {
    track(() => loc.params.id);
    productId.value = loc.params.id;
  });

  useTask$(async ({ track }) => {
    const idToFetch = track(() => productId.value);

    if (!idToFetch) {
      product.value = null;
      loading.value = false;
      error.value = null;
      return;
    }

    const API_URL = `${PRODUCT_SERVICE_BASE_API_URL}/${idToFetch}`;

    console.log('Qwik attempting to fetch product details from:', API_URL);

    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(API_URL);

      console.log('Product Details Response Status:', response.status);
      console.log('Product Details Response Content-Type:', response.headers.get('Content-Type'));
      const responseText = await response.text();
      console.log('Product Details Raw Response Text (first 500 chars):', responseText.substring(0, 500));

      if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Product with ID ${idToFetch} not found.`);
        }
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      product.value = data;
    } catch (e: any) {
      console.error('Failed to fetch product details:', e);
      error.value = `Failed to load product details: ${e.message || 'Unknown error'}. Please check backend service.`;
    } finally {
      loading.value = false;
    }
  });

  const isProductInCart = product.value ? cartSignal.value.items.some(item => item.id === product.value?.id) : false;

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Product Details</h1>

      {loading.value && (
        <div class="flex justify-center items-center h-32">
          <p class="text-gray-600">Loading product details...</p>
        </div>
      )}

      {error.value && (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Error: </strong>
          <span class="block sm:inline">{error.value}</span>
        </div>
      )}

      {!loading.value && !error.value && !product.value && (
        <p class="text-gray-600">Product not found or invalid ID.</p>
      )}

      {!loading.value && !error.value && product.value && (
        <div class="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex justify-center items-center">
            <img
                src={`https://placehold.co/400x300/FEE2E2/EF4444?text=${product.value.name.replace(/\s/g, '+')}`}
                alt={product.value.name}
                class="w-full h-auto max-w-sm rounded-lg object-cover shadow-lg"
            />
          </div>
          <div>
            <h2 class="text-4xl font-bold text-gray-800 mb-2">{product.value.name}</h2>
            <p class="text-gray-600 text-lg mb-4">{product.value.description}</p>
            <p class="text-3xl font-bold text-pink-600 mb-4">{formatCurrency(product.value.price)}</p>

            <div class="mb-6 text-gray-700">
                <p><strong>Category:</strong> {product.value.category || 'N/A'}</p>
                <p><strong>Available Stock:</strong> {product.value.stockQuantity}</p>
            </div>

            <div class="flex items-center gap-4">
              <button
                onClick$={() => handleAddToCart(product.value!)}
                disabled={isProductInCart}
                class={cn(
                    "bg-pink-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-600 transition-colors",
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});