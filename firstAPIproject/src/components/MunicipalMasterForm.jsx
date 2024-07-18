import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MunicipalForm from './MunicipalForm';

const MunicipalTable = () => {
  const [data, setData] = useState([]);
  const [muniName, setMuniName] = useState('');
  const [commisName, setCommisName] = useState('');
  const apiUrlBase = 'http://192.168.29.245:8085/muncipal/api';

  // Function to fetch data from the API based on search terms
  const fetchData = () => {
    let url = `${apiUrlBase}/getAllMunicipalMaster`;
    if (muniName) {
      url = `${apiUrlBase}/getByMuniName?muniName=${encodeURIComponent(muniName)}`;
    } else if (commisName) {
      url = `${apiUrlBase}/getByCommisName?commisName=${encodeURIComponent(commisName)}`;
    }
    axios.get(url)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Fetch data on initial component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle deletion of a municipal record (toggle suspended status)
  const handleDelete = (id, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0;

    axios.patch(`${apiUrlBase}/municipalMaster/suspendedStatus/${id}?suspendedStatus=${newStatus}`)
      .then(response => {
        console.log('Municipal record suspended status updated successfully');
        fetchData();
      })
      .catch(error => {
        console.error('Error updating suspended status of municipal record:', error);
      });
  };

  // Function to handle updating a municipal record
  const handleUpdate = (id) => {
    axios.get(`${apiUrlBase}/municipalMaster/update/${id}`, {})
      .then(response => {
        console.log(`Updated municipal record successfully with ID: ${id}`);
        fetchData();
      })
      .catch(error => {
        console.error('Error updating municipal record:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      });
  };

  // Function to handle search by municipal name
  const handleSearchByMuniName = () => {
    fetchData();
  };

  // Function to handle search by commissioner's name
  const handleSearchByCommisName = () => {
    fetchData();
  };

  return (
    <div>
      <h1>Municipal Data</h1>
      <MunicipalForm onFormSubmit={fetchData} />

      {/* Search inputs and buttons */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={muniName}
          onChange={(e) => setMuniName(e.target.value)}
          placeholder="Enter Municipal Name"
        />
        <button className="btn btn-primary" onClick={handleSearchByMuniName}>
          Search by Muni Name
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={commisName}
          onChange={(e) => setCommisName(e.target.value)}
          placeholder="Enter Commissioner Name"
        />
        <button className="btn btn-primary" onClick={handleSearchByCommisName}>
          Search by Commis Name
        </button>
      </div>

      {/* Table to display municipal data */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Muni Code</th>
            <th>Muni Name</th>
            <th>City</th>
            <th>State</th>
            <th>Address Line 1</th>
            <th>Commis Name</th>
            <th>Contact Number</th>
            <th>Toll Free Number</th>
            <th>Logo File</th>
            <th>Created By</th>
            <th>Created Date</th>
            <th>Updated By</th>
            <th>Updated Date</th>
            <th>Suspended Status</th>
            <th>Address Line 2</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.filter(municipal => municipal.suspendedStatus === 0).map((municipal, index) => (
            <tr key={index}>
              <td>{municipal.id}</td>
              <td>{municipal.muniCode}</td>
              <td>{municipal.muniName}</td>
              <td>{municipal.city}</td>
              <td>{municipal.state}</td>
              <td>{municipal.addressLine1}</td>
              <td>{municipal.commisName}</td>
              <td>{municipal.contactNumber}</td>
              <td>{municipal.tollFreeNumber}</td>
              <td>{municipal.logoFile}</td>
              <td>{municipal.createdBy}</td>
              <td>{municipal.createdDate}</td>
              <td>{municipal.updatedBy}</td>
              <td>{municipal.updatedDate}</td>
              <td>{municipal.suspendedStatus}</td>
              <td>{municipal.addressLine2}</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => handleUpdate(municipal.id)}>Update</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(municipal.id, municipal.suspendedStatus)}>
                  {municipal.suspendedStatus === 0 ? 'Suspend' : 'Unsuspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MunicipalTable;
