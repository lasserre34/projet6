const fs = require('fs');
const Sauce = require('../models/sauce');
const sanitize = require('mongo-sanitize');


// Ajouter une sauce 
exports.sauce =(req, res, next) => {

    // regex pour validation entres formulaire 
    var motValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
  
    const  sauceObject = JSON.parse(req.body.sauce)
    var clean = sanitize(sauceObject)
    if(motValid.test(clean.name)== false){
    
        res.status(401).json("Name non valide")

    } 
    if(motValid.test(clean.manufacturer)== false){
     
        res.status(401).json("manufacturer non valide")
    }
    if(motValid.test(clean.description)== false){
       
        res.status(401).json("description non valide")
    }
    if(motValid.test(clean.mainPepper)== false){
       
        res.status(401).json("description non valide")
    }
    else{
   
    const sauce = new Sauce({
      
          name: clean.name,
          manufacturer: clean.manufacturer,
          heat: clean.heat,
          mainPepper: clean.mainPepper,
          description: clean.description,
          likes: clean.likes,
          dislikes: clean.dislikes,
          userId: clean.userId ,
          imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
     sauce.save()
.then(() => res.status(201).json({message:'sauce ajoutée'}))
.catch(error => res.status(400).json({ error }));
    }
}
// affiche toute les sauces qui sont enregistré dans la base de donné
exports.getAllSauces = (req, res, next) => {

    Sauce.find()
.then(sauce => res.status(200).json(sauce))
.catch(error => res.status(400).json({error}) )

}

// affiche la sauce selectionner 
exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id})
   .then(  
        sauce => res.status(200).json(sauce))
      
    .catch(error => res.status(400).json({error}))
    
    
} 

//modifie la sauce selectionné
exports.getOneSaucePut = (req, res, next) =>{
    const OneSaucePut = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id},{...OneSaucePut, _id: req.params.id})
    .then(() => res.status(200).json({message:"Objet modifié"}))
    .catch(error => res.status(400).json({error}));
}
//supprime la sauce sélectionné
exports.getOneSauceDelete = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`,()=>{
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message:"Objet supprimé"}))
            .catch(error => res.status(400).json({error}))
        });
    })
    .catch(error => res.status(500).json({error}));
    
   };

// like est dislikes 
exports.postSauceLike = (req, res, next) =>{
        
   let  userId = req.body.userId 
   let like = req.body.like 

   Sauce.findOne({ _id: req.params.id })
  
   .then(sauce => {
    if(like === 1){

        if(sauce.usersLiked.indexOf(userId) > -1 ){
           sauce.likes--
            
            var index = sauce.usersLiked.indexOf(userId, 0); if (index > -1) { sauce.usersLiked.splice(index, 1); }
          
        }
    
        else if(sauce.usersLiked.length === 0){
            sauce.likes = +1
            sauce.usersLiked.push(userId)
        }
        else{
            
            sauce.likes++
            sauce.usersLiked.push(userId)
            
         }
       }
      
      
      if(like === -1){
            if(sauce.usersDisliked.indexOf(userId) > -1){
             like = 0
                
            }
           
            else if(sauce.usersDisliked.length === 0){
               sauce.dislikes = +1
               sauce.usersDisliked.push(userId)
            }
            else{
                sauce.dislikes++;
                sauce.usersDisliked.push(userId)
           }
           
         }
         if(like === 0){
            if (sauce.usersLiked.indexOf(userId) > -1) {
                sauce.likes-- ; 
                var index = sauce.usersLiked.indexOf(userId, 0); if (index > -1) { sauce.usersLiked.splice(index, 1); } 
         
         }
           
             if(sauce.usersDisliked.indexOf(userId) > -1){
             sauce.dislikes-- ; 
             var index2 = sauce.usersDisliked.indexOf(userId, 0); if (index2 > -1) { sauce.usersDisliked.splice(index2, 1); }
         }
     }    
         sauce.save()
        res.status(201).json({sauce})})
     .catch(error => res.status(501).json({error}))
     
        }
  