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
  User.findOne({ token: req.body.author }).then((data) => {
    const newTweet = new Tweet({
      text: req.body.text,
      date: req.body.date,
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

//Trier les tweets par trends
router.get('/trends', (req, res) => {
    Tweet.find({ text: { $regex: /#/ } })
      .then(tweets => {
        const hashtags = [];
        for (const tweet of tweets) {
          const filteredHashtags = tweet.text.split(' ').filter(word => word.startsWith('#') && word.length > 1);
          hashtags.push(...filteredHashtags);
        }
        const trends = [];
        for (const hashtag of hashtags) {
          const trendIndex = trends.findIndex(trend => trend.hashtag === hashtag);
          if (trendIndex === -1) {
            trends.push({ hashtag, count: 1 });
          } else {
            trends[trendIndex].count++;
          }
        }
        res.json({ result: true, trends: trends.sort((a, b) => b.count - a.count) });
      });
  });

module.exports = router;
