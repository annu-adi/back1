const express = require ('express')
const cors = require ('cors')
const mongoose = require('mongoose')
const userRouter = require('./Routes/auth')
const cookieParser = require('cookie-parser')

const TodoModel = require('./models/Todo')



const app = express()

app.use(cors({
    origin: ["http://localhost:5173"],
    methods:["GET","POST","PUT", "DELETE"],
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())
app.use('/auth', userRouter)



const connection=()=>{
    mongoose.connect('mongodb+srv://rashmi:rashmi123@cluster0.pszpa.mongodb.net/teste?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
        console.log("Db Connected");

    }).catch((error)=>{
       console.log(error);
    })
    
}
connection();

app.get('/get',(req, res)=>{
    TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

app.put('/update/:id', (req,res)=>{
    const {id} = req.params;
   TodoModel.findByIdAndUpdate({_id:id}, {done:true})
   .then(result=>res.json(result))
   .catch(err => res.json(err))
  
})

app.delete('/delete/:id', (req, res)=>{
    const {id} = req.params;
    TodoModel.findByIdAndDelete({_id:id})
    .then(result=>res.json(result))
    .catch(err => res.json(err))
})


app.post('/add', (req,res)=>{
    const task = req.body.task;
    TodoModel.create({
        task:task
    }).then(result => res.json(result))
    .catch(err => res.json(err))
})


app.listen(3001, ()=>{
    console.log("Server Started")
})