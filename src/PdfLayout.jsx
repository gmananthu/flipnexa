"use client"
import React from 'react'
import dynamic from 'next/dynamic';
import AuthNavbar from '@/components/navbar/authnavbar/AuthNavbar';
import appConfig from '@/config/appConfig';
import Image from 'next/image';
import Link from 'next/link';
// import PdfViewer from '../PdfViewer'
// Dynamically import PdfViewer with a custom loading component
// const PdfViewer = dynamic(() => import('../testonlyroot/catalogue/PdfViewer'), {
//     ssr: false, // Ensure the component is only rendered on the client
//     loading: () => <p>Loading PDF Viewer...</p>, // Optional loading placeholder
// });
const MyPdfViewer = dynamic(() => import('../testonlyroot/catalogue/PdfViewerPro'), {
    ssr: false, // Ensure the component is only rendered on the client
    loading: () => <p>Loading PDF Viewer...</p>, // Optional loading placeholder
});

const PdfLayout = () => {
    const imageUrl = appConfig.server.imageUrl;
    return (
        <div className='h-full flex mt-[40px] md:mt-[50px]' style={{ minHeight: 'calc(100vh - 50px)' }}>
            <div className="p-3 shadow-sm mb-2 fixed top-0 left-0 right-0 bg-white z-10">
                <Link href="/">
                    <div className="hidden md:block">
                        <Image src={imageUrl + '/images/company_logo.svg'} alt="logo" width={190} height={52} />
                    </div>
                    <div className=" md:hidden">
                        <Image src={imageUrl + '/images/company_logo_mobile.png'} alt="logo" width={154} height={36} />
                    </div>
                </Link>
            </div>
            <MyPdfViewer />
            {/* <PdfViewer /> */}
        </div>
    )
}

export default PdfLayout