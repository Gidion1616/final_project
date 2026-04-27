import React, { useEffect, useState } from "react";

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/hotels/")
      .then(res => res.json())
      .then(data => setHotels(data));
  }, []);

  const deleteHotel = async (id) => {
    await fetch(`http://localhost:8000/api/admin/hotels/${id}/`, {
      method: "DELETE",
    });

    setHotels(hotels.filter(h => h.id !== id));
  };

  return (
    <div>
      <h2>Manage Hotels</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {hotels.map(h => (
            <tr key={h.id}>
              <td>{h.hotel_name}</td>
              <td>{h.email}</td>
              <td>
                <button onClick={() => deleteHotel(h.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageHotels;