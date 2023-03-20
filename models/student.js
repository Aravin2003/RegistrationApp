const mongoose=require('mongoose');
const studentschema= new mongoose.Schema(
    {
        name:
        {
            type: String,
            required:true
        },
        regNo:
        {
            type: Number,
            required:true,
            min:[100000,"The register number must contain 6-digits only"],
            max: [999999,"The register number must contain 6-digits only"],
            unique:true
        },
        dob:
        {
            type: Date,
            required: true
        },
        password:
        {
            type: String,
            required: true,
        },
        courses:
        [
            {
                type: String,
                required:true,
                unique:true
            }
        ]
    }
);
module.exports=mongoose.model('Student',studentschema);