import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { space } from "postcss/lib/list";

const DUMMY_DATA = [
    { id: '144826', nama: 'Budi Santoso', desa: 'Kuala Enok', luas: '2.5 Ha', status: 'Aktif' },
    { id: '144827', nama: 'Siti Aminah', desa: 'Pulau Burung', luas: '1.2 Ha', status: 'Pending' },
    { id: '144828', nama: 'Agus Salim', desa: 'Sungai Guntung', luas: '3.0 Ha', status: 'Aktif' },
    { id: '144829', nama: 'Rina Marlina', desa: 'Pelangiran', luas: '0.8 Ha', status: 'Non-Aktif' },
];

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('kebun');

    return (
        <div className="min-h-screen bg-[#f0f2f5] pt-28 px-8 pb-8 font-sans">

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 min-h-[80vh] flex flex-col">

                <Navbar/>

                {/* bagian tabs */}
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                    <button 
                        onClick={() => setActiveTab('kebun')}
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'kebun' ? 'text-[#1268A8]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Data Kebun Petani 
                        {activeTab === 'kebun' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1268A8] rounded-t-md"></span>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('parit')}
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'parit' ? 'text-[#1268A8]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Data Parit dan Tanggul
                        {activeTab === 'parit' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1268A8] rounded-t-md"></span>
                        )}
                    </button>
                </div>

                {/* bagian tabel */}
                <div className="flex-1">
                    {/* <div className="overflow-hidden rounded-xl border border-gray-100"> */}
                        <table className="w-full text-left text-sm text-gray-500 border-separate border-spacing-0">
                            <thead className="font-semibold text-gray-600">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-full bg-[#F0F2F5]">ID Data</th>
                                    <th className="px-6 py-4 bg-[#F0F2F5]">Nama Pemilik</th>
                                    <th className="px-6 py-4 bg-[#F0F2F5]">Desa / Kelurahan</th>
                                    <th className="px-6 py-4 bg-[#F0F2F5]">Luas Lahan</th>
                                    <th className="px-6 py-4 rounded-r-full bg-[#F0F2F5]">Status</th>
                                </tr>
                            </thead>
                            {/* <tbody className="divide-y divide-gray-100"> */}
                            <tbody className="bg-white">
                                <tr><td colSpan="6" className="h-2"></td></tr>
                                {DUMMY_DATA.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-5 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-700 border-b border-gray-200">{row.id}</td>
                                        <td className="px-6 py-4 border-b border-gray-200">{row.nama}</td>
                                        <td className="px-6 py-4 border-b border-gray-200">{row.desa}</td>
                                        <td className="px-6 py-4 border-b border-gray-200">{row.luas}</td>
                                        <td className="px-6 py-4 border-b border-gray-200">{row.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    {/* </div> */}
                </div>

                {/* BAGIAN PAGINATION (Di bawah tabel) */}
                <div className="mt-6 flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">‹</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#dcfce7] text-green-700 font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">3</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">›</button>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;