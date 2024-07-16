import React, { useEffect, useState } from 'react';

const TaxRatesComponent = () => {
    const [taxRates, setTaxRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRate, setNewRate] = useState({
        zoneId: 2,
        propUsesType: 3,
        constructionType: 4,
        constructionAge: 5,
        roadTypeId: 6,
        rateValue: 10.5,
        fyYear: '2023',
        municipalId: 1
    });
    const [searchId, setSearchId] = useState('');
    const [searchedRate, setSearchedRate] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://192.168.29.245:8085/muncipal/api/taxrates/all');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            setTaxRates(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://192.168.29.245:8085/muncipal/api/taxrates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRate)
            });
            if (!response.ok) {
                throw new Error('Failed to create tax rate');
            }
            const createdRate = await response.json();
            console.log('Created tax rate:', createdRate);
            setTaxRates([...taxRates, createdRate]);
            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating tax rate:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://192.168.29.245:8085/muncipal/api/taxrates/delete/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete tax rate');
            }
            console.log('Tax rate deleted successfully');
            // Filter out the deleted tax rate from the state
            setTaxRates(taxRates.filter(rate => rate.id !== id));
        } catch (error) {
            console.error('Error deleting tax rate:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://192.168.29.245:8085/muncipal/api/taxrates/${searchId}`);
            if (!response.ok) {
                throw new Error('Tax rate not found');
            }
            const data = await response.json();
            console.log('Searched tax rate:', data);
            setSearchedRate(data);
        } catch (error) {
            console.error('Error searching tax rate:', error);
            setSearchedRate(null);
        }
    };

    const handleChange = (e) => {
        setSearchId(e.target.value);
    };

    const resetForm = () => {
        setNewRate({
            zoneId: 2,
            propUsesType: 3,
            constructionType: 4,
            constructionAge: 5,
            roadTypeId: 6,
            rateValue: 10.5,
            fyYear: '2023',
            municipalId: 1
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching data: {error.message}</div>;
    }

    return (
        <div className="container">
            <h2>Tax Rates Management</h2>
            <div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>Create Tax Rate</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <label>Zone ID:</label>
                    <input type="text" value={newRate.zoneId} onChange={(e) => setNewRate({ ...newRate, zoneId: e.target.value })} />
                    <label>Property Use Type:</label>
                    <input type="text" value={newRate.propUsesType} onChange={(e) => setNewRate({ ...newRate, propUsesType: e.target.value })} />
                    <label>Construction Type:</label>
                    <input type="text" value={newRate.constructionType} onChange={(e) => setNewRate({ ...newRate, constructionType: e.target.value })} />
                    <label>Construction Age:</label>
                    <input type="text" value={newRate.constructionAge} onChange={(e) => setNewRate({ ...newRate, constructionAge: e.target.value })} />
                    <label>Road Type ID:</label>
                    <input type="text" value={newRate.roadTypeId} onChange={(e) => setNewRate({ ...newRate, roadTypeId: e.target.value })} />
                    <label>Rate Value:</label>
                    <input type="text" value={newRate.rateValue} onChange={(e) => setNewRate({ ...newRate, rateValue: e.target.value })} />
                    <label>FY Year:</label>
                    <input type="text" value={newRate.fyYear} onChange={(e) => setNewRate({ ...newRate, fyYear: e.target.value })} />
                    <label>Municipal ID:</label>
                    <input type="text" value={newRate.municipalId} onChange={(e) => setNewRate({ ...newRate, municipalId: e.target.value })} />
                    <button className="btn btn-success" type="submit">Create Tax Rate</button>
                </form>
            )}

            <h2>Search Tax Rate by ID</h2>
            <div>
                <input type="text" value={searchId} onChange={handleChange} />
                <button className="btn btn-info" onClick={handleSearch}>Search</button>
            </div>

            {searchedRate && (
                <div>
                <h3>Searched Tax Rate</h3>
                <table border="1" cellpadding="5" cellspacing="0">
                    <tr>
                        <th>ID</th>
                        <td>{searchedRate.id}</td>
                    </tr>
                    <tr>
                        <th>Zone ID</th>
                        <td>{searchedRate.zoneId}</td>
                    </tr>
                    <tr>
                        <th>Property Use Type</th>
                        <td>{searchedRate.propUsesType}</td>
                    </tr>
                    <tr>
                        <th>Construction Type</th>
                        <td>{searchedRate.constructionType}</td>
                    </tr>
                    <tr>
                        <th>Construction Age</th>
                        <td>{searchedRate.constructionAge}</td>
                    </tr>
                    <tr>
                        <th>Road Type ID</th>
                        <td>{searchedRate.roadTypeId}</td>
                    </tr>
                    <tr>
                        <th>Rate Value</th>
                        <td>{searchedRate.rateValue}</td>
                    </tr>
                    <tr>
                        <th>FY Year</th>
                        <td>{searchedRate.fyYear}</td>
                    </tr>
                    <tr>
                        <th>Municipal ID</th>
                        <td>{searchedRate.municipalId}</td>
                    </tr>
                </table>
            </div>
            
            
            
            )}

            <h2>All Tax Rates</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Zone ID</th>
                        <th>Property Use Type</th>
                        <th>Construction Type</th>
                        <th>Construction Age</th>
                        <th>Road Type ID</th>
                        <th>Rate Value</th>
                        <th>FY Year</th>
                        <th>Municipal ID</th>
                        <th align="center">Edit</th>
                        <th align="center">View</th>
                        <th align="center">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {taxRates.map(rate => (
                        <tr key={rate.id}>
                            <td>{rate.id}</td>
                            <td>{rate.zoneId}</td>
                            <td>{rate.propUsesType}</td>
                            <td>{rate.constructionType}</td>
                            <td>{rate.constructionAge}</td>
                            <td>{rate.roadTypeId}</td>
                            <td>{rate.rateValue}</td>
                            <td>{rate.fyYear}</td>
                            <td>{rate.municipalId}</td>
                            <td align="center"><button className="btn btn-info btn-xs" title="EDIT">EDIT</button></td>
                            <td align="center"><button className="btn btn-primary btn-xs" title="VIEW">VIEW</button></td>
                            <td align="center"><button className="btn btn-danger btn-xs" onClick={() => handleDelete(rate.id)} title="DELETE">DELETE</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaxRatesComponent;
