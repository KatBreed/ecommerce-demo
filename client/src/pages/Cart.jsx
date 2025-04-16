const Cart = ({ cart }) => (
  <div className="container py-5">
    <h2>🛒 Your Cart</h2>
    {cart.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <ul className="list-group">
        {cart.map((item, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between">
            {item.title}
            <span className="text-success">${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Cart;
