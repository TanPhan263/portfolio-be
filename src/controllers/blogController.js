import Blog from '../models/Blog.js';

export const getBlogs = async (req, res, next) => {
  try {
    const data = await Blog.find({});
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const data = await Blog.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedBlog) {
      const err = new Error('Blog not found');
      err.status = 404;
      return next(err);
    }
    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deleteBlog) {
      const err = new Error('Blog not found');
      err.status = 404;
      return next(err);
    }
    res.status(204).json(deleteBlog);
  } catch (error) {
    next(error);
  }
};
