// import { FlatESLint } from 'eslint/use-at-your-own-risk';
import react, {useState} from 'react';
import { LAYER_CONFIG } from '../pages/MapPage';

const LayerPanel = ({ activeLayers, onToggle }) => {
    
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className='bg-[#1268A8] hover:bg[#0e5285] text-white px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ease-in-out cursor-pointer'
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="font-bold text-lg tracking-wide">Layer</span>
                </button>
            ) : (
                <div className="bg-[#1268A8] text-white p-3 rounded-xl shadow-2xl w-80 flex flex-col max-h-[40vh] transition-all duration-300 ease-in-out"> 
                    <div className='flex justify-center items-center py-6 px-6 relative border-b border-white/20 hover:text-gray-200 shrink-0'>
                        <h3 className='font-bold text-xl tracking-wide'>Layer</h3>
                        <button 
                            className='absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all duration-200'
                            onClick={() => setIsOpen(false)}
                            title='Klik untuk menutup'
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* daftar checkbox */}
                    <div className="flex flex-col gap-4 p-6 flex-1 overflow-y-auto">
                        {LAYER_CONFIG.map((layer) => (
                            <label key={layer.id} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={activeLayers[layer.id]}
                                    onChange={() => onToggle(layer.id)}
                                    className="w-5 h-5 rounded border-2 border-white bg-transparent checked:bg-white checked:text-[#1268A8] cursor-pointer focus:ring-0" 
                                />
                                <span className="text-sm font-medium group-hover:text-gray-200 transition-colors">
                                    {layer.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

};

export default LayerPanel;