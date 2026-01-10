import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('enrolled');
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    const token = getToken();
    try {
      const [enrollmentsRes, certificatesRes, statsRes] = await Promise.all([
        fetch('/api/users/enrollments', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/certificates', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/users/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const [enrollmentsData, certificatesData, statsData] = await Promise.all([
        enrollmentsRes.json(),
        certificatesRes.json(),
        statsRes.json()
      ]);

      setEnrollments(enrollmentsData);
      setCertificates(certificatesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const inProgressCourses = enrollments.filter((e) => !e.completed);
  const completedCourses = enrollments.filter((e) => e.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-soft-gray-300 border-t-soft-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-soft-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-soft-gray-900">Dashboard</h1>
              <p className="text-soft-gray-500 mt-1">Welcome back, {user?.name}</p>
            </div>
            <Link to="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Enrolled Courses', value: stats?.totalEnrolled || 0, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { label: 'In Progress', value: stats?.inProgress || 0, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { label: 'Completed', value: stats?.completed || 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Certificates', value: stats?.certificates || 0, icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-soft-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-soft-gray-900">{stat.value}</p>
                  <p className="text-soft-gray-500 text-sm mt-1">{stat.label}</p>
                </div>
                <div className="w-12 h-12 bg-soft-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-soft-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-soft-gray-100 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-soft-gray-100">
            {[
              { id: 'enrolled', label: 'My Courses', count: enrollments.length },
              { id: 'certificates', label: 'Certificates', count: certificates.length },
              { id: 'account', label: 'Account', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-soft-gray-900 border-b-2 border-soft-gray-900 bg-soft-gray-50'
                    : 'text-soft-gray-500 hover:text-soft-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-soft-gray-200 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Enrolled Courses */}
            {activeTab === 'enrolled' && (
              <div>
                {enrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-soft-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-lg font-medium text-soft-gray-900 mb-2">No courses yet</h3>
                    <p className="text-soft-gray-500 mb-4">Start learning by enrolling in a course</p>
                    <Link to="/courses" className="btn-primary">
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* In Progress */}
                    {inProgressCourses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-soft-gray-900 mb-4">In Progress</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {inProgressCourses.map((enrollment) => (
                            <Link
                              key={enrollment.id}
                              to={`/courses/${enrollment.course_id}`}
                              className="flex bg-soft-gray-50 rounded-xl overflow-hidden border border-soft-gray-100 hover:border-soft-gray-200 transition-colors"
                            >
                              <img
                                src={enrollment.image}
                                alt={enrollment.title}
                                className="w-24 h-24 object-cover"
                              />
                              <div className="flex-1 p-4">
                                <h4 className="font-medium text-soft-gray-900">{enrollment.title}</h4>
                                <p className="text-sm text-soft-gray-500">{enrollment.instructor}</p>
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-soft-gray-400 mb-1">
                                    <span>Progress</span>
                                    <span>{enrollment.progress}%</span>
                                  </div>
                                  <div className="w-full bg-soft-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-soft-gray-900 rounded-full h-1.5"
                                      style={{ width: `${enrollment.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completed */}
                    {completedCourses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-soft-gray-900 mb-4">Completed</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {completedCourses.map((enrollment) => (
                            <div
                              key={enrollment.id}
                              className="flex bg-green-50 rounded-xl overflow-hidden border border-green-100"
                            >
                              <img
                                src={enrollment.image}
                                alt={enrollment.title}
                                className="w-24 h-24 object-cover"
                              />
                              <div className="flex-1 p-4">
                                <h4 className="font-medium text-soft-gray-900">{enrollment.title}</h4>
                                <p className="text-sm text-soft-gray-500">{enrollment.instructor}</p>
                                <div className="flex items-center mt-2 text-green-600 text-sm">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Completed
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Certificates */}
            {activeTab === 'certificates' && (
              <div>
                {certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-soft-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <h3 className="text-lg font-medium text-soft-gray-900 mb-2">No certificates yet</h3>
                    <p className="text-soft-gray-500 mb-4">Complete a course to earn your first certificate</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                      <Link
                        key={cert.id}
                        to={`/certificate/${cert.id}`}
                        className="bg-gradient-to-br from-soft-gray-50 to-white rounded-xl p-6 border border-soft-gray-100 hover:border-soft-gray-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-soft-gray-900 rounded-full mb-4">
                          <span className="text-white font-bold">L</span>
                        </div>
                        <h4 className="font-semibold text-soft-gray-900">{cert.course_title}</h4>
                        <p className="text-sm text-soft-gray-500 mt-1">{cert.instructor}</p>
                        <div className="mt-4 pt-4 border-t border-soft-gray-100">
                          <p className="text-xs text-soft-gray-400">
                            Issued {new Date(cert.issued_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-soft-gray-300 mt-1">
                            {cert.certificate_number}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Account */}
            {activeTab === 'account' && (
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-soft-gray-900 mb-6">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-soft-gray-700 mb-1">Name</label>
                    <p className="input bg-soft-gray-50 cursor-not-allowed">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-soft-gray-700 mb-1">Email</label>
                    <p className="input bg-soft-gray-50 cursor-not-allowed">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-soft-gray-700 mb-1">Member Since</label>
                    <p className="input bg-soft-gray-50 cursor-not-allowed">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
