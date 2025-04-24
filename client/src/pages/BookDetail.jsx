import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

const BookDetail = ({ cart, setCart }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  if (error)
    return (
      <div className="alert alert-danger">
        Failed to load book details. Please try again later.
      </div>
    );
  if (!book) return <div>No book found</div>;

  return (
    <div className="container py-5">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Shop", path: "/shop" },
        ]}
        current={book.title}
      />

      <div className="row">
        {/* Image Section */}
        <div className="col-md-5 text-center mb-4">
          <img
            src={book.coverImage || "/placeholder-image.jpg"}
            alt={book.title}
            className="img-fluid shadow-sm rounded"
            style={{ maxHeight: "450px", objectFit: "cover" }}
          />
        </div>

        {/* Book Info Section */}
        <div className="col-md-7">
          <h2 className="mb-2">{book.title}</h2>
          <h5 className="text-muted mb-3">{book.authors?.join(", ")}</h5>

          {/* Price Section */}
          <div className="mb-3 py-2 border-top border-bottom text-center">
            <h4 className="fw-bold mb-0">NZD ${book.price?.toFixed(2)}</h4>
          </div>

          {/* Add to Cart Button */}
          <button onClick={addToCart} className="btn btn-primary btn-lg">
            Add to Cart
          </button>

          {/* Tabs for Extra Details */}
          <ul className="nav nav-tabs mt-4">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#details">
                Details
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#description">
                Description
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#synopsis">
                Synopsis
              </a>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content mt-3">
            {/* Details Tab */}
            <div className="tab-pane fade show active" id="details">
              <p><strong>Format:</strong> {book.format}</p>
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>Published:</strong> {book.publishDate ? new Date(book.publishDate).toLocaleDateString() : "N/A"}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
              <p><strong>Pages:</strong> {book.pages || "N/A"}</p>
              <p><strong>Dimensions:</strong> {book.dimensions || "N/A"}</p>
            </div>

            {/* Description Tab */}
            <div className="tab-pane fade" id="description">
              <p className="text-secondary">{book.description || "No description available for this title."}</p>
            </div>

            {/* Synopsis Tab */}
            <div className="tab-pane fade" id="synopsis">
              <p className="text-secondary">{book.synopsis || "No synopsis available for this title."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;