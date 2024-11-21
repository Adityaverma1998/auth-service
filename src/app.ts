import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome auth services");
});

export default app;
