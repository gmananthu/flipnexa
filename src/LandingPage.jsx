import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Layers, Globe, Share2, UploadCloud, Eye, BookOpen, Upload } from 'lucide-react';
import { Navbar } from './components/Navbar';

const features = [
  {
    icon: <UploadCloud size={24} />,
    title: "Instant Upload",
    description: "Drag and drop your PDFs and watch them transform into beautiful, interactive flipbooks in seconds."
  },
  {
    icon: <Layers size={24} />,
    title: "Stunning Layouts",
    description: "Pixel-perfect rendering ensures your magazines and catalogs look exactly as you designed them."
  },
  {
    icon: <Zap size={24} />,
    title: "Lightning Fast",
    description: "Optimized delivery network ensures your flipbooks load instantly, regardless of their size."
  },
  {
    icon: <Share2 size={24} />,
    title: "Easy Sharing",
    description: "Share your publications anywhere with a single link, or embed them directly into your website."
  },
  {
    icon: <Globe size={24} />,
    title: "Global Reach",
    description: "Your content is automatically optimized for all devices, from desktop to mobile."
  },
  {
    icon: <Eye size={24} />,
    title: "Rich Analytics",
    description: "Understand your audience with detailed insights into reads, impressions, and engagement."
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      navigate(`/viewer?url=${encodeURIComponent(fileUrl)}`);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white -z-10" />
        <div className="absolute top-40 right-0 -mr-20 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 left-0 -ml-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-8 ring-1 ring-indigo-200/50">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              Introducing the new Flipnexa Editor
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Transform your PDFs into <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                interactive experiences
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              The premier platform for digital publishing. Turn static documents into engaging, page-turning flipbooks, magazines, and catalogs that captivate your audience.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/pricing" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-900 text-white font-semibold text-lg hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-gray-900/20 active:scale-95 flex items-center justify-center gap-2">
                Start your free trial
                <ArrowRight size={20} />
              </Link>
              <Link to="/viewer?url=chocolatier.pdf" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-gray-900 font-semibold text-lg ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50 transition-all active:scale-95 text-center">
                See it in action
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required. 14-day free trial.</p>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="aspect-[16/9] rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-50 border border-gray-200 shadow-2xl shadow-indigo-900/5 overflow-hidden relative group">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all group-hover:bg-white/60">
                <div className="text-center">
                  <div 
                    className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Upload your own PDF</h3>
                  <p className="text-gray-500 mt-2 mb-4">Click the icon above to upload and test your file</p>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <div 
                    className="inline-block px-6 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium cursor-pointer hover:bg-indigo-100 transition-colors" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse files
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to publish like a pro</h2>
            <p className="text-lg text-gray-600">Powerful tools designed to make your digital publications stand out and reach a wider audience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 -z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-violet-900/50 -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to transform your content?</h2>
          <p className="text-xl text-indigo-100 mb-10">Join thousands of publishers, brands, and creators who trust Flipnexa to bring their documents to life.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/pricing" className="px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 active:scale-95">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Flipnexa</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Flipnexa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
