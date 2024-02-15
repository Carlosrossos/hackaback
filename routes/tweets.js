var express = require("express");
var router = express.Router();
const Tweet = require("../models/tweets");
const User = require("../models/users");
ObjectID = require('mongodb').ObjectID,

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
  Tweet.deleteOne({ _id: ObjectId(req.body.id) }).then(() => {
    res.json({ deleted: true });
  });
});

router.get("/:hashtag", (req, res) => {
  Tweet.findMany().then((data) => {
    res.json({ tweet: data });
  });
});

//Like tweet
router.put("/like", (req, res) => {
  User.findOne({ token: req.body.token })
    .then((data) => {
      console.log(data._id);
      console.log(ObjectId(req.body.id));

      Tweet.updateOne(
        { _id: ObjectId(req.body.id) },
        { $addToSet: { likes: data._id } }
      );
    })
    .then(() => {
      res.json({ result: true });
    });
});

module.exports = router;
