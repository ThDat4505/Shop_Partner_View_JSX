import React, { useEffect, useState } from 'react';
import { SHOP_CATEGORIES } from '../../utils/categories';

const ListItem = ({ shopId }) => {
  const url = 'http://localhost:4000';
  const [list, setList] = useState([]);

  const [filterCategory, setFilterCategory] = useState('All');
  const categories = SHOP_CATEGORIES[shopId] || [];

  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentItem, setCurrentItem] = useState(null);
  const [editImage, setEditImage] = useState(null);

  const fetchList = async () => {
      try {
        const response = await fetch(`${url}/list-item?shopId=${shopId}`);
        const result = await response.json();
        if (result.success) {
          setList(result.data);
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openEdit = (item) => {
    setCurrentItem({ ...item });
    setEditImage(null);
    setShowEditConfirm(false);
    setShowEditModal(true);
  };

  const openDelete = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const onEditChangeHandler = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmitForm = (e) => {
    e.preventDefault();
    setShowEditConfirm(true);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', currentItem.name);
    formData.append('description', currentItem.description);
    formData.append('price', currentItem.price);
    formData.append('category', currentItem.category);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      const response = await fetch(`${url}/edit-item/${currentItem.id}`, {
        method: 'PUT',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setShowEditModal(false);
        setShowEditConfirm(false);
        fetchList();
      }
    } catch (error) {
      console.error("Error updating stock item:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${url}/delete-item/${currentItem.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setShowDeleteModal(false);
        fetchList();
      }
    } catch (error) {
      console.error("Error deleting stock item:", error);
    }
  };

  const filteredList = list.filter(item => {
    if (filterCategory === 'All') return true;
    return item.category === filterCategory;
  });

  return (
    <div className="container-fluid mt-4">

      {/* Dynamic Category Filtering Row */}
      <div className="mb-4 d-flex gap-2 flex-wrap align-items-center">
        <span className="fw-bold text-secondary me-2">Filter Category:</span>
        <button
          className={`btn btn-sm px-3 rounded-pill ${filterCategory === 'All' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setFilterCategory('All')}
        >
          All Items
        </button>

        {categories.map((cat, index) => (
          <button
            key={index}
            className={`btn btn-sm px-3 rounded-pill ${filterCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TABLE WORKSPACE CONTAINER */}
      <div className="table-responsive bg-white p-3 rounded border shadow-sm">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Item Name</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col" className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <tr key={item.id || item.name}>
                  <td>
                    <img
                      src={`${url}/uploads/${item.image}`}
                      alt={item.name}
                      className="img-thumbnail"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <div><strong>{item.name}</strong></div>
                    <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '250px' }}>
                      {item.description}
                    </small>
                  </td>
                  <td><span className="badge bg-secondary">{item.category}</span></td>
                  <td>${item.price}</td>
                  <td className="text-end">
                    <div className="dropdown">
                      <button className="btn btn-sm btn-link text-dark shadow-none" type="button" data-bs-toggle="dropdown">
                        <i className="bi bi-three-dots-vertical fs-5"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button className="dropdown-menu-item dropdown-item" onClick={() => openEdit(item)}>
                            <i className="bi bi-pencil me-2 text-primary"></i> Edit
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-menu-item dropdown-item text-danger" onClick={() => openDelete(item)}>
                            <i className="bi bi-trash me-2"></i> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                  {filterCategory === 'All'
                    ? "No inventory items stored yet. Go add some!"
                    : `No items found under "${filterCategory}".`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL OVERLAY --- */}
      {showEditModal && currentItem && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">

            {showEditConfirm ? (
              <div className="modal-content border border-primary border-2">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Confirm Changes</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditConfirm(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted">Please check the new values below before updating:</p>
                  <div className="text-center mb-3">
                    <img
                      src={editImage ? URL.createObjectURL(editImage) : `${url}/uploads/${currentItem.image}`}
                      alt="Confirmed preview"
                      className="img-thumbnail"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-2"><strong>Item Name:</strong> {currentItem.name}</p>
                    <p className="mb-2"><strong>Description:</strong> {currentItem.description}</p>
                    <p className="mb-2"><strong>Category:</strong> <span className="badge bg-secondary">{currentItem.category}</span></p>
                    <p className="mb-0"><strong>Price:</strong> <span className="text-success fw-bold">${currentItem.price}</span></p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditConfirm(false)}>Back to Edit</button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdate}>Confirm Save</button>
                </div>
              </div>
            ) : (
              <form className="modal-content" onSubmit={handleEditSubmitForm}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Catalog Item</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3 text-center">
                    <label htmlFor="modal-image" className="form-label d-block">
                      <img
                        src={editImage ? URL.createObjectURL(editImage) : `${url}/uploads/${currentItem.image}`}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                      />
                    </label>
                    <input
                      type="file"
                      id="modal-image"
                      className="form-control d-none"
                      onChange={(e) => setEditImage(e.target.files[0])}
                    />
                    <small className="text-muted d-block mt-1">Click image to upload new file</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input type="text" name="name" className="form-control" required value={currentItem.name} onChange={onEditChangeHandler} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows="3" required value={currentItem.description} onChange={onEditChangeHandler}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select name="category" className="form-control" value={currentItem.category} onChange={onEditChangeHandler}>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price ($)</label>
                    <input type="number" name="price" className="form-control" required value={currentItem.price} onChange={onEditChangeHandler} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL OVERLAY --- */}
      {showDeleteModal && currentItem && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to permanently remove this stock item from inventory?</p>
                <div className="d-flex align-items-center gap-3 p-2 border rounded bg-light">
                  <img
                    src={`${url}/uploads/${currentItem.image}`}
                    alt=""
                    className="img-thumbnail"
                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-1">{currentItem.name}</h6>
                    <span className="badge bg-secondary me-2">{currentItem.category}</span>
                    <strong className="text-danger">${currentItem.price}</strong>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListItem;