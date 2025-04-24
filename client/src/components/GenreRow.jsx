import React from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const GenreRow = ({ title, books }) => {
  return (
    <div className="mb-5 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{title}</h3>
        <Link to={`/shop?genre=${encodeURIComponent(title)}`} className="btn btn-link">
          See more
        </Link>
      </div>

      <div className="position-relative">
    {/* Navigation Arrows */}
    <button
        className="chevron-button btn btn-outline-primary position-absolute start-0 top-50 translate-middle-y z-3"
        onClick={() => scrollLeft(title)}
    >
        <FaChevronLeft />
    </button>
    <button
        className="chevron-button btn btn-outline-primary position-absolute end-0 top-50 translate-middle-y z-3"
        onClick={() => scrollRight(title)}
    >
        <FaChevronRight />
    </button>

    <div
        id={`scroll-container-${title}`}
        className="d-flex overflow-auto gap-3 px-5 scroll-container"
        style={{ scrollBehavior: "smooth" }}
    >
        {books.slice(0, 10).map((book) => (
        <div key={book._id} className="flex-shrink-0" style={{ width: "160px" }}>
            <Link to={`/book/${book._id}`} className="text-decoration-none">
            <div className="shadow-sm">
                <img
                src={book.coverImage}
                alt={book.title}
                className="img-fluid"
                style={{ height: "250px", objectFit: "contain" }}
                />
            </div>
            </Link>
        </div>
        ))}
    </div>
    </div>

    </div>
  );
};

const scrollLeft = (genre) => {
    const el = document.getElementById(`scroll-container-${genre}`);
    el.scrollLeft -= 200;
  };
  
  const scrollRight = (genre) => {
    const el = document.getElementById(`scroll-container-${genre}`);
    el.scrollLeft += 200;
  };
  
export default GenreRow;