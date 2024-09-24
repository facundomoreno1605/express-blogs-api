const { BlogService } = require('../services');
const catchAsyncUtil = require('../utils/catchAsync.util');
const httpStatus = require('http-status');

const createBlog = catchAsyncUtil(async (req, res) => {
  await BlogService.createBlog(req.body);

  return res
    .status(httpStatus.CREATED)
    .json({ message: 'Blog created successfully' });
});

const getBlogs = catchAsyncUtil(async (req, res) => {
  const blogs = await BlogService.getBlogs();

  return res.status(httpStatus.OK).json(blogs);
});

module.exports = {
  createBlog,
  getBlogs,
};
