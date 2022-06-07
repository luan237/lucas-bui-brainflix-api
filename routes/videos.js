const express = require("express");
const router = express.Router();
const videosData = require("../data/videos.json");

router.route("/videos").get((req, res) => {
  const basicData = [];
  videosData.forEach((video) => {
    const { id, title, channel, image } = video;
    basicData.push({ id, title, channel, image });
  });
  res.send(basicData);
});

router.route("/videos/:id").get((req, res) => {
  const requestedId = req.params.id;
  const foundVideo = videosData.find((video) => video.id === requestedId);
  res.send(foundVideo);
  console.log(requestedId);
});

module.exports = router;
