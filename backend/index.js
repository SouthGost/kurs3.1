const express = require('express');
const app = express();
const server = require('http').Server(app);
const filmRouter = require('./routes/film');
const cors = require('cors');
const corsOpts = {
    origin: '*',

    methods:[
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
}

// app.use(cors(corsOpts));
app.use(express.json());
app.use('/api/film', filmRouter);

// app.get('/', (req,res) => {
//     res.status(200).send("d");
// })


server.listen(8000);