import { Project, Category, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, category_name: 'AI & Machine Learning', description: 'Deep learning, neural networks, computer vision, and NLP models', icon: 'Cpu', project_count: 14 },
  { id: 2, category_name: 'Python', description: 'Automation scripts, backend frameworks, data scrapers, and analytics', icon: 'Code', project_count: 22 },
  { id: 3, category_name: 'Web Development', description: 'Modern full-stack web applications, REST APIs, and responsive UIs', icon: 'Globe', project_count: 31 },
  { id: 4, category_name: 'Data Science', description: 'Big data pipelines, statistical modeling, visualizations, and analytics', icon: 'BarChart3', project_count: 18 },
  { id: 5, category_name: 'Android & Mobile', description: 'Native Kotlin, Flutter, and mobile health and utility applications', icon: 'Smartphone', project_count: 12 },
  { id: 6, category_name: 'Java', description: 'Enterprise architectures, Spring Boot microservices, and distributed systems', icon: 'Coffee', project_count: 15 },
  { id: 7, category_name: 'IoT & Embedded Systems', description: 'Sensor telemetry networks, ESP32 microcontrollers, and edge computing', icon: 'Radio', project_count: 9 },
  { id: 8, category_name: 'Cybersecurity', description: 'Vulnerability scanners, cryptographic ledgers, and forensic tools', icon: 'ShieldCheck', project_count: 8 },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'AI Medical Diagnostic & Chest X-Ray Disease Detection',
    short_description: 'Deep convolutional neural network model trained on NIH datasets to classify pulmonary abnormalities with 96.4% precision.',
    description: 'An advanced healthcare diagnostic assistance suite utilizing DenseNet-121 and FastAPI. It processes digital radiograph inputs, generates Grad-CAM visual heatmaps highlighting affected lung regions, and produces standardized structured medical triage reports. Designed for telemedicine clinics and biomedical research projects.',
    technology: ['Python', 'FastAPI', 'PyTorch', 'OpenCV', 'React'],
    category: 'AI & Machine Learning',
    difficulty: 'Advanced',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Paid',
    price: 1999,
    created_at: '2025-02-15',
    views_count: 1420,
    featured: true,
    trending: true,
    author_id: 1,
    author_name: 'Dr. Aryan Sharma (IIT Delhi)',
    features: [
      'DenseNet-121 model with transfer learning weights',
      'Interactive Grad-CAM heat-map visualizer',
      'FastAPI asynchronous image processing pipeline',
      'Comprehensive PDF diagnostic report generation',
      'Doctor validation and annotation dashboard'
    ],
    github_url: 'https://github.com/projecthub-preview/ai-medical-diagnosis',
    demo_url: 'https://medical-ai-demo.projecthub.edu'
  },
  {
    id: 2,
    title: 'Automated Facial Recognition Smart Attendance System',
    short_description: 'Real-time contactless classroom attendance logging utilizing Haar Cascades, FaceNet embeddings, and anti-spoofing.',
    description: 'A complete academic automation system that detects and logs student presence using classroom IP camera feeds. Includes liveness verification to prevent photo spoofing, automatic attendance percentage calculations, and automated email alerts to parents and department heads when attendance drops below the 75% threshold.',
    technology: ['Python', 'OpenCV', 'FaceNet', 'SQLite', 'Flask'],
    category: 'Python',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Free',
    price: 0,
    created_at: '2025-01-20',
    views_count: 2850,
    featured: true,
    trending: true,
    author_id: 2,
    author_name: 'Pooja Verma (VTU Belagavi)',
    features: [
      'Live RTSP camera stream frame processing',
      'Blink detection anti-spoofing mechanism',
      'Exportable Excel and CSV attendance sheets',
      'Automated email notification dispatcher',
      'Full source code with virtual environment setup script'
    ],
    github_url: 'https://github.com/projecthub-preview/smart-attendance-system',
    demo_url: 'https://attendance-demo.projecthub.edu'
  },
  {
    id: 3,
    title: 'Cloud-Native Distributed E-Learning & Proctoring Platform',
    short_description: 'Scalable microservices web platform featuring AI tab-switch detection, automated grading, and live lecture rooms.',
    description: 'A university-grade course management and secure remote examination portal. Incorporates WebRTC video feeds, background browser focus monitoring, dynamic question bank generation, and automated assignment evaluation with code execution sandboxes.',
    technology: ['Web Development', 'React', 'FastAPI', 'Docker', 'PostgreSQL'],
    category: 'Web Development',
    difficulty: 'Advanced',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Paid',
    price: 1499,
    created_at: '2025-02-02',
    views_count: 1890,
    featured: true,
    trending: false,
    author_id: 1,
    author_name: 'TechLabs Academic Consortium',
    features: [
      'Secure full-screen lock and audio proctoring',
      'Interactive quiz engine with random seed questions',
      'FastAPI asynchronous database pooling',
      'Docker Compose scripts for one-click deployment',
      'Role-based authorization for Instructors, TAs, and Students'
    ],
    github_url: 'https://github.com/projecthub-preview/cloud-elearning-suite',
    demo_url: 'https://elearning-demo.projecthub.edu'
  },
  {
    id: 4,
    title: 'Smart Agricultural IoT Soil Telemetry & Irrigation Network',
    short_description: 'Precision farming telemetry system tracking NPK nutrients, soil moisture, and climatic conditions with automated pump relays.',
    description: 'An eco-friendly IoT capstone project built on ESP32 microcontrollers and LoRa transceivers. Gathers real-time telemetry from capacitive soil sensors, transmits data over a 5km radius to a central gateway, and executes solar irrigation triggers based on predictive evapotranspiration models.',
    technology: ['IoT & Embedded Systems', 'Python', 'C++', 'ESP32', 'MQTT'],
    category: 'IoT & Embedded Systems',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Free',
    price: 0,
    created_at: '2025-01-10',
    views_count: 940,
    featured: false,
    trending: true,
    author_id: 3,
    author_name: 'Kavita Menon (Anna University)',
    features: [
      'Circuit schematics and Fritzing diagram files',
      'ESP32 firmware code with low-power sleep modes',
      'MQTT broker integration with Python dashboard',
      'SMS alerts via Twilio/GSM module fallback',
      'Cost-effective BOM (Bill of Materials) under ₹1,500'
    ],
    github_url: 'https://github.com/projecthub-preview/smart-agri-iot',
    demo_url: 'https://agri-iot-demo.projecthub.edu'
  },
  {
    id: 5,
    title: 'Blockchain Academic Credential Verification & Degree Ledger',
    short_description: 'Tamper-proof academic transcript and diploma issuance decentralized application preventing resume fraud.',
    description: 'A decentralized application (DApp) designed for university registrars to issue cryptographically signed, immutable digital diplomas. Employers can instantly verify candidate authenticity via an Ethereum/Polygon smart contract using a single QR code scan or PDF cryptographic hash.',
    technology: ['Web Development', 'Solidity', 'Ethereum', 'React', 'Node.js'],
    category: 'Web Development',
    difficulty: 'Advanced',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Paid',
    price: 2499,
    created_at: '2025-02-20',
    views_count: 1720,
    featured: true,
    trending: true,
    author_id: 1,
    author_name: 'Rohit Kulkarni (BITS Pilani)',
    features: [
      'Hardhat & Solidity verifiable diploma smart contracts',
      'IPFS decentralized metadata and document storage',
      'Instant QR-code verification portal for hiring managers',
      'Gas-optimized bulk batch minting for university batches',
      'Comprehensive deployment guide on Polygon Testnet'
    ],
    github_url: 'https://github.com/projecthub-preview/blockchain-credentials',
    demo_url: 'https://credential-verify.projecthub.edu'
  },
  {
    id: 6,
    title: 'Financial Sentiment Analysis & Stock Market Predictor',
    short_description: 'Natural language pipeline parsing financial news, corporate 10-K filings, and Twitter trends to model equity volatility.',
    description: 'A quantitative finance project utilizing RoBERTa and FinBERT transformer models. Ingests live news feeds from financial portals, scores market sentiment across specific tickers, and combines historical price technical indicators with sentiment vectors to forecast short-term momentum.',
    technology: ['Data Science', 'Python', 'FinBERT', 'Pandas', 'Streamlit'],
    category: 'Data Science',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Free',
    price: 0,
    created_at: '2025-01-28',
    views_count: 3120,
    featured: false,
    trending: true,
    author_id: 4,
    author_name: 'Sneha Patel (IIM Ahmedabad & DA-IICT)',
    features: [
      'Pre-trained FinBERT pipeline fine-tuned on financial filings',
      'Automated RSS and Twitter stream scraper',
      'Interactive Plotly candlestick charts with sentiment overlay',
      'Backtesting framework with Sharpe Ratio metrics',
      'Modular Jupyter notebooks with explanatory notes'
    ],
    github_url: 'https://github.com/projecthub-preview/stock-sentiment-nlp',
    demo_url: 'https://stock-nlp-demo.projecthub.edu'
  },
  {
    id: 7,
    title: 'Android Telemedicine & Chronic Patient Vitals Monitor',
    short_description: 'Native mobile health app with Bluetooth BLE pulse oximeter pairing, emergency SOS geofencing, and prescription manager.',
    description: 'A robust Android application engineered for remote geriatric care. Synchronizes heart rate and oxygen saturation via Bluetooth Low Energy (BLE), alerts designated caregivers upon abnormal biometric spikes, and manages dosage schedules with local notification alarms.',
    technology: ['Android & Mobile', 'Kotlin', 'Jetpack Compose', 'Bluetooth BLE', 'Room DB'],
    category: 'Android & Mobile',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Paid',
    price: 1799,
    created_at: '2025-02-12',
    views_count: 890,
    featured: false,
    trending: false,
    author_id: 5,
    author_name: 'Aditya Nair (NIT Calicut)',
    features: [
      'Modern Jetpack Compose Material 3 interface',
      'Standard Bluetooth GATT profile listener',
      'Offline-first architecture with Room SQLite caching',
      'One-tap SOS dispatching GPS coordinates via SMS',
      'Complete Android Studio project with APK build'
    ],
    github_url: 'https://github.com/projecthub-preview/android-telemed-vital',
    demo_url: 'https://telemed-demo.projecthub.edu'
  },
  {
    id: 8,
    title: 'Enterprise University Library & Resource Repository System',
    short_description: 'Modular Java Spring Boot system with barcode scanning, automated fine calculations, and inter-department book reservations.',
    description: 'A production-grade institutional resource management platform built with Java 17 and Spring Boot. Features role-based access control for librarians, professors, and students, RFID/Barcode book checkouts, automated reminder emails for overdue items, and comprehensive analytical audit logs.',
    technology: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'Thymeleaf'],
    category: 'Java',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Free',
    price: 0,
    created_at: '2025-01-05',
    views_count: 1540,
    featured: false,
    trending: false,
    author_id: 2,
    author_name: 'Deepak Rao (RVCE Bengaluru)',
    features: [
      'Complete Spring Security authentication with BCrypt',
      'MySQL schema with relational integrity and Flyway migrations',
      'Custom fine calculation algorithm with grace periods',
      'Barcode generator and scanner integration',
      'Comprehensive JavaDoc and Unit test coverage with JUnit 5'
    ],
    github_url: 'https://github.com/projecthub-preview/spring-library-manager',
    demo_url: 'https://library-demo.projecthub.edu'
  },
  {
    id: 9,
    title: 'Intelligent Real-time Traffic Signal Optimization using YOLOv8',
    short_description: 'Computer vision framework estimating vehicle density per junction quadrant to dynamically modulate green-signal durations.',
    description: 'An urban mobility engineering system that replaces fixed-timer traffic signals with an intelligent density-responsive algorithm. Utilizing YOLOv8 object detection, it quantifies passenger cars, buses, and emergency vehicles, granting dynamic right-of-way priorities and reducing peak congestion by up to 34%.',
    technology: ['AI & Machine Learning', 'Python', 'YOLOv8', 'OpenCV', 'PyQt5'],
    category: 'AI & Machine Learning',
    difficulty: 'Advanced',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
    ],
    project_type: 'Paid',
    price: 1999,
    created_at: '2025-02-18',
    views_count: 2150,
    featured: true,
    trending: true,
    author_id: 1,
    author_name: 'Vikas Singhal & Team (DTU Delhi)',
    features: [
      'Trained weights for vehicle classification in high density',
      'Emergency vehicle siren & ambulance priority override',
      'Simulation environment with SUMO (Simulation of Urban MObility)',
      'Multi-threading for 60 FPS video ingestion on standard GPU',
      'Ready-to-run demonstration video and project report documentation'
    ],
    github_url: 'https://github.com/projecthub-preview/yolo-traffic-controller',
    demo_url: 'https://traffic-ai-demo.projecthub.edu'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Academic Administrator',
    email: 'admin@projecthub.edu',
    role: 'admin',
    department: 'Computer Science & Engineering',
    institution: 'National Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    created_at: '2024-11-01'
  },
  {
    id: 2,
    name: 'Ritesh Gopal',
    email: 'student@projecthub.edu',
    role: 'student',
    department: 'Information Technology',
    institution: 'Delhi Technological University',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-15'
  },
  {
    id: 3,
    name: 'Prof. Ananya Iyer',
    email: 'faculty@projecthub.edu',
    role: 'faculty',
    department: 'Artificial Intelligence & Robotics',
    institution: 'Indian Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    created_at: '2024-12-10'
  }
];
