const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const bcrypt = require('bcrypt-nodejs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var userSchema = new Schema({
  name: String,
  username: {type: String, required: true, index: { unique: true }},
  password: {type: String, required: true, select: false}
});

userSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified('password')){
    return next();
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });

});

userSchema.methods.comparePassword = function (password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('User', userSchema);
