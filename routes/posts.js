//all required
const   express     = require("express"),
        router      = express.Router(),
        Post        = require("../models/posts"),
        User        = require("../models/users"),
        Middleware  = require("../middleware/index");

//new posts logic
router.get("/new",Middleware.isLoggedIn,function(req,res){
    res.render("new");
});

router.post("/",Middleware.isLoggedIn,function(req,res){
    
    //req.body.post.body  = req.sanitize(req.body.post.body);
    var newPost   = req.body.post;
    var author    = {
        id          : req.user._id,
        username    : req.user.username
    };
    
    newPost.author = author; 
    Post.create(newPost,function(err,post){
        if(err){
            console.log("error--posts route");
            res.redirect("/posts/new");
        }
        else{
            User.findOne({username:req.user.username},function(err,founduser){
                if(err){
                    console.log("error in finding user");
                    res.redirect("/login");
                }else{
                    founduser.posts.push(post);
                    founduser.save(function(err,data){
                        if(err){
                            console.log("error in saving post, try again");
                            res.redirect("/");
                        }
                        else{
                            //console.log(data);
                            res.redirect("/user");
                        }
                    });
                }
             });
        }
    });
});

module.exports = router; 