
const mongoose = require('mongoose');

const tmdlSchema = new mongoose.Schema({
    Basin: {
        type: String,
        required: "Basin is required",
        max: 32,
        trim: true,
        //gives deprecation warning, use createIndexes instead
        text:true
    },
    Water_Body_Name: {
        type: String,
        required: "Water body name is required",
        max: 32,
        trim: true,
        uppercase: true,
        text: true
    },
    Water_Body_ID: {
        type: String,
        required: "Water body ID is required",
        trim: true
    },
    County: {
        type: String,
        required: "County is required",
        max: 32,
        trim: true,
        uppercase:true,
        text:true

    },
    USGS_HUC: {
        type: Number,
        required: "USGS HUC is required",
        max: 999999999999,
        min: 9999999,
        trim: true,

    },
    Impaired_Use: {
        type: String,
        required: "Impaired use is required",
        max: 32,
        trim: true
    },
    Pollutant: {
        type: String,
        required: "Pollutant is required",
        max: 32,
        trim: true
    },
    TMDL_Due_Date: {
        type: String,
        // required: "TMDL due date is required",
        trim: true
    },
    Location: {
        type: String,
        required: "Location is reqiured",
        max: 128,
        trim:true
    },
    EPA_Approval_Date: {
        type: String,
        trim: true
    },
    ORC: {
        type: Number,
        required: "Off Ramp Code is required",
        trim: true
    },
    Category: {
        type: String,
        required: "Category is required",
        trim: true
    },
    Report_ID_NTTS: {
        type: String,
        trim: true,
    },
    Stressor_ID: {
        type: String,
        trim: true
    },
    // need to add stressor id date i think
    Engineer: {
        type:String,
        trim: true,
        uppercase:true
    },
    Priority: {
        type: String,
        required: "Priority is required",
        trim: true
    },
    TMDL_Path: {
        type: String,
        trim: true
    },
    TMDL_Status: {
        type: String,
        trim: true
    },

    PDF_Link: String,

    Comment: {
        type: String,
        trim: true
    }
    
});

module.exports = mongoose.model('tmdl', tmdlSchema);

// module.exports = mongoose.model('TMDLs', tmdlSchema,'TMDLs');

// module.exports = mongoose.model('TMDLs', new Schema({
//     Basin: {
//         type: String,
//         required: "Basin is required",
//         max: 32,
//         trim: true
//     },
//     Water_Body_Name: {
//         type: String,
//         required: "Water body name is required",
//         max: 32,
//         trim: true
//     },
//     County: {
//         type: String,
//         required: "County is required",
//         max: 32,
//         trim: true
//     },
//     USGS_HUC: {
//         type: Number,
//         max: 7,
//         trim: true
//     },
//     Impaired_Use: {
//         type: String,
//         required: "Impaired use is required",
//         max: 32,
//         trim: true
//     },
//     Pollutant: {
//         type: String,
//         required: "Pollutant is required",
//         max: 32,
//         trim: true
//     },
//     TMDL_Due_Date: {
//         //check to see if this works with DB
//         type: String,
//         required: "Due Date is required",
//         max: 32,
//         trim: true
//     },
//     Location: {
//         type: String,
//         required: "Location is required",
//         max: 64,
//         trim: true
//     },
//     EPA_Approval_Date: {
//         type: String,
//         max: 32,
//         trim: true
//     },
//     Category: {
//         type: String,
//         required: "Category is required",
//         max: 32,
//         trim: true
//     },
//     TMDL_Completed_Path: {
//         type: String,
//         max: 32,
//         trim: true
//     }
    
// })
// , tmdlSchema);