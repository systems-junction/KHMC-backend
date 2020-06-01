const mongoose = require('mongoose');

    const systemAdminSchema = new mongoose.Schema({
        staffTypeId: {
            type: mongoose.Schema.ObjectId,
            ref: 'staffType',
            required: [true, 'Please select System type']
        },
        username: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please add password']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    });

    // Encrypt password using bcrypt
    // systemAdminSchema.pre('save', async function() {    
    //     const salt = await bcrypt.genSalt(10);
    //     this.password = await bcrypt.hash(this.password, salt);
    // });

    // systemAdminSchema.pre('get', async function() {   
    //     console.log("get pre calles");
    //     // return await bcrypt.compare(enteredPassword, this.password);
    // });

module.exports = mongoose.model('systemAdmin', systemAdminSchema);
