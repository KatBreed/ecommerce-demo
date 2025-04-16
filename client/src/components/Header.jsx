import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Make sure to import Bootstrap JS
import { FaShoppingCart } from "react-icons/fa";

const Header = ({ cartItemCount = 0 }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: "1.4rem" }}>
            📘 Demo Bookshop
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold" to="/shop">Shop</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/cart">
                  <FaShoppingCart className="me-1" />Cart ({cartItemCount})
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
