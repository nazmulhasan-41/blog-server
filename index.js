const express = require('express')
const app = express()
const port = 5000;
var cors = require('cors')
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('dotenv').config();


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jyuwz.mongodb.net/blogDB?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const usersCollection = client.db("blogDB").collection("users");
  const categoriesCollection = client.db("blogDB").collection("categories");
  const articlesCollection = client.db("blogDB").collection("articles");
  const likesCollection = client.db("blogDB").collection("likes");



  // perform actions on the collection object
  console.log("=====================");
 

  // ---------Get-------------
  app.get('/', (req, res) => {
    console.log('dsdsd')
    res.send({msg:'Hello World!'})
  })

  app.get('/getAllCategories', (req, res) => {
    categoriesCollection.find({}).toArray((err,doc)=>{
      res.send(doc)
    })
    
  })
  
  app.get('/getArticles/:filteredObj', (req, res) => {
    //  console.log('+++++++--->>>>>>>>>>>>>>>>',req.params.filteredObj);
    const filter=JSON.parse(req.params.filteredObj);
    console.log(filter)
    articlesCollection.find(filter).toArray((err,doc)=>{
      res.send(doc)
    })
    
  })


  app.get('/getArticles', (req, res) => {

    articlesCollection.find({}).toArray((err,doc)=>{
      res.send(doc)
    })
  })

  app.get('/likeStatus/:filteredObj', (req, res) => {
    // console.log(req.params.articleId)
    const filter=JSON.parse(req.params.filteredObj);
    
    likesCollection.find(filter).toArray((err,doc)=>{
      // console.log(doc[0])
      res.send(doc)
    })
  })

// -----------post----------- 
  
  app.post('/addUser',(req,res)=>{
  
    usersCollection.insertOne(req.body,(err,doc)=>{
      res.send(doc)
    })
  })

  app.post('/addArticle',(req,res)=>{
  
    articlesCollection.insertOne(req.body,(err,doc)=>{
      res.send(doc)
    })
  })

  app.post('/addLike',(req,res)=>{
  
    likesCollection.insertOne(req.body,(err,doc)=>{
      res.send(doc)
    })
  })



  // ----------Delete Request--------------

  app.delete('/deleteArticle/:articleId',(req,res)=>{
    // console.log(req.params.articleId);
    const objectId=ObjectId(req.params.articleId)
  
    articlesCollection.deleteOne({_id: objectId},(err,doc)=>{
      res.send(doc)
    })
    
  })

  app.delete('/deleteLike',(req,res)=>{

    // console.log(req.body)
  
    likesCollection.deleteOne((req.body),(err,doc)=>{
      res.send(doc)
    })
    
  })

  //-----PUT request ------------

  app.put('/updateArticle/:articleId', (req, res) => {

    const objectId= ObjectId(req.params.articleId);
    const filteredObj=req.body;
    // console.log( req.body,objectId)

    // var convertedObjectid = ObjectId(req.body._id);
    
    articlesCollection.updateOne(

      { _id: objectId },
      {
        $set: filteredObj
      },
      (err,doc)=>res.send(doc)
    )
      // .then(result => {
      //   res.send({ modified: true })
      // })
  });


  // client.close();
});

app.listen(process.env.PORT || port);