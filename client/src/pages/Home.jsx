import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import GenreRow from "../components/GenreRow";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const genresToShow = ["Fiction",  "Non Fiction", "Biography and Memoir","Young Adult", "Children's", "History"];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getBooksByGenre = (genre) =>
    books.filter((book) => book.genre?.toLowerCase() === genre.toLowerCase());

  return (
    <Container className="pt-5">
      <div className="text-center mb-5">
        <h2 className="mb-3">Welcome to the Demo Bookshop</h2>
        <p className="lead mb-4">Start exploring our amazing book collection!</p>
        <Link to="/shop" className="btn btn-primary btn-lg">
          Start Browsing Here
        </Link>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        genresToShow.map((genre) => (
          <GenreRow key={genre} title={genre} books={getBooksByGenre(genre).slice(0, 10)} />
        ))
      )}
    </Container>
  );
};

export default Home;
