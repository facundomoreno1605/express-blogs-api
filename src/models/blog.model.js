const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const BlogModel = mongoose.model('blog', BlogSchema);

module.exports = BlogModel;
