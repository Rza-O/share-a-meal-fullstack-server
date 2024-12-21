const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000


// Middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send('Meal is Sharing')
})
app.listen(port, () => {
    console.log(`Meal sharing is on port: ${port}`)
})