const Logs = require('../model/logs.model'); // Import the Logs model

const logAction = async ({ type, operation, remark }) => {
  try {
    // Create a new log document
    const logEntry = new Logs({
      type: type,            // Corrected to use 'type' passed as parameter
      operation: operation,  // Corrected to use 'operation' passed as parameter
      remark: remark,        // Corrected to use 'remark' passed as parameter
      dateTime: new Date(),  // Set the current date and time
    });

    // Save the log entry to the database
    await logEntry.save();
    console.log('Log entry saved successfully');
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

module.exports = logAction;
