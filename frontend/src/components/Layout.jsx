import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        {children}
      </main>
    </div>
  );
}
