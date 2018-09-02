var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    title   : String,
    image   : String,
    body    : String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    created : { 
        type: Date, 
        default: Date.now 
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    likedby: [{type: String}]
});

module.exports = mongoose.model("Post", postSchema);