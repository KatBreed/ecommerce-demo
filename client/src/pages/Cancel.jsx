import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-5 text-center shadow-sm">
        <h1 className="text-danger display-3">❌</h1>
        <h2 className="mt-3">Payment Canceled</h2>
        <p className="mb-4">It looks like your payment didn’t go through. You can return to your cart or head back to the shop to keep browsing.</p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/cart" className="btn btn-outline-danger">Return to Cart</Link>
          <Link to="/shop" className="btn btn-outline-secondary">Back to Shop</Link>
        </div>
      </div>
    </div>
  );
}
