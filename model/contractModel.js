const mongoose = require('mongoose');
const { Schema } = mongoose;

const contractSchema = new Schema({
  contractNumber: { type: String, unique: true, required: true },
  farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
  productType: { type: String, required: true },
  quantity: { type: Number, required: true }, // e.g., in tons or kg
  pricePerUnit: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // Computed in a pre-save hook
  
  contractDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  status: { type: String, enum: ['pending', 'active', 'completed', 'canceled'], default: 'pending' },
  isFulfilled: { type: Boolean, default: false },

  paymentTerms: { type: String, default: 'on delivery' },
  advancePayment: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 }, // Computed in a pre-save hook

  paymentHistory: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['bank transfer', 'cash'], required: true },
    status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
  }],
  
  specialConditions: { type: String },
  notes: { type: String },
});

// Virtual to calculate if the contract is fully paid
contractSchema.virtual('isFullyPaid').get(function() {
  const totalPaid = this.paymentHistory.reduce((total, payment) => total + payment.amount, 0);
  return totalPaid >= this.totalPrice;
});

// Pre-save hook to calculate totalPrice and balanceDue
contractSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.pricePerUnit;
  this.balanceDue = this.totalPrice - this.advancePayment;
  next();
});

// Transform output when converting to JSON
contractSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

exports.Contract = mongoose.model('Contract', contractSchema);