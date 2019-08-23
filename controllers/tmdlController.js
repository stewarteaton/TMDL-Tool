//requires mongoose model
const TMDLs = require('../models/tmdls');
const cloudinary = require('cloudinary');
//multer is a middleware used for handling file uploads
const multer = require('multer');
// to format dates
const date = require('date-and-time');

//cloudinary is free cloud server used for hosting img, videos, and pdfs
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//if object left empty, images are stored to default directory
const storage = multer.diskStorage({});

const upload = multer({ storage });
//upload one PDF at a time
exports.upload = upload.single('PDF');

//List of all pollutants to populate tmdl form 'lookups'
pollutantOptions = ["","Biological Impairment", "Organic Enrichment / Low Dissolved Oxygen", "Total Nitrogen", "Total Phosphorus", "Sediment", "Pathogens",
    "pH", "Fecal Coliform", "DDT", "Toxaphene", "Mercury", "Nutrient Pollution", "Cause Unknown", "Suspended Solids", "Metals","Aluminum", "Ammonia Toxicity", "Arsenic",
    "Cadmium", "Chlorides", "Chromium", "Copper", "Crude Oil", "Dioxins", "Dispersants", "Flow Alteration", "Hydrocarbons", 
    "Kerosene", "Lead", "NonPriority Organics", "Oil and Greas", "Other Habitat Alterations", "PCB'S", "Phenols", "Phosphorus Pollution", 
    "Priority Organics", "Salinity/TDS/Chlorides", "Selenium", "Soluble Hydrocarbons", "Specific Conductivity", "Thermal Modifications", 
    "Total Toxics", "Total Toxics Acute", "Total Toxics Chronic", "Turbidity", "Unionized Ammonia", "Unknown Toxicity", "Zinc"
];

//if image is passes, cloudinary uploads image and then we store image url in database
exports.pushToCloudinary = async (request,response, next) => { 
    // checks to see if pdf is included in add tmdl form
    if(request.file){
        cloudinary.v2.uploader.upload(request.file.path, {
            folder: 'tmdls',
            use_filename:true,
            unique_filename: false
        })
        .then((result) => {
            // Gets url for new pdf uploaded and stores the address with document in database
            request.body.PDF = result.url;
            //to move on to next piece of middleware
            next();
        })
        .catch(() => {
            console.log("Error pushing to cloudinary")
            request.flash('error', 'There was a problem uploading your image, please try again');
            response.redirect('/');
        })
    } else {
        next();
    }
}

//home page
exports.homePage = async (request, response, next) => {
    try{

        pollutants = pollutantOptions;
        // set initial search query to empty
        const sQ = '';
        response.render('index', {title: "Search MDEQ's TMDL Database", pollutants, sQ});
    } catch(error) {
        next(error)
    }
}

//search results 
exports.searchResults = async (request, response, next) => {
    try{
        //apply model so that field are forced into all caps (sQ = search Query)
        const sQ = new TMDLs(request.body);
    
        console.log(sQ);

        // Create regular expressions for partial text search 
        const wbNameRegex = new RegExp(sQ.Water_Body_Name);
        const wbIdRegex = new RegExp( sQ.Water_Body_ID);
        const countyRegex = new RegExp( sQ.County );
        const usgsRegex = new RegExp( sQ.USGS_HUC );
        const reportIdRegex = new RegExp( sQ.Report_ID_NTTS);

        console.log(sQ.Report_ID_NTTS)
        // filter out seach parameters that are empty
        const searchCriteria = [
            sQ.Basin != '' && { Basin: sQ.Basin },
            sQ.Water_Body_Name != '' && { Water_Body_Name: { $regex: wbNameRegex } },
            sQ.Water_Body_ID != ''  && { Water_Body_ID: { $regex: wbIdRegex }},
            sQ.County != '' && { County: { $regex: countyRegex} },
            sQ.USGS_HUC != null && { USGS_HUC:  sQ.USGS_HUC},
            // sQ.USGS_HUC != null && { USGS_HUC: { $regex: usgsRegex }},
            sQ.Pollutant != '' && {Pollutant: sQ.Pollutant },
            sQ.Category != '' && {Category: sQ.Category},
            sQ.Report_ID_NTTS != null && { Report_ID_NTTS: { $regex: reportIdRegex }}

        ].filter(Boolean)

        console.log(searchCriteria);

        if (searchCriteria === undefined || searchCriteria.length == 0) {
            // array empty or does not exist
            request.flash('info', "At least one field must not be empty");
            response.redirect('/');
        }

        var searchData='';
        searchData = await TMDLs.aggregate([
            // { $match: { $text: {$search: `\"${sQ.Water_Body_Name}\"`}}},
            { $match: { $and: searchCriteria } },
            { $sort: {Water_Body_Name: 1 }}
        ]);

        // passes lists of pollutants for search form on results page
        pollutants = pollutantOptions;

        console.log(searchData);
        const url = request.originalUrl;

        if (url.startsWith('/admin/edit-remove')){
            response.render("results", {title: "Select TMDL to edit or remove", searchData, pollutants, sQ });
        } else {
            response.render('results', {title:"Search Results", searchData, pollutants, sQ })
        }

    } catch(error) {
        next(error)
    }
}

exports.adminPage = (request, response) => {
    response.render('admin', {title: 'Admin'});
}

exports.createTMDLget = (req, res) => {
    tmdl = [

    ];

    pollutants = pollutantOptions;

    res.render('addTMDL', {title: 'Add a new TMDL',pollutants, tmdl});
}

exports.createTMDLpost = async (req, res, next) => {
    try{
        const tmdl = new TMDLs(req.body);

        await tmdl.save();
        req.flash('success', `${tmdl.Water_Body_Name} TMDL successfully added`);
        res.redirect('/admin/admin-page');
    } catch (error) {
        next (error);
    }
}

exports.editRemoveGet = (request, response) => {
    pollutants = pollutantOptions;
    // initialze search form to empty
    const sQ = '';
    response.render('index', {title: "Search for TMDL and click on one to edit or remove", pollutants, sQ});
}


exports.editRemoveFormGet = async (req, res, next) => {
  try {
    pollutant = pollutantOptions;
    // searches for tmdl in database from id passed as parameter in hyper link
    const tmdl = await TMDLs.findOne({ _id: req.params.id });

    console.log(tmdl.EPA_Approval_Date);
    res.render("addTMDL", {title: "Edit or Remove this TMDL", tmdl, pollutant });
  } catch (error) {
    next(error);
  }
};

exports.updateTMDLpost = async (request, response, next) => {
    try{
        const tmdl_ID = request.params.id;
        // new: true  ensures that we get back the modified version
        const tmdl = await TMDLs.findByIdAndUpdate(tmdl_ID, request.body, {new: true});
        request.flash('success', `${tmdl.Water_Body_Name} TMDL updated successfully`);
        response.redirect('/admin/admin-page');
    } catch (error) {
        next(error);
    }
}

exports.deleteTMDL = async (request, response, next) => {
    try {
        const tmdl_ID = request.params.id;
        const tmdl = await TMDLs.findByIdAndRemove({ _id: tmdl_ID });
        request.flash('info', `${tmdl.Water_Body_Name} TMDL has been deleted`);
        response.redirect('/admin/admin-page');
    } catch (error) {
        next(error);
    }
}

