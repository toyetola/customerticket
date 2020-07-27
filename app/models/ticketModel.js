const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  user_email:{
    type: String,
    required: true
  },
  status: {
      type: String,
      default: null
  },
}, {timestamps:true});

//

module.exports = mongoose.model("Ticket", ticketSchema);