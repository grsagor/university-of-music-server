const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

/* Middle Wares */
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7le8ogp.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
        const serviceCollection = client.db('assignment11').collection('services');
        const reviewCollection = client.db('assignment11').collection('reviews');

        app.post('/services', async(req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
        
        app.get('/home', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            const count = await serviceCollection.estimatedDocumentCount();
            res.send({count, services});
        });

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        /* Review API */
        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = await reviewCollection.deleteOne(query);
            res.send(review);
        })

        app.get('/reviews', async(req, res) => {
            let query = {};
            if(req.query.id){
                query = {
                    service: req.query.id
                }
            };
            if(req.query.name){
                query = {
                    userName: req.query.name
                }
            };
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });

        // app.patch('/review/:id', async(req, res)=> {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};

        // })
    }
    finally{
        
    }
};

run().catch(err => console.log(err));


console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

app.get('/', (req, res) => {
    res.send('Assignment 11 server is running');
});

app.listen(port, () => {
    console.log('Running', port);
})