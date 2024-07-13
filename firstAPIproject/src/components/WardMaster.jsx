import React, { useEffect, useState } from 'react';

const WardMaster = () => {
  const [wards, setWards] = useState([]);
  const [wardNo, setWardNo] = useState('');
  const [wardId, setWardId] = useState('');
  const [newWard, setNewWard] = useState({ wardNo: '' });
  const [updateWard, setUpdateWard] = useState({ id: '', wardNo: '' });
  const [suspendedStatus, setSuspendedStatus] = useState({ id: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = () => {
    fetch('http://192.168.29.245:8085/muncipal/api/getAllWards')
      .then(response => response.json())
      .then(data => {
        setWards(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  const createWard = () => {
    fetch('http://192.168.29.245:8085/muncipal/api/zoneWard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWard)
    })
    .then(response => response.json())
    .then(data => {
      setShowForm(false);
      fetchWards();
    })
    .catch(error => console.error('Error:', error));
  };

  const searchByWardNo = () => {
    fetch(`http://192.168.29.245:8085/muncipal/api/wardNo?wardNo=${wardNo}`)
      .then(response => response.json())
      .then(data => {
        setWards(data ? [data] : []);
      })
      .catch(error => console.error('Error:', error));
  };

  const getById = () => {
    fetch(`http://192.168.29.245:8085/muncipal/api/zoneWard/${wardId}`)
      .then(response => response.json())
      .then(data => {
        setWards(data ? [data] : []);
      })
      .catch(error => console.error('Error:', error));
  };

  const updateById = () => {
    fetch(`http://192.168.29.245:8085/muncipal/api/update/${updateWard.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateWard)
    })
    .then(response => response.json())
    .then(data => {
      setShowUpdateForm(false);
      fetchWards();
    })
    .catch(error => console.error('Error:', error));
  };

  const changeSuspendedStatus = (id, status) => {
    fetch(`http://192.168.29.245:8085/muncipal/api/ward/suspendedStatus/${id}?suspendedStatus=${status}`, {
      method: 'PATCH'
    })
    .then(response => response.json())
    .then(data => {
      fetchWards();
    })
    .catch(error => console.error('Error:', error));
  };

  const handleUpdate = (ward) => {
    setUpdateWard(ward);
    setShowUpdateForm(true);
  };

  return (
    <div>
      <h1>Ward Management</h1>

      <div>
        <h2>Search Ward by Ward No</h2>
        <input type="text" placeholder="Ward No" onChange={e => setWardNo(e.target.value)} />
        <button onClick={searchByWardNo}>Search</button>
      </div>

      <div>
        <h2>Get Ward by ID</h2>
        <input type="text" placeholder="Ward ID" onChange={e => setWardId(e.target.value)} />
        <button onClick={getById}>Get</button>
      </div>

      <button onClick={() => setShowForm(true)}>Create Ward</button>
      {showForm && (
        <div>
          <h2>Create Ward</h2>
          <input type="text" placeholder="Ward No" onChange={e => setNewWard({ ...newWard, wardNo: e.target.value })} />
          <button onClick={createWard}>Create</button>
        </div>
      )}

      {showUpdateForm && (
        <div>
          <h2>Update Ward</h2>
          <input type="hidden" value={updateWard.id} />
          <input type="text" placeholder="Ward No" value={updateWard.wardNo} onChange={e => setUpdateWard({ ...updateWard, wardNo: e.target.value })} />
          <button onClick={updateById}>Update</button>
        </div>
      )}

      <h2>List of Wards</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && (
        <table border="1">
          <thead>
            <tr>
              <th>Ward No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wards.map(ward => (
              <tr key={ward.id}>
                <td>{ward.wardNo}</td>
                <td>
                  <button onClick={() => handleUpdate(ward)}>Update</button>
                  <button onClick={() => changeSuspendedStatus(ward.id, ward.suspendedStatus === '0' ? '1' : '0')}>
                    {ward.suspendedStatus === '0' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WardMaster;
