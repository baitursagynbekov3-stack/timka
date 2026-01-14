import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useApi';

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { observeElements } = useScrollAnimation();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const cleanup = observeElements();
    return cleanup;
  }, [courses, reviews, observeElements]);

  async function fetchData() {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://lumina-backend-h0fi.onrender.com/api';
    try {
      const [coursesRes, reviewsRes] = await Promise.all([
        fetch(`${apiUrl}/courses?featured=true`),
        fetch(`${apiUrl}/reviews?limit=4`)
      ]);

      const coursesData = await coursesRes.json();
      const reviewsData = await reviewsRes.json();

      setCourses(coursesData.slice(0, 4));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-soft-gray-50 via-white to-warm-50 dark:from-soft-gray-900 dark:via-soft-gray-900 dark:to-soft-gray-800"></div>

        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-soft-gray-100/40 dark:bg-soft-gray-800/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-warm-100/30 dark:bg-soft-gray-700/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-soft-gray-100/20 dark:bg-soft-gray-800/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="slide-left">
              <span className="inline-flex items-center px-4 py-2 bg-soft-gray-100/80 dark:bg-soft-gray-800/80 text-soft-gray-600 dark:text-soft-gray-300 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Premium Online Education
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-soft-gray-900 dark:text-white leading-[1.1] tracking-tight">
                Learn Skills
                <br />
                <span className="text-soft-gray-400">That Matter</span>
              </h1>

              <p className="mt-8 text-xl text-soft-gray-500 dark:text-soft-gray-400 leading-relaxed max-w-lg">
                Professional online courses crafted by industry experts.
                Earn recognized certificates and transform your career.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/courses" className="btn-primary text-lg px-8 py-4">
                  Explore Courses
                </Link>
                <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                  Start Free
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-16 flex items-center gap-12">
                {[
                  { value: '50+', label: 'Expert Courses' },
                  { value: '10k+', label: 'Students' },
                  { value: '95%', label: 'Satisfaction' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-3xl font-bold text-soft-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-soft-gray-400 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="slide-right hidden lg:block">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-br from-soft-gray-100 to-warm-100 dark:from-soft-gray-800 dark:to-soft-gray-700 rounded-[2rem] transform rotate-2 opacity-60"></div>

                {/* Main image */}
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                  alt="Students learning together"
                  className="relative rounded-3xl shadow-soft-xl object-cover w-full aspect-[4/3]"
                />

                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-soft-gray-800 p-5 rounded-2xl shadow-soft-lg border border-soft-gray-100 dark:border-soft-gray-700 animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-soft-gray-900 dark:text-white">Certificate Earned</p>
                      <p className="text-sm text-soft-gray-400">Web Development</p>
                    </div>
                  </div>
                </div>

                {/* Second floating element */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-soft-gray-800 px-5 py-3 rounded-xl shadow-soft-lg border border-soft-gray-100 dark:border-soft-gray-700" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-soft-gray-200 dark:bg-soft-gray-600 border-2 border-white dark:border-soft-gray-800"></div>
                      ))}
                    </div>
                    <span className="text-sm text-soft-gray-600 dark:text-soft-gray-300 font-medium">+2.5k enrolled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-soft-gray-300 dark:text-soft-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-28 bg-white dark:bg-soft-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 slide-up">
            <span className="text-soft-gray-400 uppercase tracking-widest text-sm font-medium">Our Courses</span>
            <h2 className="section-title mt-4">Featured Courses</h2>
            <p className="section-subtitle mx-auto mt-5">
              Handpicked courses designed to help you master in-demand skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className={`card p-0 overflow-hidden group slide-up delay-${(index + 1) * 100}`}
              >
                <div className="aspect-[4/3] overflow-hidden bg-soft-gray-100 dark:bg-soft-gray-700">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs text-soft-gray-400 uppercase tracking-wider font-medium">
                    {course.category}
                  </span>
                  <h3 className="font-semibold text-soft-gray-900 dark:text-white mt-2 group-hover:text-soft-gray-600 dark:group-hover:text-soft-gray-300 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-sm text-soft-gray-500 dark:text-soft-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.short_description}
                  </p>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-soft-gray-100 dark:border-soft-gray-700">
                    <span className="text-sm text-soft-gray-400">{course.duration}</span>
                    <span className="font-semibold text-soft-gray-900 dark:text-white">${course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-14 slide-up">
            <Link to="/courses" className="btn-secondary inline-flex items-center gap-2">
              View All Courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-28 bg-soft-gray-50/50 dark:bg-soft-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <div className="slide-left relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-soft-gray-100 to-warm-100 dark:from-soft-gray-700 dark:to-soft-gray-600 rounded-[2rem] opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                alt="Learning benefits"
                className="relative rounded-3xl shadow-soft-xl w-full"
              />

              {/* Stats card */}
              <div className="absolute -bottom-8 -right-8 bg-white dark:bg-soft-gray-800 p-6 rounded-2xl shadow-soft-lg border border-soft-gray-100 dark:border-soft-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-soft-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white dark:text-soft-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-soft-gray-900 dark:text-white">89%</p>
                    <p className="text-soft-gray-400 text-sm">Career growth</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="slide-right">
              <span className="text-soft-gray-400 uppercase tracking-widest text-sm font-medium">Why Choose Us</span>
              <h2 className="section-title mt-4">Why Choose Lumina?</h2>
              <p className="section-subtitle mt-5">
                We combine expert instruction with practical learning to help you succeed in your career.
              </p>

              <div className="mt-12 space-y-8">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ),
                    title: 'Expert-Led Content',
                    description: 'Learn from industry professionals with years of real-world experience.'
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: 'Learn at Your Pace',
                    description: 'Access courses anytime, anywhere. No deadlines, no pressure.'
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    ),
                    title: 'Recognized Certificates',
                    description: 'Earn professional certificates to showcase your achievements.'
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ),
                    title: 'Active Community',
                    description: 'Connect with fellow learners and industry professionals.'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-5 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-soft-gray-700 rounded-2xl flex items-center justify-center text-soft-gray-500 dark:text-soft-gray-300 shadow-soft border border-soft-gray-100 dark:border-soft-gray-600 group-hover:shadow-soft-lg group-hover:border-soft-gray-200 dark:group-hover:border-soft-gray-500 transition-all duration-300">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-soft-gray-900 dark:text-white text-lg">{benefit.title}</h3>
                      <p className="text-soft-gray-500 dark:text-soft-gray-400 mt-1 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Preview Section */}
      <section className="py-28 bg-white dark:bg-soft-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1 slide-left">
              <span className="text-soft-gray-400 uppercase tracking-widest text-sm font-medium">Certification</span>
              <h2 className="section-title mt-4">Earn Professional Certificates</h2>
              <p className="section-subtitle mt-5">
                Complete courses and receive verified certificates that validate your skills and knowledge.
              </p>

              <ul className="mt-10 space-y-4">
                {[
                  'Personalized with your name and completion date',
                  'Shareable on LinkedIn and social media',
                  'Verifiable through unique certificate ID',
                  'Recognized by industry professionals'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-soft-gray-100 dark:bg-soft-gray-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-soft-gray-600 dark:text-soft-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-soft-gray-600 dark:text-soft-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/courses" className="btn-primary mt-10 inline-flex items-center gap-2">
                Start Learning Today
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Certificate Preview */}
            <div className="order-1 lg:order-2 slide-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-soft-gray-100 to-warm-100 dark:from-soft-gray-700 dark:to-soft-gray-600 rounded-[2rem] transform -rotate-2 opacity-60"></div>
                <div className="relative bg-white dark:bg-soft-gray-800 p-10 rounded-3xl shadow-soft-xl border border-soft-gray-100 dark:border-soft-gray-700">
                  <div className="text-center">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-soft-gray-900 dark:bg-white rounded-2xl mx-auto flex items-center justify-center mb-8">
                      <span className="text-white dark:text-soft-gray-900 font-bold text-2xl">L</span>
                    </div>

                    <p className="text-soft-gray-400 uppercase tracking-[0.25em] text-xs font-medium mb-3">
                      Certificate of Completion
                    </p>

                    <h3 className="text-3xl font-bold text-soft-gray-900 dark:text-white mb-2">John Anderson</h3>
                    <p className="text-soft-gray-400 mb-8">has successfully completed</p>

                    <p className="text-xl font-semibold text-soft-gray-800 dark:text-soft-gray-200 mb-8">Modern Web Development</p>

                    <div className="flex items-center justify-center gap-3 mb-8">
                      <div className="h-px w-12 bg-soft-gray-200 dark:bg-soft-gray-600"></div>
                      <div className="w-2 h-2 rounded-full bg-soft-gray-200 dark:bg-soft-gray-600"></div>
                      <div className="h-px w-12 bg-soft-gray-200 dark:bg-soft-gray-600"></div>
                    </div>

                    <p className="text-sm text-soft-gray-400">January 2025</p>
                    <p className="text-xs text-soft-gray-300 dark:text-soft-gray-500 mt-2 font-mono">CERT-XK9M2-ABCD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-28 bg-soft-gray-50/50 dark:bg-soft-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 slide-up">
            <span className="text-soft-gray-400 uppercase tracking-widest text-sm font-medium">Testimonials</span>
            <h2 className="section-title mt-4">What Our Students Say</h2>
            <p className="section-subtitle mx-auto mt-5">
              Join thousands of learners who have transformed their careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`bg-white dark:bg-soft-gray-800 p-7 rounded-2xl border border-soft-gray-100 dark:border-soft-gray-700 shadow-soft hover:shadow-soft-lg transition-all duration-500 slide-up delay-${(index + 1) * 100}`}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-soft-gray-200 dark:text-soft-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-soft-gray-600 dark:text-soft-gray-300 leading-relaxed mb-6">
                  "{review.comment}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-soft-gray-100 dark:border-soft-gray-700">
                  <div className="w-10 h-10 bg-soft-gray-100 dark:bg-soft-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-soft-gray-500 dark:text-soft-gray-300 font-medium text-sm">
                      {review.user_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-soft-gray-900 dark:text-white text-sm">{review.user_name}</p>
                    <p className="text-soft-gray-400 text-xs">{review.course_title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-soft-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-soft-gray-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-soft-gray-800 rounded-full blur-3xl opacity-30"></div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center slide-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Ready to Start Your
            <br />
            <span className="text-soft-gray-400">Learning Journey?</span>
          </h2>

          <p className="mt-8 text-xl text-soft-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join our community of learners and unlock your potential with world-class courses and certifications.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-soft-gray-900 rounded-xl font-medium text-lg transition-all duration-500 hover:bg-soft-gray-100 hover:shadow-soft-xl hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              to="/courses"
              className="px-8 py-4 bg-transparent border border-soft-gray-600 text-white rounded-xl font-medium text-lg transition-all duration-500 hover:border-soft-gray-400 hover:bg-soft-gray-800"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
