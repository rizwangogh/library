import express from "express";
import fs from "fs/promises";
import {
  errorMiddleware,
  registerValdidations,
} from "../middlewares/validations/index.js";
import { passGenerator, randomStringGenerator } from "../utils/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAuthorised } from "../middlewares/auth/token";
import { appendFile } from "fs";
import { body } from "express-validator";
import { resolveAny } from "dns";
import { defaultMaxListeners } from "events";

const router = express.Router();

router.post(
  "/login",
  registerValdidations,
  errorMiddleware,
  async (req, res) => {
    try {
      let { username, email, fullname } = req.body;
      let id = randomStringGenerator(12);
      let users = await fs.readFile("users.json");
      users = JSON.parse(users);
      let findEmail = users.find((item) => item.email == email);
      if (findEmail) {
        return res.status(409).json({ error: "User already exists" });
      }
      let password = passGenerator(8);
      let hashedPassword = await bcrypt.hash(password, 12);
      let user = {
        user_id: id,
        fullname,
        username,
        email,
        password,
        hashedPassword,
        role: "user",
        books: [],
      };
      users.push(user);
      await fs.writeFile("users.json", JSON.stringify(users));
      res.status(200).json({ success: "user registered!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "internal server error" });
    }
  }
);
router.post("/login", async (req, res) => {
  try {
    let users = await fs.readFile("users.json");
    users = JSON.parse(users);
    let { email, password } = req.body;
    let findEmail = users.find((item) => item.email == email);
    if (!findEmail) {
      return res.status(403).json({ error: "unauthorized" });
    }
    let match = await bcrypt.compare(password, findEmail.password);
    if (!match) {
      return res.status(403).json({ error: "unauthorized" });
    }
    let payload = { name: findEmail.name, email, role: findEmail.role };
    let key = "rizzwan";
    let token = jwt.sign(payload, key, { expiresIn: "1h" });
    return res.status(200).json({ success: "Logged In", token });
  } catch (error) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/auth", (req, res) => {
  try {
    return res.stattus(200).json(req.payload);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/user", isAuthorised, async (req, res) => {
  try {
    let payload = req.payload;
    let email = payload.email;
    let users = await fs.readFile("users.json");
    users = JSON.parse(users);
    let findEmail = users.find((item) => item.email == email);
    if (!findEmail) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    let index = users.indexOf(findEmail);
    users.splice(index, 1);
    await fs.writeFile("users.json", JSON.stringify(users));
    return res.status(200).json({ success: "User deleted!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server" });
  }
});
router.get("/books", isAuthorised, async (req, res) => {
  try {
    let email = req.payload.email;
    let books = await fs.readFile("books.json");
    books = JSON.parse(books);
    let users = await fs.readFile("users.json");
    users = JSON.parse(users);
    let user = users.find((item) => item.email == email);
    if (!user) {
      return res.status(401).json({ error: "unauthorized" });
    }
    res.status(200).json(books);
  } catch (error) {
    console.log(error);
  }
});

router.post("/borrow/:book_id", isAuthorised, async(req,res)=>{
    try {
        let email = req.payload.email;
        let users= await fs.readFile("users.json")
        users = JSON.parse(users)
        let user = users.find((item)=>item.email == email)
        if(!user){
            return res.status(401).json({error:"Unauthorised"})
        }
        let books = await fs.readFile("books.json")
        books = JSON.parse(books)
        let book = books.find((item)=>item.book_id== req.params.book_id)
        if(!book){
            return res.status(400).json({error:"book not found"})
        }
        user.book.push(book)
        await fs.writeFile("users.json", JSON.stringify(users))
        return res.status(200).json({error:"Book Borrowed"})
    } catch (error) {
        console.log(error)
    }
})

export default router;