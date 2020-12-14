const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// schema maps to a collection
const Schema = mongoose.Schema;
const saltRounds = 10;

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
  },
  followed:{
      type: [String],
      required: false,
      unique: false
  },
  cart:{
    type: [Object],
    required:false,
    unique: false
  }
},{ collection: 'users' } );


// encrypt password before save
userSchema.pre('save', function(next) {
  const user = this;
  if(!user.isModified || !user.isNew) { // don't rehash if it's an old user
    next();
  } else {
    bcrypt.hash(user.password, saltRounds , function(err, hash) {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});


module.exports = mongoose.model('User', userSchema);
