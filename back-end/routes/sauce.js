const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/Sauce');
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth');

router.post('/sauces', auth, multer,  sauceCtrl.sauce);
router.get('/sauces', auth, multer, sauceCtrl.getAllSauces);
router.get('/sauces/:id', auth,  multer, sauceCtrl.getOneSauce);
router.put('/sauces/:id', auth, multer, sauceCtrl.getOneSaucePut );
router.delete('/sauces/:id', auth, multer, sauceCtrl.getOneSauceDelete);
router.post('/sauces/:id/like' , auth, multer, sauceCtrl.postSauceLike)

module.exports = router; 