const express = require('express')
require('dotenv').config();
const app = express()
const port = 4000
const cors = require('cors')

app.use(express.json());

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))

const authRoutes = require('./src/routes/auth');
const loginRoutes = require('./src/routes/login');
const postRoute = require('./src/routes/posts');
const commentRoutes = require('./src/routes/comment');
const uploadRoute = require('./src/routes/upload');

app.use('/api', authRoutes);
app.use('/api', loginRoutes);
app.use('/api', postRoute);
app.use('/api', commentRoutes);
app.use('/api', uploadRoute);

app.get('/', (req,res)=>{
    res.send('api is running');
})

app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`)
})