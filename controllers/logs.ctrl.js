const logsService = require("../services/logs.serv")

//Get all Customer
exports.getAlllogs = async (req, res, next) => {
  try {
    const logs = await logsService.getAlllogs(req.query);
    res.status(200).json({ data:logs, message: "Success" });
  } catch (error) {
    next(error);
  }
};

