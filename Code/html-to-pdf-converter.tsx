import React, { useState } from 'react';
import { FileText, Download, Upload, BookOpen, CheckCircle, DollarSign, Shield, Settings } from 'lucide-react';

const ProfessionalPDFConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [settings, setSettings] = useState({
    includeWatermark: true,
    includeCopyright: true,
    includeCoverPage: true,
    price: '$9.99',
    license: 'Personal Use Only'
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.html')) {
      setSelectedFile(file);
      setConverted(false);
    } else {
      alert('Please select an HTML file');
    }
  };

  const convertToPDF = async () => {
    if (!selectedFile) return;

    setConverting(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const htmlContent = e.target.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Extract title and author
      const titleElement = doc.querySelector('title');
      const bookTitle = titleElement ? titleElement.textContent : selectedFile.name.replace('.html', '').replace(/-/g, ' ');
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${bookTitle}</title>
          <style>
            @page {
              size: A4;
              margin: 2.5cm 2cm;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
              line-height: 1.7;
              color: #1f2937;
              font-size: 11pt;
            }
            
            /* Cover Page */
            .cover-page {
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 60px 40px;
              page-break-after: always;
            }
            
            .cover-title {
              font-size: 48pt;
              font-weight: 800;
              margin-bottom: 20px;
              line-height: 1.2;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .cover-subtitle {
              font-size: 20pt;
              margin-bottom: 40px;
              opacity: 0.95;
              font-weight: 300;
            }
            
            .cover-author {
              font-size: 18pt;
              margin-top: 60px;
              font-weight: 500;
            }
            
            .cover-series {
              font-size: 14pt;
              margin-top: 10px;
              opacity: 0.9;
            }
            
            .cover-footer {
              position: absolute;
              bottom: 40px;
              left: 0;
              right: 0;
              font-size: 10pt;
              opacity: 0.8;
            }
            
            /* Copyright Page */
            .copyright-page {
              page-break-after: always;
              padding: 60px 40px;
            }
            
            .copyright-title {
              font-size: 16pt;
              font-weight: 700;
              margin-bottom: 30px;
              color: #1f2937;
            }
            
            .copyright-content {
              font-size: 10pt;
              line-height: 1.8;
              color: #4b5563;
            }
            
            .copyright-content p {
              margin-bottom: 15px;
            }
            
            .license-box {
              background: #f3f4f6;
              border-left: 4px solid #3b82f6;
              padding: 20px;
              margin: 30px 0;
              border-radius: 4px;
            }
            
            /* Table of Contents */
            .toc-page {
              page-break-after: always;
              padding: 40px;
            }
            
            .toc-title {
              font-size: 24pt;
              font-weight: 700;
              margin-bottom: 30px;
              color: #1f2937;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 15px;
            }
            
            .toc-item {
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .toc-chapter {
              font-size: 12pt;
              font-weight: 600;
              color: #1f2937;
            }
            
            .toc-number {
              color: #6b7280;
              font-size: 10pt;
            }
            
            /* Content Styles */
            .content-wrapper {
              max-width: 800px;
              margin: 0 auto;
              padding: 0 20px;
            }
            
            .chapter {
              page-break-before: always;
              padding-top: 40px;
            }
            
            .chapter:first-child {
              page-break-before: auto;
            }
            
            h1 {
              font-size: 32pt;
              color: #3b82f6;
              margin-bottom: 25px;
              line-height: 1.2;
              page-break-after: avoid;
            }
            
            h2 {
              font-size: 22pt;
              color: #1f2937;
              margin-top: 35px;
              margin-bottom: 18px;
              page-break-after: avoid;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 10px;
            }
            
            h3 {
              font-size: 16pt;
              color: #374151;
              margin-top: 25px;
              margin-bottom: 12px;
              page-break-after: avoid;
            }
            
            h4 {
              font-size: 13pt;
              color: #4b5563;
              margin-top: 20px;
              margin-bottom: 10px;
              page-break-after: avoid;
            }
            
            p {
              margin-bottom: 14px;
              text-align: justify;
            }
            
            ul, ol {
              margin-left: 25px;
              margin-bottom: 14px;
            }
            
            li {
              margin-bottom: 8px;
            }
            
            strong {
              color: #1f2937;
              font-weight: 600;
            }
            
            /* Box Styles */
            .box, .info-box, .card-item {
              padding: 18px;
              margin: 20px 0;
              border-radius: 6px;
              page-break-inside: avoid;
            }
            
            .box-blue, .info-box.blue {
              background: #eff6ff;
              border-left: 4px solid #3b82f6;
            }
            
            .box-green, .info-box.green {
              background: #f0fdf4;
              border-left: 4px solid #10b981;
            }
            
            .box-purple, .info-box.purple {
              background: #faf5ff;
              border-left: 4px solid #a855f7;
            }
            
            .box-orange, .info-box.indigo {
              background: #eef2ff;
              border-left: 4px solid #6366f1;
            }
            
            .box-red {
              background: #fef2f2;
              border-left: 4px solid #ef4444;
            }
            
            .box-pink {
              background: #fdf2f8;
              border-left: 4px solid #ec4899;
            }
            
            .info-box.yellow {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
            }
            
            .card-item {
              border: 1px solid #e5e7eb;
              background: white;
            }
            
            /* Step Boxes */
            .lifecycle-step, .step-box {
              display: flex;
              gap: 15px;
              padding: 18px;
              margin-bottom: 15px;
              border-radius: 6px;
              page-break-inside: avoid;
            }
            
            .step-number {
              min-width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14pt;
            }
            
            /* Grid Layouts */
            .grid {
              display: grid;
              gap: 15px;
              margin: 20px 0;
            }
            
            .grid-2 {
              grid-template-columns: repeat(2, 1fr);
            }
            
            .grid-3 {
              grid-template-columns: repeat(3, 1fr);
            }
            
            /* Flex Layouts */
            .flex, .flex-row {
              display: flex;
              gap: 15px;
              align-items: flex-start;
            }
            
            .icon-large {
              font-size: 36pt;
            }
            
            /* Headers and Footers */
            .page-header-content {
              position: fixed;
              top: 1cm;
              left: 2cm;
              right: 2cm;
              font-size: 9pt;
              color: #6b7280;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
            }
            
            .page-footer {
              position: fixed;
              bottom: 1cm;
              left: 2cm;
              right: 2cm;
              font-size: 9pt;
              color: #6b7280;
              text-align: center;
              border-top: 1px solid #e5e7eb;
              padding-top: 8px;
            }
            
            ${settings.includeWatermark ? `
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 80pt;
              color: rgba(59, 130, 246, 0.08);
              font-weight: 900;
              z-index: -1;
              user-select: none;
              pointer-events: none;
            }
            ` : ''}
            
            /* Print-specific */
            @media print {
              body {
                padding: 0;
              }
              
              .no-print {
                display: none !important;
              }
              
              a {
                color: inherit;
                text-decoration: none;
              }
            }
            
            /* Remove interactive elements */
            .cta-box, .cta-btn, button, .menu-btn, .navigation,
            .header, .menu-sidebar, .menu-overlay, .progress-bar {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${settings.includeWatermark ? '<div class="watermark">LICENSED COPY</div>' : ''}
          
          ${settings.includeCoverPage ? `
          <div class="cover-page">
            <div class="cover-title">${bookTitle}</div>
            <div class="cover-subtitle">Professional Learning Series</div>
            <div style="height: 80px;"></div>
            <div class="cover-author">Aditya Bhutada</div>
            <div class="cover-series">LinkedIn Learning Series</div>
            <div class="cover-footer">
              ${settings.price} • ${settings.license}
            </div>
          </div>
          ` : ''}
          
          ${settings.includeCopyright ? `
          <div class="copyright-page">
            <h2 class="copyright-title">Copyright & License Information</h2>
            <div class="copyright-content">
              <p><strong>${bookTitle}</strong></p>
              <p>© ${new Date().getFullYear()} Aditya Bhutada. All rights reserved.</p>
              
              <div class="license-box">
                <p style="font-weight: 600; margin-bottom: 10px;">📜 License: ${settings.license}</p>
                <p>This e-book is licensed for personal use only. You may not reproduce, distribute, or create derivative works without written permission from the author.</p>
              </div>
              
              <p><strong>Price:</strong> ${settings.price}</p>
              
              <p style="margin-top: 25px;"><strong>Contact Information:</strong></p>
              <p>LinkedIn: linkedin.com/in/aditya-bhutada94</p>
              <p>GitHub: github.com/aditya-bhutada</p>
              
              <p style="margin-top: 25px; font-style: italic; color: #6b7280;">
                No part of this publication may be reproduced, stored in a retrieval system, or transmitted in any form or by any means, electronic, mechanical, photocopying, recording, or otherwise, without prior written permission of the publisher.
              </p>
              
              <p style="margin-top: 25px; font-size: 9pt; color: #9ca3af;">
                Published: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          ` : ''}
          
          <div class="page-footer">
            ${bookTitle} • © ${new Date().getFullYear()} Aditya Bhutada • Page <span class="page-number"></span>
          </div>
          
          <div class="content-wrapper">
            <div id="toc"></div>
            <div id="content"></div>
          </div>
        </body>
        </html>
      `);
      
      // Extract pages data
      const scripts = doc.querySelectorAll('script');
      let pagesData = [];
      
      scripts.forEach(script => {
        const scriptContent = script.textContent;
        if (scriptContent.includes('const pages =')) {
          try {
            const pagesMatch = scriptContent.match(/const pages = \[([\s\S]*?)\];/);
            if (pagesMatch) {
              eval('pagesData = [' + pagesMatch[1] + ']');
            }
          } catch (e) {
            console.error('Error parsing pages:', e);
          }
        }
      });
      
      // Generate Table of Contents
      const tocDiv = printWindow.document.getElementById('toc');
      if (pagesData.length > 0) {
        let tocHTML = '<div class="toc-page"><h2 class="toc-title">📚 Table of Contents</h2>';
        pagesData.forEach((page, index) => {
          if (page.title !== 'Welcome') {
            tocHTML += `
              <div class="toc-item">
                <span class="toc-chapter">${page.icon} ${page.title}</span>
                <span class="toc-number">Chapter ${index}</span>
              </div>
            `;
          }
        });
        tocHTML += '</div>';
        tocDiv.innerHTML = tocHTML;
      }
      
      // Add content
      const contentDiv = printWindow.document.getElementById('content');
      
      if (pagesData.length > 0) {
        pagesData.forEach((page, index) => {
          contentDiv.innerHTML += `
            <div class="chapter">
              <h2>${page.icon} ${page.title}</h2>
              ${page.content || ''}
            </div>
          `;
        });
      } else {
        contentDiv.innerHTML = '<p>Unable to extract content. Please check the HTML file structure.</p>';
      }
      
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        setConverting(false);
        setConverted(true);
      }, 1500);
    };
    
    reader.readAsText(selectedFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold text-center mb-2">
              Professional E-Book to PDF Converter
            </h1>
            <p className="text-center text-blue-100 text-lg">
              Create commercial-ready PDFs with cover pages, copyright protection, and watermarks
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                1. Upload Your E-Book
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all hover:bg-blue-50">
                <input
                  type="file"
                  accept=".html"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-700 mb-2">
                    Click to upload HTML file
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports all your interactive e-book HTML files
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  {converted && (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                2. Configure PDF Settings
              </label>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.includeCoverPage}
                        onChange={(e) => setSettings({...settings, includeCoverPage: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Professional Cover Page</span>
                        <p className="text-sm text-gray-600">Attractive title page with gradient design</p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.includeCopyright}
                        onChange={(e) => setSettings({...settings, includeCopyright: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Copyright & License Page</span>
                        <p className="text-sm text-gray-600">Legal protection and terms of use</p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.includeWatermark}
                        onChange={(e) => setSettings({...settings, includeWatermark: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Watermark Protection</span>
                        <p className="text-sm text-gray-600">Subtle watermark on every page</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block mb-2">
                      <div className="flex items-center mb-2">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-700" />
                        <span className="font-medium text-gray-900">Price</span>
                      </div>
                      <input
                        type="text"
                        value={settings.price}
                        onChange={(e) => setSettings({...settings, price: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="$9.99"
                      />
                    </label>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block mb-2">
                      <div className="flex items-center mb-2">
                        <Shield className="w-4 h-4 mr-1 text-gray-700" />
                        <span className="font-medium text-gray-900">License Type</span>
                      </div>
                      <select
                        value={settings.license}
                        onChange={(e) => setSettings({...settings, license: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Personal Use Only</option>
                        <option>Commercial License</option>
                        <option>Educational License</option>
                        <option>Extended License</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                3. Generate PDF
              </label>
              <button
                onClick={convertToPDF}
                disabled={!selectedFile || converting}
                className={`w-full py-5 rounded-xl font-bold text-xl flex items-center justify-center space-x-3 transition-all shadow-lg ${
                  !selectedFile || converting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transform hover:-translate-y-1'
                }`}
              >
                {converting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Generating Professional PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>Convert to Professional PDF</span>
                  </>
                )}
              </button>
            </div>

            {/* Success Message */}
            {converted && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Conversion Successful! 🎉
                </h3>
                <p className="text-green-800 mb-4">
                  Your professional PDF is ready. Use the print dialog to save it.
                </p>
                <div className="bg-white rounded-lg p-4 text-left">
                  <p className="font-semibold text-gray-900 mb-2">Next Steps:</p>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>In the print dialog, select "Save as PDF"</li>
                    <li>Choose your save location</li>
                    <li>Review the PDF before uploading to sales platform</li>
                    <li>Upload to Gumroad, Teachable, or your preferred platform</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Professional Design</h4>
                <p className="text-sm text-gray-600">Print-ready formatting</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Copyright Protected</h4>
                <p className="text-sm text-gray-600">Legal licensing included</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Sales Ready</h4>
                <p className="text-sm text-gray-600">Optimized for marketplaces</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6">
              <h4 className="font-bold text-yellow-900 mb-3 flex items-center text-lg">
                <span className="text-2xl mr-2">💡</span>
                Pro Tips for Selling Your E-Book
              </h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Pricing:</strong> Research similar e-books on your platform ($5-$29 is typical)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Platforms:</strong> Gumroad, Teachable, Payhip, or your own website</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Marketing:</strong> Share on LinkedIn with your professional network</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Updates:</strong> Offer free updates to customers who purchased</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Bundle:</strong> Consider selling all 8 parts as a discounted bundle</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">Created for Aditya Bhutada's LinkedIn Learning Series</p>
          <p className="text-xs mt-2">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPDFConverter;