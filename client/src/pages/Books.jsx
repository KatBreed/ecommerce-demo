import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Books() {
    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/books`)
            .then(res => {
                setBooks(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mt-4">
            {loading && <p>Loading books...</p>}
            {error && <div className="alert alert-danger">Failed to load books. Please try again later.</div>}
    
            {!loading && !error && (
                <div className="row">
                    {books.map(book => (
                        <div key={book._id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                {book.coverImage && (
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="card-img-top img-fluid"
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{book.title}</h5>
                                    <h6 className="text-muted">{book.authors?.join(', ')}</h6>
                                    <p className="card-text">{book.description}</p>
                                </div>
                                <div className="card-footer">
                                    <span className="text-primary fw-bold">${book.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
}