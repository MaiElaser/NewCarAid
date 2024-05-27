// controllers/recordsController.js

const Role = require('../models/roles');

// Get all records
exports.getAllRecord = async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching records' });
  }
};

// Create a new record
exports.createRecord = async (req, res) => {
  try {
    const newRecord = new Role(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the record' });
  }
};

// Update an existing record
exports.updateRecord = async (req, res) => {
  try {
    const updatedRecord = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the record' });
  }
};

// Delete a record
exports.deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the record' });
  }
};
