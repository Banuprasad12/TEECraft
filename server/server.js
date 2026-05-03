const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("ROOT WORKING");
});

app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));