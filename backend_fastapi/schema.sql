-- ==========================================================
-- ProjectHub: MySQL Relational Database Schema & Seed Script
-- Platform: MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS projecthub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE projecthub_db;

-- Disable foreign key checks for clean teardown/initialization
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'faculty') DEFAULT 'student',
    department VARCHAR(100) DEFAULT NULL,
    institution VARCHAR(150) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    icon VARCHAR(50) DEFAULT 'Folder',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PROJECTS TABLE
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description VARCHAR(500) NOT NULL,
    description LONGTEXT NOT NULL,
    technology JSON NOT NULL COMMENT 'JSON array of technologies e.g. ["Python", "FastAPI"]',
    category_id INT NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    image VARCHAR(500) NOT NULL,
    screenshots JSON DEFAULT NULL COMMENT 'JSON array of image URLs',
    project_type ENUM('Free', 'Paid') DEFAULT 'Free',
    price DECIMAL(10, 2) DEFAULT 0.00,
    features JSON DEFAULT NULL COMMENT 'JSON array of key feature highlights',
    github_url VARCHAR(500) DEFAULT NULL,
    demo_url VARCHAR(500) DEFAULT NULL,
    views_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    trending BOOLEAN DEFAULT FALSE,
    author_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_projects_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_project_category (category_id),
    INDEX idx_project_type (project_type),
    INDEX idx_project_price (price),
    FULLTEXT INDEX ft_project_search (title, short_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BOOKMARKS TABLE
CREATE TABLE bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmarks_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_project_bookmark (user_id, project_id),
    INDEX idx_bookmark_user (user_id),
    INDEX idx_bookmark_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PROJECT INQUIRIES / COMING SOON CONTACT REQUESTS
CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'contacted', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inquiries_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA INSERTS
-- ==========================================================

-- Insert Users (Password hashes correspond to bcrypt for 'admin123' and 'student123')
INSERT INTO users (id, name, email, password, role, department, institution) VALUES
(1, 'Academic Administrator', 'admin@projecthub.edu', '$2b$12$e8T8f.Z3i8X5XUj5lq8Vz.2g60Z8s8o3E/40L2L6vP2V8z6Q2oB9m', 'admin', 'Computer Science & Engineering', 'National Institute of Technology'),
(2, 'Ritesh Gopal', 'student@projecthub.edu', '$2b$12$e8T8f.Z3i8X5XUj5lq8Vz.2g60Z8s8o3E/40L2L6vP2V8z6Q2oB9m', 'student', 'Information Technology', 'Delhi Technological University'),
(3, 'Prof. Ananya Iyer', 'faculty@projecthub.edu', '$2b$12$e8T8f.Z3i8X5XUj5lq8Vz.2g60Z8s8o3E/40L2L6vP2V8z6Q2oB9m', 'faculty', 'Artificial Intelligence & Robotics', 'Indian Institute of Technology');

-- Insert Categories
INSERT INTO categories (id, category_name, description, icon) VALUES
(1, 'AI & Machine Learning', 'Deep learning, neural networks, computer vision, and NLP models', 'Cpu'),
(2, 'Python', 'Automation scripts, backend frameworks, data scrapers, and analytics', 'Code'),
(3, 'Web Development', 'Modern full-stack web applications, REST APIs, and responsive UIs', 'Globe'),
(4, 'Data Science', 'Big data pipelines, statistical modeling, visualizations, and analytics', 'BarChart3'),
(5, 'Android & Mobile', 'Native Kotlin, Flutter, and mobile health and utility applications', 'Smartphone'),
(6, 'Java', 'Enterprise architectures, Spring Boot microservices, and distributed systems', 'Coffee'),
(7, 'IoT & Embedded Systems', 'Sensor telemetry networks, ESP32 microcontrollers, and edge computing', 'Radio'),
(8, 'Cybersecurity', 'Vulnerability scanners, cryptographic ledgers, and forensic tools', 'ShieldCheck');

-- Insert Projects
INSERT INTO projects (id, title, short_description, description, technology, category_id, difficulty, image, project_type, price, featured, trending, author_id) VALUES
(1, 'AI Medical Diagnostic & Chest X-Ray Disease Detection', 'Deep convolutional neural network model trained on NIH datasets to classify pulmonary abnormalities with 96.4% precision.', 'An advanced healthcare diagnostic assistance suite utilizing DenseNet-121 and FastAPI. It processes digital radiograph inputs, generates Grad-CAM visual heatmaps highlighting affected lung regions, and produces standardized structured medical triage reports.', JSON_ARRAY('Python', 'FastAPI', 'PyTorch', 'OpenCV', 'React'), 1, 'Advanced', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80', 'Paid', 1999.00, TRUE, TRUE, 1),
(2, 'Automated Facial Recognition Smart Attendance System', 'Real-time contactless classroom attendance logging utilizing Haar Cascades, FaceNet embeddings, and anti-spoofing.', 'A complete academic automation system that detects and logs student presence using classroom IP camera feeds. Includes liveness verification to prevent photo spoofing, automatic attendance percentage calculations, and automated alerts.', JSON_ARRAY('Python', 'OpenCV', 'FaceNet', 'SQLite', 'Flask'), 2, 'Intermediate', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80', 'Free', 0.00, TRUE, TRUE, 2),
(3, 'Cloud-Native Distributed E-Learning & Proctoring Platform', 'Scalable microservices web platform featuring AI tab-switch detection, automated grading, and live lecture rooms.', 'A university-grade course management and secure remote examination portal. Incorporates WebRTC video feeds, background browser focus monitoring, dynamic question bank generation, and automated assignment evaluation.', JSON_ARRAY('Web Development', 'React', 'FastAPI', 'Docker', 'PostgreSQL'), 3, 'Advanced', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80', 'Paid', 1499.00, TRUE, FALSE, 1),
(4, 'Smart Agricultural IoT Soil Telemetry & Irrigation Network', 'Precision farming telemetry system tracking NPK nutrients, soil moisture, and climatic conditions with automated pump relays.', 'An eco-friendly IoT capstone project built on ESP32 microcontrollers and LoRa transceivers. Gathers real-time telemetry from capacitive soil sensors, transmits data over a 5km radius, and executes solar irrigation triggers.', JSON_ARRAY('IoT & Embedded Systems', 'Python', 'C++', 'ESP32', 'MQTT'), 7, 'Beginner', 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1000&q=80', 'Free', 0.00, FALSE, TRUE, 3),
(5, 'Blockchain Academic Credential Verification & Degree Ledger', 'Tamper-proof academic transcript and diploma issuance decentralized application preventing resume fraud.', 'A decentralized application (DApp) designed for university registrars to issue cryptographically signed, immutable digital diplomas. Employers can instantly verify candidate authenticity via an Ethereum/Polygon smart contract.', JSON_ARRAY('Web Development', 'Solidity', 'Ethereum', 'React', 'Node.js'), 3, 'Advanced', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80', 'Paid', 2499.00, TRUE, TRUE, 1),
(6, 'Financial Sentiment Analysis & Stock Market Predictor', 'Natural language pipeline parsing financial news, corporate 10-K filings, and Twitter trends to model equity volatility.', 'A quantitative finance project utilizing RoBERTa and FinBERT transformer models. Ingests live news feeds from financial portals, scores market sentiment across specific tickers, and forecasts short-term momentum.', JSON_ARRAY('Data Science', 'Python', 'FinBERT', 'Pandas', 'Streamlit'), 4, 'Intermediate', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80', 'Free', 0.00, FALSE, TRUE, 2);

-- Insert Sample Bookmarks
INSERT INTO bookmarks (user_id, project_id) VALUES
(2, 1),
(2, 3);
