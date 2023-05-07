const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://rezwan:ArZzT9En1V8FZory@cluster0.didycpa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allUser = client.db("infoDB").collection("userInfo");

    app.get('/users', async(req, res) =>{
        const storedData = allUser.find()
        const result = await storedData.toArray()
        res.send(result)
    })

    app.get('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const user = await allUser.findOne(query);
        res.send(user)
    })

    app.post("/users", async (req, res) => {
      const userData = req.body;
      console.log("New user", userData);
        const result = await allUser.insertOne(userData);
        res.send(result);
    });

    app.put('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const user = req.body;
        console.log(id, user)
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedUser = {
            $set: {
                name: user.name,
                email: user.email
            }

        }
        const result = await allUser.updateOne(filter, updatedUser, options)
        res.send(result)

    })

    app.delete("/users/:id", async(req, res) =>{
        const id = req.params.id;
        console.log("Please delete from database id: ", id)
        const query = {_id: new ObjectId(id)}
        const result = await allUser.deleteOne(query)
        res.send(result)
        
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, (req, res) => {
  console.log(`Server is running on port: ${port}`);
});
