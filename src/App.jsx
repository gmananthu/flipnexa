import React from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useParams } from 'react-router-dom';
import PdfViewer from './PdfViewer';
import LandingPage from './LandingPage';
import PricingPage from './PricingPage';

const ViewerRoute = () => {
  const [searchParams] = useSearchParams();
  const pdfUrl = searchParams.get('url') || '/sample.pdf'; // Default or passed URL

  return <PdfViewer pdfUrl={pdfUrl} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
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
