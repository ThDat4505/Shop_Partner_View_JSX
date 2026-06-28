import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const AddFood = ({ shopId }) => {
  const url = 'http://localhost:4000';
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [latestFoods, setLatestFoods] = useState([]);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cake'
  });

  const fetchLatestFoods = async () => {
      try {
        const response = await fetch(`${url}/list-food?shopId=${shopId}`); //
        const result = await response.json();
        if (result.success) {
          const sorted = [...result.data].reverse().slice(0, 5);
          setLatestFoods(sorted);
        }
      } catch (error) {
        console.error("Error fetching latest foods:", error);
      }
    };

  useEffect(() => {
    fetchLatestFoods();
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!image) {
      alert('Please select an image.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
        const formData = new FormData();
        formData.append('id', Date.now().toString());
        formData.append('shopId', shopId);
        formData.append('image', image);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('category', data.category);

      try {
            const response = await fetch(`${url}/add-food`, {
              method: 'POST',
              body: formData
            });

            const result = await response.json();

            if (result.success) {
              setShowConfirm(false);

              setData({ name: '', description: '', price: '', category: 'Cake' });
              setImage(null);

              fetchLatestFoods();

            } else {
              alert("Failed to add food item: " + result.message);
            }
          } catch (error) {
            console.error("Error submitting food:", error);
          }
  };

  return (
    <div className="mx-2 mt-4">
      <div className="row g-4">

        <div className="col-md-5">
          <div className="card shadow-sm">
            <form className="card-body" onSubmit={onSubmitHandler}>
              <h2 className="mb-4">Add Food</h2>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img
                    src={image ? URL.createObjectURL(image) : assets.upload}
                    alt=""
                    width={98}
                    style={{ cursor: 'pointer', objectFit: 'cover' }}
                  />
                </label>
                <input
                  type="file"
                  id="image"
                  className="form-control"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" id="name" name="name" className="form-control" required onChange={onChangeHandler} value={data.name} />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" name="description" className="form-control" rows="4" required onChange={onChangeHandler} value={data.description}></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select name="category" id="category" className="form-control" onChange={onChangeHandler} value={data.category}>
                  <option value="Cake">Cake</option>
                  <option value="Burger">Burger</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Salad">Salad</option>
                  <option value="Noodle">Noodle</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price ($)</label>
                <input type="number" id="price" name="price" className="form-control" required onChange={onChangeHandler} value={data.price} />
              </div>

              <button type="submit" className="btn btn-primary w-100">Save</button>
            </form>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title h4 mb-0">Recently Added Foods</h3>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/list')}>View All</button>
              </div>

              <div className="d-flex flex-column gap-3">
                {latestFoods.length > 0 ? (
                  latestFoods.map((item) => (
                    <div key={item.id} className="d-flex align-items-center gap-3 p-2 border rounded bg-light transition-all">
                      <img
                        src={`${url}/uploads/${item.image}`}
                        alt={item.name}
                        className="rounded border"
                        style={{ width: '65px', height: '65px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 text-truncate fw-bold">{item.name}</h6>
                          <span className="text-success fw-bold small">${item.price}</span>
                        </div>
                        <p className="mb-1 text-muted text-truncate small" style={{ maxWidth: '85%' }}>
                          {item.description}
                        </p>
                        <span className="badge bg-secondary style-sm" style={{ fontSize: '0.75rem' }}>{item.category}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-basket fs-1 d-block mb-2"></i>
                    No food items added recently.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {showConfirm && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Food Entry</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)} />
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" className="img-thumbnail" width={120} />
                </div>
                <div className="p-3 bg-light rounded border">
                  <p><strong>Name:</strong> {data.name}</p>
                  <p><strong>Description:</strong> {data.description}</p>
                  <p><strong>Category:</strong> <span className="badge bg-secondary">{data.category}</span></p>
                  <p className="mb-0"><strong>Price:</strong> <span className="text-success fw-bold">${data.price}</span></p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFood;