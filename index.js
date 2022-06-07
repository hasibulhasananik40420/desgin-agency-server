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

function verifyJWT(req,res,next){
  const authHeader  = req.headers.authorization 
  if(!authHeader){
    return res.status(401).send({message:'Unauthrized access'})
  }
  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
    if(err){
      return res.status(403).send({message:'Forbiden access'})
    }
   req.decoded = decoded
   next()
  });
}

async function run() {

    try {
      await client.connect();
      const serviceCollection = client.db("services").collection("service");
      const reviewCollection = client.db("services").collection("review");
      const orderCollection = client.db("services").collection("order");
      const userCollection = client.db("services").collection("user");
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
        app.get('/myorder',verifyJWT, async(req,res)=>{
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


        //save all users
         app.put('/user/:email', async(req,res)=>{
           const email = req.params.email 
           const user = req.body 
           const filter = {email: email} 
           const options = { upsert: true };
           const updateDoc = {
            $set: user
          }

          const result = await userCollection.updateOne(filter, updateDoc, options);
          const token = jwt.sign({email:email} , process.env.ACCESS_TOKEN ,  { expiresIn: '1h' })
          res.send({result, token})

         })
   
   //75.7
   
   
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
