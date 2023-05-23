const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AccessRoleSchema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admins'
    },
    name: {
        type: String
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
}, {
    timestamps: true
});
const accessRole = mongoose.model('AccessRole', AccessRoleSchema);
module.exports = accessRole;