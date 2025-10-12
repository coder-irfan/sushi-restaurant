const Auditlog = require("../models/Auditlog");

const logAction = async (userId, action, details = {}) => {
  try {
    await Auditlog.create({ userId, action, details });
  } catch (error) {}
};

module.exports = logAction;
