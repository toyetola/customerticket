const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  ticket_id: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
  },
  user_role: {
    type: String,
    required: true,
  }
}, {timestamps:true});

//

module.exports = mongoose.model("Comment", commentSchema);