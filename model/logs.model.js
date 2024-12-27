const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['workout', 'membership', 'workoutpackage', 'members'], // Add 'members' here
  },
  operation: {
    type: String,
    enum: ['insert', 'update', 'delete', 'add'],
    required: true,
  },
  remark: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

const Logs = mongoose.model('Logs', logsSchema);

module.exports = Logs;
