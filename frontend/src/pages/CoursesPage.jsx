import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useApi';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', level: '' });
  const { observeElements } = useScrollAnimation();

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  useEffect(() => {
    if (!loading) {
      const cleanup = observeElements();
      return cleanup;
    }
  }, [loading, observeElements]);

  async function fetchCourses() {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'https://lumina-backend-h0fi.onrender.com/api';
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.level) params.append('level', filter.level);

      const response = await fetch(`${apiUrl}/courses?${params.toString()}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['Development', 'Design', 'Data Science', 'Marketing', 'Business'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-soft-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-soft-gray-900 tracking-tight">
              Explore Our Courses
            </h1>
            <p className="mt-4 text-xl text-soft-gray-500 max-w-2xl mx-auto">
              Discover courses designed to help you master new skills and advance your career
            </p>
          </div>

          {/* Filters */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2 bg-white border border-soft-gray-200 rounded-lg text-soft-gray-700 focus:outline-none focus:border-soft-gray-400"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filter.level}
              onChange={(e) => setFilter({ ...filter, level: e.target.value })}
              className="px-4 py-2 bg-white border border-soft-gray-200 rounded-lg text-soft-gray-700 focus:outline-none focus:border-soft-gray-400"
            >
              <option value="">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {(filter.category || filter.level) && (
              <button
                onClick={() => setFilter({ category: '', level: '' })}
                className="px-4 py-2 text-soft-gray-500 hover:text-soft-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-soft-gray-300 border-t-soft-gray-900 rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-soft-gray-500 text-lg">No courses found matching your criteria.</p>
              <button
                onClick={() => setFilter({ category: '', level: '' })}
                className="mt-4 btn-secondary"
              >
                View All Courses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className={`card overflow-hidden group slide-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-soft-gray-400 uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.skill_level === 'Beginner' ? 'bg-green-50 text-green-600' :
                        course.skill_level === 'Intermediate' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {course.skill_level}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-soft-gray-900 group-hover:text-soft-gray-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-soft-gray-500 mt-2 line-clamp-2">
                      {course.short_description}
                    </p>

                    <div className="mt-4 flex items-center text-sm text-soft-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration}
                      <span className="mx-2">|</span>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {course.instructor}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-soft-gray-100">
                      <span className="text-2xl font-bold text-soft-gray-900">${course.price}</span>
                      <span className="text-soft-gray-400 text-sm flex items-center">
                        View Course
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
