import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Allo Platform</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>High-Concurrency Stock Allocation Dashboard</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link href="/products" style={{ padding: '12px 24px', background: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
          View Products
        </Link>
        <Link href="/checkout" style={{ padding: '12px 24px', background: '#4caf50', color: '#fff', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
          Go to Checkout
        </Link>
      </div>
    </div>
  );
}