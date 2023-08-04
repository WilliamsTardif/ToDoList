import express from "express";

const app = express();
const port = 3000;
const toDoList = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/work", (req, res) => {
    res.render("work.ejs");
});

app.get("/future", (req, res) => {
    res.render("future.ejs");
});

app.listen(port, (req, res) => {
    console.log(`Listen on port: ${port}`);
});

