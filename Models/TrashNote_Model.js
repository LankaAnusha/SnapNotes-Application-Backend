const TrashNotesSchema=require('../Schemas/TrashNotesSchema')
const mongoose=require('mongoose')
const TrashNotesModel=mongoose.model("TrashNotesDetail",TrashNotesSchema)
module.exports=TrashNotesModel