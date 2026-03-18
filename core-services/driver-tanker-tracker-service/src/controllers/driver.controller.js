const driverService = require("../services/driver.service");

function healthCheck(req, res) {
  res.send("Live tracking server is running");
}

function getDrivers(req, res) {
  const allDrivers = driverService.getAllDrivers();

  res.json({
    success: true,
    count: allDrivers.length,
    data: allDrivers,
  });
}

module.exports = {
  healthCheck,
  getDrivers,
};