require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const User_Details_Model=require('./Models/User_Details_Model')
const NotesModel=require('./Models/NoteDetailsModel')
const TrashNotesModel=require('./Models/TrashNote_Model')
const FavNotesModel=require('./Models/FavNotesmodel')
const { use } = require('react')
app.use(cors())
app.use(bodyParser.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));

const CounterSchema={
  UserId:{
    type:String
  },
  seq:{
    type:Number
  }
}


const NoteCounterSchema={
  NoteId:{
    type:String,
    required:true
  },
  seq:{
    type:Number, required:true
  }
}

const NoteCounterModel=mongoose.model("Notecounter",NoteCounterSchema)

app.post('/postnotedetails', async (req, res) => {
    let cd = await NoteCounterModel.findOneAndUpdate(
      { NoteId: "autoval" },
      { "$inc": { "seq": 1 } },
      { new: true }
    ).exec();
    let NoteseqId;
    if (cd == null) {
      const newval = new NoteCounterModel({ NoteId: "autoval", seq: 1 });
      await newval.save();
      NoteseqId=1;
    }
    else{
      NoteseqId=cd.seq
    }
    const state=req.body;
    state.NoteId=NoteseqId;
    console.log(state)
    const Note_Details = new NotesModel(state);
    await Note_Details.save();
    res.status(201).json(state.NoteId); 
});

const CounterModel=mongoose.model("counter",CounterSchema)
app.post('/postuserdetails', async (req, res) => {
    let cd = await CounterModel.findOneAndUpdate(
      { UserId: "autoval" },
      { "$inc": { "seq": 1 } },
      { new: true }
    ).exec();
    let seqId;
    if (cd == null) {
      const newval = new CounterModel({ UserId: "autoval", seq: 1 });
      await newval.save();
      seqId=1;
    }
    else{
      seqId=cd.seq
    }
    const state=req.body;
    state.UserId=seqId
    const User_Details = new User_Details_Model(req.body);
    await User_Details.save();
    res.status(201).json('created'); 
});

app.get('/getuserdetails/:email',async(req,res)=>{
    const email=req.params.email
    const password=req.query.password
    const getData=await User_Details_Model.findOne({email,password})
        if(!getData)
        {
          res.status(404).json({message:"Invalid Email"})}
        else if(getData.password!==password)
        { 
          res.status(404).json({message:"Invalid Password"})
        }
        else
          res.json(getData);
})

app.get('/getnotedetails/:userId',async (req,res)=>{
  const userId=req.params.userId
  const getData=await NotesModel.find({UserId:userId})
  if(getData){
    res.json(getData)
  }
})

app.patch('/updatenotecontent', async (req, res) => {
  try {
      const NoteId = req.body.NoteId;
      const content = req.body.content;
      const date=new Date()
      const updatedDate=date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()
      const updateResult = await NotesModel.updateOne(
          { "NoteId": NoteId },
          { $set: { "content": content ,'date':updatedDate} }
      );
      if (updateResult.modifiedCount === 1) {
          const updatedData = await NotesModel.findOne({ "NoteId": NoteId });
          res.json(updatedData.content);
      } else {
          res.status(404).json({ error: "Note not found" });
      }
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }
});

app.patch('/updateuserpassword',async(req,res)=>{
 const newPassword=req.body.newPassword
 const email=req.body.email
 const updatedData=await User_Details_Model.updateOne({"email":email},{$set:{"password":newPassword}})
})

app.post('/posttrashnote',async(req,res)=>{
  const data=req.body
  const noteId=req.body.NoteId
  await NotesModel.deleteOne({NoteId:noteId})
  await FavNotesModel.deleteOne({NoteId:noteId})
  const TrashNotes=new TrashNotesModel(data)
  await TrashNotes.save()

})

app.get('/getdeletednotesdetails/:userId',async(req,res)=>{
  const userId=req.params.userId
  const data=await TrashNotesModel.find({UserId:userId})
  if(data)
  {
    res.json(data)
  }
})

app.post('/restorenotedetails',async(req,res)=>{
  if(req.body.fav===true)
  {const data1=new FavNotesModel(req.body)
    data1.save()
  }
  const data1=new NotesModel(req.body)
  data1.save()
  await TrashNotesModel.deleteOne({NoteId:req.body.NoteId})
})

app.post('/postfavnotes',async(req,res)=>{
  const data1=req.body
  data1.fav=true
  const data=new FavNotesModel(data1)
  data.save()
  const updatedData=await NotesModel.updateOne({"NoteId":req.body.NoteId},{$set:{"fav":true}})
})

app.get('/getfavnotesdetails/:userId',async(req,res)=>{
  const userId=req.params.userId
  const data=await FavNotesModel.find({UserId:userId})
  console.log(data)
  if(data)
    {
      res.json(data)
    }
})

app.post('/deletefavnote',async(req,res)=>{
  await FavNotesModel.deleteOne({NoteId:req.body.NoteId})
  await NotesModel.updateOne({"NoteId":req.body.NoteId},{$set:{"fav":false}})
})

const DB_URL=process.env.MONGODB_URL
app.listen(1965,()=>{
    mongoose.connect(DB_URL)
    console.log("Server Started")
})