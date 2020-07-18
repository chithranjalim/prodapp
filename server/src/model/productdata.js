const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/productdb',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
},
(err) => {
    if (err) {
        console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
    } else {
        console.log("Connected to MongoDB.");
    }
}
);
const Schema = mongoose.Schema;
var NewProductSchema = new Schema({
    productId: Number,
    productName : String,
    productCode : String,
    releaseDate : String,
    description : String,
    price : Number,
    starRating : Number,
    imageUrl : String

});
var productData= mongoose.model('product',NewProductSchema);
module.exports =  productData ;    