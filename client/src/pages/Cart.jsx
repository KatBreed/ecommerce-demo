import { loadStripe } from '@stripe/stripe-js';

const Cart = ({ cart, setCart }) => {
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Use your test Publishable Key
  
    const response = await fetch('http://localhost:5000/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart }),
    });
  
    const session = await response.json();
  
    await stripe.redirectToCheckout({ sessionId: session.id });
  };  

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-muted">Your cart is empty.</p>
      ) : (
        <div className="row justify-content-center">
          {/* Cart Items */}
          <div className="col-lg-8">
            <ul className="list-group mb-4">
              {cart.map((item, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center"
                  style={{ padding: "15px", width: "100%" }}
                >
                  <div className="d-flex align-items-center mb-3 mb-md-0">
                    <img
                      src={item.coverImage} 
                      alt={item.title}
                      style={{ width: "60px", height: "auto", objectFit: "cover", marginRight: "15px", borderRadius: "4px" }}
                    />
                  </div>
                  <div className="mb-2 mb-md-0">
                    <strong>{item.title}</strong>
                    <div className="small text-muted">
                      ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => updateQuantity(item._id, -1)}
                    >
                      −
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => updateQuantity(item._id, 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Total & Actions */}
          <div className="col-lg-4">
            <div className="border rounded p-4 shadow-sm bg-light sticky-top text-center">
              <h5 className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span className="text-success">${total.toFixed(2)}</span>
              </h5>

              <div className="mt-4 d-flex justify-content-between">
                <button className="btn btn-outline-danger flex-grow-1 me-3 py-2" onClick={clearCart}>
                  🗑️ Clear Cart
                </button>
                <button className="btn btn-success flex-grow-1 py-2" onClick={handleCheckout}>
                  💳 Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;