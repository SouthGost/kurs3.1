const express = require('express');
const app = express();
const server = require('http').Server(app);
const filmRouter = require('./routes/film');
const authRouter = require('./routes/auth');
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

app.use(cors(corsOpts));
app.use(express.json());
app.use('/api/film', filmRouter);
app.use('/api/auth', authRouter);

// app.get('/', (req,res) => {
//     res.status(200).send("d");
// })


server.listen(8000);