const mongoose = require('mongoose');

/**
 * Returns a connection to the mongoDB database
 * @returns {Promise<mongoose>}
 */
module.exports = async() => {
    await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    return mongoose;
}