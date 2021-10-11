const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const { MONGO_URI } = process.env;
exports.connect = () => {
  // Connect MongoDB at default port 27017.
  mongoose.connect(
    MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (!err) {
        console.log("MongoDB Connection Succeeded.");
      } else {
        console.log("Error in DB connection: " + err);
        process.exit(1);
      }
    }
  );
};
