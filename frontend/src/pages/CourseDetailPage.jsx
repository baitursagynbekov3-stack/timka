import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getToken } = useAuth();
  const { post } = useApi();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && course) {
      checkEnrollment();
    }
  }, [isAuthenticated, course]);

  async function fetchCourse() {
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) {
        navigate('/courses');
        return;
      }
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  }

  async function checkEnrollment() {
    try {
      const response = await fetch('/api/users/enrollments', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const enrollments = await response.json();
      const enrolled = enrollments.find((e) => e.course_id === id);
      if (enrolled) {
        setEnrollment(enrolled);
      }
    } catch (error) {
      console.error('Failed to check enrollment:', error);
    }
  }

  async function handleEnroll() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await post(`/courses/${id}/enroll`, {});
      await checkEnrollment();
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setEnrolling(false);
    }
  }

  async function handleUpdateProgress(newProgress) {
    try {
      const response = await fetch(`/api/courses/${id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ progress: newProgress })
      });
      const data = await response.json();

      setEnrollment((prev) => ({
        ...prev,
        progress: data.progress,
        completed: data.completed ? 1 : 0
      }));

      if (data.completed) {
        await generateCertificate();
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }

  async function handleCompleteCourse() {
    setCompleting(true);
    await handleUpdateProgress(100);
    setCompleting(false);
  }

  async function generateCertificate() {
    try {
      await post('/certificates/generate', { courseId: id });
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-soft-gray-300 border-t-soft-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.completed === 1;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-soft-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-sm text-soft-gray-400 uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="text-soft-gray-600">|</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  course.skill_level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                  course.skill_level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {course.skill_level}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {course.title}
              </h1>

              <p className="mt-6 text-xl text-soft-gray-300 leading-relaxed">
                {course.short_description}
              </p>

              <div className="mt-8 flex items-center space-x-6 text-soft-gray-400">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {course.instructor}
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                {isEnrolled ? (
                  isCompleted ? (
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-8 py-4 bg-green-500 text-white rounded-lg font-medium text-lg hover:bg-green-600 transition-colors"
                    >
                      Course Completed - View Certificate
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteCourse}
                      disabled={completing}
                      className="px-8 py-4 bg-white text-soft-gray-900 rounded-lg font-medium text-lg hover:bg-soft-gray-100 transition-colors disabled:opacity-50"
                    >
                      {completing ? 'Completing...' : 'Complete Course'}
                    </button>
                  )
                ) : (
                  <>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="px-8 py-4 bg-white text-soft-gray-900 rounded-lg font-medium text-lg hover:bg-soft-gray-100 transition-colors disabled:opacity-50"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                    <span className="text-3xl font-bold">${course.price}</span>
                  </>
                )}
              </div>

              {isEnrolled && !isCompleted && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-soft-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-soft-gray-700 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <img
                src={course.image}
                alt={course.title}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-soft-gray-900 mb-4">About This Course</h2>
                <p className="text-soft-gray-600 leading-relaxed">{course.description}</p>
              </div>

              {/* Modules */}
              <div>
                <h2 className="text-2xl font-bold text-soft-gray-900 mb-6">Course Modules</h2>
                <div className="space-y-4">
                  {course.modules?.map((module, index) => (
                    <div
                      key={module.id}
                      className="bg-soft-gray-50 rounded-xl p-5 border border-soft-gray-100"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-soft-gray-200 rounded-lg flex items-center justify-center text-soft-gray-600 font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-soft-gray-900">{module.title}</h3>
                          <p className="text-soft-gray-500 text-sm mt-1">{module.description}</p>
                          <span className="text-soft-gray-400 text-sm mt-2 inline-block">
                            {module.duration}
                          </span>
                        </div>
                        {isEnrolled && (
                          <button
                            onClick={() => handleUpdateProgress(Math.min(100, ((index + 1) / course.modules.length) * 100))}
                            className="text-soft-gray-400 hover:text-soft-gray-600 transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              {course.reviews?.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-soft-gray-900 mb-6">Student Reviews</h2>
                  <div className="space-y-4">
                    {course.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white rounded-xl p-5 border border-soft-gray-100"
                      >
                        <div className="flex items-center space-x-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-soft-gray-200'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-soft-gray-600">{review.comment}</p>
                        <p className="text-soft-gray-400 text-sm mt-3">{review.user_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-soft-gray-50 rounded-2xl p-6 border border-soft-gray-100">
                <h3 className="font-semibold text-soft-gray-900 mb-4">This Course Includes</h3>
                <ul className="space-y-3">
                  {[
                    { icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', text: 'On-demand video content' },
                    { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', text: 'Downloadable resources' },
                    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Lifetime access' },
                    { icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'Access on mobile and desktop' },
                    { icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', text: 'Certificate of completion' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-soft-gray-600">
                      <svg className="w-5 h-5 mr-3 text-soft-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      {item.text}
                    </li>
                  ))}
                </ul>

                {!isEnrolled && (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full mt-6 btn-primary"
                  >
                    {enrolling ? 'Enrolling...' : `Enroll for $${course.price}`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
