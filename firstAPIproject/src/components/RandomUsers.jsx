import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ZoneData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const [isUpdate, setIsUpdate] = useState(false); // State to manage if form is in update mode
  const [selectedZone, setSelectedZone] = useState(null); // State to manage the selected zone for update

  const [newZone, setNewZone] = useState({
    zoneName: '',
    createdBy: '',
    updatedBy:'',
    municipalId: '',
    suspendedStatus: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.29.245:8085/muncipal/api/zone/active');
        console.log('API Response:', response.data);
        setData(response.data);
      } catch (err) {
        console.error('API Error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newZone.zoneName || !newZone.createdBy || !newZone.municipalId) {
      alert('Please fill all required fields.');
      return;
    }

    const newZoneData = {
      ...newZone,
      createdDate: new Date().toISOString(),
      updatedBy: 1,
      updatedDate: new Date().toISOString(),
    };

    try {
      console.log('Sending new zone data:', newZoneData); // Log request data
      const response = await axios.post('http://192.168.29.245:8085/muncipal/api/zone/create', newZoneData);
      console.log('Create Response:', response.data); // Log response data
      setData([...data, response.data]);
      setShowForm(false); // Hide the form after creating
      setNewZone({ zoneName: '', createdBy: '', municipalId: '', suspendedStatus: 0 }); // Clear form fields
    } catch (err) {
      console.error('Create Error:', err);
      if (err.response) {
        console.error('Error Response Data:', err.response.data);
      } else if (err.request) {
        console.error('Error Request Data:', err.request);
      } else {
        console.error('Error Message:', err.message);
      }
      setError(err);
    }
  };

  const handleUpdate = async () => {
    if (!newZone.zoneName || !newZone.createdBy || !newZone.municipalId) {
      alert('Please fill all required fields.');
      return;
    }

    const updatedZone = {
      ...selectedZone,
      ...newZone,
      updatedDate: new Date().toISOString(),
    };

    try {
      console.log('Sending updated zone data:', updatedZone); // Log request data
      const response = await axios.put(`http://192.168.29.245:8085/muncipal/api/zone/${selectedZone.id}`, updatedZone);
      console.log('Update Response:', response.data); // Log response data
      setData(data.map(zone => (zone.id === selectedZone.id ? response.data : zone)));
      setShowForm(false); // Hide the form after updating
      setIsUpdate(false);
      setSelectedZone(null);
      setNewZone({ zoneName: '', createdBy: '', municipalId: '', suspendedStatus: 0 }); // Clear form fields
    } catch (err) {
      console.error('Update Error:', err);
      if (err.response) {
        console.error('Error Response Data:', err.response.data);
      } else if (err.request) {
        console.error('Error Request Data:', err.request);
      } else {
        console.error('Error Message:', err.message);
      }
      setError(err);
    }
  };

  const handleMarkNotSuspended = async (id) => {
    try {
      const response = await axios.put(`http://192.168.29.245:8085/muncipal/api/zone/${id}/delete`);
      if (response.status === 200) {
        // Update the local data to reflect the changes
        setData(data.map(id => (id === id ? { ...id, suspendedStatus: 1 } : id)));
      } else {
        console.error('Mark Not Suspended Error:', response);
        setError(new Error('Failed to mark zone as not suspended'));
      }
    } catch (err) {
      console.error('Mark Not Suspended Error:', err);
      if (err.response) {
        console.error('Error Response Data:', err.response.data);
      } else if (err.request) {
        console.error('Error Request Data:', err.request);
      } else {
        console.error('Error Message:', err.message);
      }
      setError(err);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewZone({ ...newZone, [name]: value });
  };

  const handleEdit = (zone) => {
    setSelectedZone(zone);
    setNewZone({
      zoneName: zone.zoneName,
      createdBy: zone.createdBy,
      municipalId: zone.municipalId,
      suspendedStatus: zone.suspendedStatus
    });
    setShowForm(true);
    setIsUpdate(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Zone Data</h1>
      <button onClick={() => { setShowForm(!showForm); setIsUpdate(false); setSelectedZone(null); }}>Create New Zone</button>
      {showForm && (
        <div>
          <input
            type="text"
            name="zoneName"
            placeholder="Enter zone name"
            value={newZone.zoneName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="createdBy"
            placeholder="Created By"
            value={newZone.createdBy}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="municipalId"
            placeholder="Municipal ID"
            value={newZone.municipalId}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="suspendedStatus"
            placeholder="Suspended Status"
            value={newZone.suspendedStatus}
            onChange={handleInputChange}
          />
          <button onClick={isUpdate ? handleUpdate : handleCreate}>{isUpdate ? 'Update' : 'Submit'}</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Zone Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((zone) => (
            <tr key={zone.id}>
              <td>{zone.zoneName}</td>
              <td>
                <button onClick={() => handleEdit(zone)}>Update</button>
                <button onClick={() => handleMarkNotSuspended(zone.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZoneData;
