//set mongoose ready to use 
var mongoose = require("mongoose")

var campSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    price: String,
    location:String,
    createTime:{type: Date, default:Date.now},
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
});
var camp = mongoose.model('campgrounds', campSchema);

module.exports = camp;