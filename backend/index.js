const express = require('express');
const app = express();
const server = require('http').Server(app);

const addRouter = require('./routes/add');
const authRouter = require('./routes/auth');
const infoRouter = require('./routes/info');
const changeRouter = require('./routes/change');
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
app.use('/api/add', addRouter);
app.use('/api/auth', authRouter);
app.use('/api/info', infoRouter);
app.use('/api/change', changeRouter);

server.listen(8000);