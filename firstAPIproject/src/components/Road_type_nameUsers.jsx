import React, { useEffect, useState } from 'react';

const RoadTypeDropdown = () => {
    const [roadTypes, setRoadTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoadType, setSelectedRoadType] = useState('');
    const [newRoadType, setNewRoadType] = useState(''); // State for new road type input

    useEffect(() => {
        fetchActiveRoadTypes();
    }, []);

    // Fetch all active road types
    const fetchActiveRoadTypes = async () => {
      try {
          const response = await fetch('http://192.168.29.245:8085/muncipal/api/roadtypes/active');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Fetched road types:', data); // Log the fetched data
          setRoadTypes(data);
          setLoading(false);
      } catch (error) {
          console.error('Error fetching active road types:', error);
          setLoading(false);
      }
  };
  

    // Handle road type selection change
    const handleRoadTypeChange = (event) => {
        setSelectedRoadType(event.target.value);
    };

    // Handle new road type input change
    const handleNewRoadTypeChange = (event) => {
        setNewRoadType(event.target.value);
    };

    // Create a new road type
    const createRoadType = async () => {
        if (!newRoadType.trim()) {
            console.error('Road type name is empty');
            return;
        }

        try {
            const response = await fetch('http://192.168.29.245:8085/muncipal/api/roadtypes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roadTypeName: newRoadType // Use the new road type input value
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create road type: ${errorText}`);
            }

            console.log('Road type created successfully');
            setNewRoadType(''); // Clear the input field after successful creation
            fetchActiveRoadTypes(); // Refresh the dropdown after creating a new road type
        } catch (error) {
            console.error('Error creating road type:', error);
        }
    };

    // Delete road type by ID
    const deleteRoadType = async (id) => {
        try {
            const response = await fetch(`http://192.168.29.245:8085/muncipal/api/roadtypes/delete/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete road type');
            }
            // Refresh road types after deletion
            fetchActiveRoadTypes();
        } catch (error) {
            console.error(`Error deleting road type with ID ${id}:`, error);
        }
    };

    // Render loading message while fetching data
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {/* Dropdown to select road type */}
            <label htmlFor="roadTypeSelect">Select Road Type:</label>
            <select id="roadTypeSelect" value={selectedRoadType} onChange={handleRoadTypeChange}>
                <option value="">Select a road type...</option>
                {roadTypes.map((roadType) => (
                    <option key={roadType.id} value={roadType.id}>
                        {roadType.roadTypeName} {/* Assuming 'roadTypeName' is the correct field */}
                    </option>
                ))}
            </select>

            {/* Input field for new road type */}
            <label htmlFor="newRoadTypeInput">New Road Type:</label>
            <input
                id="newRoadTypeInput"
                type="text"
                value={newRoadType}
                onChange={handleNewRoadTypeChange}
            />

            {/* Button to create a new road type */}
            <button onClick={createRoadType}>Create Road Type</button>

            {/* Button to delete selected road type */}
            <button onClick={() => deleteRoadType(selectedRoadType)}>Delete Road Type</button>
        </div>
    );
};

export default RoadTypeDropdown;
