import express from "express";
import api from "./controllers/api.js";

const app = express();
const port = 5500

app.use(express.json())
app.use("/api/user",api)
app.use("/api",api)
app.get("/", (req,res)=>{
    res.send("hello serverLLLL")
})
app.listen(port,()=>{
    console.log("listening on port ", port)
})
