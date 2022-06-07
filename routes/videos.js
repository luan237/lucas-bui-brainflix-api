const express = require("express");
const router = express.Router();
let videosData = require("../data/videos.json");
const uuid = require("uuid");
const fs = require("fs");

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
});

router.route("/videos").post((req, res) => {
  const newVideo = {
    id: uuid.v4(),
    title: req.body.title,
    channel: "New User",
    image: "http://localhost:8080/Upload-video-preview.jpg",
    description: req.body.description,
    views: 10000,
    likes: 10,
    duration: "5:01",
    video: "https://www.youtube.com/watch?v=fpoBdxnvlcU",
    timestamp: new Date(),
    comments: [],
  };
  videosData.push(newVideo);
  fs.writeFile("./data/videos.json", JSON.stringify(videosData), (err) => {
    console.log(err);
  });
  res.send(newVideo);
});

module.exports = router;
