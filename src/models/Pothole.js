const mongoose = require("mongoose");

const PotholeSchema = mongoose.Schema(
  {
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
    size: {
      type: Number,
      required: [true, "Size is required"],
      min: [1, "Size must be at least 1"],
      max: [5, "Size must not exceed 5"], // Tùy chỉnh giới hạn nếu cần
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model("Pothole", PotholeSchema);
