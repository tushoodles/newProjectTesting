const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  date_published: {
    type: Date,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model('Blog', blogSchema);
