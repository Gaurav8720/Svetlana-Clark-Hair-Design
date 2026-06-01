/* ==========================================
   LOOKBOOK MODULE - Svetlana Clark Hair Design
   ========================================== */

const LOOKBOOK_ITEMS = [
  {
    title: "Seamless Gray Blending",
    category: "gray-blending",
    image: "assets/hair_balayage.png"
  },
  {
    title: "Dimensional Soft Balayage",
    category: "balayage-color",
    image: "assets/hair_balayage.png"
  },
  {
    title: "Chic Textured Pixie Cut",
    category: "cuts",
    image: "assets/hair_pixie.png"
  },
  {
    title: "Amino Acid Smoothing",
    category: "treatments",
    image: "assets/hair_smooth.png"
  },
  {
    title: "Precision Midi Cut",
    category: "cuts",
    image: "assets/hair_pixie.png"
  },
  {
    title: "Luxury Blonding & Tone",
    category: "balayage-color",
    image: "assets/hair_balayage.png"
  },
  {
    title: "Low Maintenance Gray Blend",
    category: "gray-blending",
    image: "assets/hair_balayage.png"
  },
  {
    title: "PuraLuxe Keratin Treatment",
    category: "treatments",
    image: "assets/hair_smooth.png"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const lookbookGrid = document.getElementById('lookbookGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!lookbookGrid) return; // Exit if lookbook isn't on the current page

  // 1. Render Gallery Items
  function renderGallery(filter = 'all') {
    lookbookGrid.innerHTML = '';
    
    const itemsToRender = filter === 'all' 
      ? LOOKBOOK_ITEMS 
      : LOOKBOOK_ITEMS.filter(item => item.category === filter);

    itemsToRender.forEach(item => {
      const card = document.createElement('div');
      card.className = `lookbook-item ${item.category}`;
      card.style.opacity = 0;
      card.style.transform = 'translateY(10px)';
      
      const humanCategory = item.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' & ');

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="lookbook-item-overlay">
          <h4 class="lookbook-item-title">${item.title}</h4>
          <span class="lookbook-item-tag">${humanCategory}</span>
        </div>
      `;

      lookbookGrid.appendChild(card);
      
      // Trigger smooth fade-in
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }, 50);
    });
  }

  // 2. Setup Filter Click Handlers
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Remove active class from other buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      renderGallery(filterValue);
    });
  });

  // Initial render
  renderGallery();
});
