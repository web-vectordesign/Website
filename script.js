// ==================== YEAR UPDATE ====================
document.getElementById('year').textContent = new Date().getFullYear();

// ==================== CUSTOM CURSOR ====================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.innerWidth > 768) {
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let outlineX = 0, outlineY = 0;
  
  // Smooth cursor following
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateCursor() {
    // Smooth interpolation for dot
    dotX += (mouseX - dotX) * 0.3; // Faster response
    dotY += (mouseY - dotY) * 0.3;
    
    // Smooth interpolation for outline (slightly delayed)
    outlineX += (mouseX - outlineX) * 0.15; // Faster response
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();

  // Cursor interaction with clickable elements
  const clickables = document.querySelectorAll('a, button, .project-card, .service-card');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'scale(2)';
      cursorOutline.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'scale(1)';
      cursorOutline.style.transform = 'scale(1)';
    });
  });
}

// ==================== PARTICLE CANVAS ====================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 60; // Reduced from 80 for better performance

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1.5 - 0.75; // Faster movement
    this.speedY = Math.random() * 1.5 - 0.75; // Faster movement
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x > canvas.width || this.x < 0) {
      this.speedX *= -1;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.speedY *= -1;
    }
  }
  
  draw() {
    ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
    
    // Connect particles - reduced distance for better performance
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) { // Reduced from 120 for faster rendering
        ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 - distance / 500})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
  
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Resize canvas on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particlesArray.length = 0;
  initParticles();
});

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ==================== MOBILE NAVIGATION ====================
const navToggle = document.querySelector('.nav-toggle');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navbar.classList.toggle('open');
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('open');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navbar.classList.remove('open');
    }
  });
}

// ==================== SMOOTH SCROLL FOR NAVIGATION LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.workflow-step, .service-card, .project-card, .feature-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)'; // Reduced from 30px
  el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out'; // Faster animation
  observer.observe(el);
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  // Parallax for orbs
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 0.05;
    orb.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed * 0.3}px)`;
  });
});

// ==================== 3D TILT EFFECT FOR CARDS ====================
function tiltCard(e) {
  if (window.innerWidth <= 768) return; // Disable on mobile
  
  const card = e.currentTarget;
  const cardRect = card.getBoundingClientRect();
  const cardCenterX = cardRect.left + cardRect.width / 2;
  const cardCenterY = cardRect.top + cardRect.height / 2;
  
  const angleX = (e.clientY - cardCenterY) / 20;
  const angleY = (cardCenterX - e.clientX) / 20;
  
  card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
}

// Apply tilt effect to cards
document.querySelectorAll('.project-card, .service-card, .feature-card').forEach(card => {
  card.addEventListener('mousemove', tiltCard);
  card.addEventListener('mouseleave', resetTilt);
});

// ==================== BUTTON RIPPLE EFFECT ====================
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ripple-effect 0.6s ease-out';
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-effect {
    to {
      width: 300px;
      height: 300px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ==================== ICON ANIMATION ON HOVER ====================
document.querySelectorAll('.service-card, .feature-card, .contact-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    const icon = this.querySelector('.service-icon, .feature-icon, .contact-icon');
    if (icon) {
      icon.style.transition = 'transform 0.2s ease-out'; // Faster transition
      icon.style.transform = 'scale(1.2) rotate(5deg)';
    }
  });
  
  card.addEventListener('mouseleave', function() {
    const icon = this.querySelector('.service-icon, .feature-icon, .contact-icon');
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
  });
});

// ==================== SECTION REVEAL ON SCROLL ====================
const sections = document.querySelectorAll('section');
const revealSection = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  threshold: 0.1
});

sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(15px)'; // Reduced from 20px
  section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'; // Faster
  sectionObserver.observe(section);
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Debounce function for scroll events
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ==================== PRELOADER ====================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s ease-out'; // Faster fade-in
    document.body.style.opacity = '1';
  }, 50); // Reduced delay
});

// Logo is now a static image; rotate animation removed.

// ==================== PROJECT CARD OVERLAY ANIMATION ====================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    const overlay = this.querySelector('.project-overlay');
    const tag = this.querySelector('.project-tag');
    
    if (overlay) {
      overlay.style.opacity = '1';
    }
    if (tag) {
      tag.style.animation = 'slideUp 0.3s ease';
    }
  });
  
  card.addEventListener('mouseleave', function() {
    const overlay = this.querySelector('.project-overlay');
    
    if (overlay) {
      overlay.style.opacity = '0';
    }
  });
});

// Add slideUp animation
const slideUpStyle = document.createElement('style');
slideUpStyle.textContent = `
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(slideUpStyle);

// ==================== WORKFLOW STEP SEQUENTIAL ANIMATION ====================
const workflowSteps = document.querySelectorAll('.workflow-step');
const workflowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      workflowSteps.forEach((step, index) => {
        setTimeout(() => {
          step.style.opacity = '1';
          step.style.transform = 'translateY(0)';
        }, index * 60); // Reduced from 100ms to 60ms
      });
      workflowObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

if (workflowSteps.length > 0) {
  workflowObserver.observe(workflowSteps[0]);
}

// ==================== RESPONSIVE CHECKS ====================
function handleResize() {
  if (window.innerWidth <= 768) {
    // Disable cursor effects on mobile
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
  } else {
    if (cursorDot) cursorDot.style.display = 'block';
    if (cursorOutline) cursorOutline.style.display = 'block';
  }
}

window.addEventListener('resize', debounce(handleResize, 250));
handleResize(); // Run on load

console.log('🚀 Vector Design - Enhanced Portfolio Loaded');
console.log('💻 All animations and interactions active');
console.log('📱 Fully responsive across all devices');
