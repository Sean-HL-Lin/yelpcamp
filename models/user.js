var mongoose =require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var  userSchema = new mongoose.Schema({
    username: String,
    password: String,
    admin:{type: Boolean, default: false},
    createdCamps:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'campgrounds'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);