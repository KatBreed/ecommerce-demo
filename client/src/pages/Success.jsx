import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Success({ setCart }) {
  useEffect(() => {
    // Clear the cart in localStorage and reset state
    localStorage.removeItem("cart");
    setCart([]); // Reset the cart state
  }, [setCart]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-5 text-center shadow-sm">
        <h1 className="text-success display-3">✅</h1>
        <h2 className="mt-3">Payment Successful</h2>
        <p className="mb-4">Thank you for your purchase! We hope you enjoy your new books 📚</p>
        <Link to="/" className="btn btn-outline-success">Back to Home</Link>
      </div>
    </div>
  );
}
