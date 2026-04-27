import React from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useParams } from 'react-router-dom';
import PdfViewer from './PdfViewer';

const ViewerRoute = () => {
  const [searchParams] = useSearchParams();
  const pdfUrl = searchParams.get('url') || '/sample.pdf'; // Default or passed URL

  return <PdfViewer pdfUrl={pdfUrl} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Flipnexa</h1>
            <p className="mb-4 text-gray-600">Please provide a ?url= query parameter to view a PDF</p>
            <div className="flex gap-4">
               {/* Example usage, assuming sample.pdf is in public */}
               <a href="/viewer?url=/sample.pdf" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Open Sample</a>
            </div>
          </div>
        } />
        <Route path="/viewer" element={<ViewerRoute />} />
        {/* Supporting the nextjs dynamic route style if needed */}
        <Route path="/view/:url" element={<ViewerRouteWithParams />} />
      </Routes>
    </Router>
  );
};

const ViewerRouteWithParams = () => {
  const { url } = useParams();
  const decodedUrl = decodeURIComponent(url);
  return <PdfViewer pdfUrl={decodedUrl} />;
};

export default App;
