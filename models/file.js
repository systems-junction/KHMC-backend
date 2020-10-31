const mongoose = require('mongoose');
const FileSchema = new mongoose.Schema({
abc:{
    type:String
}
});
module.exports = mongoose.model('file', FileSchema);
