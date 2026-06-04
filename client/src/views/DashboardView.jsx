import React, { useState, useRef, useEffect } from 'react';
import { Home, ShoppingBag, Search, LayoutGrid, ChevronDown, X, Plus, Trash2, Menu } from 'lucide-react';

let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (rawApiUrl.endsWith('/')) {
  rawApiUrl = rawApiUrl.slice(0, -1);
}
const API_BASE_URL = `${rawApiUrl}/api/products`;

export default function DashboardView() {
  // Navigation Routing States
  const [activeNav, setActiveNav] = useState('Home'); 
  const [activeTab, setActiveTab] = useState('Published'); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Core Product Data State Container (Now loaded dynamically from MongoDB via backend)
  const [products, setProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);

  // Toast Notification Alert State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Product added Successfully');

  // Track product item context being edited (null signifies creation mode)
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal Input Field Local State
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('Foods');
  const [quantityStock, setQuantityStock] = useState('');
  const [mrp, setMrp] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [brandName, setBrandName] = useState('');
  const [eligibility, setEligibility] = useState('Yes');
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);


  // Lifecycle Hook: Fetch all existing products from the backend database when the page mounts
  useEffect(() => {
    fetchProductsFromBackend();
  }, []);

  // Auto-dismiss alert banner after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // BACKEND INTEGRATION: GET Request to retrieve all items
  const fetchProductsFromBackend = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const result = await response.json();
      if (result.success) {
        // Remap backend data object properties cleanly if needed (e.g., matching backend _id string to frontend id)
        const formattedProducts = result.data.map(p => ({
          ...p,
          id: p._id // MongoDB uses _id, frontend layout reads .id
        }));
        setProducts(formattedProducts);
      }
    } catch (err) {
      console.error("Error communicating with backend cluster database:", err);
    }
  };

  const handleOpenModal = () => {
    setEditingProduct(null);
    setProductName('');
    setProductType('Foods');
    setQuantityStock('');
    setMrp('');
    setSellingPrice('');
    setBrandName('');
    setEligibility('Yes');
    setImages([]);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProductName(product.productName);
    setProductType(product.productType);
    setQuantityStock(product.quantityStock);
    setMrp(product.mrp);
    setSellingPrice(product.sellingPrice);
    setBrandName(product.brandName);
    setEligibility(product.eligibility.toLowerCase() === '.yes' || product.eligibility.toLowerCase() === 'yes' ? 'Yes' : 'No');
    setError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    setProductName(e.target.value);
    if (e.target.value.trim() !== '') {
      setError('');
    }
  };

  // BACKEND INTEGRATION: PATCH request to toggle live publish state
  const togglePublishStatus = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle-publish`, {
        method: 'PATCH',
      });
      const result = await response.json();
      if (result.success) {
        // Refresh local view immediately following successful state persistence on database
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isPublished: result.data.isPublished } : p));
      }
    } catch (err) {
      console.error("Failed to alter publish visibility switch lifecycle:", err);
    }
  };

  // Triggers confirmation modal dialog
  const initiateDeleteSequence = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // BACKEND INTEGRATION: DELETE Request to remove product record from database collection
  const confirmDeleteProductItem = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/${productToDelete.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        setToastMessage('Product deleted successfully');
        setShowToast(true);
      }
    } catch (err) {
      console.error("Error dispatching product deletion payload:", err);
    }
  };

  // BACKEND INTEGRATION: POST (Create) or PUT (Update) implementation form lifecycle parser
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!productName.trim()) {
      setError('Please enter product name');
      return;
    }

    // Build standard payload mapped directly to database target validator schema strings
    const productDataPayload = {
      productName,
      productType,
      quantityStock: Number(quantityStock) || 0,
      mrp: Number(mrp) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      brandName,
      eligibility: eligibility.toUpperCase(),
      imageUrl: images[0]?.url || '',
      totalImages: images.length
    };

    try {
      let response;
      if (editingProduct) {
        // Trigger update route mapping parameters
        response = await fetch(`${API_BASE_URL}/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productDataPayload)
        });
      } else {
        // Trigger creation route path mapping structure
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productDataPayload)
        });
      }

      const result = await response.json();

      if (result.success) {
        // Re-sync UI state container with data generated and validated by your Express middleware endpoints
        await fetchProductsFromBackend();
        setToastMessage(editingProduct ? 'Product updated Successfully' : 'Product added Successfully');
        setIsModalOpen(false);
        setShowToast(true);
      } else {
        setError(result.message || 'An operational database error occurred.');
      }
    } catch (err) {
      console.error("Failed to commit entity model update parameters:", err);
      setError('Unable to reach your API server. Please check your connection state parameters.');
    }
  };

  // New handler for file input change – creates object URLs for preview and stores them in state
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImages = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file)
    }));
    setImages((prev) => [...prev, ...newImages]);
    // Reset the file input value to allow re-selecting the same file(s) later
    e.target.value = '';
  };

  // Cleanup object URLs whenever images change
  useEffect(() => {
    // Revoke URLs of previous images when the list updates
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  return (
    <div className="flex h-screen w-full bg-white font-sans antialiased overflow-hidden relative">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR PANEL */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-[#1E222B] h-full flex flex-col shrink-0 text-gray-300 transition-transform duration-300 z-50 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">Productr</span>
            <div className="flex gap-0.5 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 opacity-90"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 -ml-1.5"></span>
            </div>
          </div>
          {/* Close Button - Mobile Only */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 mb-4">
          <div className="relative flex items-center bg-[#2A2F3D] rounded-lg border border-gray-700/40">
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-9 pr-4 py-2 bg-transparent border-0 text-sm placeholder-gray-500 text-white focus:outline-hidden focus:ring-0"
            />
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          <button
            onClick={() => {
              setActiveNav('Home');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeNav === 'Home' ? 'bg-[#2A2F3D]/80 text-white' : 'hover:bg-[#2A2F3D]/40 text-gray-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          
          <button
            onClick={() => {
              setActiveNav('Products');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeNav === 'Products' ? 'bg-[#2A2F3D]/80 text-white' : 'hover:bg-[#2A2F3D]/40 text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Products
          </button>
        </nav>
      </aside>

      {/* 2. MAIN DISPLAY CONTENT AREA */}
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-white">
        
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0 bg-white">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
            {/* Hamburger Menu Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              {activeNav === 'Home' ? (
                <>
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>Home</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <span>Products</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative hidden md:flex items-center w-64 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search Services, Products" 
                className="w-full bg-transparent text-xs border-0 focus:outline-hidden focus:ring-0 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="User profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
          
          {activeNav === 'Home' ? (
            <>
              <div className="px-8 border-b border-gray-100 bg-white shrink-0 relative flex justify-between items-center">
                <div className="flex gap-6 text-sm font-medium">
                  <button
                    onClick={() => setActiveTab('Published')}
                    className={`py-4 border-b-2 px-1 transition-all cursor-pointer text-xs tracking-wide ${
                      activeTab === 'Published' ? 'border-b-[#1131D7] text-[#1131D7] font-bold' : 'border-b-transparent text-gray-400'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    onClick={() => setActiveTab('Unpublished')}
                    className={`py-4 border-b-2 px-1 transition-all cursor-pointer text-xs tracking-wide ${
                      activeTab === 'Unpublished' ? 'border-b-[#1131D7] text-[#1131D7] font-bold' : 'border-b-transparent text-gray-400'
                    }`}
                  >
                    Unpublished
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-white">
                {products.filter(p => activeTab === 'Published' ? p.isPublished : !p.isPublished).length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4 max-w-md">
                      <div className="inline-flex flex-col items-center justify-center text-[#0F1A80]">
                        <div className="grid grid-cols-2 gap-1.5 relative w-14 h-14">
                          <div className="border-[3px] border-[#0F1A80] rounded-md w-6 h-6"></div>
                          <div className="border-[3px] border-[#0F1A80] rounded-md w-6 h-6"></div>
                          <div className="border-[3px] border-[#0F1A80] rounded-md w-6 h-6"></div>
                          <div className="w-6 h-6 flex items-center justify-center relative">
                            <Plus className="w-6 h-6 stroke-[3.5] text-[#0F1A80]" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#1E254C]">No {activeTab} Products</h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                          Your {activeTab} Products will appear here<br />
                          Create your first product to publish
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products
                      .filter(p => activeTab === 'Published' ? p.isPublished : !p.isPublished)
                      .map(product => (
                        <ProductCard key={product.id} product={product} onTogglePublish={togglePublishStatus} onDelete={initiateDeleteSequence} onEdit={handleOpenEditModal} />
                      ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden bg-white px-8 py-6">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h1 className="text-xl font-bold text-gray-800">Products</h1>
                <button 
                  onClick={handleOpenModal}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Add Products
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {products.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-5 max-w-md">
                      <LayoutGrid className="w-16 h-16 text-[#0F1A80] mx-auto stroke-[1.5]" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[#1E254C]">Feels a little empty over here...</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">
                          You can create products without connecting store you can add products to store anytime
                        </p>
                      </div>
                      <div className="pt-2">
                        <button onClick={handleOpenModal} className="bg-[#1131D7] text-white px-8 py-3 rounded-xl text-sm font-semibold cursor-pointer">
                          Add your Products
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} onTogglePublish={togglePublishStatus} onDelete={initiateDeleteSequence} onEdit={handleOpenEditModal} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. ADD / EDIT DIALOG MODAL PANEL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-[450px] rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            
            <div className="px-5 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-[14px] font-bold text-[#333E5B]">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-0.5 rounded-md cursor-pointer">
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-5 pb-5 space-y-4 text-left">
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#4E5874]">Product Name</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={handleNameChange}
                  className={`w-full px-3 py-2 bg-white rounded-md text-xs border transition-all outline-hidden ${
                    error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 text-gray-700'
                  }`}
                />
                {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#4E5874]">Product Type</label>
                <div className="relative">
                  <select 
                    value={productType} 
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 appearance-none focus:outline-hidden cursor-pointer"
                  >
                    <option value="Foods">Foods</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothes">Clothes</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#4E5874]">Quantity Stock</label>
                <input type="text" value={quantityStock} onChange={(e) => setQuantityStock(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 focus:outline-hidden" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#4E5874]">MRP</label>
                <input type="text" value={mrp} onChange={(e) => setMrp(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 focus:outline-hidden" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#4E5874]">Selling Price</label>
                <input type="text" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 focus:outline-hidden" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#4E5874]">Brand Name</label>
                <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 focus:outline-hidden" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#4E5874]">Upload Product Images</label>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="text-[11px] font-bold text-[#333E5B] hover:underline cursor-pointer"
                  >
                    Add More Photos
                  </button>
                </div>
                
                <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                
                <div className="border border-dashed border-gray-200 rounded-xl p-3 flex flex-wrap gap-2.5 min-h-[72px] items-center bg-white">
                  {images.map((img) => (
                    <div key={img.id} className="relative w-12 h-12 rounded-lg p-0.5 border border-gray-100 bg-gray-50 flex items-center justify-center">
                      <img src={img.url} alt="thumbnail" className="max-h-full max-w-full object-contain rounded-md" />
                      <button
                        type="button"
                        onClick={() => { setImages(prev => prev.filter(i => i.id !== img.id)); URL.revokeObjectURL(img.url); }}
                        className="absolute -top-1 -right-1 bg-white border border-gray-200 text-gray-400 hover:text-gray-700 rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-xs cursor-pointer"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#4E5874]">Exchange or return eligibility</label>
                <div className="relative">
                  <select 
                    value={eligibility} 
                    onChange={(e) => setEligibility(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-700 appearance-none focus:outline-hidden cursor-pointer"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

            </form>

            <div className="px-5 py-3.5 bg-[#F8F9FB] border-t border-gray-100 flex justify-end shrink-0">
              <button 
                type="submit" 
                onClick={handleFormSubmit} 
                className="bg-[#0A1BE2] text-white text-xs font-semibold px-5 py-2 rounded-md hover:bg-[#0815B2] transition-colors cursor-pointer"
              >
                {editingProduct ? 'Update' : 'Create'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. DELETE PRODUCT CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-[400px] rounded-xl shadow-2xl p-6 flex flex-col relative">
            <button 
              onClick={() => setIsDeleteModalOpen(false)} 
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-md cursor-pointer absolute right-4 top-4"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
            
            <h3 className="text-[15px] font-bold text-gray-800 mb-2 text-left">Delete Product</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed text-left mb-6">
              Are you sure you really want to delete this Product <br />
              <span className="font-bold text-gray-800">“ {productToDelete?.productName} ”</span> ?
            </p>

            <div className="flex justify-end">
              <button 
                onClick={confirmDeleteProductItem}
                className="bg-[#0A1BE2] text-white text-xs font-semibold px-5 py-2 rounded-md hover:bg-[#0815B2] transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUCCESS TOAST ALERT NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-xl px-5 py-3 rounded-xl flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white">
            <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-700 tracking-wide">{toastMessage}</span>
          <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-600 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}

{/* REUSABLE PRODUCT CARD RENDERING MODULE */}
function ProductCard({ product, onTogglePublish, onDelete, onEdit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow text-left">
      <div>
        <div className="bg-[#FAFAFA] rounded-xl border border-gray-100 p-4 aspect-square flex items-center justify-center relative overflow-hidden mb-4">
          <img src={product.imageUrl} alt={product.productName} className="max-h-full max-w-full object-contain" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
          </div>
        </div>

        <h4 className="font-bold text-sm text-gray-900 tracking-tight mb-3 line-clamp-1">{product.productName}</h4>
        
        <div className="space-y-1.5 text-xs text-gray-500 font-medium">
          <div className="flex justify-between"><span>Product type -</span><span className="text-gray-800 font-normal">{product.productType}</span></div>
          <div className="flex justify-between"><span>Quantity Stock -</span><span className="text-gray-800 font-normal">{product.quantityStock}</span></div>
          <div className="flex justify-between"><span>MRP -</span><span className="text-gray-800 font-normal">₹ {product.mrp}</span></div>
          <div className="flex justify-between"><span>Selling Price -</span><span className="text-gray-800 font-normal">₹ {product.sellingPrice}</span></div>
          <div className="flex justify-between"><span>Brand Name -</span><span className="text-gray-800 font-normal">{product.brandName}</span></div>
          <div className="flex justify-between"><span>Total Number of images -</span><span className="text-gray-800 font-normal">{product.totalImages}</span></div>
          <div className="flex justify-between border-b border-dashed border-gray-100 pb-3">
            <span>Exchange Eligibility -</span><span className="text-gray-800 font-normal">.{product.eligibility}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 shrink-0">
        <button 
          onClick={() => onTogglePublish(product.id)}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer text-white ${
            product.isPublished ? 'bg-[#4ADE80] hover:bg-[#22C55E]' : 'bg-[#091BE1] hover:bg-[#0716B8]'
          }`}
        >
          {product.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        
        <button 
          onClick={() => onEdit(product)}
          className="flex-1 text-center py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 cursor-pointer"
        >
          Edit
        </button>
        
        <button 
          onClick={() => onDelete(product)}
          className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-100 bg-white hover:bg-red-50/30 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}