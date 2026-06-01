/* ==========================================
   HAIR QUIZ MODULE - Svetlana Clark Hair Design
   ========================================== */

const QUIZ_QUESTIONS = [
  {
    question: "What is your primary hair concern or goal today?",
    options: [
      { text: "Seamlessly blending my growing gray hair", value: "A" },
      { text: "Adding brightness, dimension, or highlights", value: "B" },
      { text: "Getting a clean shape, precision styling, or short cut", value: "C" },
      { text: "Eliminating frizz, dryness, or morning styling struggle", value: "D" }
    ]
  },
  {
    question: "How would you describe your hair type and density?",
    options: [
      { text: "Fine, delicate, or thinning hair", value: "A" },
      { text: "Medium density with normal texture", value: "B" },
      { text: "Thick, heavy, or coarse hair", value: "C" },
      { text: "Chemically damaged, dry, or over-processed", value: "D" }
    ]
  },
  {
    question: "What is your ideal salon visit frequency / maintenance routine?",
    options: [
      { text: "Low maintenance (grow out naturally, visit every 4-6 months)", value: "A" },
      { text: "Medium maintenance (balayage refresh every 8-12 weeks)", value: "B" },
      { text: "High maintenance (precision cut/roots check every 4-6 weeks)", value: "C" },
      { text: "Happy to invest in long-lasting treatments (visit twice a year)", value: "D" }
    ]
  },
  {
    question: "What matters most to you during a hair coloring or texturizing service?",
    options: [
      { text: "Natural-looking transitions and soft grow-out lines", value: "A" },
      { text: "Stunning blonde tones and rich multi-dimensional depth", value: "B" },
      { text: "Sharp precision styling that is lightweight and custom shaped", value: "C" },
      { text: "Hair health first—using non-toxic, protective treatments", value: "D" }
    ]
  }
];

const RECS = {
  A: {
    title: "Signature Gray Blending Experience",
    desc: "A personalized solution designed to integrate and soften your gray roots with subtle, low-maintenance highlights and lowlights. Ideal for maintaining long-term hair integrity without harsh demarcation lines.",
    image: "assets/hair_balayage.png",
    duration: "2-3 hrs",
    price: "From $200"
  },
  B: {
    title: "Dimensional Balayage & Lightening",
    desc: "A premium hand-painted lightening experience utilizing K18 pre-treatment and bond protection. Perfect for creating natural brightness, sun-kissed dimension, and shiny blonde finishes.",
    image: "assets/hair_balayage.png",
    duration: "3-4 hrs",
    price: "Custom Pricing"
  },
  C: {
    title: "Precision Haircut Experience",
    desc: "A customized design session tailored for short haircuts, textured pixie cuts, or midi styles. Focuses on matching your hair's natural growth pattern, face shape, and daily maintenance preferences.",
    image: "assets/hair_pixie.png",
    duration: "1 hr",
    price: "$150"
  },
  D: {
    title: "Pura Luxe Smoothing Treatment",
    desc: "An advanced, amino-acid-based, non-toxic smoothing treatment that eliminates frizz, restores shine, and strengthens the hair cuticles. Formulated without formaldehyde, leaving hair healthy and strong.",
    image: "assets/hair_smooth.png",
    duration: "2-3 hrs",
    price: "From $300"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const startQuizBtn = document.getElementById('startQuizBtn');
  const quizIntro = document.getElementById('quizIntro');
  const quizContainer = document.getElementById('quizContainer');
  const quizResults = document.getElementById('quizResults');
  
  const questionTitle = document.getElementById('quizQuestionTitle');
  const optionsGrid = document.getElementById('quizOptions');
  const progressFill = document.getElementById('quizProgressFill');
  
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  
  const resultImg = document.getElementById('resultImg');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const resultDuration = document.getElementById('resultDuration');
  const resultPrice = document.getElementById('resultPrice');
  const restartQuizBtn = document.getElementById('restartQuizBtn');

  if (!quizContainer) return; // Exit if quiz is not on current page

  let currentQuestionIndex = 0;
  let answers = [];

  // Start Quiz Event
  startQuizBtn.addEventListener('click', () => {
    quizIntro.style.display = 'none';
    quizContainer.style.display = 'block';
    loadQuestion();
  });

  // Load Question Details
  function loadQuestion() {
    const qData = QUIZ_QUESTIONS[currentQuestionIndex];
    questionTitle.textContent = qData.question;
    optionsGrid.innerHTML = '';

    // Update Progress Bar
    const progressPercent = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Render Option Buttons
    qData.options.forEach((opt, idx) => {
      const charCode = String.fromCharCode(65 + idx); // A, B, C, D
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      
      // Highlight if previously selected
      if (answers[currentQuestionIndex] === opt.value) {
        btn.classList.add('selected');
      }

      btn.innerHTML = `
        <span class="quiz-option-letter">${charCode}</span>
        <span>${opt.text}</span>
      `;

      btn.addEventListener('click', () => {
        // Highlight active and select option
        document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[currentQuestionIndex] = opt.value;
        
        // Auto progress to next question after brief delay
        setTimeout(() => {
          if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
          } else {
            showResults();
          }
        }, 350);
      });

      optionsGrid.appendChild(btn);
    });

    // Handle Back Button Visibility
    if (currentQuestionIndex === 0) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }

    // Next Button behavior (only enabled if option is selected)
    if (answers[currentQuestionIndex]) {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
    } else {
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.5';
    }
  }

  // Back Button Navigation
  prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion();
    }
  });

  // Next Button Navigation
  nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1 && answers[currentQuestionIndex]) {
      currentQuestionIndex++;
      loadQuestion();
    } else if (currentQuestionIndex === QUIZ_QUESTIONS.length - 1 && answers[currentQuestionIndex]) {
      showResults();
    }
  });

  // Show Results
  function showResults() {
    quizContainer.style.display = 'none';
    quizResults.style.display = 'block';

    // Calculate Recommendation (Most frequent letter score)
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(ans => {
      counts[ans] = (counts[ans] || 0) + 1;
    });

    let topScore = 'A';
    let max = 0;
    for (const key in counts) {
      if (counts[key] > max) {
        max = counts[key];
        topScore = key;
      }
    }

    const rec = RECS[topScore];
    
    // Inject result data
    resultImg.src = rec.image;
    resultImg.alt = rec.title;
    resultTitle.textContent = rec.title;
    resultDesc.textContent = rec.desc;
    resultDuration.textContent = rec.duration;
    resultPrice.textContent = rec.price;
  }

  // Restart Quiz Event
  restartQuizBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    answers = [];
    quizResults.style.display = 'none';
    quizIntro.style.display = 'block';
  });
});
