
const mongoose=require('mongoose');
const courseschema= new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true,
            unique:true
        },
        teacher:
        {
            type: String,
            required: true
        }
    }
);
module.exports=mongoose.model('Course',courseschema);



