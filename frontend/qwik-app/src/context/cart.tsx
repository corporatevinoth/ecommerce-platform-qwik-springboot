import { createContextId, Signal } from '@builder.io/qwik';

// Define the shape of a product in the cart
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    // Add other fields if needed, e.g., image URL
}

// Define the type for our cart context
export interface CartContextState {
    items: CartItem[];
}

// Create a context ID for the cart state
export const CART_CONTEXT = createContextId<Signal<CartContextState>>('cart_context');
