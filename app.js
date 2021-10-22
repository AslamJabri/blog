const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

require('dotenv').config();

const homeStartingContent = "This blog is only used for either publishing or reading.";
const aboutContent = "Technologies used in this javascript , ejs, express , mangodb";
const contactContent = "Thank you Inco for all the learning.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.DB, {useNewUrlParser: true , useUnifiedTopology: true}) ;

const postSchema = {
  title: String,
  content: String
};
const users = {
  name : String,
  email: String
}

const User = mongoose.model("user" , users);
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/")
    
})

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.post("/contact", function(req, res){
  const newuser = new User({
    name: req.body.name,
    email: req.body.email
  });
  newuser.save();
  res.redirect("/")
    
})

//server on port

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);



app.listen(port, function() {
  console.log(`Server started on port {3000}`);
});
