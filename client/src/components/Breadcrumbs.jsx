// components/Breadcrumbs.js
import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items, current }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li
            key={item.path}
            className="breadcrumb-item"
          >
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
        {current && (
          <li className="breadcrumb-item active" aria-current="page">
            {current}
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
