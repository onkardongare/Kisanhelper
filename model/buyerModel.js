const mongoose = require('mongoose');
const { Schema } = mongoose;

const buyerSchema = new Schema({
  name: { type: String, required: true },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: String,
  },
  type: { type: String, enum: ['company', 'individual', 'cooperative'], required: true },
  contracts: [{
    contractId: { type: Schema.Types.ObjectId, ref: 'Contract' },
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    productType: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    contractDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    status: { type: String, enum: ['pending', 'active', 'completed', 'canceled'], default: 'pending' },
  }],
  paymentTerms: { type: String, default: 'upon delivery' },
  paymentHistory: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['bank transfer', 'cash', 'cheque'] },
    status: { type: String, enum: ['completed', 'pending'], default: 'pending' },
  }],
  contractDocuments: [String],
  complianceStatus: { type: String, enum: ['compliant', 'non-compliant'], default: 'compliant' },
});

// Virtual to calculate total contracts
buyerSchema.virtual('totalContracts').get(function() {
  return this.contracts.length;
});

// Virtual to calculate total purchased quantity
buyerSchema.virtual('totalPurchasedQuantity').get(function() {
  return this.contracts.reduce((total, contract) => total + contract.quantity, 0);
});

// Transform output when converting to JSON
buyerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

exports.Buyer = mongoose.model('Buyer', buyerSchema);
