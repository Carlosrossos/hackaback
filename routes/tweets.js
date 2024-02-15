var express = require("express");
var router = express.Router();
const Tweet = require("../models/tweets");
const User = require("../models/users");
const { ObjectId } = require("mongoose");

router.get("/", (req, res) => {
  Tweet.find().then((data) => {
    res.json({ tweet: data });
  });
});

//Poster un tweet
router.post("/", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    const newTweet = new Tweet({
      text: req.body.text,
      date: req.body.date,
      hashtag: req.body.hashtag,
      author: data._id,
    });
    newTweet.save().then(() => {
      res.json({ result: true });
    });
  });
});

router.delete("/", (req, res) => {
  Tweet.deleteOne({ _id: req.body.id }).then(() => {
    res.json({ deleted: true });
  });
});

router.get("/:hashtag", (req, res) => {
  Tweet.findMany().then((data) => {
    res.json({ tweet: data });
  });
});

//Like tweet
router.patch("/like", (req, res) => {
  console.log(req.body.id);
  User.findOne({ token: req.body.token }).then((data) => {
    console.log(data._id);

    Tweet.updateOne(
      { _id: req.body.id },
      { $addToSet: { likes: data._id } }
    ).then((data) => {
      console.log(data);
      return res.json({ result: true });
    });
  });
});

module.exports = router;
