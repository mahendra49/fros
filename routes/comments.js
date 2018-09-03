const   express     = require("express"),
        router      = express.Router({ mergeParams: true }),
        Post        = require("../models/posts"),
        User        = require("../models/users"),
        Comment     = require("../models/comments"),
        Middleware  = require("../middleware/index");

//comments logic
router.post("/",Middleware.isLoggedIn,function(req,res){

    Post.findById(req.params.id,function(err,Post){
        if(err){
            console.log(err);
            res.redirect("/user");
        }else{
            Comment.create({text:req.body.comment},function(err,comment){
                if(err){
                    //flash here
                    console.log("error in comments");
                    res.redirect("/user");
                }else{
                    //add username and id to comment
                    comment.author.id       = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    // console.log(comment);
                    //push to Post
                    Post.comments.push(comment);
                    Post.save();

                    var data={"comment":comment.text,"username":comment.author.username};
                    res.json(data);
                    res.status(200).end();

                }   

            });
        }

    });

});

module.exports = router;