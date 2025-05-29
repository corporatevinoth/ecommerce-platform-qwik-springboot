// src/routes/layout.tsx
import { component$, Slot } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city'; // Import Link here

export default component$(() => {
  return (
    <>
      <main>
        {/* Basic header with navigation */}
        <header style={{ padding: '10px 20px', background: '#f0f0f0', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '20px' }}>
              <li>
                <Link href="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Home</Link>
              </li>
              <li>
                <Link href="/products" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Products</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Slot /> {/* This is where the content of your specific routes will be rendered */}
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ⚡️ Qwik
        </a>
      </footer>
    </>
  );
});