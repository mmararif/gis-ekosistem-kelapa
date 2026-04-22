import React, { useState } from "react";
import { LAYER_CONFIG, GEOSERVER_URL } from "../pages/MapPage";

const LegendPanel = ({ activeLayers }) => {

    const [isMinimized, setIsMinimized] = useState(false);

    const activeLayerConfigs = LAYER_CONFIG.filter(layer => activeLayers[layer.id]);
    
    if (activeLayerConfigs.length === 0) return null;

    return (

        // <div className="absolute bottom-8 right-8 z-[1000] bg-white rounded-xl shadow-2xl w-80 max-h-[20vh] overflow-y-auto p-5">
        <div className="bg-white rounded-xl shadow-2xl w-80 flex flex-col transition-all duration-300 max-h-[25vh]">
            
            <div 
                className="flex justify-between items-center px-6 pt-3 pb-4 cursor-pointer hover:bg-gray-50 rounded-t-xl border-b border-gray-100 shrink-0"
                onClick={() => setIsMinimized(!isMinimized)}
            >
                <h3 className="font-bold text-lg text-gray-800">Legenda</h3>
                <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {!isMinimized && (
                <div className="flex flex-col gap-3 px-6 pb-6 flex-1 overflow-y-auto">
                    {activeLayerConfigs.map(layer => {
                        const legendUrl = `${GEOSERVER_URL}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LEGEND_OPTIONS=forceLabels:on;fontSize:12&LAYER=${layer.wsName}`;

                        return (
                            <div key={layer.id} >
                                <h4 className="text-sm font-semibold text-[#1268A8]">{layer.name}</h4>
                                <img 
                                    src={legendUrl} 
                                    alt={`Legenda ${layer.name}`} 
                                    className="max-w-full object-contain"
                                    // Antisipasi jika GeoServer gagal mengirim gambar
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )
                    })}
                </div>
            )}

        </div>

    )
    
}

export default LegendPanel;