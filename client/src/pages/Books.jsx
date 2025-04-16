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
                        <div key={book._id} className="col-sm-4 col-md-3 col-lg-2 mb-2">
                            <div className="card h-100 shadow-sm" style={{ maxWidth: '180px' }}>
                                {book.coverImage && (
                                    <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="card-img-top img-fluid"
                                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                                  />
                                )}
                                <div className="card-body" style={{ padding: '10px' }}>
                                    <h5 className="card-title" style={{ fontSize: '1rem' }}>{book.title}</h5>
                                    <h6 className="text-muted" style={{ fontSize: '0.85rem' }}>{book.authors?.join(', ')}</h6>
                                    <p className="card-text" style={{ fontSize: '0.8rem' }}>{book.description}</p>
                                </div>
                                <div className="card-footer" style={{ padding: '5px', fontSize: '0.9rem' }}>
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