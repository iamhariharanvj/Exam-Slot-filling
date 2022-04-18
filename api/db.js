const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema(
    {
        name: {
            type: 'string',
            unique: true,
        },
        maxEntries: String,
    }
);

const FacultyModel = mongoose.model('Faculty',FacultySchema);

module.exports = FacultyModel;