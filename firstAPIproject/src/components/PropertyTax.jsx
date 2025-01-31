import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PropertyTax = () => {
    const [propertyTaxData, setPropertyTaxData] = useState([]);
    const [formData, setFormData] = useState({
        componentName: '',
        rateValue: '',
        calcValue: '',
        fyYear: '2023-2024',
        isRateActive: true,
        createdBy: 'Admin',
        createdDate: new Date().toISOString(),
        updatedBy: 'Admin',
        updatedDate: new Date().toISOString(),
        suspendedStatus: 0,
        municipalId: '12345',
    });
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPropertyTaxData();
    }, []);

    const fetchPropertyTaxData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://192.168.29.245:8085/muncipal/api/getAllPropertyTaxComponent');
            setPropertyTaxData(response.data);
        } catch (error) {
            handleError(error, 'fetching property tax data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log('Submitting form data:', formData);
            const response = selectedId
                ? await axios.put(`http://192.168.29.245:8085/muncipal/api/propertyTaxComponent/update/${selectedId}`, formData)
                : await axios.post('http://192.168.29.245:8085/muncipal/api/createPropertyTaxComponent', formData);

            console.log('Property tax component saved:', response.data);
            fetchPropertyTaxData();
            resetForm();
        } catch (error) {
            handleError(error, 'saving property tax component');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchById = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://192.168.29.245:8085/muncipal/api/propertyTaxComponent/${id}`);
            setSelectedId(response.data.id);
            setFormData({
                componentName: response.data.componentName,
                rateValue: response.data.rateValue,
                calcValue: response.data.calcValue,
                fyYear: response.data.fyYear,
                isRateActive: response.data.isRateActive,
                createdBy: response.data.createdBy,
                createdDate: response.data.createdDate,
                updatedBy: response.data.updatedBy,
                updatedDate: response.data.updatedDate,
                suspendedStatus: response.data.suspendedStatus,
                municipalId: response.data.municipalId,
            });
        } catch (error) {
            handleError(error, 'fetching property tax component by id');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this component?')) {
            setLoading(true);
            try {
                await axios.delete(`http://192.168.29.245:8085/muncipal/api/propertyTaxComponent/${id}`);
                fetchPropertyTaxData();
            } catch (error) {
                handleError(error, 'deleting property tax component');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSuspendedStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 0 ? 1 : 0;
        setLoading(true);
        try {
            await axios.patch(`http://192.168.29.245:8085/muncipal/api/propertyTaxComponent/suspendedStatus/${id}?suspendedStatus=${newStatus}`);
            console.log('Municipal record suspended status updated successfully');
            fetchPropertyTaxData();
        } catch (error) {
            console.error('Error updating suspended status of municipal record:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedId(null);
        setFormData({
            componentName: '',
            rateValue: '',
            calcValue: '',
            fyYear: '2023-2024',
            isRateActive: true,
            createdBy: 'Admin',
            createdDate: new Date().toISOString(),
            updatedBy: 'Admin',
            updatedDate: new Date().toISOString(),
            suspendedStatus: 0,
            municipalId: '12345',
        });
    };

    const handleError = (error, action) => {
        console.error(`Error ${action}:`, error);
        if (error.response) {
            console.log('Error response data:', error.response.data);
            alert(`Error ${action}: ${error.response.data.message || 'Request failed'}`);
        } else {
            alert(`Error ${action}: Unable to reach the server`);
        }
    };

    return (
        <div>
            <h2>Property Tax Component Data:</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <label>
                    Component Name:
                    <input
                        type="text"
                        name="componentName"
                        value={formData.componentName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Rate Value:
                    <input
                        type="text"
                        name="rateValue"
                        value={formData.rateValue}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Calc Value:
                    <input
                        type="text"
                        name="calcValue"
                        value={formData.calcValue}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Fiscal Year:
                    <input
                        type="text"
                        name="fyYear"
                        value={formData.fyYear}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Is Rate Active:
                    <input
                        type="checkbox"
                        name="isRateActive"
                        checked={formData.isRateActive}
                        onChange={(e) => setFormData({ ...formData, isRateActive: e.target.checked })}
                        required
                    />
                </label>
                <br />
                <label>
                    Created By:
                    <input
                        type="text"
                        name="createdBy"
                        value={formData.createdBy}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Created Date:
                    <input
                        type="datetime-local"
                        name="createdDate"
                        value={new Date(formData.createdDate).toISOString().slice(0, -1)}
                        onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
                        required
                    />
                </label>
                <br />
                <label>
                    Updated By:
                    <input
                        type="text"
                        name="updatedBy"
                        value={formData.updatedBy}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Updated Date:
                    <input
                        type="datetime-local"
                        name="updatedDate"
                        value={new Date(formData.updatedDate).toISOString().slice(0, -1)}
                        onChange={(e) => setFormData({ ...formData, updatedDate: e.target.value })}
                        required
                    />
                </label>
                <br />
                <label>
                    Suspended Status:
                    <input
                        type="number"
                        name="suspendedStatus"
                        value={formData.suspendedStatus}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Municipal ID:
                    <input
                        type="text"
                        name="municipalId"
                        value={formData.municipalId}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <button type="submit" className="btn btn-primary">{selectedId ? 'Update' : 'Create'} Property Tax Component</button>
                {selectedId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                propertyTaxData.length > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Component Name</th>
                                <th>Rate Value</th>
                                <th>Calc Value</th>
                                <th>Fiscal Year</th>
                                <th>Is Rate Active</th>
                                <th>Created By</th>
                                <th>Created Date</th>
                                <th>Updated By</th>
                                <th>Updated Date</th>
                                <th>Suspended Status</th>
                                <th>Municipal ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {propertyTaxData.map((tax) => (
                                <tr key={tax.id}>
                                    <td>{tax.id}</td>
                                    <td>{tax.componentName}</td>
                                    <td>{tax.rateValue}</td>
                                    <td>{tax.calcValue}</td>
                                    <td>{tax.fyYear}</td>
                                    <td>{tax.isRateActive ? 'Yes' : 'No'}</td>
                                    <td>{tax.createdBy}</td>
                                    <td>{tax.createdDate}</td>
                                    <td>{tax.updatedBy}</td>
                                    <td>{tax.updatedDate}</td>
                                    <td>{tax.suspendedStatus}</td>
                                    <td>{tax.municipalId}</td>
                                    <td>
                                        <button onClick={() => handleFetchById(tax.id)}>Edit</button>
                                        <button onClick={() => handleDelete(tax.id)}>Delete</button>
                                        <button onClick={() => handleSuspendedStatusChange(tax.id, tax.suspendedStatus)}>
                                            {tax.suspendedStatus === 0 ? 'Suspend' : 'Unsuspend'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No property tax components found.</p>
                )
            )}
        </div>
    );
};

export default PropertyTax;
