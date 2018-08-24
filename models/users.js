var mongoose              = require("mongoose"),
    passportlocalmongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({

    username:{
        type:String,
        unique:true
    },
    password:String,
    email:{
        type:String,
        unique:true
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ]
});

userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User",userSchema);