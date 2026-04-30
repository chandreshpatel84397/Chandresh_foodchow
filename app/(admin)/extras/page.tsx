'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";

interface ExtraSize {
  size_name: string;
  size_price: number;
}

interface Extra {
  ingredient_id: number;
  ingredient_name: string;
  price: number;
  status: boolean;
  is_veg: boolean;
  ingredient_category_id: number;
  ingredient_size?: ExtraSize[];
}

interface Category {
  custom_cat_id: number;
  custom_cat_name: string;
  shop_id: number;
}

export default function ExtrasPage() {
  const defaultShopId = 1;
  const apiBaseUrl = 'https://localhost:44376/api';

  const [view, setView] = useState<'list' | 'add'>('list');
  const [extras, setExtras] = useState<Extra[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentShopId, setCurrentShopId] = useState<number>(defaultShopId);
  const [loading, setLoading] = useState(false);
  const [editingExtra, setEditingExtra] = useState<Extra | null>(null);

const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    ingredient_category_id: 0,
    ingredient_name: '',
    price: '',
    status: true,
    is_veg: true,
  });

  // Validation errors
  const [errors, setErrors] = useState({
    ingredient_category_id: false,
    ingredient_name: false,
    price: false,
  });

  useEffect(() => {
    void loadCategories(currentShopId);
  }, [currentShopId]);

  useEffect(() => {
    if (currentShopId > 0) {
      void loadExtras(currentShopId);
    }
  }, [currentShopId]);

  const loadCategories = async (shopId: number) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/FoodItemCustomCategory/getall/${shopId}`
      );
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const loadExtras = async (shopId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/extras/list/${shopId}`);
      if (res.ok) {
        const data = await res.json();
        setExtras(data || []);
      }
    } catch {
      toast.error('Failed to load extras');
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection change - update shop_id based on selected category
  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    
    if (categoryValue === 'all') {
      setCurrentShopId(defaultShopId);
    } else {
      const selectedCat = categories.find(c => c.custom_cat_id === Number(categoryValue));
      if (selectedCat) {
        setCurrentShopId(selectedCat.shop_id);
      }
    }
  };

  // Get shop_id for form operations based on selected category in form
  const getShopIdForCategory = (catId: number): number => {
    const cat = categories.find(c => c.custom_cat_id === catId);
    return cat?.shop_id || defaultShopId;
  };

  const validateForm = () => {
    const newErrors = {
      ingredient_category_id: formData.ingredient_category_id === 0,
      ingredient_name: formData.ingredient_name.trim() === '',
      price: formData.price.trim() === '' || isNaN(Number(formData.price)),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    const shopIdForCategory = getShopIdForCategory(formData.ingredient_category_id);

    try {
      const payload = {
        shop_id: shopIdForCategory,
        ingredient_category_id: formData.ingredient_category_id,
        ingredient_name: formData.ingredient_name,
        price: Number(formData.price),
        status: formData.status,
        is_veg: formData.is_veg,
      };

      const res = await fetch(`${apiBaseUrl}/extras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Extra added successfully!');
        resetForm();
        setView('list');
        loadExtras(currentShopId);
      } else {
        toast.error('Failed to add extra');
      }
    } catch {
      toast.error('Server error');
    }
  };

  const handleUpdate = async () => {
    if (!validateForm() || !editingExtra) {
      toast.error('Please fill all required fields');
      return;
    }

    const shopIdForCategory = getShopIdForCategory(formData.ingredient_category_id);

    try {
      const payload = {
        ingredient_id: editingExtra.ingredient_id,
        shop_id: shopIdForCategory,
        ingredient_category_id: formData.ingredient_category_id,
        ingredient_name: formData.ingredient_name,
        price: Number(formData.price),
        status: formData.status,
        is_veg: formData.is_veg,
      };

      const res = await fetch(`${apiBaseUrl}/extras`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Extra updated successfully!');
        resetForm();
        setView('list');
        setEditingExtra(null);
        loadExtras(currentShopId);
      } else {
        toast.error('Failed to update extra');
      }
    } catch {
      toast.error('Server error');
    }
  };

  const handleDelete = async (extra: Extra) => {
    const shopIdForCategory = getShopIdForCategory(extra.ingredient_category_id);

    try {
      const res = await fetch(
        `${apiBaseUrl}/extras/${extra.ingredient_id}/${shopIdForCategory}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        toast.success('Ingredient deleted successfully!');
        loadExtras(currentShopId);
      } else {
        toast.error('Failed to delete extra');
      }
    } catch {
      toast.error('Server error');
    }
  };

  const handleToggleActive = async (extra: Extra) => {
    const shopIdForCategory = getShopIdForCategory(extra.ingredient_category_id);

    try {
      const payload = {
        ingredient_id: extra.ingredient_id,
        shop_id: shopIdForCategory,
        ingredient_category_id: extra.ingredient_category_id,
        ingredient_name: extra.ingredient_name,
        price: extra.price,
        status: !extra.status,
        is_veg: extra.is_veg,
      };

      const res = await fetch(`${apiBaseUrl}/extras`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const action = extra.status ? 'de-activated' : 'activated';
        toast.success(`Ingredient has been ${action} successfully.`);
        loadExtras(currentShopId);
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Server error');
    }
  };

  const handleEdit = (extra: Extra) => {
    setEditingExtra(extra);
    setFormData({
      ingredient_category_id: extra.ingredient_category_id,
      ingredient_name: extra.ingredient_name,
      price: String(extra.price),
      status: extra.status,
      is_veg: extra.is_veg,
    });
    setErrors({ ingredient_category_id: false, ingredient_name: false, price: false });
    setView('add');
  };

  const resetForm = () => {
    setFormData({
      ingredient_category_id: 0,
      ingredient_name: '',
      price: '',
      status: true,
      is_veg: true,
    });
    setErrors({ ingredient_category_id: false, ingredient_name: false, price: false });
    setEditingExtra(null);
  };

  const handleCancel = () => {
    resetForm();
    setView('list');
  };

  const openAddForm = () => {
    resetForm();
    setView('add');
  };

  const filteredExtras = selectedCategory === 'all'
    ? extras
    : extras.filter(e => e.ingredient_category_id === Number(selectedCategory));

  const getCategoryName = (catId: number) => {
    const cat = categories.find(c => c.custom_cat_id === catId);
    return cat?.custom_cat_name || '';
  };

  return (
    <div>
    <div className="extras-wrapper">
      <Toaster position="top-center" />
      
      {view === 'list' && (
        <div className="extras-card">
          {/* Header */}
          <div className="extras-header">
            <div className="extras-title-section">
              <h1 className="extras-title">Extras</h1>
              <select
                className="category-filter"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="all">All Category</option>
                {categories.map((cat) => (
                  <option key={cat.custom_cat_id} value={cat.custom_cat_id}>
                    {cat.custom_cat_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="extras-actions">
              <button className="add-extras-btn" onClick={openAddForm}>
                + ADD EXTRAS
              </button>
              <button className="help-btn">
                <span className="help-icon">💬</span> HELP
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="extras-table-container">
            <table className="extras-table">
              <thead>
                <tr>
                  <th className="th-name">Extra Name</th>
                  <th className="th-price">Price</th>
                  <th className="th-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="loading-cell">Loading...</td>
                  </tr>
                ) : filteredExtras.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="empty-cell">No extras found</td>
                  </tr>
                ) : (
                  filteredExtras.map((extra) => (
                    <tr key={extra.ingredient_id}>
                      <td className="td-name">
                        <span className={`veg-indicator ${extra.is_veg ? 'veg' : 'non-veg'}`}></span>
                        {extra.ingredient_name}
                      </td>
                      <td className="td-price">
                        {extra.ingredient_size && extra.ingredient_size.length > 0 ? (
                          <div className="size-prices">
                            {extra.ingredient_size.map((size, idx) => (
                              <div key={idx} className="size-price-item">
                                <span className="size-name">{size.size_name}</span>
                                <span className="size-price">Rs. {size.size_price}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="single-price">Rs. {extra.price}</span>
                        )}
                      </td>
                      <td className="td-action">
                        <div className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(extra)}
                            title="Edit Ingredient"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(extra)}
                            title="Delete Ingredient"
                          >
                            🗑️
                          </button>
                          <label className="toggle-switch" title={extra.status ? 'DeActivate Ingredient' : 'Activate Ingredient'}>
                            <input
                              type="checkbox"
                              checked={extra.status}
                              onChange={() => handleToggleActive(extra)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="nav-footer">
            <button className="nav-btn nav-prev"  onClick={() => router.push("/extras-category/custom_category/show_category")}
>PREVIOUS</button>
            <div className="nav-step">
              <span className="step-label">Step</span>
              <span className="step-number">6.2/26</span>
            </div>
            <button className="nav-btn nav-next"  onClick={() => router.push("/Items")}
>NEXT</button>
          </div>
        </div>
      )}

      {view === 'add' && (
        <div className="extras-card add-form-card">
          <h2 className="form-title">Add New Extras</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className={`form-label ${errors.ingredient_category_id ? 'error-label' : ''}`}>
                Extras Category <span className="required">*</span>
              </label>
              <select
                className={`form-select ${errors.ingredient_category_id ? 'error-input' : ''}`}
                value={formData.ingredient_category_id}
                onChange={(e) => {
                  setFormData({ ...formData, ingredient_category_id: Number(e.target.value) });
                  setErrors({ ...errors, ingredient_category_id: false });
                }}
              >
                <option value={0}>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.custom_cat_id} value={cat.custom_cat_id}>
                    {cat.custom_cat_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className={`form-label ${errors.ingredient_name ? 'error-label' : ''}`}>
                Extra Name(English) <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.ingredient_name ? 'error-input' : ''}`}
                value={formData.ingredient_name}
                onChange={(e) => {
                  setFormData({ ...formData, ingredient_name: e.target.value });
                  setErrors({ ...errors, ingredient_name: false });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status}
                    onChange={() => setFormData({ ...formData, status: true })}
                  />
                  <span>Active</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    checked={!formData.status}
                    onChange={() => setFormData({ ...formData, status: false })}
                  />
                  <span>Deactive</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className={`form-label ${errors.price ? 'error-label' : ''}`}>
                Price (Rs.) <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.price ? 'error-input' : ''}`}
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  setErrors({ ...errors, price: false });
                }}
              />
            </div>

            <div className="form-group veg-group">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="veg"
                    checked={formData.is_veg}
                    onChange={() => setFormData({ ...formData, is_veg: true })}
                  />
                  <span>Vegetarian</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="veg"
                    checked={!formData.is_veg}
                    onChange={() => setFormData({ ...formData, is_veg: false })}
                  />
                  <span>Non Vegetarian</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button
              className="btn-add"
              onClick={editingExtra ? handleUpdate : handleAdd}
            >
              {editingExtra ? 'UPDATE' : 'ADD'}
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>

    </div>



  );
}
