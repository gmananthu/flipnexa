import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';

// Load worker natively via Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const PdfPageItem = React.forwardRef(({ pageNumber, isNearby, pageWidth }, ref) => {
    return (
        <div ref={ref} className="page bg-white shadow-xl flex items-center justify-center overflow-hidden border-r border-gray-200/50">
            <div className="w-full h-full flex justify-center items-center pointer-events-none bg-white">
                {isNearby ? (
                    <Page
                        pageNumber={pageNumber}
                        width={pageWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={
                            <div className="flex items-center justify-center h-full w-full">
                                <div className="h-8 w-8 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        }
                    />
                ) : (
                    <div className="flex items-center justify-center h-full w-full bg-white">
                        <span className="text-gray-300">Loading Page...</span>
                    </div>
                )}
            </div>
        </div>
    );
});

const PdfViewer = ({ pdfUrl }) => {
    const navigate = useNavigate();
    const [numPages, setNumPages] = useState(null);
    const [pageDimensions, setPageDimensions] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); 
    const [scale, setScale] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showGridView, setShowGridView] = useState(false);
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    const bookRef = useRef(null);
    const containerRef = useRef(null);
    const pageWrapperRef = useRef(null);

    const onDocumentLoadSuccess = (pdf) => {
        setNumPages(pdf.numPages);
        // Get natural dimensions from the first page
        pdf.getPage(1).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            setPageDimensions({ width: viewport.width, height: viewport.height });
            
            // Auto-scale to fit window
            const screenHeight = window.innerHeight;
            const targetHeight = screenHeight * 0.8;
            let initialScale = targetHeight / viewport.height;
            
            // Limit minimum and maximum zoom
            setScale(Math.min(1.5, Math.max(0.4, initialScale)));
        });
    };

    const goToNextPage = (e) => {
        if (e) e.stopPropagation();
        if (bookRef.current) {
            bookRef.current.pageFlip().flipNext();
        }
    };

    const goToPrevPage = (e) => {
        if (e) e.stopPropagation();
        if (bookRef.current) {
            bookRef.current.pageFlip().flipPrev();
        }
    };

    const onPage = (e) => {
        setCurrentPage(e.data);
    };

    const zoomIn = () => setScale((prev) => Math.min(3.0, prev * 1.2));
    const zoomOut = () => setScale((prev) => Math.max(0.3, prev / 1.2));

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            const element = containerRef.current;
            if (!element) return;
            try {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else {
                    setIsFullscreen(true);
                }
            } catch (error) {
                setIsFullscreen(true);
            }
        } else {
            try {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else {
                    setIsFullscreen(false);
                }
            } catch (error) {
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isDocumentFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            setIsFullscreen(isDocumentFullscreen);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    // Panning / Dragging Logic
    const startDrag = (e) => {
        // Only allow dragging if we are significantly zoomed in
        if (scale > 0.8) {
            setIsDragging(true);
            setDragStartX(e.clientX - translateX);
            setDragStartY(e.clientY - translateY);
        }
    };

    const onDrag = (e) => {
        if (isDragging && scale > 0.8) {
            setTranslateX(e.clientX - dragStartX);
            setTranslateY(e.clientY - dragStartY);
        }
    };

    const endDrag = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        // When page changes, reset position slightly or completely if needed
        // setTranslateX(0); setTranslateY(0); 
    }, [currentPage]);

    useEffect(() => {
        const handleMouseUp = () => {
            if (isDragging) endDrag();
        };
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [isDragging]);

    const handleWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }
    };

    const toggleGridView = () => setShowGridView(!showGridView);
    
    const handleGridItemClick = (pageNum) => {
        if (bookRef.current) {
            bookRef.current.pageFlip().turnToPage(pageNum - 1);
        }
        setShowGridView(false);
    };

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col bg-zinc-900 text-white overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'h-screen w-full'}`}
        >
            {showGridView ? (
                // Grid View
                <div className="flex-grow overflow-auto p-4 bg-zinc-900">
                    <div className="mb-4 flex justify-between items-center text-white">
                        <h2 className="text-xl font-bold">Pages Grid</h2>
                        <button onClick={toggleGridView} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: numPages || 0 }, (_, i) => i + 1).map((pageNum) => (
                            <div
                                key={`grid-${pageNum}`}
                                className="cursor-pointer transition-all transform hover:scale-105 bg-white shadow rounded-lg overflow-hidden flex flex-col"
                                onClick={() => handleGridItemClick(pageNum)}
                            >
                                <div className="aspect-[0.7] flex items-center justify-center bg-gray-100 p-2">
                                     <Document file={pdfUrl} loading={null}>
                                         <Page
                                             pageNumber={pageNum}
                                             width={120}
                                             renderTextLayer={false}
                                             renderAnnotationLayer={false}
                                             loading={<div className="h-4 w-4 border-2 border-t-blue-500 rounded-full animate-spin"></div>}
                                         />
                                     </Document>
                                </div>
                                <div className="p-2 text-center text-sm text-gray-800 font-medium border-t">{pageNum}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Book View
                <>
                    <div 
                        className="flex-grow overflow-hidden relative flex items-center justify-center"
                        onWheel={handleWheel}
                    >
                        {/* Top Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute left-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/80 z-20 transition shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>

                        {/* Navigation Arrows */}
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 0}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/50 transition shadow-lg ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/80 hover:scale-110'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <button
                            onClick={goToNextPage}
                            disabled={numPages && currentPage >= numPages - 1}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/50 transition shadow-lg ${numPages && currentPage >= numPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/80 hover:scale-110'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Document Container */}
                        <div 
                            className="relative transition-transform ease-out duration-200"
                            ref={pageWrapperRef}
                            style={{
                                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                                cursor: scale > 0.8 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                            }}
                            onMouseDown={startDrag}
                            onMouseMove={onDrag}
                            onMouseUp={endDrag}
                            onMouseLeave={endDrag}
                        >
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="flex flex-col items-center justify-center h-[600px] w-[800px] bg-white/5 rounded-xl border border-white/10">
                                        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-xl text-gray-300 font-medium">Loading Book...</p>
                                    </div>
                                }
                            >
                                {numPages && pageDimensions && (
                                    <HTMLFlipBook
                                        width={pageDimensions.width}
                                        height={pageDimensions.height}
                                        size="fixed"
                                        minWidth={315}
                                        maxWidth={1500}
                                        minHeight={400}
                                        maxHeight={2000}
                                        maxShadowOpacity={0.5}
                                        showCover={true}
                                        autoCenter={true} // Horizontally centers the book!
                                        usePortrait={false} // Force 2-page view always
                                        mobileScrollSupport={true}
                                        onFlip={onPage}
                                        className="flipbook-demo shadow-2xl"
                                        ref={bookRef}
                                    >
                                        {Array.from(new Array(numPages), (el, index) => {
                                            // Render +- 3 pages to save memory
                                            const isNearby = Math.abs(index - currentPage) <= 3;
                                            return (
                                                <PdfPageItem 
                                                    key={`page_${index + 1}`} 
                                                    pageNumber={index + 1} 
                                                    isNearby={isNearby}
                                                    pageWidth={pageDimensions.width}
                                                />
                                            );
                                        })}
                                    </HTMLFlipBook>
                                )}
                            </Document>
                        </div>
                    </div>

                    {/* Bottom Control Bar */}
                    <div className="bottom-controls bg-black/90 p-3 flex items-center justify-between border-t border-gray-800 sticky bottom-0 z-30">
                        {/* Page Numbers */}
                        <div className="flex items-center space-x-2 text-sm font-medium w-32 text-gray-300">
                            <span>{numPages ? `${Math.max(1, currentPage)}-${Math.min(currentPage + 1, numPages)} of ${numPages}` : ''}</span>
                        </div>

                        {/* Center Controls */}
                        <div className="flex-grow flex justify-center items-center px-4">
                            <div className="w-full max-w-sm items-center space-x-4 flex">
                                <button onClick={zoomOut} className="p-2 rounded-full hover:bg-gray-700 transition" title="Zoom Out">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M5 11a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1z" />
                                    </svg>
                                </button>
                                
                                <div className="flex-grow text-center text-sm font-semibold tracking-wider text-gray-400">
                                    {Math.round(scale * 100)}%
                                </div>

                                <button onClick={zoomIn} className="p-2 rounded-full hover:bg-gray-700 transition" title="Zoom In">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center space-x-2 w-32 justify-end">
                            <button onClick={toggleGridView} className="p-2 rounded-full hover:bg-gray-700 transition" title="Grid View">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-gray-700 hidden md:block transition" title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                                {isFullscreen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h3a1 1 0 010 2H7.414l2.293 2.293a1 1 0 01-1.414 1.414L6 12.414V14a1 1 0 01-2 0v-3a1 1 0 01.293-.707L5 10zm10 0a1 1 0 01-1 1h-3a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L14 7.586V6a1 1 0 012 0v3a1 1 0 01-.293.707L15 10z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011 1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PdfViewer;