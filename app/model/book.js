const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title : String,
  author : String,
  publisher : String,
  year : Number,
  isbn : String,
  cover : String,
  category : String,
  //added_by : { type: Schema.Types.ObjectId, ref: 'user'},
  created : { type: Date, default: Date.now}
});

module.exports = mongoose.model('Book', bookSchema);
