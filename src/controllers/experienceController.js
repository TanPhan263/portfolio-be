import Experience from "../models/Experience.js";

export const getExperiences = async (req, res, next) => {
  try {
    const data = await Experience.find({});
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req, res, next) => {
  try {
    const newExperience = new Experience(req.body);
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedExperience) {
      const err = new Error("Experience not found");
      err.status = 404;
      return next(err);
    }
    res.json(updatedExperience);
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const deleteExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deleteExperience) {
      const err = new Error("Experience not found");
      err.status = 404;
      return next(err);
    }
    res.status(204).json(deleteExperience);
  } catch (error) {
    next(error);
  }
};
