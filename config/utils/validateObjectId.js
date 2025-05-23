const mongoose = require("mongoose");

module.exports.valiadateObjectId = function (id) {
  if (!id) {
    return false;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  return true;
};
