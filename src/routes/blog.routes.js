const express = require('express');
const router = express.Router();

const { blogValidations } = require('../validations');
const validateMiddleware = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { BlogController } = require('../controllers');

router.post(
  '/blogs',
  authMiddleware,
  validateMiddleware(blogValidations.createBlogSchema),
  BlogController.createBlog,
);
router.get('/blogs', authMiddleware, BlogController.getBlogs);

module.exports = router;
