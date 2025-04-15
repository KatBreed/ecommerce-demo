import { useState } from 'react';
import axios from 'axios';

const AdminBookForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    description: '',
    price: '',
    publisher: '',
    publishDate: '',
    isbn: '',
    format: '',
    pages: '',
    weight: '',
    dimensions: '',
    synopsis: '',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      let imageURL = '';

      // Upload image first
      if (coverImage) {
        const imageData = new FormData();
        imageData.append('coverImage', coverImage);

        const uploadRes = await axios.post('http://localhost:5000/api/upload', imageData);
        imageURL = uploadRes.data.imageURL;
      }

      // Prepare book data
      const newBook = {
        ...formData,
        authors: formData.authors.split(',').map(a => a.trim()), // convert string to array
        coverImage: imageURL,
      };

      await axios.post('http://localhost:5000/api/books', newBook);
      setMessage('📚 Book added successfully!');
      setFormData({});
      setCoverImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add book');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2>Admin - Add New Book</h2>
      {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
            {[
                'title', 'authors', 'price', 'publisher',
                'publishDate', 'isbn', 'format', 'pages',
                'weight', 'dimensions'
                ].map((field) => (
                <div className="col-md-6 mb-3" key={field}>
                    <label className="form-label text-capitalize">{field}</label>
                    <input
                    type={field === 'publishDate' ? 'date' : field === 'price' || field === 'pages' ? 'number' : 'text'}
                    className="form-control"
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    />
                </div>
                ))}

                {/* Textarea for description */}
                <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={formData.description || ''}
                    onChange={handleChange}
                />
                </div>

                {/* Textarea for synopsis */}
                <div className="col-md-12 mb-3">
                <label className="form-label">Synopsis</label>
                <textarea
                    className="form-control"
                    name="synopsis"
                    rows="6"
                    value={formData.synopsis || ''}
                    onChange={handleChange}
                />
                </div>
            </div>

            {/* Cover image */}
            <div className="mb-3">
                <label className="form-label">Cover Image</label>
                <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
            </div>

            {/* Preview */}
            {preview && (
                <div className="mb-3">
                <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />
                </div>
            )}

            <button type="submit" className="btn btn-success" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Add Book'}
            </button>
        </form>
    </div>
  );
};

export default AdminBookForm;
