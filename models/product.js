const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id:{
        type:Number,
        required:true
        },
    name:{
        type:String,
        required:true},
    imgUrl:{type:String,required:true},
    price:{type:Number,required:true}
});


const Product = mongoose.model('Product',productSchema);
module.exports = Product;