import React, { useEffect, useState } from 'react';

const Orders = ({ shopId }) => {
  const url = 'http://localhost:4000';
  const [orders, setOrders] = useState([]);
  
  // Filter States (Dates: YYYY-MM-DD, Times: HH:MM in 24h backend strings)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Fetch orders list from backend
  const fetchOrders = async () => {
      try {
        const response = await fetch(`${url}/list-orders?shopId=${shopId}`);
        const result = await response.json();
        if (result.success) {
          const sortedOrders = result.data.sort((a, b) => {
            return new Date(a.time) - new Date(b.time);
          });
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle dropdown status change instantly
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${url}/update-order-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        fetchOrders();
      } else {
        alert("Failed to update status: " + result.message);
      }
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'waiting': return 'bg-warning text-dark';
      case 'confirm': return 'bg-primary';
      case 'delivering': return 'bg-info text-dark';
      case 'delivered': return 'bg-success';
      case 'Done': return 'bg-dark';
      default: return 'bg-secondary';
    }
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
  };

  // Helper function to turn "14:30" or "2026-06-26 14:30" into "2:30 PM" or "26/06/2026 02:30 PM"
  const formatToAMPM = (timeInput, includeDate = false) => {
    if (!timeInput) return '';
    const dateObj = new Date(timeInput.includes(' ') || timeInput.includes('T') ? timeInput : `2000-01-01T${timeInput}`);

    if (isNaN(dateObj.getTime())) return timeInput; // Fallback if string is weird

    return dateObj.toLocaleString('en-US', {
      year: includeDate ? 'numeric' : undefined,
      month: includeDate ? '2-digit' : undefined,
      day: includeDate ? '2-digit' : undefined,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // --- RECURRING SHIFT FILTER LOGIC ---
  const filteredOrders = orders.filter((order) => {
    // order.time format from backend: "YYYY-MM-DD HH:MM"
    const [orderDateStr, orderTimeStr] = order.time.split(' ');

    // 1. Check Date Range boundaries
    if (startDate && orderDateStr < startDate) return false;
    if (endDate && orderDateStr > endDate) return false;

    // 2. Check Specific Time Range slot boundaries
    if (startTime && endTime) {
      if (startTime <= endTime) {
        // Normal time range slot (e.g., 10:00 to 13:00)
        if (orderTimeStr < startTime || orderTimeStr > endTime) return false;
      } else {
        // Overnight slot boundary handling (e.g., 22:00 to 02:00)
        if (orderTimeStr < startTime && orderTimeStr > endTime) return false;
      }
    } else if (startTime) {
      if (orderTimeStr < startTime) return false;
    } else if (endTime) {
      if (orderTimeStr > endTime) return false;
    }

    return true;
  });

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Manage Orders <small className="text-muted fs-6">(Sorted: Oldest First)</small></h2>

      {/* RECURRING SHIFT FILTER CONTROL PANEL */}
      <div className="card mb-4 shadow-sm border">
        <div className="card-body bg-light">
          <h5 className="h6 fw-bold mb-3 text-secondary">
            <i className="bi bi-funnel-fill me-2"></i>Filter Specific Time Windows Across Days
          </h5>
          <div className="row g-3 align-items-end">

            {/* Start Date */}
            <div className="col-md-2">
              <label htmlFor="startDate" className="form-label small fw-bold">From Day</label>
              <input
                type="date"
                id="startDate"
                className="form-control bg-white shadow-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="col-md-2">
              <label htmlFor="endDate" className="form-label small fw-bold">To Day</label>
              <input
                type="date"
                id="endDate"
                className="form-control bg-white shadow-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Start Shift Time */}
            <div className="col-md-2">
              <label htmlFor="startTime" className="form-label small fw-bold">Start Time Slot</label>
              <input
                type="time"
                id="startTime"
                className="form-control bg-white shadow-none"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            {/* End Shift Time */}
            <div className="col-md-2">
              <label htmlFor="endTime" className="form-label small fw-bold">End Time Slot</label>
              <input
                type="time"
                id="endTime"
                className="form-control bg-white shadow-none"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            {/* Clear Button Action */}
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100 btn-sm p-2 shadow-none"
                onClick={resetFilters}
                disabled={!startDate && !endDate && !startTime && !endTime}
              >
                Clear Filter
              </button>
            </div>

          </div>

          {/* Active Filter Description Hint with AM/PM formatting */}
          {(startDate || endDate || startTime || endTime) && (
            <div className="mt-2 text-primary small fw-semibold">
              <i className="bi bi-info-circle me-1"></i>
              Showing orders placed between {' '}
              <strong>{startDate ? new Date(startDate).toLocaleDateString('en-GB') : "Any Day"}</strong> and <strong>{endDate ? new Date(endDate).toLocaleDateString('en-GB') : "Any Day"}</strong>
              {startTime && endTime && (
                <span> strictly inside the <strong>{formatToAMPM(startTime)} - {formatToAMPM(endTime)}</strong> daily shift window.</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ORDERS INDEX TABLE CONTAINER */}
      <div className="table-responsive bg-white p-3 rounded border shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Customer info</th>
              <th scope="col">Address</th>
              <th scope="col">Items Ordered</th>
              <th scope="col">Order Time</th>
              <th scope="col">Special Note</th>
              <th scope="col" style={{ width: '160px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="fw-bold">{order.name}</div>
                    <small className="text-muted">
                      <i className="bi bi-telephone-fill me-1 small"></i>{order.phone}
                    </small>
                  </td>
                  <td>
                    <span className="text-wrap d-inline-block" style={{ maxWidth: '200px', fontSize: '0.9rem' }}>
                      {order.address}
                    </span>
                  </td>
                  <td>
                    <span className="fw-semibold text-primary">{order.orderItems}</span>
                  </td>

                  {/* Order Time formatted explicitly to AM/PM */}
                  <td>
                    <small className="text-nowrap fw-bold text-secondary">
                      <i className="bi bi-clock me-1"></i>{formatToAMPM(order.time, true)}
                    </small>
                  </td>

                  <td>
                    <span className="text-muted italic small">
                      {order.note ? `"${order.note}"` : <span className="text-light-emphasis">-</span>}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <span className={`badge ${getStatusBadgeClass(order.status)} mb-1 text-capitalize`}>
                        {order.status}
                      </span>
                      <select
                        className="form-select form-select-sm shadow-none"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="waiting">Waiting</option>
                        <option value="confirm">Confirm</option>
                        <option value="delivering">Delivering</option>
                        <option value="delivered">Delivered</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  <i className="bi bi-calendar-x fs-2 d-block mb-2 text-secondary"></i>
                  No orders found matching this recurring time slot.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;