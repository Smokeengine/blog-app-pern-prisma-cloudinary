const express = require('express')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 4000
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

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () =>{
    console.log(`Server running on port ${port}`)
})
