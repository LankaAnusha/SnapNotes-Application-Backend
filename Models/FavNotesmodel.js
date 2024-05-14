const FavNotesSchema=require('../Schemas/FavNotesSchema')
const mongoose=require('mongoose')
const FavNotesModel=mongoose.model("FavNoteDetail",FavNotesSchema)
module.exports=FavNotesModel