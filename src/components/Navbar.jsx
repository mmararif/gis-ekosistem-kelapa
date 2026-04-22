import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo_ybda_1.png'

const Navbar = () => {
    return (
        // kontainer utama navbar
        <div className='absolute top-4 left-0 right-0 z-50 px-4 md:px-8'>
            <nav className='bg-white/95 backdrop-blur-sm shadow-xl rounded-[25px] px-6 py-3 border border-neutral-100'>
                <div className='flex items-center justify-between gap-6'>
                    {/* Bagian kiri (logo dan judul) */}
                    <div className='flex items-center gap-2'>
                        <img src={logo} alt="logo ybda" className='max-w-30'/>
                    </div>
                    <div>
                        <h1 className='text-cl font-bold text-[#1072B1] leading-tight'>
                            🌴 WEBGIS Ekosistem Kelapa
                        </h1>
                    </div>
                    {/* Bagian Kanan link navbar */}
                    <div className='flex items-center gap-2'>
                        {[
                            { label: 'Peta', to: '/' },
                            { label: 'Data', to: '/data' },
                        ].map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.to}
                                // className='text-md font-semibold px-5 py-2.5 rounded-full transition-colors duration-200 ease-in-out text-neutral-700 hover:text-white hover:bg-teal-600'
                                className={({ isActive }) =>
                                    `text-sm font-semibold px-5 py-2.5 rounded-[13px] transition-all duration-200 ease-in-out ${
                                        isActive
                                        ? 'bg-[#1072B1] text-white shadow-md' // Style jika tab AKTIF
                                        : 'text-neutral-600 hover:text-[#1072B1] hover:shadow-sm' // Style jika tab TIDAK AKTIF
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;