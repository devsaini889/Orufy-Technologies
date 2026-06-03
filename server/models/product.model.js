import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ['Foods', 'Electronics', 'Clothes'],
      default: 'Foods',
    },
    quantityStock: {
      type: Number,
      required: true,
      default: 0,
    },
    mrp: {
      type: Number,
      required: true,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    brandName: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80',
    },
    totalImages: {
      type: Number,
      default: 1,
    },
    eligibility: {
      type: String,
      enum: ['YES', 'NO'],
      default: 'YES',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;