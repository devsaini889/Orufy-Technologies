import Product from '../models/product.model.js';

export const createProduct = async (req, res) => {
  try {
    const { productName, productType, quantityStock, mrp, sellingPrice, brandName, eligibility, imageUrl, totalImages } = req.body;

    if (!productName || productName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please enter product name' });
    }

    const product = await Product.create({
      productName,
      productType,
      quantityStock: Number(quantityStock) || 0,
      mrp: Number(mrp) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      brandName,
      eligibility: eligibility ? eligibility.toUpperCase() : 'YES',
      imageUrl,
      totalImages: Number(totalImages) || 1,
      isPublished: false
    });

    res.status(201).json({ success: true, data: product, message: 'Product added Successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, eligibility } = req.body;

    if (productName !== undefined && !productName.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter product name' });
    }

    const updateData = { ...req.body };
    if (eligibility) updateData.eligibility = eligibility.toUpperCase();

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product record location not found' });
    }

    res.status(200).json({ success: true, data: updatedProduct, message: 'Product updated Successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePublishStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isPublished = !product.isPublished;
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};