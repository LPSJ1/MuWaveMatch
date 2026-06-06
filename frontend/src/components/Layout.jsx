import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', transition: 'background-color 0.3s' }}>
      <Navbar />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}
