import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CertificatePage() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const certificateRef = useRef(null);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  async function fetchCertificate() {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    try {
      const response = await fetch(`${apiUrl}/certificates/${id}`);
      if (!response.ok) {
        setError('Certificate not found');
        return;
      }
      const data = await response.json();
      setCertificate(data);
    } catch (err) {
      setError('Failed to load certificate');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${certificate.course_title}`,
        text: `I earned a certificate for completing ${certificate.course_title} on Lumina!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-soft-gray-300 border-t-soft-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-soft-gray-900 mb-2">Certificate Not Found</h2>
          <p className="text-soft-gray-500 mb-4">{error}</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link to="/dashboard" className="btn-ghost flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <button onClick={handleShare} className="btn-secondary flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <button onClick={handlePrint} className="btn-primary flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-white rounded-3xl shadow-2xl shadow-soft-gray-200/50 overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* Decorative Border */}
          <div className="p-2 bg-gradient-to-r from-soft-gray-100 via-soft-gray-200 to-soft-gray-100">
            <div className="bg-white p-12 md:p-16">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-soft-gray-900 rounded-full mb-6">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <p className="text-soft-gray-400 uppercase tracking-[0.3em] text-sm font-medium">
                  Certificate of Completion
                </p>
              </div>

              {/* Recipient */}
              <div className="text-center mb-10">
                <p className="text-soft-gray-500 mb-2">This is to certify that</p>
                <h1 className="text-4xl md:text-5xl font-bold text-soft-gray-900 tracking-tight">
                  {certificate.user_name}
                </h1>
              </div>

              {/* Course */}
              <div className="text-center mb-10">
                <p className="text-soft-gray-500 mb-2">has successfully completed the course</p>
                <h2 className="text-2xl md:text-3xl font-semibold text-soft-gray-800">
                  {certificate.course_title}
                </h2>
                <p className="text-soft-gray-500 mt-2">
                  Instructed by {certificate.instructor}
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center my-10">
                <div className="h-px w-24 bg-soft-gray-200"></div>
                <div className="w-3 h-3 bg-soft-gray-200 rounded-full mx-4"></div>
                <div className="h-px w-24 bg-soft-gray-200"></div>
              </div>

              {/* Footer */}
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <p className="text-sm text-soft-gray-400 mb-1">Date Issued</p>
                  <p className="font-medium text-soft-gray-700">
                    {new Date(certificate.issued_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-block border-t-2 border-soft-gray-300 pt-2 px-8">
                    <p className="font-semibold text-soft-gray-800">Lumina Learning</p>
                    <p className="text-sm text-soft-gray-400">Chief Learning Officer</p>
                  </div>
                </div>

                <div className="text-center md:text-right mt-6 md:mt-0">
                  <p className="text-sm text-soft-gray-400 mb-1">Certificate ID</p>
                  <p className="font-mono text-sm text-soft-gray-600">
                    {certificate.certificate_number}
                  </p>
                </div>
              </div>

              {/* Verification Note */}
              <div className="mt-12 pt-8 border-t border-soft-gray-100 text-center">
                <p className="text-xs text-soft-gray-400">
                  This certificate can be verified at lumina.com/verify/{certificate.certificate_number}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Info */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-soft-gray-100 print:hidden">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-soft-gray-900">Verified Certificate</h3>
              <p className="text-soft-gray-500 text-sm mt-1">
                This certificate is verified and issued by Lumina. The certificate ID can be used to validate the authenticity of this document.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
