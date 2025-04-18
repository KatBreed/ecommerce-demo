import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import AdminBookForm from "./pages/AdminBookForm";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

const App = () => {
  // Initialize cart state from localStorage with error handling for malformed data
  const [cart, setCart] = useState(() => {
    let storedCart = localStorage.getItem("cart");
    try {
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });

  // Save cart to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Define routes to be more readable
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/shop", element: <Shop cart={cart} setCart={setCart} /> },
    { path: "/cart", element: <Cart cart={cart} setCart={setCart} /> },
    { path: "/admin", element: <AdminBookForm /> },
    { path: "/success", element: <Success setCart={setCart} /> },
    { path: "/cancel", element: <Cancel /> },
    { path: "/book/:id", element: <BookDetail cart={cart} setCart={setCart}/> }
  ];

  return (
    <Router>
      <Header cartItemCount={cart.length} />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
