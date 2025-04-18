import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const Home = () => {
  return (
    <Container className="text-center py-5">
      <h2 className="mb-3">Welcome to the Demo Bookshop</h2>
      <p className="lead mb-4">Start exploring our amazing book collection!</p>
      <Link to="/shop" className="btn btn-primary btn-lg">
        Browse Books
      </Link>
    </Container>
  );
};

export default Home;
