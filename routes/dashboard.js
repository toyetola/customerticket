const express = require("express")
const router = require("express").Router();
const userController = require('../app/controllers/userController');
var session ;

router.get("/", (req, res) => {
    session = req.session
    if(session.theuser){
        res.json({
            error: null,
            data: {
            title: "My dashboard",
            content: "dashboard content",
            user: req.user, // token payload information
            },
        });
    } else{
        res.json({'Access denied':'Login again'})
    } 
  
});

router.post('/submitTicket', userController.supportRequest);
router.get('/viewSingleTicket/:ticket_Id', userController.viewSingleTicket);
router.get('/viewAllTickets', userController.viewAllTickets);
router.post('/commentOnTicket', userController.commentOnTicket);


module.exports = router;