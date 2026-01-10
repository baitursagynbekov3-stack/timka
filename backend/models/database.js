import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('courses.db');

export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT,
      duration TEXT NOT NULL,
      skill_level TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      instructor TEXT NOT NULL,
      category TEXT,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Course modules table
  db.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      duration TEXT,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  // User enrollments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      UNIQUE(user_id, course_id)
    )
  `);

  // Certificates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      certificate_number TEXT UNIQUE NOT NULL,
      issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  // Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  // Seed sample data if empty
  const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get();
  if (courseCount.count === 0) {
    seedData();
  }
}

function seedData() {
  // Sample courses
  const courses = [
    {
      id: uuidv4(),
      title: 'Modern Web Development',
      description: 'Master the art of building beautiful, responsive websites using the latest technologies. This comprehensive course covers HTML5, CSS3, JavaScript ES6+, and modern frameworks. You will learn best practices for creating professional web applications from scratch.',
      short_description: 'Build modern, responsive websites with cutting-edge technologies',
      duration: '12 weeks',
      skill_level: 'Beginner',
      price: 99.00,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      instructor: 'Sarah Mitchell',
      category: 'Development',
      featured: 1
    },
    {
      id: uuidv4(),
      title: 'UX/UI Design Fundamentals',
      description: 'Learn the principles of user experience and interface design. This course teaches you how to create intuitive, beautiful digital products that users love. From wireframing to prototyping, master the complete design process.',
      short_description: 'Create intuitive and beautiful digital experiences',
      duration: '8 weeks',
      skill_level: 'Beginner',
      price: 79.00,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      instructor: 'Alex Chen',
      category: 'Design',
      featured: 1
    },
    {
      id: uuidv4(),
      title: 'Data Science Essentials',
      description: 'Dive into the world of data science with Python. Learn statistical analysis, machine learning fundamentals, and data visualization techniques. Perfect for those looking to transition into data-driven careers.',
      short_description: 'Unlock insights from data with Python and machine learning',
      duration: '16 weeks',
      skill_level: 'Intermediate',
      price: 149.00,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      instructor: 'Dr. Michael Foster',
      category: 'Data Science',
      featured: 1
    },
    {
      id: uuidv4(),
      title: 'Digital Marketing Mastery',
      description: 'Become a digital marketing expert. Learn SEO, social media marketing, content strategy, email marketing, and analytics. Build campaigns that drive real results for businesses of any size.',
      short_description: 'Master digital channels to grow any business',
      duration: '10 weeks',
      skill_level: 'Beginner',
      price: 89.00,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      instructor: 'Emma Thompson',
      category: 'Marketing',
      featured: 0
    },
    {
      id: uuidv4(),
      title: 'Advanced React Development',
      description: 'Take your React skills to the next level. Learn advanced patterns, state management with Redux and Context, testing strategies, performance optimization, and building scalable applications.',
      short_description: 'Build scalable applications with advanced React patterns',
      duration: '10 weeks',
      skill_level: 'Advanced',
      price: 129.00,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      instructor: 'David Park',
      category: 'Development',
      featured: 1
    },
    {
      id: uuidv4(),
      title: 'Product Management',
      description: 'Learn how to lead product development from ideation to launch. Understand user research, roadmap planning, agile methodologies, and stakeholder management. Become the product leader companies need.',
      short_description: 'Lead products from concept to successful launch',
      duration: '12 weeks',
      skill_level: 'Intermediate',
      price: 119.00,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      instructor: 'Rachel Green',
      category: 'Business',
      featured: 0
    }
  ];

  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, description, short_description, duration, skill_level, price, image, instructor, category, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertModule = db.prepare(`
    INSERT INTO modules (id, course_id, title, description, duration, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  courses.forEach(course => {
    insertCourse.run(
      course.id, course.title, course.description, course.short_description,
      course.duration, course.skill_level, course.price, course.image,
      course.instructor, course.category, course.featured
    );

    // Add modules for each course
    const modules = [
      { title: 'Introduction & Setup', description: 'Get started with the basics', duration: '2 hours' },
      { title: 'Core Concepts', description: 'Learn fundamental principles', duration: '4 hours' },
      { title: 'Hands-on Practice', description: 'Apply what you have learned', duration: '6 hours' },
      { title: 'Advanced Topics', description: 'Dive deeper into complex subjects', duration: '5 hours' },
      { title: 'Final Project', description: 'Build a real-world project', duration: '8 hours' }
    ];

    modules.forEach((module, index) => {
      insertModule.run(uuidv4(), course.id, module.title, module.description, module.duration, index + 1);
    });
  });

  // Create demo user
  const hashedPassword = bcrypt.hashSync('demo123', 10);
  const demoUserId = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password, name)
    VALUES (?, ?, ?, ?)
  `).run(demoUserId, 'demo@example.com', hashedPassword, 'Demo User');

  // Add sample reviews
  const reviews = [
    { name: 'Jennifer L.', comment: 'This course transformed my career. The content is well-structured and the instructor explains complex concepts clearly.' },
    { name: 'Mark S.', comment: 'Excellent course with practical examples. I was able to apply what I learned immediately at work.' },
    { name: 'Anna K.', comment: 'The best investment I made in my education. High-quality content and great community support.' },
    { name: 'Robert M.', comment: 'Clear, concise, and professional. Exactly what I needed to level up my skills.' }
  ];

  // Create review users and reviews
  const courseIds = db.prepare('SELECT id FROM courses').all();
  reviews.forEach((review, index) => {
    const reviewUserId = uuidv4();
    const hashedPw = bcrypt.hashSync('password123', 10);
    db.prepare('INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)').run(
      reviewUserId, `user${index}@example.com`, hashedPw, review.name
    );

    if (courseIds[index % courseIds.length]) {
      db.prepare('INSERT INTO reviews (id, user_id, course_id, rating, comment) VALUES (?, ?, ?, ?, ?)').run(
        uuidv4(), reviewUserId, courseIds[index % courseIds.length].id, 5, review.comment
      );
    }
  });

  console.log('Database seeded successfully');
}

export default db;
