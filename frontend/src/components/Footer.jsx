import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-soft-gray-50 dark:bg-soft-gray-800 border-t border-soft-gray-100 dark:border-soft-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-soft-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-soft-gray-900 font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-semibold text-soft-gray-900 dark:text-white">Lumina</span>
            </Link>
            <p className="mt-4 text-soft-gray-500 dark:text-soft-gray-400 text-sm leading-relaxed">
              Empowering learners worldwide with premium online education and professional certifications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-soft-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-soft-gray-500 dark:text-soft-gray-400 hover:text-soft-gray-900 dark:hover:text-white transition-colors text-sm">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-soft-gray-500 dark:text-soft-gray-400 hover:text-soft-gray-900 dark:hover:text-white transition-colors text-sm">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-soft-gray-500 dark:text-soft-gray-400 hover:text-soft-gray-900 dark:hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-soft-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-soft-gray-500 dark:text-soft-gray-400 text-sm">Help Center</span>
              </li>
              <li>
                <span className="text-soft-gray-500 dark:text-soft-gray-400 text-sm">Community</span>
              </li>
              <li>
                <span className="text-soft-gray-500 dark:text-soft-gray-400 text-sm">Blog</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-soft-gray-900 dark:text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:630-380-9738" className="text-soft-gray-500 dark:text-soft-gray-400 hover:text-soft-gray-900 dark:hover:text-white transition-colors text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  630-380-9738
                </a>
              </li>
              <li>
                <a href="mailto:baitursagynbekov3@gmail.com" className="text-soft-gray-500 dark:text-soft-gray-400 hover:text-soft-gray-900 dark:hover:text-white transition-colors text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  baitursagynbekov3@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-soft-gray-200 dark:border-soft-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-soft-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Lumina. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <span className="text-soft-gray-400 text-sm hover:text-soft-gray-600 dark:hover:text-soft-gray-300 cursor-pointer">
                Privacy Policy
              </span>
              <span className="text-soft-gray-400 text-sm hover:text-soft-gray-600 dark:hover:text-soft-gray-300 cursor-pointer">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
