import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Propertytax = () => {
    const [propertyTaxData, setPropertyTaxData] = useState(null);
    const [formData, setFormData] = useState({
        componentName: '',
        rateValue: '',
        calcValue: '',
        fyYear: '',
        isRateActive: '',
        createdBy: '',
        createdDate: '',
        updatedBy: '',
        updatedDate: '',
        suspendedStatus: '',
        municipalId: '',
    });

    useEffect(() => {
        fetchPropertyTaxData();
    }, []);

    const fetchPropertyTaxData = async () => {
        try {
            const response = await axios.get('http://192.168.29.245:8085/muncipal/api/getAllPropertyTaxComponent');
            setPropertyTaxData(response.data);
        } catch (error) {
            console.error('Error fetching property tax data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.29.245:8085/muncipal/api/createPropertyTaxComponent', formData);
            console.log('Property tax component created:', response.data);
            fetchPropertyTaxData();
            setFormData({
                componentName: '',
                rateValue: '',
                calcValue: '',
                fyYear: '',
                isRateActive: '',
                createdBy: '',
                createdDate: '',
                updatedBy: '',
                updatedDate: '',
                suspendedStatus: '',
                municipalId: '',
            });
        } catch (error) {
            console.error('Error creating property tax component:', error);
            if (error.response) {
                console.error('Error response from server:', error.response.data);
            }
        }
    };

    return (
        <div>
            <h2>Property Tax Component Data:</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Component Name:
                    <input type="text" name="componentName" value={formData.componentName} onChange={handleInputChange} required />
                </label>
                <br />
                <label>
                    Rate Value:
                    <input type="text" name="rateValue" value={formData.rateValue} onChange={handleInputChange} required />
                </label>
                <br />
                {/* Add more fields as per your requirements */}
                
                <button type="submit">Create Property Tax Component</button>
            </form>

            {propertyTaxData ? (
                <table>
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
                        </tr>
                    </thead>
                    <tbody>
                        {propertyTaxData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.componentName}</td>
                                <td>{item.rateValue}</td>
                                <td>{item.calcValue}</td>
                                <td>{item.fyYear}</td>
                                <td>{item.isRateActive}</td>
                                <td>{item.createdBy}</td>
                                <td>{item.createdDate}</td>
                                <td>{item.updatedBy}</td>
                                <td>{item.updatedDate}</td>
                                <td>{item.suspendedStatus}</td>
                                <td>{item.municipalId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Propertytax;
