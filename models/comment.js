var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    createTime:{type: Date, default:Date.now},
});

var comment = mongoose.model('Comment',  commentSchema);
module.exports = comment;

