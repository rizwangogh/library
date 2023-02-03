import express from "express";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { isAuthorised, isAdmin } from "../middlewares/auth/token.js";
import { randomStringGenerator } from "../utils/index.js";
import {
  isBookValidated,
  errorMiddleware,
} from "../middlewares/validations/index.js";

const router = express.Router();
router.use(express.json());

router.post(
  "/admin/books/add",
  isAdmin,
  isBookValidated,
  isAuthorised,
  async (req, res) => {
    try {
      let books = await fs.readFile("books.json");
      books = JSON.parse(books);
      let { ISBN } = req.body;
      let findBook = books.find((item) => item.ISBN === ISBN);
      if (findBook) {
        return res.status(404).json({ ERROR: "BOOK ALREADY EXISTS" });
      }
      let book = req.body;
      book.book_id = randomStringGenerator(12);
      books.push(book);
      await fs.writeFile("books.json", JSON.stringify(books));
      return res.status(200).json({ message: "book added succesfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }
);
router.put(
  "admin/books/:book_id",
  isBookValidated,
  isAuthorised,
  isAdmin,
  async (req, res) => {
    try {
      let id = req.params.book_id;
      let books = await fs.readFile("books.json");
      books = JSON.parse(books);
      let book = books.find((item) => item.book_id == id);
      if (!book) {
        return res.status(400).json({ ERROR: "BOOK NOT FOUND" });
      }
      book = req.body;
      book.book_id = id;
      books[index] = book;
      await fs.writeFile("books.json", JSON.stringify(books));
      return res.status(200).json({ success: "Book Edited" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
router.delete(
  "admin/books/:books_id",
  isAuthorised,
  isAdmin,
  async (req, res) => {
    try {
      let id = req.params.book_id;
      let books = await fs.readFile("books.json");
      books = JSON.parse(books);
      let book = books.find((item) => item.book_id == id);
      console.log(id);
      if (!book) {
        return res.status(400).json({ error: "Book does not exist" });
      }
      book.splice(books.indexOf(book), 1);
      await fs.writeFile("books.json", JSON.stringify(books));
      return res.status(200).json({ error: "Book deleted" });
    } catch (error) {
      return res.status(500), json({ error: "Internal server error" });
    }
  }
);
router.get("admin/books/:books_id", isAuthorised, isAdmin, async (req, res) => {
  try {
    let id = req.params.book_id;
    let books = await fs.readFile("books.json");
    books = JSON.parse(books);
    let book = books.find((item) => item.book_id == id);
  } catch (error) {
    console.log(error);
    returnr.res.status(500).json({ error: "internal server error" });
  }
});
router.get("/books", isAuthorised, isAdmin, async (req, res) => {
  try {
    let books = await fs.readFile("books.json");
    books = JSON.parse(books);
    if (!books) {
      return res.status(400).json({ error: "No books in storage" });
    }
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});

export default router;
