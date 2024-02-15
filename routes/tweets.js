var express = require("express");
var router = express.Router();
const Tweet = require("../models/tweets");
const User = require("../models/users");

//TOUS LES TWEETS
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

//SUPP TWEET
router.delete("/", (req, res) => {
  Tweet.deleteOne({ _id: req.body.id }).then(() => {
    res.json({ deleted: true });
  });
});

//Trouver par hashtag
router.get("/hashtag", (req, res) => {
  Tweet.find({ hashtag: req.body.hashtag }).then((data) => {
    res.json({ tweet: data });
  });
});

//Like tweet
router.patch("/like", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    Tweet.updateOne(
      { _id: req.body.id },
      { $addToSet: { likes: data._id } }
    ).then((data) => {
      return res.json({ result: true });
    });
  });
});

module.exports = router;
