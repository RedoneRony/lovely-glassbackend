const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();
const objectId = require("mongodb").ObjectId;
console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ngucd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("lovelyGlass");
    const servicessCollections = database.collection("services");
    const ordersCollections = database.collection("orders");
    const reviewCollections = database.collection("review");
    const userCollections = database.collection("user");
    // get all service value from database
    app.get("/addService", async (req, res) => {
      const cursor = servicessCollections.find({});
      const services = await cursor.toArray();
      res.json(services);
    });
    // delete order api
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const resultOrder = await servicessCollections.deleteOne(query);
      console.log("deleting user with id", resultOrder);
      res.json(resultOrder);
    });
    //  get all order value
    app.get("/order/", async (req, res) => {
      const cursorOrder = ordersCollections.find({});
      const orders = await cursorOrder.toArray();
      res.json(orders);
    });

    // get single order value from database
    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const order = await ordersCollections.findOne(query);
      console.log("load user with id:", id);
      res.send(order);
    });

    // create a addService document to insert in database
    app.post("/addService/", async function (req, res) {
      const newUser = req.body;
      const result = await servicessCollections.insertOne(newUser);
      console.log("got new User", req.body);
      console.log("added User", result);
      res.send(result);
    });

    // create a review document to insert in database
    app.post("/review/", async function (req, res) {
      const newReview = req.body;
      const result = await reviewCollections.insertOne(newReview);
      console.log("got new review", req.body);
      console.log("added review", result);
      res.send(result);
    });
    app.get("/review/", async (req, res) => {
      const cursorReview = reviewCollections.find({});
      const reviews = await cursorReview.toArray();
      res.json(reviews);
    });
    // create a order document to insert in database
    app.post("/order/", async function (req, res) {
      const newOrder = req.body;
      const resultOrder = await ordersCollections.insertOne(newOrder);
      console.log("got new Order", req.body);
      console.log("added Order", resultOrder);
      res.send(resultOrder);
    });

    // create user database
    app.post("/user/", async function (req, res) {
      const newUser = req.body;
      const result = await userCollections.insertOne(newUser);
      console.log("got new User", req.body);
      console.log("added User", result);
      res.send(result);
    });

    http: app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollections.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.put("/user/", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.put("/users/admin", async (req, res) => {
      const user = req.body;

      const filter = { email: user.email };
      console.log(filter);
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollections.updateOne(filter, updateDoc);
      console.log(result);
      console.log("got new User", updateDoc);
      res.json(result);
    });

    // delete order api
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const resultOrder = await ordersCollections.deleteOne(query);
      console.log("deleting user with id", resultOrder);
      res.json(resultOrder);
    });

    //UPDATE order API
    app.put("/order/:id", async (req, res) => {
      const id = req.params.id;
      const updatedOrder = req.body;
      const filter = { _id: objectId(id) };
      const options = { upsert: true };
      console.log(updatedOrder);
      const updateDoc = {
        $set: {
          status: updatedOrder.status,
        },
      };
      const resultOrder = await ordersCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating", id);
      res.json(resultOrder);
    });

    // const doc = {
    //   title: "Record of a Shriveled Datum",
    //   content: "No bytes, no problem. Just insert a document, in MongoDB",
    // };
    // const result = await usersCollections.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my server");
});
app.listen(port, () => {
  console.log("Running my server", port);
});
