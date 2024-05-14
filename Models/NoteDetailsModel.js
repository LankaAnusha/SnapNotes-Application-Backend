const NotesSchema=require('../Schemas/NotesSchema')
const mongoose=require('mongoose')
const NotesModel=mongoose.model("NoteDetail",NotesSchema)
module.exports=NotesModel