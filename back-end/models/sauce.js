const mongoose = require('mongoose');


const sauceSchema = mongoose.Schema({
    
    "userId": String, //Identifiant unique MongoDb pour l'utilisateur qui a crée la sauce
    "name":  String, // Nom de la sauce 
    "manufacturer":  String, //Fabriquant de la sauce 
    "description": String, // Description de la sauce 
    "mainPepper":  String, // Ingrédient principal de la sauce 
    "heat": Number, // nombre entre 1 est 10 décrivant la sauce
    likes: {type: Number, required: true, default: 0},  // nombre d'utilisateur qui aime la sauce 
    dislikes:{type:Number, required: true, default: 0},  // nombre d'utilisateur qui n'aime pas la sauce 
    "usersLiked": [String], // tableau d'identifiant des personnes aimant la sauce 
    "usersDisliked": [String], // tableau d'identifiant des personnes n'aimant pas la sauce 
    
    "imageUrl": String, // image de la sauce 
});

module.exports = mongoose.model('sauce', sauceSchema);