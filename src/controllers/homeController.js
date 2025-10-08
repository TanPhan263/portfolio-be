import Home from "../models/Home.js";

export const getHome = async (req, res, next) => {
  try {
    const data = await Home.find({});
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const createHome = async (req, res, next) => {
  try {
    const newHome = new Home(req.body);
    const savedHome = await newHome.save();
    res.status(201).json(savedHome);
  } catch (err) {
    next(err);
  }
};

export const updateHome = async (req, res, next) => {
  try {
    const updatedHome = await Home.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedHome) {
      const err = new Error("Home not found");
      err.status = 404;
      return next(err);
    }
    res.json(updatedHome);
  } catch (err) {
    next(err);
  }
};
