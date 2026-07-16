const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById('progress');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navLinks');
const topButton = document.getElementById('topButton');
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
const contactFields = ['name', 'email', 'subject', 'message'];
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalBadges = document.getElementById('modalBadges');
const modalFeatures = document.getElementById('modalFeatures');
const modalGithub = document.getElementById('modalGithub');
const typingElement = document.getElementById('typing');
const revealElements = document.querySelectorAll('.reveal');
const projects = document.querySelectorAll('[data-project]');
const loadingScreen = document.getElementById('loadingScreen');
const yearTarget = document.getElementById('year');

const projectData = {
  honeypot: {
    title: 'Agentic Honeypot',
    description: 'AI-powered honeypot system that interacts with scammers and captures fraud messages for analysis.',
    tech: ['Python', 'FastAPI', 'AI Agents', 'NLP', 'MongoDB'],
    features: ['Scam message collection', 'Fraud analysis', 'Threat intelligence', 'Automated monitoring'],
    github: 'https://github.com/Enochgideon17',
  },
  fakejob: {
    title: 'Fake Job Detector',
    description: 'Machine learning application that identifies fraudulent job postings using NLP and model-based risk analysis.',
    tech: ['Python', 'Scikit-learn', 'NLP', 'Streamlit'],
    features: ['TF-IDF vectorization', 'Logistic Regression', 'Real-time job scam detection', 'Risk analysis'],
    github: 'https://github.com/Enochgideon17',
  },
  handsign: {
    title: 'Hand Sign Detection System',
    description: 'Real-time gesture recognition system using computer vision and optimized webcam processing.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'Computer Vision'],
    features: ['Hand landmark detection', 'Gesture recognition', 'Real-time webcam processing', 'Optimized image pipeline'],
    github: 'https://github.com/Enochgideon17',
  }
};

const typingWords = ['AI-driven systems.', 'full-stack applications.', 'problem-solving workflows.'];
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer;

function setTheme(theme) {
  body.dataset.theme = theme;
  localStorage.setItem('portfolioTheme', theme);
  const isLight = theme === 'light';
  themeToggle.textContent = isLight ? 'Dark' : 'Light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
}

function initTheme() {
  const saved = localStorage.getItem('portfolioTheme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(saved || systemTheme);
}

function handleTyping() {
  if (!typingElement) return;
  const currentWord = typingWords[typingIndex];
  if (!isDeleting) {
    charIndex += 1;
    typingElement.textContent = currentWord.slice(0, charIndex);
    if (charIndex === currentWord.length) {
      isDeleting = true;
      typingTimer = window.setTimeout(handleTyping, 1200);
      return;
    }
  } else {
    charIndex -= 1;
    typingElement.textContent = currentWord.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingWords.length;
    }
  }
  typingTimer = window.setTimeout(handleTyping, isDeleting ? 60 : 90);
}

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (topButton) topButton.classList.toggle('visible', scrollTop > 560);
}

function highlightNav() {
  const scrollY = window.scrollY;
  document.querySelectorAll('main section[id]').forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    }
  });
}

function revealOnScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}

function openProjectModal(key) {
  const project = projectData[key];
  if (!project) return;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalBadges.innerHTML = project.tech.map(tag => `<span>${tag}</span>`).join('');
  modalFeatures.innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
  modalGithub.href = project.github;
  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function validateForm(event) {
  event.preventDefault();
  let valid = true;
  const values = {};

  contactFields.forEach(field => {
    const input = document.getElementById(field);
    const isFilled = input.value.trim().length > 0;
    input.classList.toggle('is-invalid', !isFilled);
    if (!isFilled) valid = false;
    values[field] = input.value.trim();
  });

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    valid = false;
    document.getElementById('email').classList.add('is-invalid');
  }

  if (valid) {
    feedback.textContent = 'Message ready to send. Thank you, I will review and respond soon.';
    form.reset();
  } else {
    feedback.textContent = 'Please complete all fields and use a valid email.';
  }
}

function closeNavigation() {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function setupNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', closeNavigation);
  });

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeNavigation();
  });
}

function setupProjects() {
  projects.forEach(card => {
    const button = card.querySelector('.project-btn');
    if (button) {
      button.addEventListener('click', () => {
        openProjectModal(card.dataset.project);
      });
    }
  });
}

function setupEventListeners() {
  themeToggle.addEventListener('click', () => {
    setTheme(body.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  window.addEventListener('scroll', () => {
    updateProgress();
    highlightNav();
  });

  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  modalClose.addEventListener('click', closeProjectModal);
  modalBackdrop.addEventListener('click', event => {
    if (event.target === modalBackdrop) closeProjectModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeProjectModal();
      closeNavigation();
    }
  });

  form.addEventListener('submit', validateForm);
}

function initObservers() {
  const observer = new IntersectionObserver(revealOnScroll, {
    rootMargin: '0px 0px -120px 0px',
    threshold: 0.1,
  });
  revealElements.forEach(el => observer.observe(el));
}

function initLoadingScreen() {
  if (!loadingScreen) return;
  window.setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 900);
}

function init() {
  if (yearTarget) yearTarget.textContent = new Date().getFullYear();
  initTheme();
  handleTyping();
  setupEventListeners();
  setupNavigation();
  setupProjects();
  initObservers();
  updateProgress();
  highlightNav();
  initLoadingScreen();
}

init();
