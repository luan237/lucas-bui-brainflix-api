const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const videos = require("./routes/videos");

app.use(express.json());
app.use(cors());
app.use("/", videos);
app.use(express.static("./public"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
