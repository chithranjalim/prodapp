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
const signupSchema = new Schema({
    
    password : String,
    email: String
  

});
var signupData= mongoose.model('signupData',signupSchema);
module.exports = signupData;