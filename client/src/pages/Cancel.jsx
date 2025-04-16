import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-5 text-center shadow-sm">
        <h1 className="text-success display-3">❌</h1>
        <h2 className="mt-3">Payment Cancelled</h2>
        <p className="mb-4">Your payment was cancelled. Feel free to browse and try again</p>
        <Link to="/" className="btn btn-outline-success">Back to Home</Link>
      </div>
    </div>
  );
}
