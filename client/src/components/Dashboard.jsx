import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error('Error fetching books:', err));
  }, []);

  return (
    <div>
      <h1>Book Dashboard</h1>
      <ul>
        {books.map(book => (
          <li key={book._id}>
            {book.title} - ${book.price}
            {book.coverImage && <img src={book.coverImage} alt={book.title} width="100" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
