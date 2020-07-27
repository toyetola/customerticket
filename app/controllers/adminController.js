const Ticket = require('../models/ticketModel');
const Comment = require('../models/commentModel')
const User = require('../models/userModel')
const Joi = require("@hapi/joi");
const session = require('express-session');
const bcrypt = require("bcryptjs");

const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    location: Joi.string().min(3).max(255)
  });

  const checkParam = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    confirm_password:Joi.string().required().valid(Joi.ref('password')),
    role: Joi.string().required()
});  
  
  

  function genString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


const adminController = {

    createAgent : async (req, res) => {
      // validate the user input
      const { error } = checkParam.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const isEmailExist = await User.findOne({ email: req.body.email });
      if (isEmailExist)
          return res.status(401).json({ error: "Email already exists" });
      const session = req.session
      if(session.theuser.role != "admin") return res.status(401).json({"error":"not authorized"})
      // hash the password
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);   
      if(req.body.role != "admin" && req.body.role !="agent" ) return res.status(401).json({"error":"not authorized", "message":"Your should use the admin registeration route"}) 
      const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: password,
          role: req.body.role    
      });
  
      try{
          const savedUser = await user.save().then( (theuser)=>{
            return res.json({ data:theuser, message:"success" })
          }).catch(err => {
            res.json({ error:1, message:err})
          });
          /* if(savedUser)
              return res.json({ data:savedUser, message:"success" })  
          else
              return res.json({ error:1, message:"could not save the details" }) */         
      }catch (error){
          return res.status(500).json({ error : "fatal error: cannot determine error "+error.message});  
      }
  },


    //retreive all existing teams
    retreiveAllTickets: (req, res) => {
        try{
            // session = req.session
            // if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  Ticket.find()
                  .then(teams => {
                      res.send(teams);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving teams."
                      });
                  });
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            // }
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
      },
    
      //retriev a single team with the id as param
    retrieveOneTicket: (req, res) => {
        try{
            //session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  Ticket.findById(req.params.ticket_Id)
                  .then(team => {
                    if(!team) {
                      return res.status(404).send({
                          message: "Team with id " + req.params.TeamId + "not found."
                      });            
                    }
                    res.send(team);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving teams."
                      });
                  });
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
      },
      
      
      //updateTeam
      updateTicket : (req, res) => {
        try{
        
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  if(!req.body){
                    return res.status(400).send({
                      message: "Data to update can not be empty!"
                    });
                  }
                  Ticket.findByIdAndUpdate(req.params.ticket_Id, req.body, { useFindAndModify: false })
                  .then(team => {
                    if(!team) {
                      return res.status(404).send({
                          message: "Team with id " + req.params.ticket_Id + "not found."
                      });            
                    }else{
                      team.status = req.body.status ? req.body.status : team.status
                      team.update()
                      res.send({message:"successfully updated",team});
                    }
                    
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving tickets."
                      });
                  });
                }else{
                    res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
          
      
      },


      //delete a single team
      deleteTicket : (req, res) => {
        try{
            // session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "admin"){
                  //return res.json({'id':req.params.TeamId});
                  if(!req.body){
                    return res.status(400).send({
                      message: "Data to update can not be empty!"
                    });
                  }
                  Team.findOneAndRemove(req.params.ticket_Id)
                  .then(team => {
                    if(!team) {
                      return res.status(404).send({
                          message: "Team was successfully deleted"
                      });            
                    }else{
                      team.name = req.body.name ? req.body.name : team.name
                      team.location = req.body.location ? req.body.location : team.location
                      res.send({message:"successfully deleted"});
                    }
                    
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving teams."
                      });
                  });
                }else{
                    res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
      },
}

module.exports = adminController