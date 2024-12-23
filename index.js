require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000


// Middlewares
app.use(express.json());
app.use(cors());



// MongoDB integration starts here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbg9j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const foodsCollection = client.db('FoodsDB').collection('foods');

        // Adding food to the food Collection
        app.post('/add-foods', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await foodsCollection.insertOne(data);
            res.send(result)
        })

        // GET API for all available foods
        app.get('/all-foods', async (req, res) => {
            const { search, sort } = req.query;
            let result;
            let query = {};
            if (search) {
                query = { foodName: { $regex: search, $options: 'i' } }
                result = await foodsCollection.find(query).toArray();
            }
            else if (sort) {
                const sortOrder = sort === 'asc' ? 1 : -1;
                result = await foodsCollection.find().sort({ expiryDate: sortOrder }).toArray();
            }
            else {
                result = await foodsCollection.find().toArray();
            }
            res.send(result)
        })

        // Single food details api
        app.get('/food/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) };
            const result = await foodsCollection.findOne(query);
            res.send(result);
        })

        // Updating data of a single food
        app.patch('/food/:id', async (req, res) => {
            const { id } = req.params;
            const filter = { _id: new ObjectId(id) };
            const updateData = req.body;
            const result = await foodsCollection.updateOne(filter, { $set: updateData });
            res.send(result)
        })
        

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Meal is Sharing')
})
app.listen(port, () => {
    console.log(`Meal sharing is on port: ${port}`)
})