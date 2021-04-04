var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
var alert = require('alert');
const { render } = require('ejs');
var validUrl = require('valid-url');

var Id = 1;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addProduct',function(req,res) {
  res.render('addProduct');
});

router.post('/addProduct', async function(req,res){
  var url = req.body.link;
  if (validUrl.isUri(url)){
      console.log('Looks like an URI');
      const {data} = await axios.get(url);
      const $ = cheerio.load(data);
      const product = new Product({
        id: Id,
        name:$('h2[itemprop = "name" ]').text().trim(),
        imgUrl:$('div').find('img').attr('src'),
        price:$('meta[property = "product:price:amount" ]').attr('content')
      })
      product.save().then((result) => {
        Id++;
        alert("Succes");
        res.redirect('/');
      }).catch((err) => {
        alert('Could not retrieve a product from the given url');
        res.redirect('/');
      });
      
  }
  else {
      console.log('Not a URI');
      alert("Not a valid url");
      res.redirect('/addProduct');
  }
});

router.get('/products',function(req,res){
  Product.find({}).then((result) =>{
    var products = result;
    res.render('products',{products:products});
  });
});

router.get('/detailProduct',(req,res) =>{
  res.render('detail');
});

router.post('/detailProduct',(req,res) =>{
  var ID = req.body.ID;
  console.log(ID)
  Product.findOne({
    id:ID
  }).then((result) => {
    if(result === null) {
      alert("There is no product with given ID");
      res.redirect('/detailProduct');
    }
    var product = result;
    res.render('detailShow', {product:product});
  }).catch((err) => console.log(err))
});

module.exports = router;
