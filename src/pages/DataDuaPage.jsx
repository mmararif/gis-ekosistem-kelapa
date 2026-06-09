import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowExpanding,
} from '@tanstack/react-table';

const DataDuaPage = () => {
  const [activeTab, setActiveTab] = useState('kebun');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Untuk menangkap huruf yang diketik dan memasukkannya ke tabel(sementara)
  const handleInputChange = (fid, columnId, value) => {
    setData(oldData => 
      oldData.map(row => {
        if (row.fid === fid) {
          return { ...row, [columnId]: value};
        }
        return row;
      })
    );
  };

  const handleSimpanMassal = async () => {
    const currentRows = table.getRowModel().rows.map(row => row.original);

    if (currentRows.length === 0) return;

    try {

      const createPropertyXML = (name, value) => {

        if (value === '' || value === null || value === undefined) return '';

        const safeValue = String(value).replace(',', '.');
        
        return `
          <wfs:Property>
            <wfs:Name>${name}</wfs:Name>
            <wfs:Value>${safeValue}</wfs:Value>
          </wfs:Property>
        `;
      };

      const updatesXML = currentRows.map(rowData => {
        const propPanjang = createPropertyXML('panjang', rowData['panjang']);
        const propLebar = createPropertyXML('lebar', rowData['lebar']);
        const propMasalah = createPropertyXML('permasalahan', rowData['permasalahan']);

        if (!propPanjang && !propLebar && !propMasalah) return '';

        return `
          <wfs:Update typeName="risetids:Parit_Tanggul" xmlns:ogc="http://www.opengis.net/ogc">
            ${propPanjang}
            ${propLebar}
            ${propMasalah}
            <ogc:Filter>
              <ogc:FeatureId fid="${rowData.fid}"/>
            </ogc:Filter>
          </wfs:Update>
        `;
      }).join('');

      if (!updatesXML.trim()) {
        setIsEditMode(false);
        return;
      }
    
      // const updatesXML = currentRows.map(rowData => `
      //   <wfs:Update typeName="risetids:Parit_Tanggul">
      //     <wfs:Property>
      //       <wfs:Name>panjang</wfs:Name>
      //       <wfs:Value>$rowData['panjang'] || ''</wfs:Value>
      //     </wfs:Property>
      //     <wfs:Property>
      //       <wfs:Name>lebar</wfs:Name>
      //       <wfs:Value>$rowData['lebar'] || ''</wfs:Value>
      //     </wfs:Property>
      //     <wfs:Property>
      //       <wfs:Name>permasalahan</wfs:Name>
      //       <wfs:Value>$rowData['permasalahan'] || ''</wfs:Value>
      //     </wfs:Property>
      //     <ogc:Filter>
      //       <ogc:FeatureId fid="${rowData.fid}"/>
      //     </ogc:Filter>
      //   </wfs:Update>
      //   `).join('');

        const xmlBody = `
          <wfs:Transaction service="WFS" version="1.0.0" 
            xmlns:wfs="http://www.opengis.net/wfs"
            xmlns:ogc="http://www.opengis.net/ogc"
            xmlns:gml="http://www.opengis.net/gml"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            ${updatesXML}
          </wfs:Transaction>
        `;

        const response = await fetch('/geoserver/risetids/ows', {
          method: 'POST',
          headers: { 'Content-Type': 'text/xml'},
          body: xmlBody
        });

        const textResponse = await response.text();

        if (textResponse.includes('WFS_TransactionResponse') && textResponse.includes('SUCCESS')) {
          alert('Berhasil! Seluruh data di halaman ini telah tersimpan!');
          setIsEditMode(false);
        } else {
          alert('Gagal menyimpan data');
          console.log("Error dari Geoserver:", textResponse);
        }

    } catch (error) {
      console.error("Gagal melakukan transaksi WFS:", error);
    }
  }

  // saat tombol "simpan" ditekan
  // const handleSimpanBaris = async (rowData) => {
  //   // console.log("Data yang akan di-update:", rowData);
  //   // alert(`Berhasil mengunci data ${rowData.Nama}. (Koneksi ke Geoserver menyusul!)`);

  //   try {
  //     const xmlBody = `
  //       <wfs:Transaction service="WFS" version="1.0.0"
  //         xmlns:wfs="http://www.opengis.net/wfs"
  //         xmlns:ogc="http://www.opengis.net/ogc"
  //         xmlns:risetids="risetids">
  //         <wfs:Update typeName="risetids:Parit_Tanggul">

  //           <wfs:Property>
  //             <wfs:Name>panjang</wfs:Name>
  //             <wfs:Value>${rowData['panjang'] || ''}</wfs:Value>
  //           </wfs:Property>

  //           <wfs:Property>
  //             <wfs:Name>lebar</wfs:Name>
  //             <wfs:Value>${rowData['lebar'] || ''}</wfs:Value>
  //           </wfs:Property>

  //           <wfs:Property>
  //             <wfs:Name>permasalahan</wfs:Name>
  //             <wfs:Value>${rowData['permasalahan'] || ''}</wfs:Value>
  //           </wfs:Property>

  //           <ogc:Filter>
  //             <ogc:FeatureId fid="${rowData.fid}"/>
  //           </ogc:Filter>

  //         </wfs:Update>
  //       </wfs:Transaction>
  //     `;

  //     const response = await fetch('/geoserver/risetids/ows', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type' : 'text/xml',
  //       }, 
  //       body: xmlBody
  //     });

  //     const textResponse = await response.text();
  //     console.log("Respon dari Geoserver:", textResponse);

  //     if (textResponse.includes('WFS_TransactionResponse') && textResponse.includes('SUCCES')) {
  //       alert(`Berhasil! Data ${rowData.Nama} sudah masuk Database!`);
  //     } else {
  //       alert('Geoserver menolak transaksi!');
  //     }

  //     // if (response.ok) {
  //     //   alert(`Mantap Data ${rowData.Nama} berhasil diupdate ke PostgreSQL!`);
  //     // } else {
  //     //   alert('Waduh, gagal menyimpan data');
  //     // }

  //   } catch (error) {
  //     console.error("Gagal melakukan transaksi WFS-T:", error);
  //   }
  // };


  // 1. DAFTAR KOLOM UNTUK TAB KEBUN
  // accessorKey diambil LANGSUNG dari kodingan p["..."] temanmu!
  const columnsKebun = useMemo(() => [
    { header: 'No', id: 'index', cell: (info) => info.row.index + 1 }, // Nomor urut otomatis
    { header: 'Kecamatan', accessorKey: 'Kecamatan' },
    { header: 'Desa', accessorKey: 'Desa' },
    { header: 'Nama Pemilik', accessorKey: 'Nama Pemilik' },
    { header: 'Luas Lahan (Ha)', accessorKey: 'Luas Lahan (Ha)' },
    { header: 'Jumlah Pohon', accessorKey: 'Jumlah Pohon' },
    { header: 'Pola Budidaya', accessorKey: 'Pola Budidaya' },
  ], []);

  // 2. DAFTAR KOLOM UNTUK TAB PARIT
  const columnsParit = useMemo(() => {
    const cols = [
      { header: 'No', id: 'index', cell: (info) => info.row.index + 1 },
      { header: 'Nama Parit/Tanggul', accessorKey: 'Nama' },
      { header: 'Desa', accessorKey: 'Desa' },
      { header: 'Kecamatan', accessorKey: 'Kecamatan' },
      { header: 'Panjang (km)', 
        accessorKey: 'panjang',
        cell: ({ row, column }) => {
          return isEditMode ? (
            <input 
              type="text"
              value={row.original[column.id] || ''}
              onChange={(e) => handleInputChange(row.original.fid, column.id, e.target.value)}
              className='w-24 border border-[#1268A8] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1268A8]'
            />
          ) : row.original[column.id];
        }
      },
      { header: 'Lebar (m)', 
        accessorKey: 'lebar',
        cell: ({ row, column }) => {
          return isEditMode ? (
            <input 
              type="text"
              value={row.original[column.id] || ''}
              onChange={(e) => handleInputChange(row.original.fid, column.id, e.target.value)}
              className='w-24 border border-[#1268A8] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1268A8]'
            />
          ) : row.original[column.id];
        }
      },
      { header: 'Permasalahan', 
        accessorKey: 'permasalahan',
        cell: ({ row, column }) => {
          return isEditMode ? (
            <input 
              type="text"
              value={row.original[column.id] || ''}
              onChange={(e) => handleInputChange(row.original.fid, column.id, e.target.value)}
              className='w-24 border border-[#1268A8] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1268A8]'
            />
          ) : row.original[column.id];
        }
      },
    ];

    // if (isEditMode) {
    //   cols.push({
    //     header: 'Aksi',
    //     id: 'aksi',
    //     cell: ({ row }) => (
    //       <button 
    //         onClick={() => handleSimpanBaris(row.original)}
    //         className='bg-[#1268A8] hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold transition-colos'
    //       >
    //         Simpan
    //       </button>
    //     )
    //   });
    // }
    return cols;
  }, [isEditMode]);
    

  // 3. LOGIKA MEMILIH KOLOM (Berdasarkan Tab Aktif)
  // Inilah keajaiban React! Kita cukup mem-passing variabel ini ke TanStack
  const currentColumns = activeTab === 'kebun' ? columnsKebun : columnsParit;

  // 4. FUNGSI MENARIK DATA WFS GEOSERVER
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Menggunakan URL dan nama layer asli dari kodingan temanmu
        // const BASE_WFS_URL = "http://localhost:8080/geoserver/risetids/ows";
        // const BASE_WFS_URL = "https://bondless-phrasing-wispy.ngrok-free.dev/geoserver/risetids/ows";
        const BASE_WFS_URL = "/geoserver/risetids/ows";
        const layerName = activeTab === 'kebun' 
          ? 'risetids:Infrastruktur_Data_Spasial' 
          : 'risetids:Parit_Tanggul';

        const params = new URLSearchParams({
          service: 'WFS',
          version: '1.0.0',
          request: 'GetFeature',
          typeName: layerName,
          outputFormat: 'application/json'
        });

        const response = await fetch(`${BASE_WFS_URL}?${params.toString()}`, {
          method: 'GET',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const result = await response.json();

        // Ekstrak data properties-nya saja
        // const formattedData = result.features.map(feature => feature.properties);
        // setData(formattedData);

        const formattedData = result.features.map(feature => ({
          ...feature.properties,
          fid: feature.id 
        }));
        formattedData.sort((a, b) => {
          const idA = parseInt(a.fid.split('.')[1]) || 0;
          const idB = parseInt(b.fid.split('.')[1]) || 0;
          
          return idA - idB;
        });
        setData(formattedData);

        setGlobalFilter('');
        table.setPageIndex(0);

      } catch (error) {
        console.error("Gagal menarik data dari GeoServer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // 5. INISIALISASI TANSTACK TABLE
  const table = useReactTable({
    data,
    columns: currentColumns, // Memasukkan kolom yang sedang aktif
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    state: {
      sorting,
      globalFilter,
    }, 
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#f0f2f5] pt-28 px-8 pb-8 font-sans">
      <Navbar />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[85vh] flex flex-col">
        
        {/* BAGIAN TABS */}
        <div className="flex justify-between items-center border-b border-gray-200 mb-6 pb-2">
          <div className='flex gap-8'>
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

          <div className='flex items-center gap-4 mb-2'>
            {activeTab === 'parit' && (
              <>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all border ${
                    isEditMode
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      : 'bg-[#1268A8]/10 text-[#1268A8] border-[#1268A8]/20 hover:bg-[#1268A8]/20'
                  }`}
                >
                  {isEditMode ? 'Batal Edit' : 'Mode Edit'}
                </button>

                {isEditMode && (
                  <button
                    onClick={handleSimpanMassal}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-bold rounded-lg shadow-sm transition-all'
                  >
                    Simpan
                  </button>
                )}
              </>
            )}

            <div className='relative '>
              <input type="text" 
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder='Cari data...'
                className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1268a8]/50 transition-all w-64'
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          
        </div>

        {/* BAGIAN TABEL KAPSUL */}
        <div className="flex-1 mt-4 overflow-auto min-h-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-gray-400 font-bold">
              Memuat data dari GeoServer...
            </div>
          ) : (
            <table className="w-full min-w-max text-left text-sm text-gray-500 border-separate border-spacing-0">
              <thead className="font-semibold text-gray-600 sticky top-0 z-10 bg-white">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      const isFirst = index === 0;
                      const isLast = index === headerGroup.headers.length - 1;
                      return (
                        <th 
                          key={header.id} 
                          className={`px-6 py-4 bg-[#F0F2F5] whitespace-nowrap select-none cursor-pointer hover:bg-[#e4e7eb] transition-colors ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className='flex items-center gap-2'>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <span className='text-[#1268a8]'>▲</span>,
                              desc: <span className='text-[#1268a8]'>▼</span>,
                            }[header.column.getIsSorted()] ?? <span className='text-gray-300 opacity-0 group-hover:opacity-100'>▲</span>}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              
              <tbody className="bg-white">
                <tr><td colSpan={currentColumns.length} className="h-2"></td></tr>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 border-b border-gray-100 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Tampilkan pesan jika data kosong */}
                {data.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={currentColumns.length} className="text-center py-8 text-gray-400">
                      Data tidak ditemukan di server.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* paginatiaon */}
        {!isLoading && data.length > 0 && (
          <div className='mt-4 flex items-center justify-between border-t border-gray-100 pt-4 shrink-0'>
            <span className='text-sm text-gray-500 font-medium'>
              Menampilkan {table.getRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} data
            </span>
            <div className='flex items-center gap-2'>
              <button 
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className='w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowes transition-all'
              >
                ‹
              </button>

              <span className='text-sm font-bold text-[#1258a8] px-3'>
                Halaman {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()} 
                className='w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
              >
                ›
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DataDuaPage;