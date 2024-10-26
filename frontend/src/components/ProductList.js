

import { useEffect, useState } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../api/productApi';
import "../App.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', quantity: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const result = await fetchProducts();
        setProducts(result);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddOrUpdate = async () => {
        try {
            if (editId) {
                await updateProduct(editId, formData);
                setEditId(null);
            } else {
                await addProduct(formData);
            }
            setFormData({ name: '', description: '', price: '', quantity: '' });
            loadProducts();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = (product) => {
        setEditId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
        });
    };

    const handleDelete = async (id) => {
        await deleteProduct(id);
        loadProducts();
    };

    return (
        <div className="container">
            <div className="title-bar">
                <h1>Product Management System</h1>
            </div>
            <div className="form-section">
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
                <input name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
                <div className="icon-input">
                    <span className="icon">💵</span>
                    <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price" />
                </div>
                <div className="icon-input">
                    <span className="icon">📦</span>
                    <input name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="Quantity" />
                </div>
                <button className="button-primary" onClick={handleAddOrUpdate}>
                    {editId ? 'Update' : 'Add'}
                </button>
            </div>
            <div className="product-table">
                <div className="table-header">
                    <span className="header-cell">Name</span>
                    <span className="header-cell">Description</span>
                    <span className="header-cell">Price</span>
                    <span className="header-cell">Quantity</span>
                    <span className="header-cell">Actions</span>
                </div>
                {products.map((product) => (
                    <div key={product.id} className="table-row">
                        <span className="cell">{product.name}</span>
                        <span className="cell">{product.description}</span>
                        <span className="cell">${product.price}</span>
                        <span className="cell">{product.quantity}</span>
                        <div className="cell actions">
                            <button className="button-secondary" onClick={() => handleEdit(product)}>Edit</button>
                            <button className="button-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
