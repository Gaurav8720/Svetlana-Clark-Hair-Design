/* ==========================================
   MAIN JS MODULE - Svetlana Clark Hair Design
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Sticky/Scrolled Header Shadow Effect
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 3. Virtual Consultation Form Submission Simulator
  const consultationForm = document.getElementById('consultationForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  if (consultationForm && formSuccessMessage) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get submit button to show loading
      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Hide form and show success message
        consultationForm.style.display = 'none';
        formSuccessMessage.style.display = 'block';
        
        // Smooth scroll to success message
        formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
    });
  }

  // 4. Contact Form Submission Simulator (for contact page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.backgroundColor = '#5b4648';
        submitBtn.style.color = '#ffffff';
        
        // Reset form
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
        }, 3000);
      }, 1200);
    });
  }

  // 5. Active Link Highlight (based on URL)
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 6. Before/After Image Slider Drag Logic
  const slider = document.getElementById('beforeAfterSlider');
  const beforeWrapper = document.getElementById('beforeImageWrapper');
  const sliderBar = document.getElementById('sliderBar');

  if (slider && beforeWrapper && sliderBar) {
    let isDragging = false;

    function moveSlider(x) {
      const rect = slider.getBoundingClientRect();
      const position = x - rect.left;
      let percent = (position / rect.width) * 100;
      
      // Constrain percentages
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;

      // Update positions
      sliderBar.style.left = `${percent}%`;
      beforeWrapper.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }

    // Mouse events
    sliderBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault(); // Prevent text selection/drag ghosting
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    // Touch events
    sliderBar.addEventListener('touchstart', (e) => {
      isDragging = true;
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        moveSlider(e.touches[0].clientX);
      }
    });
  }
});
