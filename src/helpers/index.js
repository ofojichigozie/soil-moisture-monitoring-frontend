/* eslint-disable */

import axios from "axios";
let captureInterval = null;

function startCapture() {
  captureInterval = setInterval(() => {
    const moisturePercentage = Math.floor(Math.random() * (85 - 30 + 1) + 30);
    axios
      .get(
        `https://ismm-be.onrender.com/api/v1/soil-moistures/${moisturePercentage}`
      )
      .then((data) => {
        console.log(`Captured and stored - ${moisturePercentage}%`);
      })
      .catch((e) => {
        console.error("Couldn't capture and store");
      });
  }, 60000);
}

function stopCapture() {
  if (captureInterval !== null) {
    clearInterval(captureInterval);
    captureInterval = null;
  }
}

export default {
  startCapture,
  stopCapture,
};
