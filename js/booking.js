/* ==========================================
   BOOKING SIMULATOR MODULE - Svetlana Clark Hair Design
   ========================================== */

const SERVICES_DATA = {
  consultation: { title: "Signature Consultation", price: "$0.00", duration: "15 mins" },
  haircut: { title: "Precision Haircut Experience", price: "$150.00", duration: "1 hr" },
  color: { title: "Color Experience (No Lightening)", price: "$200.00", duration: "1 hr 30 mins" },
  lightening: { title: "Lightening Experience", price: "Custom", duration: "3 hrs" },
  puraluxe: { title: "Pura Luxe Smoothing Treatment", price: "From $300.00", duration: "2 hrs 30 mins" }
};

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM"
];

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const locationCards = document.querySelectorAll('.booking-location-card');
  const serviceDropdown = document.getElementById('bookingServiceSelect');
  const calendarGrid = document.getElementById('bookingCalendar');
  const calendarMonthLabel = document.getElementById('calendarMonthLabel');
  const slotsGrid = document.getElementById('bookingSlots');
  
  // Summary Panel elements
  const summaryLocation = document.getElementById('summaryLocation');
  const summaryService = document.getElementById('summaryService');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryDate = document.getElementById('summaryDate');
  const summaryTime = document.getElementById('summaryTime');
  const summaryTotal = document.getElementById('summaryTotal');
  const confirmBtn = document.getElementById('bookingConfirmBtn');
  
  // Modal elements
  const successModal = document.getElementById('successModal');
  const modalClose = document.querySelector('.modal-close');
  const receiptLocation = document.getElementById('receiptLocation');
  const receiptService = document.getElementById('receiptService');
  const receiptDateTime = document.getElementById('receiptDateTime');
  const receiptPrice = document.getElementById('receiptPrice');

  if (!serviceDropdown) return; // Exit if booking panel is not on current page

  // Current Selections State
  let selectedLocationName = "Houston Galleria";
  let selectedServiceKey = "consultation";
  let selectedDateObj = null;
  let selectedTimeSlot = "";

  // 1. Setup Location Selection
  locationCards.forEach(card => {
    card.addEventListener('click', () => {
      locationCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedLocationName = card.getAttribute('data-location-name');
      updateSummary();
    });
  });

  // 2. Setup Service Selection
  serviceDropdown.addEventListener('change', (e) => {
    selectedServiceKey = e.target.value;
    updateSummary();
  });

  // 3. Setup Calendar Generation
  function generateCalendar() {
    calendarGrid.innerHTML = '';
    
    // Day Name Headers
    const daysHeader = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    daysHeader.forEach(day => {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'booking-calendar-day-header';
      headerDiv.textContent = day;
      calendarGrid.appendChild(headerDiv);
    });

    const today = new Date();
    calendarMonthLabel.textContent = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Generate next 14 days starting from today
    for (let i = 0; i < 14; i++) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + i);

      const dayElement = document.createElement('div');
      dayElement.className = 'booking-calendar-day';
      dayElement.textContent = targetDate.getDate();

      // Closed days: Monday (1) and Sunday (0)
      const dayOfWeek = targetDate.getDay();
      const isClosed = dayOfWeek === 0 || dayOfWeek === 1;

      if (isClosed) {
        dayElement.classList.add('disabled');
      } else {
        // Handle click selection
        dayElement.addEventListener('click', () => {
          document.querySelectorAll('.booking-calendar-day').forEach(d => d.classList.remove('selected'));
          dayElement.classList.add('selected');
          selectedDateObj = targetDate;
          
          // Generate Slots upon date selection
          generateTimeSlots();
          updateSummary();
        });

        // Auto select first available day
        if (!selectedDateObj) {
          dayElement.classList.add('selected');
          selectedDateObj = targetDate;
          generateTimeSlots();
        }
      }

      calendarGrid.appendChild(dayElement);
    }
  }

  // 4. Setup Time Slots Generation
  function generateTimeSlots() {
    slotsGrid.innerHTML = '';
    selectedTimeSlot = ""; // Reset time slot on date change
    confirmBtn.disabled = true; // Disable confirm button until slot chosen

    TIME_SLOTS.forEach((slot, idx) => {
      const slotElement = document.createElement('div');
      slotElement.className = 'booking-slot-pill';
      slotElement.textContent = slot;

      // Simulate occasional booked slots
      const isBooked = (idx === 1 || idx === 3) && (selectedDateObj.getDate() % 2 === 0);
      if (isBooked) {
        slotElement.classList.add('disabled');
      } else {
        slotElement.addEventListener('click', () => {
          document.querySelectorAll('.booking-slot-pill').forEach(s => s.classList.remove('selected'));
          slotElement.classList.add('selected');
          selectedTimeSlot = slot;
          confirmBtn.disabled = false; // Enable submit
          updateSummary();
        });
      }

      slotsGrid.appendChild(slotElement);
    });
  }

  // 5. Update Summary Panel Display
  function updateSummary() {
    const serviceInfo = SERVICES_DATA[selectedServiceKey];
    
    summaryLocation.textContent = selectedLocationName;
    summaryService.textContent = serviceInfo.title;
    summaryDuration.textContent = serviceInfo.duration;
    summaryPrice.textContent = serviceInfo.price;
    summaryTotal.textContent = serviceInfo.price;

    if (selectedDateObj) {
      const formattedDate = selectedDateObj.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
      });
      summaryDate.textContent = formattedDate;
    } else {
      summaryDate.textContent = 'Choose Date';
    }

    if (selectedTimeSlot) {
      summaryTime.textContent = selectedTimeSlot;
    } else {
      summaryTime.textContent = 'Choose Time';
    }
  }

  // 6. Request Booking Action (Simulating validation & confirmation)
  confirmBtn.addEventListener('click', () => {
    if (!selectedLocationName || !selectedServiceKey || !selectedDateObj || !selectedTimeSlot) {
      return;
    }

    const serviceInfo = SERVICES_DATA[selectedServiceKey];
    const formattedDate = selectedDateObj.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });

    // Populate confirmation receipt values
    receiptLocation.textContent = selectedLocationName;
    receiptService.textContent = serviceInfo.title;
    receiptDateTime.textContent = `${formattedDate} at ${selectedTimeSlot}`;
    receiptPrice.textContent = serviceInfo.price;

    // Show modal dialog
    successModal.style.display = 'flex';
  });

  // Modal Close Action
  modalClose.addEventListener('click', () => {
    successModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.style.display = 'none';
    }
  });

  // Initialize Simulator
  generateCalendar();
  updateSummary();
});
