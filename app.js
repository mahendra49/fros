var express = require("express")
    app     = express();



//serve "public" files and set view engine as "ejs"
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");


//login page
app.get("/login",function(req,res){
    res.render("login");
});


//register page
app.get("/register",function(req,res){
    res.render("register");
});

//index page
app.get("/",function(req,res){
    res.render("feed");
});

app.listen(5000,function(){
    console.log("server started");
});