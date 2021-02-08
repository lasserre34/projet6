const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv').config() ;
const cryptojs = require('crypto-js');
const sanitize = require('mongo-sanitize');



exports.signup =  (req, res, next) => {
  var clean = sanitize(req.body.email);
  var emailValid = /^[^$]+[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
  console.log(emailValid.test(clean))
  if (emailValid.test(clean) == false) {
   res.status(401).json("l'email n'est pas valide ")
  }
   var cleanPassword = sanitize(req.body.password)
 var passwordValid = /^(?=.{8,}$)(?=(?:.*?[A-Z]){2})(?=.*?[a-z])(?=(?:.*?[0-9]){2}).*$/
 if(passwordValid.test(cleanPassword)== false){
   res.status(401).json("Votre mot de passe doit contenir au moins 2 majuscules , au minimum 1 minuscule et 2 chiffres , et comporter au moins 8 caractéres")
 }
  else{
    console.log(clean)
    const cryptoEmail = cryptojs.HmacSHA512(clean, `${process.env.KEY_CRYTPO_MAIL}`).toString();
  bcrypt.hash(cleanPassword, 10)
   .then(hash => { 
   
    const user  = new User  ({ 
        email : cryptoEmail , 
        password: hash
    });
  
      user.save() 
     .then(() => res.status(201).json("utilisateur crée"))
       .catch(error => res.status(400).json({error}));
  
    })
  
    .catch(error => res.status(500).json({error}));
  }
};
   
exports.login = (req, res, next) =>{ 
  var clean = sanitize(req.body.email)
  var cleanPassword = sanitize(req.body.password)
  const cryptoEmail = cryptojs.HmacSHA512( clean , `${process.env.KEY_CRYTPO_MAIL}`).toString();

  User.findOne({email: cryptoEmail})
 
   .then(user => {
       if(!user){
           return res.status(401).json({error:'utilisateur non trouvé'});
       } console.log(user.password)
       bcrypt.compare( cleanPassword , user.password)
       .then(valid =>{
           if(!valid){
            return res.status(401).json({error:'Mot de passe incorrect'});
           }
           res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              `${process.env.TOKEN}`,
              { expiresIn: '24h' }
            )
           });
       })
       .catch(error => res.status(500).json({error}));
   })
   .catch(error => res.status(500).json({error}));
  };