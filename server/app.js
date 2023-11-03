const express=require('express');
const app=express();
const Router=require('./Routes/Route');
const cors=require('cors');
const path=require('path');
require('dotenv').config()

app.use(cors());
const conn=require('./Routes/conn');
conn();
const PORT=process.env.PORT;




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(Router);

app.use(express.static(path.join(__dirname,'../client/build')))

app.get('*',(req,res)=>
{
    res.sendFile(path.join(__dirname,'../client/build/index.html'));
})

app.get('/', (req, res)=>
{
    res.send("Hello World");
});




app.listen(PORT,(req,res)=>
{
    console.log(`listening on  port ${PORT}`);
})