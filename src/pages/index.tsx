import { Fragment } from 'react';
import Link from 'next/link';

export default function HomePage() {
    return (
      <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('../../frontPageBG.png')" }}></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="absolute top-6 left-6 flex items-center">
            <p className="font-inter font-bold text-white">TRAVELBLOG</p>
            <div className="h-4 w-4 bg-[#7FA4EE] rounded-full ml-2"></div>
          </div>
          <div className='mt-12 mb-12'></div>
          <div className='items-center mt-12 w-1/2 mx-auto '>
            <h2 className="text-white mt-5 text-5xl font-bold w-1/2">EXPLORE THE PHILIPPINES</h2>
            <p className="text-white text-sm mt-4">Welcome to Explore the Philippines, your ultimate guide to discovering the beauty, culture, and wonders of this tropical paradise. From pristine beaches and lush jungles to vibrant cities and rich cultural heritage, the Philippines offers a diverse array of experiences just waiting to be explored.</p>
            <div className="flex mt-8 items-center">
                <Link href="/login">
                <button className="bg-[#234F91] text-white font-bold py-2 px-6 rounded-full flex">
                    Get Started
                    <span className="ml-12 text-xs" style={{ fontSize: '2rem' }}>&#8250;</span>
                </button>
                </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
