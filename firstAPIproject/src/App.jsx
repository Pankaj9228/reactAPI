import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import MunicipalMasterForm from './components/MunicipalMasterForm';
import PropertyTax from './components/PropertyTax';
import RandomUsers from './components/RandomUsers';
import RoadTypeNameUsers from './components/Road_type_nameUsers';
import TaxRateManager from './components/TaxRateManager';
import WardMaster from './components/WardMaster';

function App() {
    return (
        <Router>
            <div>
                <nav className="navapp">
                    <ul>
                        <li>
                            <Link to="/random-users">Zone Data</Link>
                        </li>
                        <li>
                            <Link to="/road-type-name-users">Road Type Name Users</Link>
                        </li>
                        <li>
                            <Link to="/property-tax">Property Tax</Link>
                        </li>
                        <li>
                            <Link to="/ward-master">Ward Master</Link>
                        </li>
                        <li>
                            <Link to="/tax-rate-manager">Tax Rate Manager</Link>
                        </li>
                        <li>
                            <Link to="/municipal-master-form">Municipal Master Form</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/random-users" element={<RandomUsers />} />
                    <Route path="/road-type-name-users" element={<RoadTypeNameUsers />} />
                    <Route path="/property-tax" element={<PropertyTax/>}/>
                    <Route path="/ward-master" element={<WardMaster/>}/>
                    <Route path="/tax-rate-manager" element={<TaxRateManager/>}/>
                    <Route path="/municipal-master-form" element={<MunicipalMasterForm/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
