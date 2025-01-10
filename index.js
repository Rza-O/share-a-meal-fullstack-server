require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000


// Middlewares
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://share-aa-meal.web.app',
        'https://share-aa-meal.firebaseapp.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// custom middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized Access' });
    }
    // verifying the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized Access' });
        }
        req.user = decoded;
        next();
    })
}



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

        // Auth related Api
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6h' })

            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                })
                .send({ success: true })

        })

        app.post('/logout', (req, res) => {
            res
                .clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                })
                .send({ success: true })
        })

        // Adding food to the food Collection
        app.post('/add-foods', verifyToken, async (req, res) => {
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
                if (sort) {
                    const sortOrder = sort === 'asc' ? 1 : -1;
                    result = await foodsCollection.find(query).sort({ expiryDate: sortOrder }).toArray();
                }
            }
            else if (sort) {
                const sortOrder = sort === 'asc' ? 1 : -1;
                result = await foodsCollection.find(query).sort({ expiryDate: sortOrder }).toArray();
            }
            else {
                const filter = { status: 'available' }
                result = await foodsCollection.find(filter).toArray();
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
        app.patch('/food/:id', verifyToken, async (req, res) => {
            const { id } = req.params;
            const filter = { _id: new ObjectId(id) };
            const updateData = req.body;
            const result = await foodsCollection.updateOne(filter, { $set: updateData });
            res.send(result)
        })

        // My food get request api
        app.get('/my-foods', verifyToken, async (req, res) => {
            const { email } = req.query;

            if (!email) {
                return res.status(400).send({ message: 'Bad Request: Missing requestEmail in query parameters' });
            }

            if (req.user.email !== email) {
                return res.status(403).send({ message: 'Forbidden Request: Emails do not match the authenticated user' });
            }
            const query = { 'donor.email': email };
            const result = await foodsCollection.find(query).toArray();
            res.send(result);
        })
        
        
        // My food get request api
        app.get('/my-requests', verifyToken, async (req, res) => {
            const { requestEmail } = req.query;

            if (!requestEmail) {
                return res.status(400).send({ message: 'Bad Request: Missing requestEmail in query parameters' });
            }

            if (req.user.email !== requestEmail) {
                return res.status(403).send({ message: 'Forbidden Request: Emails do not match the authenticated user' });
            }
            const query = { 'requester.requesterEmail': requestEmail };
            const result = await foodsCollection.find(query).toArray();
            res.send(result);
        });

        // Deleting a food from the database
        app.delete('/food/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) };
            const result = await foodsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

        // canceling request patch api
        app.patch('/cancel-request/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) };
            const updateData = {
                $set: { status: 'available' },
                $unset: { requester: '' }
            }
            const result = await foodsCollection.updateOne(query, updateData)
            res.send(result);
        })

        // Featured foods GET API for homepage
        app.get('/featured', async (req, res) => {
            const filter = { status: 'available' };
            const sorted = { foodQuantity: -1 }
            const result = await foodsCollection.find(filter).sort(sorted).limit(8).toArray();
            res.send(result);
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