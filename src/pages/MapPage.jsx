import React, { useState } from "react";
import { MapContainer, TileLayer, WMSTileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import Navbar from "../components/Navbar";
import LayerPanel from "../components/LayerPanel";
import LegendPanel from '../components/LegendPanel';

export const LAYER_CONFIG = [
    { id: 'layerAdm', name: 'Batas Administrasi Kecamatan', wsName: 'risetids:Batas_Administrasi_Kecamatan-LN' },
    { id: 'layerAdmDesa', name: 'Batas Administrasi Desa', wsName: 'risetids:Batas Administrasi Desa-LN' },
    { id: 'layerKab', name: 'Kabupaten Indragiri Hilir', wsName: 'risetdids:Kab.Indragiri_Hilir-2' },
    { id: 'layerSungai', name: 'Sungai Indragiri Hilir', wsName: 'risetids:Sungai_Indragiri_Hilir' },
    { id: 'layerTanah', name: 'Jenis Tanah', wsName: 'risetids:Jenis_Tanah_INHIL' },
    { id: 'layerKelapa', name: 'Sebaran Perkebunan Kelapa', wsName: 'risetids:Sebaran_Kebun_Kelapa' },
    { id: 'layerDem', name: 'Demnas', wsName: 'risetids:Demnas_Clip-2' },
    { id: 'layerLahan', name: 'Tutupan Lahan', wsName: 'risetids:Tutupan_Lahan' },
    { id: 'layerParit', name: 'Parit dan Tanggul', wsName: 'risetids:Parit_Tanggul' },
];

// export const GEOSERVER_URL = "http://localhost:8080/geoserver/risetids/wms";
// export const GEOSERVER_URL = "https://bondless-phrasing-wispy.ngrok-free.dev/geoserver/risetids/wms";
export const GEOSERVER_URL = "/geoserver/risetids/wms";

const MapPage = () => {

    const [activeLayers, setActiveLayers] = useState({
        layerKab: false,
        layerAdm: false,
        layerAdmDesa: false,
        layerSungai: false,
        layerTanah: false,
        layerKelapa: false,
        layerDem: false,
        layerLahan: false,
        layerParit: false
    });

    const handleToggleLayer = (layerId) => {
        setActiveLayers((prev) => ({
            ...prev,
            [layerId]: !prev[layerId]
        }));
    };


    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <Navbar />

            <div className="absolute top-24 right-8 bottom-8 z-[1000] flex flex-col justify-between items-end pointer-events-none">
                <div className="pointer-events-auto">
                    <LayerPanel 
                        activeLayers={activeLayers}
                        onToggle={handleToggleLayer}
                    />
                </div>
                <div className="pointer-events-auto">
                    <LegendPanel activeLayers={activeLayers} />
                </div>
            </div>

            

            

            {/* Kontainer peta */}
            <div className="absolute inset-0 z-10 h-full w-full">
                <MapContainer
                    center={[-0.4, 103.2]}
                    zoom={8}
                    className="h-full w-full"
                    zoomControl={false}
                >
                    <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {LAYER_CONFIG.map((layer) => (
                        activeLayers[layer.id] && (
                            <WMSTileLayer 
                                key={layer.id}
                                url={GEOSERVER_URL}
                                layers={layer.wsName}
                                format="image/png"
                                transparent={true}
                            />
                        )
                    ))};
                </MapContainer>

            </div>
        </div>
    );
};

export default MapPage;