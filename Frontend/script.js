document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "https://library-reading-list-back.onrender.com/books";

  const titleInput = document.getElementById("titleInput");
  const authorInput = document.getElementById("authorInput");
  const addBtn = document.getElementById("addBookBtn");
  const bookList = document.getElementById("bookList");
  const totalBooks = document.getElementById("totalBooks");

  async function loadBooks() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      bookList.innerHTML = "";
      totalBooks.textContent = data.length;

      data.forEach(book => createBook(book));
    } catch (error) {
      console.error("Error loading books:", error);
    }
  }

  addBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
      });

      titleInput.value = "";
      authorInput.value = "";
      loadBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  });

  function createBook(book) {
    const li = document.createElement("li");

    if (book.read) li.classList.add("read");

    const text = document.createElement("span");
    text.textContent = `${book.title} — ${book.author}`;

    const actions = document.createElement("div");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = book.read ? "Unread" : "Read";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    toggleBtn.onclick = async () => {
      await fetch(`${API_URL}/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !book.read })
      });
      loadBooks();
    };

    deleteBtn.onclick = async () => {
      await fetch(`${API_URL}/${book._id}`, {
        method: "DELETE"
      });
      loadBooks();
    };

    actions.append(toggleBtn, deleteBtn);
    li.append(text, actions);
    bookList.appendChild(li);
  }

  loadBooks();
});