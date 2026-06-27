import React, { useEffect, useState } from 'react';

const ListFood = ({ shopId }) => {
  const url = 'http://localhost:4000';
  const [list, setList] = useState([]);

  // Category filter state ('All' displays everything)
  const [filterCategory, setFilterCategory] = useState('All');

  // Modals visibility toggles
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Track currently active data objects
  const [currentFood, setCurrentFood] = useState(null);
  const [editImage, setEditImage] = useState(null);

  // All categories declared in AddFood.jsx
  const categories = ["Cake", "Burger", "Pizza", "Rolls", "Salad", "Noodle", "Dessert"];

  // Fetch all elements from backend
  const fetchList = async () => {
      try {
        const response = await fetch(`${url}/list-food?shopId=${shopId}`); // <-- Update this fetch URL line
        const result = await response.json();
        if (result.success) {
          setList(result.data);
        }
      } catch (error) {
        console.error("Error fetching list data:", error);
      }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Handlers to open actions
  const openEdit = (food) => {
    setCurrentFood({ ...food });
    setEditImage(null);
    setShowEditConfirm(false);
    setShowEditModal(true);
  };

  const openDelete = (food) => {
    setCurrentFood(food);
    setShowDeleteModal(true);
  };

  // Handle Input Changes inside Edit Modal
  const onEditChangeHandler = (e) => {
    const { name, value } = e.target;
    setCurrentFood(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmitForm = (e) => {
    e.preventDefault();
    setShowEditConfirm(true);
  };

  // Submit PUT updates to Server once confirmed
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', currentFood.name);
    formData.append('description', currentFood.description);
    formData.append('price', currentFood.price);
    formData.append('category', currentFood.category);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      const response = await fetch(`${url}/edit-food/${currentFood.id}`, {
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
      console.error("Error updating item:", error);
    }
  };

  // Submit DELETE query to Server
  const handleDelete = async () => {
    try {
      const response = await fetch(`${url}/delete-food/${currentFood.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setShowDeleteModal(false);
        fetchList();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Filter the list dynamically based on the dropdown selection
  const filteredList = list.filter(item => {
    if (filterCategory === 'All') return true;
    return item.category === filterCategory;
  });

  return (
    <div className="container-fluid mt-4">

      {/* HEADER AND FILTER ROW */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <h2 className="mb-0">All Food Items</h2>

        {/* Category Pull-Down Menu */}
        <div className="d-flex align-items-center gap-2" style={{ maxWidth: '300px' }}>
          <label htmlFor="categoryFilter" className="form-label mb-0 fw-bold text-nowrap">Filter By:</label>
          <select
            id="categoryFilter"
            className="form-select bg-white shadow-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE WORKSPACE CONTAINER */}
      <div className="table-responsive bg-white p-3 rounded border shadow-sm">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
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
              /* EMPTY FILTER FALLBACK TEXT */
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                  {filterCategory === 'All'
                    ? "No food data stored yet. Go add some!"
                    : `No items found under "${filterCategory}". Add more items of this category!`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL OVERLAY --- */}
      {showEditModal && currentFood && (
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
                      src={editImage ? URL.createObjectURL(editImage) : `${url}/uploads/${currentFood.image}`}
                      alt="Confirmed preview"
                      className="img-thumbnail"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-2"><strong>Name:</strong> {currentFood.name}</p>
                    <p className="mb-2"><strong>Description:</strong> {currentFood.description}</p>
                    <p className="mb-2"><strong>Category:</strong> <span className="badge bg-secondary">{currentFood.category}</span></p>
                    <p className="mb-0"><strong>Price:</strong> <span className="text-success fw-bold">${currentFood.price}</span></p>
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
                  <h5 className="modal-title">Edit Food Item</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3 text-center">
                    <label htmlFor="modal-image" className="form-label d-block">
                      <img
                        src={editImage ? URL.createObjectURL(editImage) : `${url}/uploads/${currentFood.image}`}
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
                    <label className="form-label">Name</label>
                    <input type="text" name="name" className="form-control" required value={currentFood.name} onChange={onEditChangeHandler} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows="3" required value={currentFood.description} onChange={onEditChangeHandler}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select name="category" className="form-control" value={currentFood.category} onChange={onEditChangeHandler}>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price ($)</label>
                    <input type="number" name="price" className="form-control" required value={currentFood.price} onChange={onEditChangeHandler} />
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
      {showDeleteModal && currentFood && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to permanently remove this food item?</p>
                <div className="d-flex align-items-center gap-3 p-2 border rounded bg-light">
                  <img
                    src={`${url}/uploads/${currentFood.image}`}
                    alt=""
                    className="img-thumbnail"
                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-1">{currentFood.name}</h6>
                    <span className="badge bg-secondary me-2">{currentFood.category}</span>
                    <strong className="text-danger">${currentFood.price}</strong>
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

export default ListFood;