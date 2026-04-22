import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const DataPage = () => {

    const [activeTab, setActiveTab] = useState('kebun');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const columnsKebun = useMemo(() => [
        { header: 'No', id: 'index', cell: (info) => info.row.index + 1 },
        { header: 'Kecamatan', accessorKey: 'Kecamatan' },
        { header: 'Desa', accessorKey: 'Desa' },
        { header: 'Nama Pemilik', accessorKey: 'Nama Pemilik' },
        { header: 'Luas Lahan (Ha)', accessorKey: 'Luas Lahan (Ha)' },
        { header: 'Jumlah Pohon', accessorKey: 'Jumlah Pohon' },
        { header: 'Pola Budidaya', accessorKey: 'Pola Budidaya' },
    ], []);

    const columnsParit = useMemo(() => [
        { header: 'No', id: 'index', cell: (info) => info.row.index + 1 },
        { header: 'Nama Parit/Tanggul', accessorKey: 'Nama' },
        { header: 'Desa', accessorKey: 'Desa' },
        { header: 'Kecamatan', accessorKey: 'Kecamatan' },
        { header: 'Panjang (km)', accessorKey: 'Panjang Parit/Tanggul (km)' },
        { header: 'Lebar (m)', accessorKey: 'Lebar Parit/Tanggul (m)' },
        { header: 'Permasalahan', accessorKey: 'Permasalahan' },
    ], []);

    const currentColumns = activeTab === 'kebun' ? columnsKebun : columnsParit;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const BASE_WFS_URL = "http://localhost:8080/geoserver/risetids/ows";

                const layername = activeTab === 'kebun' ? 'risetids:Infrastruktur_Data_Spasial' : 'risetids:Parit_Tanggul';

                const params = new URLSearchParams({
                    service: 'WFS',
                    version: '1.0.0',
                    request: 'GetFeature',
                    typeName: layername,
                    outputFormat: 'application/json'
                });

                const response = await fetch (`${BASE_WFS_URL}?${params.toString()}`);
                const result = await response.json();

                const formattedData = result.features.map((feature, index) => ({
                    ...feature.properties,
                    id_data: feature.properties.id ||   `1448${index}`,
                }));

                setData(formattedData);
            } catch (error) {
                console.error("Gagal menarik data dari Geoserver:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [activeTab]);

    const table = useReactTable({
        data,
        columns: currentColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="min-h-screen bg-[#f0f2f5] pt-28 px-8 pb-8 font-sans">
            <Navbar />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[85vh] flex flex-col">
                
                {/* BAGIAN TABS */}
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('kebun')}
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'kebun' ? 'text-[#1268A8]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Data Kebun Petani
                        {activeTab === 'kebun' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1268A8] rounded-t-md"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('parit')}
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'parit' ? 'text-[#1268A8]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Data Parit dan Tanggul
                        {activeTab === 'parit' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1268A8] rounded-t-md"></span>}
                    </button>
                </div>

                {/* BAGIAN TABEL */}
                <div className="flex-1 mt-4 overflow-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64 text-gray-400 font-bold">
                    Memuat data dari GeoServer...
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-500 border-separate border-spacing-0">
                    {/* RENDER HEADER OTOMATIS DARI TANSTACK */}
                    <thead className="font-semibold text-gray-600 sticky top-0 z-10 bg-white">
                        {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header, index) => {
                            // Logika melengkungkan kolom ujung kiri dan kanan
                            const isFirst = index === 0;
                            const isLast = index === headerGroup.headers.length - 1;
                            return (
                                <th 
                                key={header.id} 
                                className={`px-6 py-4 bg-[#F0F2F5] whitespace-nowrap ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`}
                                >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            );
                            })}
                        </tr>
                        ))}
                    </thead>
                    
                    {/* RENDER BODY OTOMATIS DARI TANSTACK */}
                    <tbody className="bg-white">
                        <tr><td colSpan={currentColumns.length} className="h-2"></td></tr>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                {row.getVisibleCells().map((cell, index) => {
                                const isLast = index === row.getVisibleCells().length - 1;
                                return (
                                    <td key={cell.id} className={`px-6 py-4 border-b border-gray-100 ${isLast ? 'text-center' : ''}`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                );
                                })}
                            </tr>
                        ))}
                        {data.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={currentColumns.length} className="text-center py-8 text-gray-400">
                                    Data tidak ditemukan di Server
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                )}
                </div>
            </div>
        </div>
    );
}

export default DataPage;