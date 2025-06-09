import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProduct, createProduct, updateProduct, fetchCategories } from '../store/slices/productsSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Upload, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

// Validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  hasVariants: z.boolean(),
  isActive: z.boolean(),
});

const variantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0').optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().int().min(0, 'Threshold cannot be negative').optional(),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProduct, categories, loading, error } = useAppSelector((state) => state.products);
  const [images, setImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [variants, setVariants] = useState<any[]>([]);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any | null>(null);

  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      sizes: [],
      colors: [],
      materials: [],
      hasVariants: false,
      isActive: true,
    },
  });

  const watchedSizes = watch('sizes') || [];
  const watchedColors = watch('colors') || [];
  const watchedMaterials = watch('materials') || [];
  const watchedHasVariants = watch('hasVariants');

  useEffect(() => {
    // Load categories
    dispatch(fetchCategories());

    // Load product if editing
    if (isEditing && id) {
      loadProduct(id);
    }
  }, [dispatch, id, isEditing]);

  const loadProduct = async (productId: string) => {
    try {
      const product = await dispatch(fetchProduct(productId)).unwrap();
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        sizes: product.sizes || [],
        colors: product.colors || [],
        materials: product.materials || [],
        hasVariants: product.hasVariants || false,
        isActive: product.isActive,
      });
      setImages(product.images || []);
      setCoverImageIndex(product.coverImageIndex || 0);
      setVariants(product.variants || []);
    } catch (err: any) {
      toast.error(err || 'Failed to load product');
      navigate('/products');
    }
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const fileArray = Array.from(files);
      
      // Create preview URLs
      const uploadedUrls = fileArray.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success(`${fileArray.length} image(s) uploaded successfully`);
    } catch (err) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      handleImageUpload(files);
    } else {
      toast.error('Please upload only image files');
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
    
    // Update cover image index if needed
    if (fromIndex === coverImageIndex) {
      setCoverImageIndex(toIndex);
    } else if (fromIndex < coverImageIndex && toIndex >= coverImageIndex) {
      setCoverImageIndex(coverImageIndex - 1);
    } else if (fromIndex > coverImageIndex && toIndex <= coverImageIndex) {
      setCoverImageIndex(coverImageIndex + 1);
    }
  };

  const setCoverImageHandler = (index: number) => {
    setCoverImageIndex(index);
    toast.success('Cover image updated');
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const addSize = () => {
    if (newSize.trim() && !watchedSizes.includes(newSize.trim())) {
      setValue('sizes', [...watchedSizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setValue('sizes', watchedSizes.filter(s => s !== size));
  };

  const addColor = () => {
    if (newColor.trim() && !watchedColors.includes(newColor.trim())) {
      setValue('colors', [...watchedColors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setValue('colors', watchedColors.filter(c => c !== color));
  };

  const addMaterial = () => {
    if (newMaterial.trim() && !watchedMaterials.includes(newMaterial.trim())) {
      setValue('materials', [...watchedMaterials, newMaterial.trim()]);
      setNewMaterial('');
    }
  };

  const removeMaterial = (material: string) => {
    setValue('materials', watchedMaterials.filter(m => m !== material));
  };

  const addVariant = (variantData: any) => {
    const newVariant = {
      id: Date.now().toString(),
      sku: variantData.sku,
      size: variantData.size,
      color: variantData.color,
      material: variantData.material,
      price: variantData.price,
      stock: variantData.stock,
      lowStockThreshold: variantData.lowStockThreshold || 10,
      isActive: variantData.isActive,
    };
    setVariants(prev => [...prev, newVariant]);
    setShowVariantForm(false);
    toast.success('Variant added successfully');
  };

  const updateVariant = (variantId: string, variantData: any) => {
    setVariants(prev => prev.map(v => 
      v.id === variantId ? { ...v, ...variantData } : v
    ));
    setEditingVariant(null);
    setShowVariantForm(false);
    toast.success('Variant updated successfully');
  };

  const deleteVariant = (variantId: string) => {
    setVariants(prev => prev.filter(v => v.id !== variantId));
    toast.success('Variant deleted successfully');
  };

  const generateSKU = (name: string, size?: string, color?: string, material?: string) => {
    const nameCode = name.substring(0, 3).toUpperCase();
    const sizeCode = size ? size.substring(0, 2).toUpperCase() : '';
    const colorCode = color ? color.substring(0, 2).toUpperCase() : '';
    const materialCode = material ? material.substring(0, 2).toUpperCase() : '';
    const randomCode = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    return `${nameCode}-${sizeCode}${colorCode}${materialCode}-${randomCode}`;
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        ...data,
        images,
        coverImageIndex,
        variants: data.hasVariants ? variants : [],
      };

      if (isEditing && id) {
        await dispatch(updateProduct({ id, data: productData })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success('Product created successfully');
      }

      navigate('/products');
    } catch (err: any) {
      toast.error(err || `Failed to ${isEditing ? 'update' : 'create'} product`);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && isEditing) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
        <button 
          onClick={() => navigate('/products')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update product information' : 'Create a new product for your store'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing and Inventory */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Variants */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Variants</h3>

          {/* Sizes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter size (e.g., S, M, L, XL)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchedSizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="ml-2 text-gray-500 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter color (e.g., Red, Blue, Black)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchedColors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {color}


        {/* Product Variants Management */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
              <p className="text-sm text-gray-600">Manage size, color, and material combinations with individual SKUs</p>
            </div>
            <div className="flex items-center">
              <input
                {...register('hasVariants')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
              />
              <label className="text-sm text-gray-700">Enable variants</label>
            </div>
          </div>

          {watchedHasVariants && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {variants.length} variant{variants.length !== 1 ? 's' : ''} created
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingVariant(null);
                    setShowVariantForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Variant
                </button>
              </div>

              {/* Variants List */}
              {variants.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {variants.map((variant) => (
                        <tr key={variant.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{variant.sku}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{variant.size || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{variant.color || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{variant.material || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {variant.price ? `$${variant.price.toFixed(2)}` : 'Base price'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{variant.stock}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              variant.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {variant.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingVariant(variant);
                                  setShowVariantForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteVariant(variant.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Variant Form Modal */}
              {showVariantForm && (
                <VariantForm
                  variant={editingVariant}
                  availableSizes={watchedSizes}
                  availableColors={watchedColors}
                  availableMaterials={watchedMaterials}
                  productName={watch('name')}
                  onSave={editingVariant ? updateVariant : addVariant}
                  onCancel={() => {
                    setShowVariantForm(false);
                    setEditingVariant(null);
                  }}
                  generateSKU={generateSKU}
                />
              )}
            </div>
          )}
        </div>

                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="ml-2 text-gray-500 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Materials
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter material (e.g., Cotton, Leather, Polyester)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              />
              <button
                type="button"
                onClick={addMaterial}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchedMaterials.map((material) => (
                <span
                  key={material}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {material}
                  <button
                    type="button"
                    onClick={() => removeMaterial(material)}
                    className="ml-2 text-gray-500 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Images Gallery */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images Gallery</h3>

          <div className="space-y-4">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {uploading ? (
                    <LoadingSpinner />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Drag & drop images here or click to browse'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Supports JPG, PNG, WebP up to 10MB each
                  </span>
                </label>
              </div>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Images ({images.length})
                  </h4>
                  <span className="text-xs text-gray-500">
                    Drag to reorder • Click to set as cover
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group cursor-move"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', index.toString());
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        if (fromIndex !== index) {
                          moveImage(fromIndex, index);
                        }
                      }}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-lg border-2 hover:border-blue-400 transition-colors">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Cover Image Badge */}
                        {index === coverImageIndex && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">
                            Cover
                          </div>
                        )}
                        
                        {/* Image Controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            {index !== coverImageIndex && (
                              <button
                                type="button"
                                onClick={() => setCoverImageHandler(index)}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                title="Set as cover image"
                              >
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                              title="Remove image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Drag Handle */}
                        <div className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-70 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="mt-1 text-center">
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>

          <div className="flex items-center">
            <input
              {...register('isActive')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Product is active and visible to customers
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <LoadingSpinner />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;