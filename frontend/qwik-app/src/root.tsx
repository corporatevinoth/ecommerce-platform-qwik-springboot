import { component$, useVisibleTask$, useSignal, useContextProvider } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import './global.css'; // Your global CSS

// --- New Imports for Cart Context ---
import { CART_CONTEXT, CartContextState } from './context/cart';
// --- End New Imports ---

export default component$(() => {
  // Create a signal to hold the cart state
  const cartSignal = useSignal<CartContextState>({ items: [] });

  // Provide the cart signal to the entire application
  useContextProvider(CART_CONTEXT, cartSignal);

  // useVisibleTask$ to load cart from localStorage on client-side
  // This ensures the cart persists across browser refreshes/reloads
  useVisibleTask$(({ track }) => {
    // Only run on client-side
    track(() => true); // Track a static value to run once on mount

    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      try {
        cartSignal.value = JSON.parse(storedCart);
      } catch (e) {
        console.error('Failed to parse stored cart:', e);
        localStorage.removeItem('shoppingCart'); // Clear invalid data
      }
    }
  });

  // useVisibleTask$ to save cart to localStorage whenever it changes
  useVisibleTask$(({ track }) => {
    // Track changes to the cartSignal's value
    track(() => cartSignal.value);

    // Save the cart to localStorage
    if (cartSignal.value) {
      localStorage.setItem('shoppingCart', JSON.stringify(cartSignal.value));
    }
  });


  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en" class="font-inter">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
