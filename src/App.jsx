import React, { useState } from 'react';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import './App.css'; // Memanggil file CSS yang baru kita buat
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import DataPage from './pages/DataPage';
import DataDuaPage from './pages/DataDuaPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MapPage/>}/>
        {/* <Route path='/data' element={<DashboardPage/>} /> */}
        {/* <Route path='/data' element={<DataPage/>} /> */}
        <Route path='/data' element={<DataDuaPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;