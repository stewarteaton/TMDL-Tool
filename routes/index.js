var express = require('express');
var router = express.Router();

//must require controllers
const tmdlController = require('../controllers/tmdlController');
const userController = require('../controllers/userController');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: "MDEQ's TMDL Database Tools" });
// });


/* GET home page. */
router.get('/', tmdlController.homePage);
router.post('/', tmdlController.searchResults);



// Admin Routes
router.get('/admin', userController.isAdmin, tmdlController.adminPage)
    // routes that start with admin
router.get('/admin/*', userController.isAdmin);
router.get('/admin/signup', userController.signUpGet);
router.post('/admin/signup', userController.signUpPost,
                        userController.loginPost);
router.get('/admin/admin-page', userController.adminPageGet);
router.get('/admin/add-tmdl', tmdlController.createTMDLget);
router.post('/admin/add-tmdl', tmdlController.upload,
                          tmdlController.pushToCloudinary,
                          tmdlController.createTMDLpost);
router.get('/admin/edit-remove', tmdlController.editRemoveGet);
router.post('/admin/edit-remove', tmdlController.searchResults);
// retrieves tmdl to edit or remove
router.get('/admin/edit-remove/:id', tmdlController.editRemoveFormGet);
// updated tmdl
router.post('/admin/edit-remove/:id', tmdlController.upload,
                                        tmdlController.pushToCloudinary,
                                        tmdlController.updateTMDLpost);
router.get('/admin/delete/:id', tmdlController.deleteTMDL);

// USER Routes
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logout);


module.exports = router;
