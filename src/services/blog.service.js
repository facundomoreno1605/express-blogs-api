const { BlogModel } = require("../models");

const createBlog = async ({ title, description }) => {
  const blog = new BlogModel({ title, description });

  await blog.save();

  return blog;
};

const getBlogs = async () => {
  const blogs = await BlogModel.find();

  return blogs;
};

module.exports = {
  createBlog,
  getBlogs,
};
