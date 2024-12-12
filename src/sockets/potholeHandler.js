const Pothole = require("../models/Pothole");
const User = require("../models/User");
const Comment = require("../models/Comment");

const surroundDistance = 100;
const alertDistance = 10;

const getPotholes = async (io, socket, payload) => {
  const findSurroundPothole = async (location) => {
    const potholes = await Pothole.find({});
    potholes.filter(
      (obj) =>
        calculateDistance(
          obj.location[0],
          obj.location[1],
          location[0],
          location[1]
        ) >= surroundDistance
    );
    return potholes;
  };
  const findClosestPoint = (points, location) => {
    let closestPoint = null;
    let minDistance = alertDistance;

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
  const { location, prevLocation } = payload;
  const potholes = findSurroundPothole(location);
  const closetPot = findClosestPoint(potholes, location);

  //check va cham
  if (closetPot !== null) {
    const prevDistance = calculateDistance(
      closetPot.location[0],
      closetPot.location[1],
      prevLocation[0],
      prevLocation[1]
    );
    const nowDistance = calculateDistance(
      closetPot.location[0],
      closetPot.location[1],
      location[0],
      location[1]
    );

    if (nowDistance < prevDistance) {
      socket.emit("alert", { closetPot });
    }
  }

  socket.emit("potholes", { potholes });
};

const potholeHandler = (io, socket) => {
  socket.on("getPotholes", (payload) => getPotholes(io, socket, payload));
};

module.exports = potholeHandler;

const calculateDistance = (x1, y1, x2, y2) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
};
