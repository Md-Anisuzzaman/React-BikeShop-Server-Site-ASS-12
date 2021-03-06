const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhzyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('bike-selling');
    const productsCollection = database.collection('Products');
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection('users');
    const reviewsCollection = database.collection("reviews");

    //add product Collection

    app.post("/addproduct", async (req, res) => {
      console.log(req.body);
      const result = await productsCollection.insertOne(req.body);
      res.send(result);
    });

    // get all products

    app.get("/allproduct", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });

    //Delete Product 

    app.delete('/allproduct-delete/:id', async (req, res) => {
      const id = req.params.id;
      console.log('hello', id);
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
      console.log('hello');
    });


    // single product details to purchase

    app.get("/singleProduct/:id", async (req, res) => {
      //console.log(req.params.id);
      const query = { _id: ObjectId(req.params.id) }
      const result = await productsCollection.findOne(query)
      res.send(result);
      //console.log("result vaiya",result);
    });

    // add order an item

    app.post("/addOrderItem", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });


    // get all orders

    app.get("/allorders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });


    // get my orders list

    app.get("/myOrders/:email", async (req, res) => {
      //console.log(req.params.email);
      const result = await ordersCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    });


    //DELETE Orders

    app.delete('/orders-delete/:id', async (req, res) => {
      const id = req.params.id;
      //console.log('hello', id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
      //console.log('hello');
    });

    //add review

    app.post("/addreview", async (req, res) => {
      const result = await reviewsCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    //get reviews

    app.get("/allreview", async (req, res) => {
      const result = await reviewsCollection.find({}).toArray();
      res.send(result);
    });

    // Add user

    app.post("/addusers", async (req, res) => {
      const result = await usersCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    //  user list

    app.get("/allusers", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });


    // app.post("/makeAdmin", async (req, res) => {
    //   const filter = { email: req.body.email };
    //   const result = await usersCollection.find(filter).toArray();
    //   if (result) {
    //     const updateDoc = await usersCollection.updateOne(filter, { $set: { role: "admin" } });
    //     console.log(updateDoc, "doc");
    //   }
    //   console.log(result, req.body, "koi");
    // });


    //Make Admin

    app.post("/makeAdmin", async (req, res) => {
      const filter = { _id: new ObjectId(req.body.id) };
      const updateDoc = await usersCollection.updateOne(filter, { $set: { role: "admin" } });
      // console.log(updateDoc, "doc");
      // console.log(filter, req.body);
    });

    // Check Admin
    app.get("/checkAdmin/:email", async (req, res) => {
      const result = await usersCollection.find({ email: req.params.email }).toArray();
      console.log(result);
      res.send(result);
    });


  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to BuyBike site')
})

app.listen(port, () => {
  console.log(`Hello World! Do You Need Server: ${port}`)
})