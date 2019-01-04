// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
  name: {
    type: String,
    default: ''
  },mail: {
    type: String,
    default: ''
  },password: {
    type: String,
    default: null
  },enable: {
    type: Number,
    default: 0
  },secret: {
    type: String,
    default: 0
  },avatar: {
    type: String,
    default: 'imagenes/avatar/default.jpg'
  },creationTimestamp: {
    type: Date,
    default: new Date()
  }
});
