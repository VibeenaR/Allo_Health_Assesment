'use strict';
'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Create temporary hold lock
  const handleReserve = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(productId),
          warehouseId: parseInt(warehouseId),
          quantity: parseInt(quantity),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Allocation error');
      
      setReservationId(data.id);
      setStatusMessage(`Success! 10-minute hold secured. Hold ID: ${data.id}`);
    } catch (err: any) {
      setStatusMessage(`Reservation Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Finalize payment/checkout capture
  const handleConfirm = async () => {
    if (!reservationId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/reservations/${reservationId}/confirm`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Confirmation error');
      
      setStatusMessage('Order complete! Physical items deducted permanently from capacity.');
      setReservationId(null);
    } catch (err: any) {
      setStatusMessage(`Confirmation Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Drop hold and release allocation blocks
  const handleRelease = async () => {
    if (!reservationId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/reservations/${reservationId}/release`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Release error');
      
      setStatusMessage('Reservation released! Stock units returned to public availability pool.');
      setReservationId(null);
    } catch (err: any) {
      setStatusMessage(`Release Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Transactional Checkout Terminal</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>
          Product ID:
          <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} disabled={reservationId !== null} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </label>
        <label>
          Warehouse ID:
          <input type="number" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} disabled={reservationId !== null} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </label>
        <label>
          Quantity:
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} disabled={reservationId !== null} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </label>

        {reservationId === null ? (
          <button onClick={handleReserve} disabled={loading || !productId || !warehouseId} style={{ padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Securing Concurrency Row Locks...' : 'Lock Temporary Allocation'}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={handleConfirm} disabled={loading} style={{ flex: 1, padding: '12px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Finalize Purchase
            </button>
            <button onClick={handleRelease} disabled={loading} style={{ flex: 1, padding: '12px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Release Hold Early
            </button>
          </div>
        )}
      </div>

      {statusMessage && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '5px', borderLeft: '4px solid #333', fontSize: '14px', wordBreak: 'break-word' }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}