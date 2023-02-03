import jwt from "jsonwebtoken";
import fs from "fs/promises";
const key = "rizwan";
const isAuthorised = (req, res, next) => {
  try {
    let token = req.headers["auth-token"];
    let payload = jwt.verify(token, key);
    req.payload = payload;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "invalid Token" });
  }
};

const isAdmin = async (req, res, next) => {
  //   let role = req.payload.role;
  //   let email = req.payload.email;
  let { role, email } = req.payload; //works the same
  let users = await fs.readFile("users.json");
  users = JSON.parse(users);
  let findEmail = users.find((item) => item.email === email);

  if (!findEmail || role !== "admin") {
    return res.status(401).json({ error: "Invalid" });
  }
  next();
};
export { isAuthorised, isAdmin };
