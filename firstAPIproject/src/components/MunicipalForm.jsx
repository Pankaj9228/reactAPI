import axios from 'axios';
import React, { useState } from 'react';
import './MunicipalForm.css'; // Import your CSS for unique styling

const MunicipalForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    muniCode: '',
    muniName: '',
    city: '',
    state: '',
    addressLine1: '',
    addressLine2: '',
    commisName: '',
    contactNumber: '',
    tollFreeNumber: '',
    logoFile: null,
    createdBy: 1, // Example: this might come from authentication or context
    createdDate: '2024-07-16', // Example: current date
    updatedBy: 2, // Example: this might come from authentication or context
    updatedDate: '2024-07-16', // Example: current date
    suspendedStatus: 0 // Example: initial status
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      logoFile: file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
  
      const response = await axios.post(
        'http://192.168.29.245:8085/muncipal/api/createMunicipalMaster',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      console.log('Data saved successfully:', response.data);
      onFormSubmit(); // Refresh the data table or perform any other action
    } catch (error) {
      console.error('Error saving data:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      alert('There was an error saving the data. Please try again.');
    }
  };
  
  return (
    <div className="municipal-form-container">
      <h2 className="form-title">Municipal Form</h2>
      <form onSubmit={handleSubmit} className="municipal-form">
        <div className="form-group">
          <label>Municipal Code:</label>
          <input
            type="text"
            name="muniCode"
            value={formData.muniCode}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Municipal Name:</label>
          <input
            type="text"
            name="muniName"
            value={formData.muniName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Address Line 1:</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Address Line 2:</label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Commissioner Name:</label>
          <input
            type="text"
            name="commisName"
            value={formData.commisName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Toll-Free Number:</label>
          <input
            type="text"
            name="tollFreeNumber"
            value={formData.tollFreeNumber}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Logo File:</label>
          <input
            type="file"
            name="logoFile"
            onChange={handleFileChange}
            required
            className="form-control-file"
          />
        </div>
        
        {/* These fields are not user-editable */}
        <input type="hidden" name="createdBy" value={formData.createdBy} />
        <input type="hidden" name="createdDate" value={formData.createdDate} />
        <input type="hidden" name="updatedBy" value={formData.updatedBy} />
        <input type="hidden" name="updatedDate" value={formData.updatedDate} />
        <input type="hidden" name="suspendedStatus" value={formData.suspendedStatus} />

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default MunicipalForm;
