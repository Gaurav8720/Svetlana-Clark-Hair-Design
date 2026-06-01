/* 
 * Svetlana Clark Hair Design Rebuild
 * Unified Client Interactions Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initHeroSlider();
  initTestimonialsCarousel();
  initConsultationForm();
  initHairQuiz();
  initBookingWizard();
  initGuestIntakeWizard();
  initServicesFilter();
  initLookbookLightbox();
  initFaqAccordion();
});

/* --- MOBILE MENU TOGGLE --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* --- HEADER TRANSPARENCY ON SCROLL --- */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --- AUTO HERO SLIDER --- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide-img');
  if (slides.length <= 1) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 6000);
}

/* --- TESTIMONIALS CAROUSEL --- */
function initTestimonialsCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let intervalId;

  // Create indicator dots dynamically
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.carousel-dot').forEach(d => d.classList.remove('active'));

    currentSlide = idx;

    slides[currentSlide].classList.add('active');
    const dots = document.querySelectorAll('.carousel-dot');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function startAutoplay() {
    intervalId = setInterval(() => {
      let nextSlide = (currentSlide + 1) % slides.length;
      goToSlide(nextSlide);
    }, 8000);
  }

  function resetAutoplay() {
    clearInterval(intervalId);
    startAutoplay();
  }

  startAutoplay();
}

/* --- MULTI-STEP VIRTUAL CONSULTATION FORM --- */
function initConsultationForm() {
  const formSteps = document.querySelectorAll('.consult-form-step');
  const nextBtns = document.querySelectorAll('.btn-form.next');
  const prevBtns = document.querySelectorAll('.btn-form.prev');
  const dots = document.querySelectorAll('.step-dot');
  const form = document.getElementById('consultationForm');
  const successMsg = document.querySelector('.success-message');

  if (!form) return;

  let currentStep = 0;

  function updateSteps() {
    formSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx <= currentStep);
    });
  }

  function loadSavedConsultation() {
    const saved = localStorage.getItem('savedConsultationForm');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (document.getElementById('fullName')) document.getElementById('fullName').value = data.fullName || '';
        if (document.getElementById('phoneNumber')) document.getElementById('phoneNumber').value = data.phoneNumber || '';
        if (document.getElementById('servicesInterested')) document.getElementById('servicesInterested').value = data.servicesInterested || '';
        if (document.getElementById('preferredDate')) document.getElementById('preferredDate').value = data.preferredDate || '';
        if (document.getElementById('preferredTime')) document.getElementById('preferredTime').value = data.preferredTime || '';
      } catch (e) {
        console.error('Error parsing saved consultation form', e);
      }
    }
  }

  loadSavedConsultation();

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Validate inputs in current step
      const stepInputs = formSteps[currentStep].querySelectorAll('input, textarea, select');
      let valid = true;

      stepInputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('error');
          valid = false;
        } else {
          input.classList.remove('error');
        }
      });

      if (!valid) {
        alert('Please fill out all required fields.');
        return;
      }

      if (currentStep < formSteps.length - 1) {
        currentStep++;
        updateSteps();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateSteps();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Save to localStorage
    const formData = {
      fullName: document.getElementById('fullName')?.value || '',
      phoneNumber: document.getElementById('phoneNumber')?.value || '',
      servicesInterested: document.getElementById('servicesInterested')?.value || '',
      preferredDate: document.getElementById('preferredDate')?.value || '',
      preferredTime: document.getElementById('preferredTime')?.value || '',
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem('savedConsultationForm', JSON.stringify(formData));

    // Simulate submission
    form.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
  });
}

/* --- HAIR HEALTH & RECOMMENDATION QUIZ --- */
function initHairQuiz() {
  const quizSteps = document.querySelectorAll('.quiz-step');
  const cards = document.querySelectorAll('.quiz-card');
  const progressFill = document.querySelector('.quiz-progress-fill');
  const resultBox = document.querySelector('.quiz-result-box');
  const quizWrapper = document.querySelector('.quiz-wrapper');
  
  if (quizSteps.length === 0) return;

  let answers = {
    texture: '',
    state: '',
    concern: '',
    goal: ''
  };

  let stepIdx = 0;

  function updateProgress() {
    if (progressFill) {
      const percentage = (stepIdx / quizSteps.length) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  }

  function loadSavedQuiz() {
    const savedRec = localStorage.getItem('savedQuizRecommendation');
    const savedAns = localStorage.getItem('savedQuizAnswers');
    if (savedRec && savedAns) {
      try {
        const rec = JSON.parse(savedRec);
        answers = JSON.parse(savedAns);
        
        if (quizWrapper) quizWrapper.style.display = 'none';
        if (resultBox) {
          resultBox.style.display = 'block';
          updateProgress();
          const badge = resultBox.querySelector('.result-badge');
          const details = resultBox.querySelector('.result-details');
          if (badge) badge.textContent = rec.title;
          if (details) details.textContent = rec.description;
        }
      } catch (e) {
        console.error('Error parsing saved quiz', e);
      }
    }
  }

  loadSavedQuiz();

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const parentStep = card.closest('.quiz-step');
      const stepType = parentStep.dataset.step;
      const optionValue = card.dataset.value;

      answers[stepType] = optionValue;

      // Select active card
      parentStep.querySelectorAll('.quiz-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Proceed to next step after a tiny delay
      setTimeout(() => {
        parentStep.classList.remove('active');
        stepIdx++;

        if (stepIdx < quizSteps.length) {
          quizSteps[stepIdx].classList.add('active');
          updateProgress();
        } else {
          showQuizResults();
        }
      }, 350);
    });
  });

  function showQuizResults() {
    if (quizWrapper) quizWrapper.style.display = 'none';
    if (resultBox) {
      resultBox.style.display = 'block';
      updateProgress();

      const badge = resultBox.querySelector('.result-badge');
      const details = resultBox.querySelector('.result-details');

      // Recommendation Logic
      let recTitle = "Dimensional Balayage & Styling";
      let recDesc = "Based on your responses, we recommend a customized dimensional color session combined with a structured haircut to protect hair health while creating flawless transitions.";

      if (answers.state === 'damaged' && answers.goal === 'smooth') {
        recTitle = "Pura Luxe Amino Acid Smoothing Treatment";
        recDesc = "Your hair needs strength and frizz control. The Pura Luxe treatment is formaldehyde-free, using essential amino acids to lock in moisture, create smooth keratin-rich fibers, and dramatically reduce blow-dry time.";
      } else if (answers.concern === 'gray' || answers.goal === 'low-maintenance') {
        recTitle = "Expert Gray Blending & Balayage";
        recDesc = "To achieve beautiful transitions with soft maintenance, we recommend our specialized Gray Blending services. This technique highlights natural whites while keeping color natural and soft.";
      } else if (answers.texture === 'fine' && answers.goal === 'volume') {
        recTitle = "Precision Haircut & French Balayage";
        recDesc = "Fine hair requires detailed, weighted cuts. A bespoke pixie cut or tailored bob, combined with subtle balayage highlights, will create depth, movement, and visual volume.";
      }

      if (badge) badge.textContent = recTitle;
      if (details) details.textContent = recDesc;

      // Save to localStorage
      localStorage.setItem('savedQuizAnswers', JSON.stringify(answers));
      localStorage.setItem('savedQuizRecommendation', JSON.stringify({ title: recTitle, description: recDesc }));
    }
  }

  // Reset Button
  const resetBtn = document.getElementById('restartQuiz');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      answers = { texture: '', state: '', concern: '', goal: '' };
      stepIdx = 0;
      cards.forEach(c => c.classList.remove('selected'));
      localStorage.removeItem('savedQuizAnswers');
      localStorage.removeItem('savedQuizRecommendation');
      if (resultBox) resultBox.style.display = 'none';
      if (quizWrapper) quizWrapper.style.display = 'block';
      quizSteps.forEach((s, idx) => s.classList.toggle('active', idx === 0));
      updateProgress();
    });
  }
}

/* --- BOOKING CONCIERGE WIDGET --- */
const servicesData = [
  {
    id: 'consultation',
    name: 'Signature Consultation',
    desc: 'A personalized consultation to assess your hair, goals, and maintenance preferences. Required for all new color and lightening clients to ensure the right slot.',
    price: 0.00,
    duration: '15 min',
    durationMinutes: 15,
    img: 'assets/profile.jpeg'
  },
  {
    id: 'haircut',
    name: 'Haircut Experience',
    desc: 'A precision haircut designed specifically for your hair type, density, and lifestyle. Includes shampoo, conditioning treatment, and polished styling.',
    price: 150.00,
    duration: '1 hr',
    durationMinutes: 60,
    img: 'assets/hair_pixie.png'
  },
  {
    id: 'color',
    name: 'Color Experience (No Lightening)',
    desc: 'Designed for gray coverage, root maintenance, or full color refinement. This service enhances tone, shine, and overall polish while maintaining hair health.',
    price: 200.00,
    duration: '1 hr 30 min',
    durationMinutes: 90,
    img: 'assets/hair_balayage.png'
  },
  {
    id: 'lightening',
    name: 'Lightening Experience',
    desc: 'A high-integrity lightening service designed to create brightness, dimension, or full transformation while prioritizing long-term hair health.',
    price: 400.00,
    duration: '3 hr',
    durationMinutes: 180,
    img: 'assets/lookbook_2.jpeg'
  },
  {
    id: 'grayblending',
    name: 'Gray Blending Experience',
    desc: 'A customized, precision lightening service specifically designed to softly integrate natural gray and diffuse regrowth lines for a seamless, low-maintenance transition.',
    price: 550.00,
    duration: '4 hr',
    durationMinutes: 240,
    img: 'assets/gray_blending.jpeg'
  },
  {
    id: 'smoothing',
    name: 'Pura Luxe Smoothing Treatment',
    desc: 'The Pura Luxe Treatment is a revolutionary, non-toxic smoothing treatment that transforms the condition and manageability of your hair. Using a powerful blend of amino acids.',
    price: 350.00,
    duration: '3 hr',
    durationMinutes: 180,
    img: 'assets/smoothing_treatment.jpeg'
  },
  {
    id: 'formal',
    name: 'The Formal Style Experience',
    desc: 'High-end styling for weddings, galas, photo shoots, or special events, delivering lasting structure and flawless texture.',
    price: 150.00,
    duration: '1 hr',
    durationMinutes: 60,
    img: 'assets/lookbook_4.jpeg'
  }
];

const bookingWizardHTML = `
        <div class="booking-wizard-modal">
            <div class="booking-split-container">
                <!-- Main Content Column (Left) -->
                <div class="booking-main-content">
                    <div class="wizard-header" style="padding: 1.5rem 2rem; background: var(--color-bg-secondary); border-bottom: 1px solid rgba(192, 159, 87, 0.1); display: flex; justify-content: space-between; align-items: center;">
                        <h3 id="bookingWizardStepTitle" style="font-family: var(--font-heading); font-size: 1.35rem; margin: 0;">Select Services</h3>
                        <button class="wizard-close" id="bookingCloseBtn" aria-label="Close booking" style="font-size: 1.75rem; background: transparent; border: none; color: var(--color-text-muted); cursor: pointer;">&times;</button>
                    </div>
                    
                    <div class="wizard-body" style="padding: 2.25rem 2rem;">
                        <!-- Step 1: Services -->
                        <div class="wizard-step active" data-step="services">
                            <div class="booking-services-list" id="bookingServicesList"></div>
                        </div>
                        
                        <!-- Step 2: Date & Time -->
                        <div class="wizard-step" data-step="datetime">
                            <div class="booking-calendar-wrapper">
                                <div class="booking-calendar-header">
                                    <div class="booking-calendar-month">Jun 2026</div>
                                    <div class="booking-calendar-nav">
                                        <button type="button" class="btn-calendar-nav" disabled><i class="fa-solid fa-chevron-left"></i></button>
                                        <button type="button" class="btn-calendar-nav" disabled><i class="fa-solid fa-chevron-right"></i></button>
                                    </div>
                                </div>
                                <div class="booking-calendar-grid">
                                    <div class="calendar-day-header">Su</div>
                                    <div class="calendar-day-header">Mo</div>
                                    <div class="calendar-day-header">Tu</div>
                                    <div class="calendar-day-header">We</div>
                                    <div class="calendar-day-header">Th</div>
                                    <div class="calendar-day-header">Fr</div>
                                    <div class="calendar-day-header">Sa</div>
                                    
                                    <button type="button" class="calendar-day-cell disabled">31</button>
                                    <button type="button" class="calendar-day-cell active" data-day="1">1</button>
                                    <button type="button" class="calendar-day-cell" data-day="2">2</button>
                                    <button type="button" class="calendar-day-cell" data-day="3">3</button>
                                    <button type="button" class="calendar-day-cell" data-day="4">4</button>
                                    <button type="button" class="calendar-day-cell" data-day="5">5</button>
                                    <button type="button" class="calendar-day-cell" data-day="6">6</button>
                                    
                                    <button type="button" class="calendar-day-cell" data-day="7">7</button>
                                    <button type="button" class="calendar-day-cell" data-day="8">8</button>
                                    <button type="button" class="calendar-day-cell" data-day="9">9</button>
                                    <button type="button" class="calendar-day-cell" data-day="10">10</button>
                                    <button type="button" class="calendar-day-cell" data-day="11">11</button>
                                    <button type="button" class="calendar-day-cell" data-day="12">12</button>
                                    <button type="button" class="calendar-day-cell" data-day="13">13</button>
                                    
                                    <button type="button" class="calendar-day-cell" data-day="14">14</button>
                                    <button type="button" class="calendar-day-cell" data-day="15">15</button>
                                    <button type="button" class="calendar-day-cell" data-day="16">16</button>
                                    <button type="button" class="calendar-day-cell" data-day="17">17</button>
                                    <button type="button" class="calendar-day-cell" data-day="18">18</button>
                                    <button type="button" class="calendar-day-cell" data-day="19">19</button>
                                    <button type="button" class="calendar-day-cell" data-day="20">20</button>
                                    
                                    <button type="button" class="calendar-day-cell" data-day="21">21</button>
                                    <button type="button" class="calendar-day-cell" data-day="22">22</button>
                                    <button type="button" class="calendar-day-cell" data-day="23">23</button>
                                    <button type="button" class="calendar-day-cell" data-day="24">24</button>
                                    <button type="button" class="calendar-day-cell" data-day="25">25</button>
                                    <button type="button" class="calendar-day-cell" data-day="26">26</button>
                                    <button type="button" class="calendar-day-cell" data-day="27">27</button>
                                    
                                    <button type="button" class="calendar-day-cell" data-day="28">28</button>
                                    <button type="button" class="calendar-day-cell" data-day="29">29</button>
                                    <button type="button" class="calendar-day-cell" data-day="30">30</button>
                                    <button type="button" class="calendar-day-cell disabled">1</button>
                                    <button type="button" class="calendar-day-cell disabled">2</button>
                                    <button type="button" class="calendar-day-cell disabled">3</button>
                                    <button type="button" class="calendar-day-cell disabled">4</button>
                                </div>
                            </div>
                            
                            <!-- No Availability State -->
                            <div id="bookingNoAvailabilityContainer">
                                <div class="booking-status-box">
                                    <div class="booking-slots-subtitle" id="noAvailabilityDateTitle" style="font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text-primary);">Monday, 1 Jun 2026</div>
                                    <p style="margin: 0.5rem 0 1.25rem; color: var(--color-text-secondary); font-size: 0.95rem;">No availability until Friday, 5 June.</p>
                                    <button type="button" class="btn-booking-status primary" id="goToNextAvailableBtn">Go to next available</button>
                                    <p style="margin: 0.5rem 0; color: var(--color-text-muted); font-size: 0.85rem;">or</p>
                                    <button type="button" class="btn-booking-status secondary" id="joinWaitlistBtn">Join the waitlist</button>
                                </div>
                            </div>
                            
                            <!-- Time Slots Selection Grid -->
                            <div id="bookingTimeSlotsContainer" style="display: none;">
                                <div class="booking-slots-container">
                                    <div class="booking-slots-title" id="selectedDateTitle" style="font-weight: 600; font-size: 1.15rem; margin-bottom: 1rem; color: var(--color-text-primary);">Friday, 5 Jun 2026</div>
                                    <div class="booking-slots-subtitle">Morning</div>
                                    <div class="booking-slots-grid">
                                        <button type="button" class="booking-slot-badge" data-time="10:15 am">10:15 am</button>
                                        <button type="button" class="booking-slot-badge" data-time="10:30 am">10:30 am</button>
                                        <button type="button" class="booking-slot-badge" data-time="11:15 am">11:15 am</button>
                                        <button type="button" class="booking-slot-badge" data-time="11:45 am">11:45 am</button>
                                    </div>
                                    <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--color-text-secondary);">
                                        Afternoon: <span style="color: var(--color-text-muted); font-style: italic;">No availability</span>
                                    </div>
                                    <div style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 1.2rem;">
                                        Evening: <span style="color: var(--color-text-muted); font-style: italic;">No availability</span>
                                    </div>
                                    <div style="font-size: 0.85rem; color: var(--color-text-muted); border-top: 1px solid rgba(192, 159, 87, 0.12); padding-top: 0.75rem;">
                                        Don't see your preference? <button type="button" id="joinWaitlistBtn2" style="background: none; border: none; color: var(--color-accent-gold); font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0;">Join the waitlist</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 3: Checkout -->
                        <div class="wizard-step" data-step="checkout">
                            <div class="booking-checkout-section">
                                <div class="booking-checkout-title">Contact info</div>
                                <div class="checkout-form-grid">
                                    <div class="form-group checkout-form-full">
                                        <label for="checkoutPhone" style="display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Phone number *</label>
                                        <input type="tel" id="checkoutPhone" required class="form-control" placeholder="Phone number" style="width: 100%; padding: 0.85rem 1rem; border-radius: var(--radius-medium); border: 1px solid rgba(192, 159, 87, 0.25); background-color: var(--color-bg-secondary); color: var(--color-text-primary); font-family: var(--font-body); box-sizing: border-box;">
                                    </div>
                                    <div class="form-group">
                                        <label for="checkoutFirstName" style="display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">First name *</label>
                                        <input type="text" id="checkoutFirstName" required class="form-control" placeholder="First name" style="width: 100%; padding: 0.85rem 1rem; border-radius: var(--radius-medium); border: 1px solid rgba(192, 159, 87, 0.25); background-color: var(--color-bg-secondary); color: var(--color-text-primary); font-family: var(--font-body); box-sizing: border-box;">
                                    </div>
                                    <div class="form-group">
                                        <label for="checkoutLastName" style="display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Last name *</label>
                                        <input type="text" id="checkoutLastName" required class="form-control" placeholder="Last name" style="width: 100%; padding: 0.85rem 1rem; border-radius: var(--radius-medium); border: 1px solid rgba(192, 159, 87, 0.25); background-color: var(--color-bg-secondary); color: var(--color-text-primary); font-family: var(--font-body); box-sizing: border-box;">
                                    </div>
                                    <div class="form-group checkout-form-full">
                                        <label for="checkoutEmail" style="display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Email *</label>
                                        <input type="email" id="checkoutEmail" required class="form-control" placeholder="Email address" style="width: 100%; padding: 0.85rem 1rem; border-radius: var(--radius-medium); border: 1px solid rgba(192, 159, 87, 0.25); background-color: var(--color-bg-secondary); color: var(--color-text-primary); font-family: var(--font-body); box-sizing: border-box;">
                                    </div>
                                    <div class="form-group checkout-form-full" style="display: flex; gap: 0.6rem; align-items: flex-start; margin-top: 0.25rem;">
                                        <input type="checkbox" id="checkoutMarketing" style="margin-top: 0.25rem; transform: scale(1.15);">
                                        <label for="checkoutMarketing" style="font-size: 0.85rem; line-height: 1.4; color: var(--color-text-secondary);">Text me marketing and loyalty offers from Svetlana Clark Hair Design.</label>
                                    </div>
                                </div>
                                
                                <div class="booking-checkout-title" style="margin-top: 1rem;">Card on file</div>
                                <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-top: -1rem; line-height: 1.4; margin-bottom: 1rem;">
                                    A credit or debit card is required to book and may be charged in the case of a late cancellation. Protected and encrypted by Square.
                                </p>
                                <div class="checkout-form-grid">
                                    <div class="form-group checkout-form-full">
                                        <label for="checkoutCard" style="display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Card number *</label>
                                        <input type="text" id="checkoutCard" required class="form-control" placeholder="0000 0000 0000 0000" style="width: 100%; padding: 0.85rem 1rem; border-radius: var(--radius-medium); border: 1px solid rgba(192, 159, 87, 0.25); background-color: var(--color-bg-secondary); color: var(--color-text-primary); font-family: var(--font-body); box-sizing: border-box;">
                                    </div>
                                    <div class="form-group">
                                        <label for="checkoutExpiry" style="display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Expiry Date (MM/YY) *</label>
                                        <input type="text" id="checkoutExpiry" required class="form-control" placeholder="MM/YY" style="width: 100%; padding: 0.85rem 1rem; border-radius: var(--radius-medium); border: 1px solid rgba(192, 159, 87, 0.25); background-color: var(--color-bg-secondary); color: var(--color-text-primary); font-family: var(--font-body); box-sizing: border-box;">
                                    </div>
                                    <div class="form-group">
                                        <label for="checkoutCvv" style="display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">CVV *</label>
                                        <input type="text" id="checkoutCvv" required class="form-control" placeholder="123" style="width: 100%; padding: 0.85rem 1rem; border-radius: var(--radius-medium); border: 1px solid rgba(192, 159, 87, 0.25); background-color: var(--color-bg-secondary); color: var(--color-text-primary); font-family: var(--font-body); box-sizing: border-box;">
                                    </div>
                                    <div class="form-group checkout-form-full" style="display: flex; gap: 0.6rem; align-items: flex-start; margin-top: 0.25rem;">
                                        <input type="checkbox" id="checkoutAuthorize" required style="margin-top: 0.25rem; transform: scale(1.15);">
                                        <label for="checkoutAuthorize" style="font-size: 0.85rem; line-height: 1.4; color: var(--color-text-secondary);">I authorize Svetlana Clark Hair Design to save this card on file for future purchases.</label>
                                    </div>
                                </div>
                                
                                <div class="form-group checkout-form-full" style="margin-top: 0.75rem;">
                                    <label for="checkoutNote" style="display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Appointment note</label>
                                    <textarea id="checkoutNote" class="form-control" placeholder="Add a note (e.g. key details for your stylist)..." style="width: 100%; height: 80px; padding: 0.85rem 1rem; border-radius: var(--radius-medium); border: 1px solid rgba(192, 159, 87, 0.25); background-color: var(--color-bg-secondary); color: var(--color-text-primary); font-family: var(--font-body); resize: none; box-sizing: border-box;"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 4: Success -->
                        <div class="wizard-step" data-step="success">
                            <div style="text-align: center; padding: 1.5rem 0;">
                                <div class="success-icon" style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--color-bg-primary); border: 2px solid var(--color-accent-gold); display: flex; justify-content: center; align-items: center; color: var(--color-accent-gold); font-size: 2.25rem; margin: 0 auto 1.5rem; box-shadow: var(--shadow-glow-active);">
                                    <i class="fa-solid fa-check"></i>
                                </div>
                                <h4 style="font-size: 1.5rem; font-family: var(--font-heading); margin-bottom: 0.75rem; color: var(--color-text-primary);">Appointment Booked!</h4>
                                <p style="color: var(--color-text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; max-width: 440px; margin-left: auto; margin-right: auto;">
                                    Your appointment has been successfully scheduled. We have sent a confirmation email to your address.
                                </p>
                                
                                <div class="wizard-summary-card" style="max-width: 460px; margin: 0 auto 1.5rem; text-align: left; padding: 1.25rem; background-color: var(--color-bg-secondary); border: 1px solid rgba(192, 159, 87, 0.18);">
                                    <h4 style="font-size: 0.85rem; letter-spacing: 1px; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(192, 159, 87, 0.12); padding-bottom: 0.4rem; color: var(--color-accent-gold); font-family: var(--font-accent); text-transform: uppercase;">Booking Details</h4>
                                    <div style="font-size: 0.9rem; line-height: 1.7; color: var(--color-text-secondary);">
                                        <strong>Date/Time:</strong> <span id="successBookedTime">Friday, 5 Jun 2026 at 11:15 am</span><br>
                                        <strong>Client Name:</strong> <span id="successBookedName">John Doe</span><br>
                                        <strong>Selected Services:</strong>
                                        <ul id="successBookedServices" style="margin: 0.25rem 0 0.25rem 1.25rem; padding: 0;">
                                            <!-- Filled dynamically -->
                                        </ul>
                                        <strong>Total Value:</strong> <span id="successBookedTotal">$350.00</span> <span style="color: var(--color-text-muted); font-size: 0.8rem; margin-left: 0.25rem;">(Due at Salon)</span>
                                    </div>
                                </div>
                                <button type="button" class="btn-primary gold" id="successDoneBtn" style="padding: 0.85rem 2rem; border-radius: var(--radius-small); border: none; font-weight: 600; cursor: pointer;">Done</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sidebar Summary Column (Right) -->
                <div class="booking-sidebar-summary" id="bookingSidebarSummary">
                    <h4 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--color-text-primary); margin-bottom: 1.25rem; border-bottom: 1px solid rgba(192, 159, 87, 0.15); padding-bottom: 0.5rem; margin-top: 0;">Appointment summary</h4>
                    
                    <div id="sidebarSummaryDetails">
                        <div id="sidebarNoServicesMsg" style="color: var(--color-text-muted); font-style: italic; font-size: 0.9rem; margin: 3rem 0; text-align: center;">No services added yet</div>
                        
                        <div id="sidebarActiveDetails" style="display: none;">
                            <div style="font-weight: 600; font-size: 1.05rem;" id="sidebarTotalCount">0 services</div>
                            <div style="color: var(--color-text-secondary); font-size: 0.88rem; margin-top: 0.15rem;" id="sidebarTotalMeta">$0.00 &bull; 0 min</div>
                            
                            <div class="sidebar-summary-list" id="sidebarSummaryList">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                    </div>
                    
                    <div id="sidebarDateTimeBlock" style="display: none; margin: 1rem 0; padding: 0.85rem; background-color: var(--color-bg-tertiary); border-radius: var(--radius-small); border: 1px solid rgba(192, 159, 87, 0.12);">
                        <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-accent-gold); font-weight: 600; margin-bottom: 0.3rem;">Selected Slot</div>
                        <div style="font-size: 0.92rem; font-weight: 600; color: var(--color-text-primary);" id="sidebarSelectedSlotText">Friday, 5 Jun at 10:15 am</div>
                        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.1rem;">GMT-5 Timezone</div>
                    </div>
                    
                    <div class="checkout-summary-block" id="sidebarPricingDetails" style="display: none;">
                        <div class="checkout-summary-row">
                            <span>Subtotal</span>
                            <span id="summarySubtotal">$0.00</span>
                        </div>
                        <div class="checkout-summary-row">
                            <span>Taxes</span>
                            <span>$0.00</span>
                        </div>
                        <div class="checkout-summary-row total">
                            <span>Total</span>
                            <span id="summaryTotal">$0.00</span>
                        </div>
                        <div class="checkout-summary-row">
                            <span>Due today</span>
                            <span>$0.00</span>
                        </div>
                        <div class="checkout-summary-row" style="font-weight: 500; color: var(--color-text-primary); margin-bottom: 0;">
                            <span>Due at Salon</span>
                            <span id="summaryDueAppointment">$0.00</span>
                        </div>
                    </div>

                    <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.75rem; padding-top: 1.5rem;">
                        <button type="button" class="btn-booking-status primary" id="sidebarNextBtn" disabled style="background-color: #d1beab; color: var(--color-text-primary); font-weight: 600;">Next</button>
                        <button type="button" class="btn-booking-status secondary" id="sidebarBackBtn" style="display: none;">Back</button>
                    </div>
                </div>
            </div>
        </div>
`;

function initBookingWizard() {
  const wizardOverlay = document.getElementById('bookingWizard');
  const openBtns = document.querySelectorAll('.open-booking-wizard');

  if (!wizardOverlay) return;

  // State Management
  let currentStep = 0;
  let selectedServices = []; // Holds service objects
  let selectedDay = '1'; // Monday June 1st selected by default
  let selectedTimeSlot = ''; // e.g. "10:15 am"
  let checkoutData = {
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    marketing: false,
    card: '',
    expiry: '',
    cvv: '',
    authorize: false,
    note: ''
  };

  // Helper: Format duration
  function formatDuration(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs} hr${mins > 0 ? ` ${mins} min` : ''}`;
  }

  // Inject HTML template once
  function injectWizardHTML() {
    wizardOverlay.innerHTML = bookingWizardHTML;
    
    // Bind core window controls
    const closeBtn = wizardOverlay.querySelector('#bookingCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        wizardOverlay.classList.remove('active');
      });
    }
    
    wizardOverlay.addEventListener('click', (e) => {
      if (e.target === wizardOverlay) {
        wizardOverlay.classList.remove('active');
      }
    });

    // Bind sub-navigation links in Steps
    const goToNextBtn = wizardOverlay.querySelector('#goToNextAvailableBtn');
    if (goToNextBtn) {
      goToNextBtn.addEventListener('click', () => {
        selectDate('5');
      });
    }

    const waitlistBtn1 = wizardOverlay.querySelector('#joinWaitlistBtn');
    const waitlistBtn2 = wizardOverlay.querySelector('#joinWaitlistBtn2');
    const handleWaitlist = () => {
      alert('Success! You have joined the Svetlana Clark Hair Design waitlist. If a spot opens up, Svetlana will contact you directly.');
    };
    if (waitlistBtn1) waitlistBtn1.addEventListener('click', handleWaitlist);
    if (waitlistBtn2) waitlistBtn2.addEventListener('click', handleWaitlist);

    // Bind Calendar clicks
    const dayCells = wizardOverlay.querySelectorAll('.calendar-day-cell:not(.disabled)');
    dayCells.forEach(cell => {
      cell.addEventListener('click', () => {
        const day = cell.getAttribute('data-day');
        selectDate(day);
      });
    });

    // Bind Time slot selection
    const slotBadges = wizardOverlay.querySelectorAll('.booking-slot-badge');
    slotBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        slotBadges.forEach(b => b.classList.remove('selected'));
        badge.classList.add('selected');
        selectedTimeSlot = badge.getAttribute('data-time');
        
        // Update sidebar
        updateDateTimeSidebar();
        validateStepTransition();
      });
    });

    // Bind footer actions
    const nextBtn = wizardOverlay.querySelector('#sidebarNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        advanceStep();
      });
    }

    const backBtn = wizardOverlay.querySelector('#sidebarBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        retrogressStep();
      });
    }

    const successDoneBtn = wizardOverlay.querySelector('#successDoneBtn');
    if (successDoneBtn) {
      successDoneBtn.addEventListener('click', () => {
        wizardOverlay.classList.remove('active');
      });
    }
  }

  // Set selected date logic
  function selectDate(day) {
    selectedDay = day;
    selectedTimeSlot = ''; // Reset selected time
    
    // Toggle active calendar selection styles
    const dayCells = wizardOverlay.querySelectorAll('.calendar-day-cell:not(.disabled)');
    dayCells.forEach(cell => {
      if (cell.getAttribute('data-day') === day) {
        cell.classList.add('active');
      } else {
        cell.classList.remove('active');
      }
    });

    // Toggle container views based on slot availability
    const availabilityBox = wizardOverlay.querySelector('#bookingNoAvailabilityContainer');
    const slotsGridBox = wizardOverlay.querySelector('#bookingTimeSlotsContainer');
    const noAvailTitle = wizardOverlay.querySelector('#noAvailabilityDateTitle');
    const selectedTitle = wizardOverlay.querySelector('#selectedDateTitle');

    // Deselect time slot badges visual
    const slotBadges = wizardOverlay.querySelectorAll('.booking-slot-badge');
    slotBadges.forEach(b => b.classList.remove('selected'));

    const dayName = getDayNameOfJune(day);

    if (day === '5') {
      if (availabilityBox) availabilityBox.style.display = 'none';
      if (slotsGridBox) slotsGridBox.style.display = 'block';
      if (selectedTitle) selectedTitle.textContent = `${dayName}, ${day} Jun 2026`;
    } else {
      if (slotsGridBox) slotsGridBox.style.display = 'none';
      if (availabilityBox) availabilityBox.style.display = 'block';
      if (noAvailTitle) noAvailTitle.textContent = `${dayName}, ${day} Jun 2026`;
      
      const subMsg = availabilityBox.querySelector('p');
      if (subMsg) {
        if (parseInt(day) < 5) {
          subMsg.textContent = 'No availability until Friday, 5 June.';
        } else {
          subMsg.textContent = 'No availability on this date.';
        }
      }
    }

    updateDateTimeSidebar();
    validateStepTransition();
  }

  function getDayNameOfJune(dayStr) {
    const day = parseInt(dayStr);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // June 1st, 2026 is a Monday (index 1)
    const baseIndex = 1;
    const computedIndex = (baseIndex + (day - 1)) % 7;
    return weekdays[computedIndex];
  }

  // Update DateTime Sidebar Block
  function updateDateTimeSidebar() {
    const dateTimeBlock = wizardOverlay.querySelector('#sidebarDateTimeBlock');
    const slotText = wizardOverlay.querySelector('#sidebarSelectedSlotText');
    
    if (selectedTimeSlot) {
      if (dateTimeBlock) dateTimeBlock.style.display = 'block';
      if (slotText) {
        const dayName = getDayNameOfJune(selectedDay);
        slotText.textContent = `${dayName}, ${selectedDay} Jun at ${selectedTimeSlot}`;
      }
    } else {
      if (dateTimeBlock) dateTimeBlock.style.display = 'none';
    }
  }

  // Validate Next Button state per step
  function validateStepTransition() {
    const nextBtn = wizardOverlay.querySelector('#sidebarNextBtn');
    if (!nextBtn) return;

    if (currentStep === 0) {
      // Step 1: Services selection
      nextBtn.disabled = selectedServices.length === 0;
    } else if (currentStep === 1) {
      // Step 2: Date & Time picker
      nextBtn.disabled = !selectedTimeSlot;
    } else if (currentStep === 2) {
      // Step 3: Checkout validation handled in form trigger
      nextBtn.disabled = false;
    }
  }

  // Dynamic service renderer
  function renderServices() {
    const container = wizardOverlay.querySelector('#bookingServicesList');
    if (!container) return;

    container.innerHTML = '';
    
    servicesData.forEach(svc => {
      const isAdded = selectedServices.some(item => item.id === svc.id);
      const actionText = isAdded ? 'Added' : 'Add';
      const actionClass = isAdded ? 'added' : 'add';
      
      const itemRow = document.createElement('div');
      itemRow.className = 'booking-service-item';
      itemRow.innerHTML = `
        <div class="booking-service-info">
            <div class="booking-service-name">${svc.name}</div>
            <div class="booking-service-desc">${svc.desc}</div>
            <div class="booking-service-meta">$${svc.price.toFixed(2)} <span>&bull; ${svc.duration}</span></div>
        </div>
        <div class="booking-service-visual">
            <img src="${svc.img}" alt="${svc.name}" class="booking-service-img">
            <button type="button" class="btn-service-action ${actionClass}" data-id="${svc.id}">${actionText}</button>
        </div>
      `;
      
      // Bind click event
      const actionBtn = itemRow.querySelector('.btn-service-action');
      actionBtn.addEventListener('click', () => {
        toggleService(svc);
      });
      
      container.appendChild(itemRow);
    });
  }

  // Toggle selection of service
  function toggleService(svc) {
    const index = selectedServices.findIndex(item => item.id === svc.id);
    if (index > -1) {
      selectedServices.splice(index, 1);
    } else {
      selectedServices.push(svc);
    }
    
    // Refresh list and sidebar summary
    renderServices();
    updateSidebarSummary();
    validateStepTransition();
  }

  // Update Sidebar details
  function updateSidebarSummary() {
    const noServicesMsg = wizardOverlay.querySelector('#sidebarNoServicesMsg');
    const activeDetails = wizardOverlay.querySelector('#sidebarActiveDetails');
    const totalCountText = wizardOverlay.querySelector('#sidebarTotalCount');
    const totalMetaText = wizardOverlay.querySelector('#sidebarTotalMeta');
    const summaryList = wizardOverlay.querySelector('#sidebarSummaryList');
    
    if (selectedServices.length === 0) {
      if (noServicesMsg) noServicesMsg.style.display = 'block';
      if (activeDetails) activeDetails.style.display = 'none';
      return;
    }

    if (noServicesMsg) noServicesMsg.style.display = 'none';
    if (activeDetails) activeDetails.style.display = 'block';

    // Calculate totals
    let totalPrice = 0;
    let totalMinutes = 0;
    
    if (summaryList) summaryList.innerHTML = '';

    selectedServices.forEach(svc => {
      totalPrice += svc.price;
      totalMinutes += svc.durationMinutes;
      
      // Render summary row item with remove button
      const row = document.createElement('div');
      row.className = 'sidebar-summary-item';
      row.innerHTML = `
        <span>${svc.name}</span>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>$${svc.price.toFixed(2)}</span>
            <button type="button" class="sidebar-summary-remove" data-id="${svc.id}">&times;</button>
        </div>
      `;
      
      const removeBtn = row.querySelector('.sidebar-summary-remove');
      removeBtn.addEventListener('click', () => {
        toggleService(svc);
      });
      
      if (summaryList) summaryList.appendChild(row);
    });

    if (totalCountText) totalCountText.textContent = `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''}`;
    if (totalMetaText) totalMetaText.textContent = `$${totalPrice.toFixed(2)} \u2022 ${formatDuration(totalMinutes)}`;
    
    // Update Checkout invoice blocks
    const subtotalField = wizardOverlay.querySelector('#summarySubtotal');
    const totalField = wizardOverlay.querySelector('#summaryTotal');
    const dueApptField = wizardOverlay.querySelector('#summaryDueAppointment');
    
    if (subtotalField) subtotalField.textContent = `$${totalPrice.toFixed(2)}`;
    if (totalField) totalField.textContent = `$${totalPrice.toFixed(2)}`;
    if (dueApptField) dueApptField.textContent = `$${totalPrice.toFixed(2)}`;
  }

  // Save/Load user contact details
  function loadSavedClientDetails() {
    const saved = localStorage.getItem('savedBookingDetails');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.firstName) {
          checkoutData = { ...checkoutData, ...data };
          // Prefill checkout inputs
          const phoneIn = document.getElementById('checkoutPhone');
          const firstIn = document.getElementById('checkoutFirstName');
          const lastIn = document.getElementById('checkoutLastName');
          const emailIn = document.getElementById('checkoutEmail');
          
          if (phoneIn) phoneIn.value = checkoutData.phone || '';
          if (firstIn) firstIn.value = checkoutData.firstName || '';
          if (lastIn) lastIn.value = checkoutData.lastName || '';
          if (emailIn) emailIn.value = checkoutData.email || '';
        }
      } catch (e) {
        console.error('Error loading saved details', e);
      }
    }
  }

  // Wizard Step Navigation
  function updateStepsVisibility() {
    const steps = wizardOverlay.querySelectorAll('.wizard-step');
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
    });

    const stepTitle = wizardOverlay.querySelector('#bookingWizardStepTitle');
    const nextBtn = wizardOverlay.querySelector('#sidebarNextBtn');
    const backBtn = wizardOverlay.querySelector('#sidebarBackBtn');
    const pricingDetails = wizardOverlay.querySelector('#sidebarPricingDetails');
    const sidebarSummaryBlock = wizardOverlay.querySelector('#bookingSidebarSummary');

    if (currentStep === 0) {
      if (stepTitle) stepTitle.textContent = 'Select Services';
      if (backBtn) backBtn.style.display = 'none';
      if (nextBtn) {
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Next';
      }
      if (pricingDetails) pricingDetails.style.display = 'none';
      if (sidebarSummaryBlock) sidebarSummaryBlock.style.display = 'flex';
    } else if (currentStep === 1) {
      if (stepTitle) stepTitle.textContent = 'Select Date & Time';
      if (backBtn) {
        backBtn.style.display = 'block';
        backBtn.textContent = 'Back';
      }
      if (nextBtn) {
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Next';
      }
      if (pricingDetails) pricingDetails.style.display = 'none';
      if (sidebarSummaryBlock) sidebarSummaryBlock.style.display = 'flex';
    } else if (currentStep === 2) {
      if (stepTitle) stepTitle.textContent = 'Checkout';
      if (backBtn) {
        backBtn.style.display = 'block';
        backBtn.textContent = 'Back';
      }
      if (nextBtn) {
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Book appointment';
      }
      if (pricingDetails) pricingDetails.style.display = 'block';
      if (sidebarSummaryBlock) sidebarSummaryBlock.style.display = 'flex';
      
      loadSavedClientDetails();
    } else if (currentStep === 3) {
      if (stepTitle) stepTitle.textContent = 'Appointment Booked!';
      if (sidebarSummaryBlock) sidebarSummaryBlock.style.display = 'none'; // Hide sidebar summary
    }

    validateStepTransition();
  }

  function advanceStep() {
    if (currentStep === 0) {
      currentStep = 1;
      updateStepsVisibility();
    } else if (currentStep === 1) {
      currentStep = 2;
      updateStepsVisibility();
    } else if (currentStep === 2) {
      // Perform form inputs validation before completing booking
      const phoneIn = document.getElementById('checkoutPhone');
      const firstIn = document.getElementById('checkoutFirstName');
      const lastIn = document.getElementById('checkoutLastName');
      const emailIn = document.getElementById('checkoutEmail');
      const cardIn = document.getElementById('checkoutCard');
      const expiryIn = document.getElementById('checkoutExpiry');
      const cvvIn = document.getElementById('checkoutCvv');
      const authChk = document.getElementById('checkoutAuthorize');
      const noteIn = document.getElementById('checkoutNote');
      const marketingChk = document.getElementById('checkoutMarketing');

      let valid = true;
      const fields = [phoneIn, firstIn, lastIn, emailIn, cardIn, expiryIn, cvvIn];
      
      fields.forEach(input => {
        if (input && !input.value.trim()) {
          input.classList.add('error');
          valid = false;
        } else if (input) {
          input.classList.remove('error');
        }
      });

      if (authChk && !authChk.checked) {
        authChk.classList.add('error');
        valid = false;
      } else if (authChk) {
        authChk.classList.remove('error');
      }

      if (!valid) {
        alert('Please fill out all required contact and payment details to schedule your appointment.');
        return;
      }

      // Collect form info
      checkoutData = {
        phone: phoneIn.value,
        firstName: firstIn.value,
        lastName: lastIn.value,
        email: emailIn.value,
        marketing: marketingChk ? marketingChk.checked : false,
        card: cardIn.value.slice(-4), // Mask card (save only last 4 digits)
        expiry: expiryIn.value,
        cvv: '***',
        authorize: authChk.checked,
        note: noteIn ? noteIn.value : ''
      };

      // Calculate totals for success screen display
      let totalPrice = 0;
      selectedServices.forEach(s => totalPrice += s.price);

      // Save to localStorage
      localStorage.setItem('savedBookingDetails', JSON.stringify({
        phone: checkoutData.phone,
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        email: checkoutData.email
      }));

      const activeBooking = {
        date: `Friday, 5 Jun 2026`,
        time: selectedTimeSlot,
        clientName: `${checkoutData.firstName} ${checkoutData.lastName}`,
        services: selectedServices.map(s => s.name),
        total: `$${totalPrice.toFixed(2)}`,
        note: checkoutData.note,
        timestamp: new Date().toISOString()
      };
      
      // Keep appointment log
      const apptsHistory = JSON.parse(localStorage.getItem('myAppointmentsHistory') || '[]');
      apptsHistory.push(activeBooking);
      localStorage.setItem('myAppointmentsHistory', JSON.stringify(apptsHistory));

      // Render success summaries
      const succTime = wizardOverlay.querySelector('#successBookedTime');
      const succName = wizardOverlay.querySelector('#successBookedName');
      const succServices = wizardOverlay.querySelector('#successBookedServices');
      const succTotal = wizardOverlay.querySelector('#successBookedTotal');

      if (succTime) succTime.textContent = `Friday, 5 Jun 2026 at ${selectedTimeSlot}`;
      if (succName) succName.textContent = activeBooking.clientName;
      if (succTotal) succTotal.textContent = activeBooking.total;
      
      if (succServices) {
        succServices.innerHTML = '';
        selectedServices.forEach(s => {
          const li = document.createElement('li');
          li.textContent = `${s.name} ($${s.price.toFixed(2)})`;
          succServices.appendChild(li);
        });
      }

      currentStep = 3;
      updateStepsVisibility();
    }
  }

  function retrogressStep() {
    if (currentStep > 0) {
      currentStep--;
      updateStepsVisibility();
    }
  }

  // Inject layout template on initial load
  injectWizardHTML();

  // Open button event bindings
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Reset variables
      currentStep = 0;
      selectedServices = [];
      selectedDay = '1';
      selectedTimeSlot = '';
      
      // Initialize view rendering
      renderServices();
      updateSidebarSummary();
      selectDate('1');
      updateStepsVisibility();
      
      wizardOverlay.classList.add('active');
    });
  });
}

/* --- SERVICES CATEGORY FILTER --- */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceItems = document.querySelectorAll('.service-item-row');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      serviceItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          // Trigger entry animation
          item.style.animation = 'none';
          item.offsetHeight; // Trigger reflow
          item.style.animation = 'fadeInUp 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --- LOOKBOOK LIGHTBOX MODAL --- */
function initLookbookLightbox() {
  const items = document.querySelectorAll('.lookbook-item');
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  if (!modal || !img || !closeBtn || items.length === 0) return;

  function openLightbox(src, text) {
    img.src = src;
    caption.textContent = text || '';
    modal.style.display = 'flex';
    // Trigger reflow for fade transition
    modal.offsetHeight; 
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
        img.src = '';
      }
    }, 400); // Wait for transition fade to complete
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      const text = item.dataset.caption;
      openLightbox(src, text);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --- FAQ ACCORDION INTERACTION --- */
function initFaqAccordion() {
  const faqBtns = document.querySelectorAll('.faq-question-btn');
  if (faqBtns.length === 0) return;

  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wrapper = item.querySelector('.faq-answer-wrapper');
      
      if (!item || !wrapper) return;

      const isActive = item.classList.contains('active');

      // Close all other accordion items first for an elegant focus accordion look
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherWrapper = otherItem.querySelector('.faq-answer-wrapper');
          if (otherWrapper) otherWrapper.style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        wrapper.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      }
    });
  });
}

/* --- NEW GUEST INTAKE WIDGET --- */
function initGuestIntakeWizard() {
  const wizardOverlay = document.getElementById('guestIntakeWizard');
  const openBtn = document.querySelector('.open-guest-intake');
  const closeBtn = document.getElementById('intakeCloseBtn');
  
  if (!wizardOverlay || !openBtn) return;
  
  const wizardSteps = wizardOverlay.querySelectorAll('.wizard-step');
  const prevBtn = wizardOverlay.querySelector('.intake-btn-prev');
  const nextBtn = wizardOverlay.querySelector('.intake-btn-next');
  
  let currentStep = 0;
  let intakeDetails = {
    name: '',
    email: '',
    phone: '',
    history: '',
    texture: '',
    goals: '',
    referral: ''
  };

  function updateWizard() {
    wizardSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
    });

    if (currentStep === wizardSteps.length - 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.textContent = 'Done';
    } else {
      if (prevBtn) {
        prevBtn.style.display = 'block';
        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
      }
      if (nextBtn) {
        if (currentStep === wizardSteps.length - 2) {
          nextBtn.textContent = 'Submit Intake';
        } else {
          nextBtn.textContent = 'Next';
        }
      }
    }
  }

  function loadSavedIntake() {
    const saved = localStorage.getItem('savedGuestIntake');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        intakeDetails = { ...intakeDetails, ...data };
        
        if (document.getElementById('intakeName')) document.getElementById('intakeName').value = intakeDetails.name || '';
        if (document.getElementById('intakeEmail')) document.getElementById('intakeEmail').value = intakeDetails.email || '';
        if (document.getElementById('intakePhone')) document.getElementById('intakePhone').value = intakeDetails.phone || '';
        if (document.getElementById('intakeHistory')) document.getElementById('intakeHistory').value = intakeDetails.history || '';
        if (document.getElementById('intakeTexture')) document.getElementById('intakeTexture').value = intakeDetails.texture || '';
        if (document.getElementById('intakeGoals')) document.getElementById('intakeGoals').value = intakeDetails.goals || '';
        if (document.getElementById('intakeReferral')) document.getElementById('intakeReferral').value = intakeDetails.referral || '';
      } catch (e) {
        console.error('Error loading saved intake', e);
      }
    }
  }

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    wizardOverlay.classList.add('active');
    currentStep = 0;
    loadSavedIntake();
    updateWizard();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      wizardOverlay.classList.remove('active');
    });
  }

  wizardOverlay.addEventListener('click', (e) => {
    if (e.target === wizardOverlay) {
      wizardOverlay.classList.remove('active');
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateWizard();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === wizardSteps.length - 1) {
        wizardOverlay.classList.remove('active');
      } else {
        // Validation logic for current step
        const activeStepEl = wizardSteps[currentStep];
        const inputs = activeStepEl.querySelectorAll('input, textarea, select');
        let valid = true;

        inputs.forEach(input => {
          if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('error');
            valid = false;
          } else {
            input.classList.remove('error');
          }
        });

        if (!valid) {
          alert('Please fill out all required fields to proceed.');
          return;
        }

        // Save input values to intakeDetails
        if (currentStep === 0) {
          intakeDetails.name = document.getElementById('intakeName').value;
          intakeDetails.email = document.getElementById('intakeEmail').value;
          intakeDetails.phone = document.getElementById('intakePhone').value;
        } else if (currentStep === 1) {
          intakeDetails.history = document.getElementById('intakeHistory').value;
          intakeDetails.texture = document.getElementById('intakeTexture').value;
        } else if (currentStep === 2) {
          intakeDetails.goals = document.getElementById('intakeGoals').value;
          intakeDetails.referral = document.getElementById('intakeReferral').value;
        }

        currentStep++;
        updateWizard();
        
        if (currentStep === wizardSteps.length - 2) {
          compileIntakeSummary();
        } else if (currentStep === wizardSteps.length - 1) {
          // Final Submit
          localStorage.setItem('savedGuestIntake', JSON.stringify(intakeDetails));
          compileIntakeSuccessSummary();
        }
      }
    });
  }

  function compileIntakeSummary() {
    const summaryText = document.getElementById('intakeSummaryText');
    if (summaryText) {
      const texMap = {
        'fine': 'Fine / Thin',
        'medium': 'Medium / Normal',
        'thick': 'Thick / Coarse',
        'curly': 'Curly / Wavy'
      };
      const tex = texMap[intakeDetails.texture] || intakeDetails.texture;
      summaryText.innerHTML = `
        <strong>Name:</strong> ${intakeDetails.name}<br>
        <strong>Email:</strong> ${intakeDetails.email}<br>
        <strong>Phone:</strong> ${intakeDetails.phone}<br>
        <strong>Texture:</strong> ${tex}<br>
        <strong>Goals:</strong> ${intakeDetails.goals}
      `;
    }
  }

  function compileIntakeSuccessSummary() {
    const successSummary = document.getElementById('intakeSuccessSummary');
    if (successSummary) {
      successSummary.innerHTML = `
        <span style="display: block; font-family: var(--font-heading); color: var(--color-accent-gold); border-bottom: 1px solid rgba(192, 159, 87, 0.15); padding-bottom: 0.35rem; margin-bottom: 0.5rem; font-size: 0.95rem;">Submitted Intake Profile:</span>
        <strong>Name:</strong> ${intakeDetails.name}<br>
        <strong>Email:</strong> ${intakeDetails.email}<br>
        <strong>Phone:</strong> ${intakeDetails.phone}
      `;
    }
  }
}
