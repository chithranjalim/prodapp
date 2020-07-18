const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');


const  productData = require('./src/model/productdata');
const signupData = require('./src/model/signupdata');
var ObjectId = require('mongoose').Types.ObjectId;

const app = new express();

app.use(bodyparser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.get('/',function(req,res)
{
    res.send("hello from server");
});

app.get('/products',function(req,res)
{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");

    productData.find()
    .then (function(products)
                    {
                        res.send(products);
                    });
});

app.post('/insert',function(req,res)
{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    console.log(req.body);
    
    var product ={
                    productId : req.body.productId,
                    productName : req.body.productName,
                    productCode : req.body.productCode,
                    releaseDate : req.body.releaseDate,
                    description : req.body.description,
                    price : req.body.price,
                    starRating : req.body.starRating,
                    imageUrl : req.body.imageUrl
                    }
     var product =new productData(product);
     product.save();               
    
});


app.post('/edit', (req, res) => {
  
    var id = req.params.id;
    var product = {
        productId: req.body.productId,
        productName: req.body.productName,
        productCode: req.body.productCode,
        releaseDate: req.body.releaseDate,
        description: req.body.description,
        price: req.body.price,
        starRating: req.body.starRating,
        imageUrl: req.body.imageUrl
    }
    productData.findOneAndUpdate({_id:id},{$set:{productId:productId,productName:productName,productCode:productCode,releaseDate:releaseDate,description:description,price:price,starRating:starRating,imageUrl:imageUrl}},
        {new:true},function(err,edit)
        {
        if(err) {
         
             console.log("err");
             
                 }  
       res.json(edit);
       console.log("edit");
  
});
});

app.delete('/delete/:id',function(req, res)
         {  
            var id = req.params.id;
            productData.findOneAndRemove({_id: id})
            .then(function(product){
                res.status(200).send(product);
                
                console.log(product);
                console.log(id);
            });
        });
  
// app.post('/signup',function(req,res)
// {
//     res.header("Access-Control-Allow-Origin","*");
//     res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
//     console.log(req.body);
    
//     var item ={
//         entry:req.body.entry,
//         fname:req.body.fname,
//         lname :req.body.lname,
//         DOB :req.body.DOB,
//         gender:req.body.gender,
//         address :req.body.address,
//         username : req.body.username ,
//         password : req.body.password,
//         email: req.body.email,
//         mob: req.body.mob
//     }
//      var user =new signupData(item);
//      user.save();               
    
// });
app.post("/signup", (req, res) => {
    let userData = req.body;
    let user = new signupData(userData);
    user.save((err, signupUserDetails) => {
        if (err) {
            console.log(err);
        } else {
            let payload = { subject: user._id };
            let token = jwt.sign(payload, "secretKey");
            res.status(200).send({token});
            console.log(signupUserDetails);
        }
    });
});
app.post("/login", (req, res) => {
    let userData = req.body;
    signupData.findOne({email: userData.email}, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (!user) {
                res.status(401).send("Invalid Email");
            } else if (user.password !== userData.password) {
                res.status(401).send("Invalid Password");
            } else {
                let payload = { subject: user._id };
                let token = jwt.sign(payload, "secretKey");
                res.status(200).send({token});
                console.log(user);
            }
        }
    });
});
app.get("/test", verifyToken, (req, res) => {
    res.status(200);
});
// app.post('/login',function(req,res)
//                 {
//                     var username=req.body.username;
//                     var password=req.body.password;
                   
//     signupData.findOne({username:username,password:password},function(err,user)
//         {
//             if(err)
//                 {
//                     res.send(html);
//                     console.log("err");
//                    return res.status(500).send();
//                 }
//                res.json(user);
//                  res.redirect('/');
//                  return res.status(200).send();
//         });
//     });
function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        res.status(401).send("Unauthorized request");
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === "null") {
        res.status(401).send("Unauthorized request");
    }
    try {
        let payload = jwt.verify(token, "secretKey");
        req.userId = payload.subject;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized request");
    }
}
app.listen(3000,function(){
    console.log('listening to port 3000');    
});