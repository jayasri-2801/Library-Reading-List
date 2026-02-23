const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./model/book");

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection

mongoose.connect("mongodb+srv://Jayasri:Jayasri2816@cluster0.3ku3lfd.mongodb.net/bookLibrary?appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err.message));

// CREATE
app.post("/books", async (req, res) => {
  try {
    const { title, author } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newBook = new Book({ title, author });
    const savedBook = await newBook.save();

    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
app.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



const port =process.env.port||4000;
app.listen(port, () => {
    console.log("Server running on port ",port);
});
