const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến User model
      required: [true, "User is required"],
    },
    pothole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pothole", // Tham chiếu đến Pothole model
      required: [true, "Pothole is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, "Size is required"],
      min: [1, "Size must be at least 1"],
      max: [5, "Size must not exceed 5"], // Tùy chỉnh giới hạn nếu cần
    },
    location: {
      type: [Number], // Mảng số, [lat, lng]
      required: [true, "Location is required"],
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            value.every((num) => typeof num === "number")
          );
        },
        message: "Location must be an array of two numbers [lat, lng]",
      },
    },
    photos: {
      type: [String], // Mảng các đường dẫn URL ảnh
      default: [], // Mặc định là mảng rỗng nếu không có ảnh
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
