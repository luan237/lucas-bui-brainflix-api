const express = require("express");
const app = express();
const port = 8080;
const videosData = require("./data/videos.json");

app.use(express.json());
app.use(express.cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
