import express from 'express';

import {
  createBlog,
  deleteBlog,
  getBlogs,
  updateBlog
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogs);
router.post('/', createBlog);
router.patch('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
