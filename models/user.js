const mongoose = require('mongoose');
// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: 'String',
    required: true,
    unique: true
  },
  username:{
      type: 'String',
      required: true,
      unique: true
  },
  password: {
    type: 'String',
    required: true,
    unique: false
  },
  userType: {           // user / artist / moderator
      type: 'String',
      required: true,
      unique: false
  },
  bio: {
      type: 'String',
      required: false,
      unique: false
  }
});

module.exports = mongoose.model('User', userSchema);
