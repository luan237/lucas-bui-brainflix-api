const express = require("express");
const router = express.Router();
let videosData = require("../data/videos.json");
const uuid = require("uuid");
const fs = require("fs");
// get basic list of video
router.route("/videos").get((req, res) => {
  const basicData = [];
  videosData.forEach((video) => {
    const { id, title, channel, image } = video;
    basicData.push({ id, title, channel, image });
  });
  res.status(200).json(basicData);
});

// get a specific video details
router.route("/videos/:id").get((req, res) => {
  const requestedId = req.params.id;
  const foundVideo = videosData.find((video) => video.id === requestedId);
  res.status(200).json(foundVideo);
});

// post new Video
router.route("/videos").post((req, res) => {
  console.log(req);
  const newVideo = {
    id: uuid.v4(),
    title: req.body.title,
    channel: "New User",
    image: req.body.image,
    description: req.body.description,
    views: 10000,
    likes: 10,
    duration: "5:01",
    video:
      "https://project-2-api.herokuapp.com/stream/?api_key=5821f58b-d638-4339-9f50-71d86650f340",
    timestamp: new Date(),
    comments: [],
  };
  videosData.push(newVideo);
  // fs.writeFile("./data/videos.json", JSON.stringify(videosData), (err) => {
  //   console.log(err);
  // });
  res.status(200).json(newVideo);
});

// diving deeper (post comment)
router.post("/videos/:id/comments", (req, res) => {
  const { name, comment } = req.body;
  const foundVideo = videosData.find((video) => video.id === req.params.id);
  foundVideo.comments.push({
    name,
    comment,
    id: uuid.v4(),
    likes: 0,
    timestamp: new Date(),
  });
  fs.writeFile("./data/videos.json", JSON.stringify(videosData), (err) => {
    console.log(err);
  });
  res.status(200).json(foundVideo);
});

// diving deeper (delete comment)
router
  .route("/videos/:id/comments/:commentId")
  .delete((req, res) => {
    const foundVideo = videosData.find((video) => video.id === req.params.id);
    const foundComment = foundVideo.comments.find(
      (comment) => comment.id === req.params.commentId
    );
    commentId = foundVideo.comments.indexOf(foundComment);
    foundVideo.comments.splice(commentId, 1);
    fs.writeFile("./data/videos.json", JSON.stringify(videosData), (err) => {
      console.log(err);
    });
    res.status(200).json(foundVideo);
  })
  .put((req, res) => {
    const foundVideo = videosData.find((video) => video.id === req.params.id);
    const foundComment = foundVideo.comments.find(
      (comment) => comment.id === req.params.commentId
    );
    foundComment.likes += 1;
    fs.writeFile("./data/videos.json", JSON.stringify(videosData), (err) => {
      console.log(err);
    });
    res.status(200).json(foundVideo);
  });

module.exports = router;
