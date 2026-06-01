# Svetlana Clark Hair Design

A premium, bespoke web experience rebuild for **Svetlana Clark Hair Design** (Pearland & Houston). Re-themed from a dark style to a warm, luxury **Light-Mode ("Alabaster & Champagne Gold")** theme. Features a fully-functional local alternative to Square Appointments Scheduling and checkout wizard.

## 🌟 Core Features

- **Square-Styled Local Scheduling Calendar & Checkout**:
  - **Service Selection**: Multi-select menu with active sidebar tallying subtotal, taxes, due today, and due at salon.
  - **Grid Date Picker**: Calendar grid displaying June 2026. Mocked availability logic (June 1st displays waitlist options; June 5th reveals morning slots).
  - **Secure Checkout**: Forms for customer details and simulated Card on File authorization using Square-encrypted mockup styles.
  - **Satisfaction Screen**: Clean booked details summary receipt upon confirmation.
- **Dynamic HTML Injection & Single-Source Template**: The scheduling wizard and modals are loaded dynamically using `app.js` into empty `<div class="booking-wizard-overlay" id="bookingWizard"></div>` placeholders across all five static pages (`index.html`, `about.html`, `contact.html`, `new-clients.html`, and `services.html`).
- **Interactive Consultation Systems**:
  - **Pre-Consultation Form**: 3-step intake form for dimensional color styling requests.
  - **Hair Health & Recommendation Quiz**: Interactive 4-step selector showing custom results and actions.
  - **New Guest Intake Wizard**: 4-step client profile registration modal.
- **Local Persistence (`localStorage`)**:
  - Automatically preserves and pre-fills previously entered user data in all modal wizards and quiz results upon reload.
  - Keeps a rolling history of scheduled bookings in `myAppointmentsHistory`.
- **Responsive Fluid Layouts & Scrolling**: Modals adapt cleanly to laptop and mobile screens, utilizing scrollable overlays to prevent viewport truncation.

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Custom properties & HSL color tokens)
- **Icons**: FontAwesome 6 (CDN loaded)
- **Server**: Standard Python static server (local environment)

## 📁 Repository Structure

```
├── index.html              # Home page (artistry specialties, comparison grid, FAQs)
├── services.html           # Interactive filterable services menu
├── about.html              # Svetlana biography & testimonial slideshow
├── new-clients.html        # Onboarding guides & Interactive Hair Health Quiz
├── contact.html            # Pre-consultation form, operating hours & location
├── app.js                  # Unified dynamic modal injection, scheduler, and localStorage state
├── styles.css              # Main luxury Alabaster & Champagne Gold stylesheet
├── css/
│   └── style.css           # Backup/legacy styles reference
└── assets/                 # Client profiles, lookbook image items, and salon logo assets
```

## 🚀 Getting Started

To run the application locally without external internet dependencies (except FontAwesome CDN):

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/svetlana-clark-hair-design.git
   cd svetlana-clark-hair-design
   ```

2. **Start a local server**:
   You can serve the static files using a Python HTTP server or any local server extension:
   ```bash
   # Python 3
   python -m http.server 8000
   ```

3. **Open the browser**:
   Navigate to `http://localhost:8000/index.html` to explore the rebuild.

## 📝 License
This project is for demonstration and customization purposes for Svetlana Clark Hair Design. All rights reserved.
