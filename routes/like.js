const   express     = require("express"),
        router      = express.Router({ mergeParams: true }),
        Post        = require("../models/posts"),
        User        = require("../models/users"),
        Comment     = require("../models/comments"),
        Middleware  = require("../middleware/index");


router.post("/",Middleware.isLoggedIn,function(req,res){

    Post.findById(req.params.id,function(err,post){
        var listofNames=post.likedby;
        if(err){
            console.log("err");
            res.json({"error":"comments"});
        }
        else{
            if(listofNames.includes(req.user.username)){
                //console.log("includes");
                res.json({"ok":"0"});
            }else{
                //console.log("not included");
                post.likedby.push(req.user.username);
                post.likes=post.likes+1;
                post.save();
                res.json({"ok":"1"});
            }
        }
    });
});

module.exports = router;
