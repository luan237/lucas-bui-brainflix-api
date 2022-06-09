const express = require("express");
const router = express.Router();
let videosData = require("../data/videos.json");
const uuid = require("uuid");
const fs = require("fs");
const multer = require("multer");

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

// set destination and file name for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Hello World");
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    console.log("Hello World 2");
    cb(null, file.originalname);
  },
});

// post new Video (with image or default image)
router
  .route("/videos")
  .post(multer({ storage: storage }).single("thumbnail"), async (req, res) => {
    let imageName;
    if (req.file) {
      imageName = req.file.originalname;
    } else {
      imageName = "Upload-video-preview.jpg";
    }
    const newVideo = {
      id: uuid.v4(),
      title: req.body.title,
      channel: "New User",
      image: `http://localhost:8080/${imageName}`,
      description: req.body.description,
      views: 10000,
      likes: 10,
      duration: "5:01",
      video:
        "https://project-2-api.herokuapp.com/stream/?api_key=5821f58b-d638-4339-9f50-71d86650f340",
      timestamp: Date.now(),
      comments: [],
    };
    videosData.push(newVideo);
    fs.writeFile("./data/videos.json", JSON.stringify(videosData), (err) => {
      if (err) console.log(err);
      else {
        console.log("Upload successfuly");
      }
    });
    res.status(200).send(newVideo);
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
    timestamp: Date.now(),
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

  // diving deeper (like comment)
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
