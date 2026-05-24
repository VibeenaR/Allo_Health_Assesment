'use client';

import { useEffect, useState } from 'react';

// Ensure this matches your Prisma model structure
interface InventoryItem {
  warehouse: { name: string }; // Assuming nested warehouse relation
  totalUnits: number;
  reservedUnits: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  stocks: InventoryItem[]; // Changed to 'stocks' to match typical Prisma schema
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to download inventory maps');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading real-time catalog allocations...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Real-time Distribution Catalog</h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h3>{product.name}</h3>
            <p>SKU: {product.sku}</p>
            
            {/* Defensive mapping: fallback to [] if product.stocks is undefined */}
            {(product.stocks || []).map((inv, idx) => (
              <div key={idx}>
                <span>{inv.warehouse.name}</span>
                <strong>{inv.totalUnits - inv.reservedUnits} / {inv.totalUnits} available</strong>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}