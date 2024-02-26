const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// usename: Assignment
// cXr1VrdrEOBgnEME :password

// middleware
app.use(cors());
app.use(express.json());
// mongodb add


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1cctsuq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const BrandsCollection = client.db('productsDB').collection('brands');
        app.post('/brands', async(req, res) => {
            const newBrand = req.body;
            console.log(newBrand);
            const result = await BrandsCollection.insertOne(newBrand);
            res.send(result);
        })

        //data read korar jonno

        app.get('/brands', async(req, res) => {
                const Brand = BrandsCollection.find();
                const result = await Brand.toArray();
                res.send(result);
            })
            // delete single user
        app.delete('/brands/:id', async(req, res) => {
                const id = req.params.id;
                console.log('id', id)

                const query = {
                    _id: new ObjectId(id)
                }
                const result = await BrandsCollection.deleteOne(query);
                res.send(result);
            })
            // update single user
        app.put('/brands/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id),
            }
            const options = { upsert: true };
            const updatedBrands = req.body;

            const Brands = {
                $set: {


                    name: updatedBrands.name,
                    ChoiceYourBrand: updatedBrands.ChoiceYourBrand,
                    Price: updatedBrands.Price,
                    description: updatedBrands.description,
                    Rating: updatedBrands.Rating,
                    details: updatedBrands.details,
                    Image: updatedBrands.Image
                }
            }

            const result = await BrandsCollection.updateOne(filter, Brands, options);
            res.send(result);
        })


        app.get('/brands/:id', async(req, res) => {
                const id = req.params.id;
                console.log('id', id)

                const query = {
                    _id: new ObjectId(id)
                }
                const result = await BrandsCollection.findOne(query);
                res.send(result);
            })
            // Send a ping to confirm a successful connection
            // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})