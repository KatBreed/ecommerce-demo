import { useEffect, useState } from 'react';
import axios from 'axios';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]); // 🛒 cart state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const addToCart = (book) => {
    setCart(prevCart => [...prevCart, book]);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">📚 Bestsellers</h1>
      {loading && <p>Loading books...</p>}
      {error && <div className="alert alert-danger">Failed to load books. Please try again later.</div>}

      {/* Book list */}
      <div className="row">
        {books.map(book => (
          <div className="col-md-4 mb-4" key={book._id}>
            <div className="card h-100 shadow-sm">
              {book.coverImage && (
                <img src={book.coverImage} alt={book.title} className="card-img-top img-fluid" />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{book.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{book.authors?.join(', ')}</h6>
                <p className="card-text text-success fw-bold">${book.price?.toFixed(2)}</p>
                <button className="btn btn-primary mt-auto" onClick={() => addToCart(book)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Cart Preview */}
      {/* {cart.length > 0 && (
        <div className="mt-5">
          <h2>🛒 Cart ({cart.length} items)</h2>
          <ul className="list-group">
            {cart.map((item, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                {item.title}
                <span className="text-success">${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default Shop;
