import express from 'express';

import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.patch('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
