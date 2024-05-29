// controllers/recordController.js
const getAllRecord = (req, res) => {
    // Your logic to get all records
    res.send('Get all records');
  };
  
  const createRecord = (req, res) => {
    // Your logic to create a record
    res.send('Create a record');
  };
  
  const updateRecord = (req, res) => {
    // Your logic to update a record
    res.send('Update a record');
  };
  
  const deleteRecord = (req, res) => {
    // Your logic to delete a record
    res.send('Delete a record');
  };
  
  module.exports = {
    getAllRecord,
    createRecord,
    updateRecord,
    deleteRecord,
  };
  