const mongoose = require('mongoose');

const reactionRoleSchema = mongoose.Schema({
    messageID: String,
    roleID: String,
    emojiID: String
})

module.exports = mongoose.model("reactionRoles", reactionRoleSchema);
