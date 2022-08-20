const express= require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors=require('cors')

const userRouter = require('./routes/userRoutes');
const movieRouter = require('./routes/movieRoutes');
const likeRouter = require('./routes/likeRoutes');

dotenv.config({ path: './config.env' });
const app = express();

//public api
app.use(cors({
  origin: '*'
}));
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log('DB Connected')
});

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/likes', likeRouter);

app.get('/',(req,res)=>{
  res.status(200).json({ status:'success', message: 'I am alive'})
})

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this Server`,
  })
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
  console.log(`Server run on port ${port}`)
})