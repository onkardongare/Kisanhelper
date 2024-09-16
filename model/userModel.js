const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  // name: { type: String, required: true },
  role: { type: String, enum: ['user']},
  email: { type: String, required: true},
  password: { type:String, required: true},
  salt: Buffer,
  // contactInfo: {
  //   phone: { type: String, required: true },
  //   email: { type: String, required: true },
  //   address: String,
  // },
  // farmLocation: { type: String, required: true },
  // farmSize: { type: Number, required: true }, // e.g., in acres or hectares
  // crops: [{
  //   cropType: { type: String, required: true },
  //   areaCultivated: { type: Number, required: true }, // Area for this crop
  //   estimatedYield: { type: Number, required: true }, // Estimated yield in tons or kg
  // }],
  // contracts: [{
  //   contractId: { type: Schema.Types.ObjectId, ref: 'Contract' },
  //   buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
  //   productType: { type: String, required: true },
  //   agreedQuantity: { type: Number, required: true },
  //   pricePerUnit: { type: Number, required: true },
  //   contractDate: { type: Date, default: Date.now },
  //   deliveryDate: { type: Date },
  //   status: { type: String, enum: ['pending', 'active', 'completed', 'canceled'], default: 'pending' },
  // }],
  // paymentHistory: [{
  //   amount: { type: Number, required: true },
  //   date: { type: Date, default: Date.now },
  //   paymentMethod: { type: String, enum: ['bank transfer', 'cash'] },
  //   status: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  // }],
  // equipment: [{
  //   equipmentType: { type: String },
  //   quantity: { type: Number, default: 1 },
  //   condition: { type: String, enum: ['new', 'used', 'needs repair'], default: 'used' },
  // }]
});

// to convert a _id to id for frontend simplicity
 userSchema.virtual('id').get(function() {
     return this._id;
 })

// Virtual to calculate total contracts
// userSchema.virtual('totalContracts').get(function() {
//   return this.contracts.length;
// });

// Virtual to calculate total yield
// userSchema.virtual('totalYield').get(function() {
//   return this.crops.reduce((total, crop) => total + crop.estimatedYield, 0);
// });

// Virtual to calculate total earnings
// userSchema.virtual('totalEarnings').get(function() {
//   return this.contracts.reduce((total, contract) => total + (contract.agreedQuantity * contract.pricePerUnit), 0);
// });

// Transform output when converting to JSON
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

exports.User = mongoose.model('User', userSchema);
