const Ticket = require('../models/ticketModel')
const Comment = require('../models/commentModel')

const userController = {
    viewSingleTicket : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "user"){
                  //return res.json({'id':req.params.TeamId});
                  let comment;
                  let searchid = req.params.ticket_Id;
                  /* Comment.find({ticket_id, searchid}, (comm)=>{
                      comment = comm;
                  }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving teams."
                    });
                  }); */
                  Ticket.findById(req.params.ticket_Id)
                  .then(team => {
                    if(!team) {
                      return res.status(404).send({
                          message: "Ticket with id " + req.params.ticket_Id + "not found."
                      });            
                    }
                    team[comment] = comment
                    res.send(team);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving ticket."
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


    //user view single team

    supportRequest : (req, res) => {
        // return req.header('Authorization').split(' ').pop()
        try{
            session = req.session
            // if(session.theuser){
                if(session.theuser && req.session.theuser.role == "user"){
                    const ticket = new Ticket({
                        title : req.body.title,
                        message : req.body.message,
                        user_email : req.session.theuser.email,
                    });
            
            
                    const created = ticket.save();
                    res.json({'sucess':1, 'messsage':'ticket successfully submitted'})
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            // }
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
      },


    commentOnTicket : (req, res) => {
        try{
            session = req.session
            // if(session.theuser){
                if(req.session.theuser.role == "user"){
                    Comment.find({role:"agent", ticket_id: req.body.ticket_id }).then(function(com) {
                        console.log(com); //check if agent has commentted before saving
                        if(com.length > 0){              
                            const thecomment = new Comment({
                                ticket_id : req.body.ticket_id,
                                comment : req.body.comment,
                                user_id : req.session.theuser._id,
                                user_role: req.session.theuser.role
                            });
                            const created = thecomment.save();
                            res.json({'success': 'Your comment as been saved.'});
                        }else{
                            res.json({'error': 'Wait until an agent responds'});
                        } 
                      })
                      .catch(function(err) {
                        console.log(err);
                        res.json({'error': 'Wait until an agent responds'});
                      });
                    
                }else if(req.session.theuser.role == "agent" || req.session.theuser.role == "admin"){
                    const thecomment = new Comment({
                        ticket_id : req.body.ticket_id,
                        comment : req.body.comment,
                        user_id : req.session.theuser._id,
                        user_role: req.session.theuser.role
                    });
                    const created = thecomment.save();
                    res.json({'success': 'Your comment as been saved.'});
                }
            // }
                //res.json({'Access denied': 'Please try again'});
        }catch(error){
          return res.status(500).json({'error': error.message});
        }
    },
    
    viewAllTickets : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "user"){
                  //return res.json({'id':req.params.TeamId});
                  Ticket.find({user_email:req.session.theuser.email})
                  .then(ticket => {
                      res.send(ticket);
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
          return res.status(400).json({'error': error.message});
        }
    },

}

module.exports = userController

