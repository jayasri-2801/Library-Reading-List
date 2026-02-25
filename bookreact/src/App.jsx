import { useEffect, useState } from "react";
import "./App.css";

const API = "https://library-reading-list-back.onrender.com/books";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  // Fetch Books
  const fetchBooks = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Error loading books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add Book
  const addBook = async () => {
    if (!title.trim() || !author.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), author: author.trim() }),
      });

      setTitle("");
      setAuthor("");
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // Toggle Read Status
  const toggleRead = async (book) => {
    try {
      await fetch(`${API}/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !book.read }),
      });
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // Delete Book
  const deleteBook = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📚 My Reading List</h1>

        <div className="input-section">
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <button onClick={addBook}>Add Book</button>
        </div>

        <div className="stats">
          Total Books: <span>{books.length}</span>
        </div>

        <ul id="bookList">
          {books.map((book) => (
            <li key={book._id} className={book.read ? "read" : ""}>
              <span>
                {book.title} — {book.author}
              </span>
              <div className="actions">
                <button onClick={() => toggleRead(book)}>
                  {book.read ? "Unread" : "Read"}
                </button>
                <button onClick={() => deleteBook(book._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;