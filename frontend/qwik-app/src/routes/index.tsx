import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the E-commerce Platform!</h1>
      <p>Explore our products or add new ones using the navigation above.</p>
      <img src="/qwik.svg" alt="Qwik Logo" style={{ maxWidth: '150px', marginTop: '20px' }}/>
    </div>
  );
});