const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userID: String,
    fc: String,
    ign: String
});

module.exports = mongoose.model("profile", profileSchema);
