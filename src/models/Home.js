import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const greetingSchema = new mongoose.Schema({
  greetingText: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  bioTitle: {
    type: String,
    required: true,
  },
  bioDescription: {
    type: String,
    required: true,
  },
  imageDark: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    required: true,
  },
});

const socialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  comments: {
    type: Number,
    required: true,
  },
});

const homeSchema = new mongoose.Schema(
  {
    menu: [menuSchema],
    greeting: {
      type: greetingSchema,
      required: true,
    },
    socials: [socialSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Home", homeSchema);
