const Pothole = require("../models/Pothole");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");

const pointDistance = 5;

const createComment = async (req, res) => {
  const findSurroundPothole = async (location, points) => {
    const findClosestPoint = (points, location) => {
      let closestPoint = null;
      let minDistance = pointDistance;

      for (const point of points) {
        const distance = calculateDistance(
          location[0],
          location[1],
          point.location[0],
          point.location[1]
        );

        if (distance < minDistance) {
          // console.log("hi");

          minDistance = distance;
          closestPoint = point;
        }
      }
      // console.log(closestPoint);

      return closestPoint;
    };

    return findClosestPoint(points, location);
  };
  const { location, size, userId, content } = req.body;

  const potholes = await Pothole.find({});
  // kiem tra co pothole ko
  const closestPothole = await findSurroundPothole(location, potholes);

  let newPothole;
  if (closestPothole === null) {
    // khong thi tao moi
    console.log("pot moi");

    newPothole = await Pothole.create({ location, size });
  } else {
    // co thi tim
    console.log("pot cu");

    newPothole = await Pothole.findOne({ _id: closestPothole._id });
  }

  const comments = await Comment.find({ user: userId });
  const closestComment = await findSurroundPothole(location, comments);

  let newComment;
  // kiem tra co comment gan do khong
  if (closestComment === null) {
    console.log("cmt moi");

    // khong co thi tao moi
    newComment = await Comment.create({
      user: userId,
      pothole: newPothole,
      content,
      size,
      location,
    });
  } else {
    // co thi update
    console.log("cmt cu");

    newComment = await Comment.findOne({ _id: closestComment._id });
    newComment.location = location;
    newComment.size = size;
    newComment.content = content;
    await newComment.save();
  }

  // update pothole
  const potholeComments = await Comment.find({ pothole: newPothole._id });
  let sumX = 0;
  let sumY = 0;
  let sumSize = 0;
  potholeComments.forEach((obj) => {
    sumX += obj.location[0];
    sumY += obj.location[1];
    sumSize += obj.size;
  });
  const avgX = sumX / potholeComments.length;
  const avgY = sumY / potholeComments.length;
  const avgSize = sumSize / potholeComments.length;
  newPothole.location = [avgX, avgY];
  newPothole.size = avgSize;
  newPothole.save();

  res.status(400).json({ newComment, newPothole });
};

const getComment = async (req, res) => {
  const { potholeId } = req.body;
  const comments = await Comment.find({ pothole: potholeId });
  res.status(400).json({ comments });
};

const getPothole = async (req, res) => {
  const potholes = await Pothole.find();
  res.status(400).json({ potholes });
};

module.exports = {
  createComment,
  getComment,
  getPothole,
};

const calculateDistance = (x1, y1, x2, y2) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
};
