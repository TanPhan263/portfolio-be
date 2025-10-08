import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  stacks: {
    type: [String],
    required: false,
  },
  achievements: {
    type: [String],
    required: false,
  },
  imageUrl: { type: String, required: true },
  imageUrlMobile: { type: String, required: true },
});

const experienceSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    projects: {
      type: [projectSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one project is required",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
