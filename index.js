const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

//desgin-agency
//kiD4VA6MuAwZ9weL



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.mx55o.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {
      await client.connect();
      const serviceCollection = client.db("services").collection("service");
      const reviewCollection = client.db("services").collection("review");
      const orderCollection = client.db("services").collection("order");
      console.log('db connected');

     //add services
     app.post('/service', async(req,res)=>{
       const service = req.body 
       const result = await serviceCollection.insertOne(service) 
       res.send(result)
     })

      //get this services
      app.get('/service', async(req,res)=>{
        const service = await serviceCollection.find().toArray()
        res.send(service)
      })

       //save review in database
       app.post('/review', async(req,res)=>{
         const review = req.body 
         const result =await reviewCollection.insertOne(review) 
         res.send(result)
       })

        //get the review 
        app.get('/review', async(req,res)=>{
          const review = await reviewCollection.find().toArray() 
          res.send(review)
        })

        //save order on database
        app.post('/order', async(req,res)=>{
          const order = req.body 
          const result = await orderCollection.insertOne(order)
          res.send(result)
        })

        //get all order

        app.get('/order', async(req,res)=>{
          const order = await orderCollection.find().toArray() 
          res.send(order)
        })

        //find my orders
        app.get('/myorder', async(req,res)=>{
          const email = req.query.email 
          const query = {email:email} 
          const cursor = orderCollection.find(query) 
          const result = await cursor.toArray() 
          res.send(result)
        })
  

        //delete myorder
        app.delete('/myorder/:id', async(req,res)=>{
          const id = req.params.id 
          const query = {_id:ObjectId(id)} 
          const result = await orderCollection.deleteOne(query) 
          res.send(result)

        })
    }
     finally {
  
    }
  
  }
  
  run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('Hello from dsgin agency')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
