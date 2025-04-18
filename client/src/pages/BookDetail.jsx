import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetail = ({ cart, setCart }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === book._id);
      return existing
        ? prevCart.map((item) =>
            item._id === book._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...book, quantity: 1 }];
    });
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <div className="alert alert-danger">Failed to load book details. Please try again later.</div>;
  if (!book) return <div>No book found</div>;

  return (
    <div className="container py-5">
      <div className="row">
        {/* Image Section */}
        <div className="col-md-5 text-center mb-4">
          {book.coverImage && (
            <img
              src={book.coverImage}
              alt={book.title}
              className="img-fluid shadow-sm"
              style={{ maxHeight: '450px', objectFit: 'contain' }}
            />
          )}
        </div>

        {/* Book Info Section */}
        <div className="col-md-7">
          <h2 className="mb-2">{book.title}</h2>
          <h5 className="text-muted mb-3">{book.authors?.join(', ')}</h5>
          
          {/* Price Section */}
          <div className="mb-3 py-2 border-top border-bottom text-center">
            <h4 className="fw-bold mb-0">
              NZD ${book.price?.toFixed(2)}
            </h4>
          </div>

          {/* Add to Cart Button */}
          <button onClick={addToCart} className="btn btn-primary btn-lg">
            Add to Cart
          </button>
          
          {/* Book Details Below the Add to Cart */}
          <div className="mt-4">
            <p className="mb-1 text-start"><strong>Format:</strong> {book.format}</p>
            <p className="mb-1 text-start"><strong>Publisher:</strong> {book.publisher}</p>
            <p className="mb-1 text-start">
              <strong>Published:</strong> {book.publishDate ? new Date(book.publishDate).toLocaleDateString() : 'N/A'}
            </p>
            <p className="mb-1 text-start"><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
            <p className="mb-1 text-start"><strong>Pages:</strong> {book.pages || 'N/A'}</p>
            <p className="mb-1 text-start"><strong>Dimensions:</strong> {book.dimensions || 'N/A'}</p>
            <p className="mb-3 text-start"><strong>Weight:</strong> {book.weight || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Tabs or Synopsis Section */}
      <div className="mt-5">
        <h5>Synopsis</h5>
        <p className="text-secondary">
          {book.synopsis || book.description || "No synopsis available for this title."}
        </p>
      </div>
    </div>
  );
};

export default BookDetail;
