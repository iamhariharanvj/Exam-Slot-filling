const express = require('express');
const path = require('path');
app = express();


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors())

//DB connection
const mongoose = require('mongoose');
var dbUrl = `mongodb+srv://tcenit:tceit@facultydetails.ymqws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(dbUrl,(err) => {
    message = err?"Error Connecting to MongoDB\n"+err.message:"Successfully connected to DataBase";
    console.log(message);
})

const FacultyModel = require('./db.js');

app.get('/', (req, res)=>{
    FacultyModel.find({}).then(faculty =>{
        console.log(faculty);
        res.send(faculty);
    });
})

app.post('/', (req, res)=>{
    console.log(req.body);
    const facName = req.body.faculty;
    const maxEntries = req.body.maxEntries;

    var facData = new FacultyModel({
        name: facName,
        maxEntries: maxEntries,
    })

    facData.save((err)=>{
    message = err?"Error adding faculty\n"+err.message:"Successfully added faculty";
    console.log(message)
    res.send(`${message} \n${facData}`);
    })
})

app.put('/', (req,res)=>{

    const obj = req.body;
    const name = obj.name;
    const id = obj.id;
    const maxEntries = obj.maxEntries;





    FacultyModel.updateOne({_id:id},{ name: name,maxEntries: maxEntries },(err)=>{
        message = err?"Error updating max entry\n"+err.message:"Successfully edited max entry";
        res.send(message)
    })
})


app.delete('/:facultyName', (req,res)=>{
    FacultyModel.deleteOne({name:req.params.facultyName},(err)=>{
        message = err?"Error deleting faculty\n"+err.message:"Successfully deleted faculty";
        res.send(message)
    })
})


app.listen(8080,()=>{
    console.log(`Server is running in the port http://localhost:8080`);
})

app.post('/facDefault', (req,res)=>{
    value = req.body.value;
    FacultyModel.updateMany({},{ maxEntries: value },(err)=>{
        message = err?"Error updating max entry\n"+err.message:"Successfully edited max entry";
        res.send(message);
    })
});

app.post('/new', (req, res)=>{

    console.log(req.body.facData);
    res.send(req.body);

})

app.use(express.static(path.join(__dirname, '../frontend/public')))
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname +'/../frontend/public/index.html'))
})