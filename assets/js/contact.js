/**
 * Stackly Bakery - Contact & Hearth Visit Application
 * Vanilla JavaScript: Sticky navbar, mobile menu drawer,
 * inquiry modal drawer, newsletter subscription, and schedule interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. STICKY NAVBAR SCROLL STATE (Handled primarily by navbar.js)
  // --------------------------------------------------------------------------
  const header = document.getElementById('contactHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileDrawerClose && mobileDrawer) {
    mobileDrawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // --------------------------------------------------------------------------
  // 3. INQUIRY / CATERING SLIDE-OVER MODAL
  // --------------------------------------------------------------------------
  const inquiryOverlay = document.getElementById('inquiryModalOverlay');
  const openInquiryBtn = document.getElementById('openInquiryBtn');
  const modalCloseBtn = document.getElementById('inquiryCloseBtn');
  const inquiryForm = document.getElementById('inquiryForm');

  function openInquiryModal() {
    if (!inquiryOverlay) return;
    inquiryOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeInquiryModal() {
    if (!inquiryOverlay) return;
    inquiryOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openInquiryBtn) {
    openInquiryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openInquiryModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeInquiryModal);
  }

  if (inquiryOverlay) {
    inquiryOverlay.addEventListener('click', (e) => {
      if (e.target === inquiryOverlay) closeInquiryModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inquiryOverlay && inquiryOverlay.classList.contains('open')) {
      closeInquiryModal();
    }
  });

  // Strict validation regex helpers
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
  const nameRegex = /^[a-zA-Z\s'-]+$/;

  if (inquiryForm) {
    const inqName = document.getElementById('inqName');
    const inqEmail = document.getElementById('inqEmail');
    const inqPhone = document.getElementById('inqPhone');
    const inqType = document.getElementById('inqType');
    const inqNotes = document.getElementById('inqNotes');

    const inqNameError = document.getElementById('inqNameError');
    const inqEmailError = document.getElementById('inqEmailError');
    const inqPhoneError = document.getElementById('inqPhoneError');
    const inqNotesError = document.getElementById('inqNotesError');

    // Real-time error dismissal on input
    const clearInqError = (input, errorEl) => {
      if (!input) return;
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        if (errorEl) errorEl.classList.remove('visible');
      });
    };

    clearInqError(inqName, inqNameError);
    clearInqError(inqEmail, inqEmailError);
    clearInqError(inqPhone, inqPhoneError);
    clearInqError(inqNotes, inqNotesError);

    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = inqName ? inqName.value.trim() : '';
      const emailVal = inqEmail ? inqEmail.value.trim() : '';
      const phoneVal = inqPhone ? inqPhone.value.trim() : '';
      const notesVal = inqNotes ? inqNotes.value.trim() : '';

      let isValid = true;
      let firstInvalid = null;

      // Validate Name
      if (!nameVal) {
        isValid = false;
        if (inqName) inqName.classList.add('is-invalid');
        if (inqNameError) {
          inqNameError.textContent = 'Name is required';
          inqNameError.classList.add('visible');
        }
        if (!firstInvalid) firstInvalid = inqName;
      } else if (nameVal.length < 2 || !nameRegex.test(nameVal)) {
        isValid = false;
        if (inqName) inqName.classList.add('is-invalid');
        if (inqNameError) {
          inqNameError.textContent = 'Please enter a valid name (letters only, min 2 characters)';
          inqNameError.classList.add('visible');
        }
        if (!firstInvalid) firstInvalid = inqName;
      }

      // Validate Email
      if (!emailVal) {
        isValid = false;
        if (inqEmail) inqEmail.classList.add('is-invalid');
        if (inqEmailError) {
          inqEmailError.textContent = 'Email is required';
          inqEmailError.classList.add('visible');
        }
        if (!firstInvalid) firstInvalid = inqEmail;
      } else if (!emailRegex.test(emailVal)) {
        isValid = false;
        if (inqEmail) inqEmail.classList.add('is-invalid');
        if (inqEmailError) {
          inqEmailError.textContent = 'Please enter a valid email address';
          inqEmailError.classList.add('visible');
        }
        if (!firstInvalid) firstInvalid = inqEmail;
      }

      // Validate Phone (optional, but strict format if provided)
      if (phoneVal && !phoneRegex.test(phoneVal)) {
        isValid = false;
        if (inqPhone) inqPhone.classList.add('is-invalid');
        if (inqPhoneError) {
          inqPhoneError.textContent = 'Please enter a valid phone number (e.g. 9876543210)';
          inqPhoneError.classList.add('visible');
        }
        if (!firstInvalid) firstInvalid = inqPhone;
      }

      // Validate Notes/Event Details
      if (!notesVal) {
        isValid = false;
        if (inqNotes) inqNotes.classList.add('is-invalid');
        if (inqNotesError) {
          inqNotesError.textContent = 'Please enter your event details & date';
          inqNotesError.classList.add('visible');
        }
        if (!firstInvalid) firstInvalid = inqNotes;
      } else if (notesVal.length < 10) {
        isValid = false;
        if (inqNotes) inqNotes.classList.add('is-invalid');
        if (inqNotesError) {
          inqNotesError.textContent = 'Please provide at least 10 characters describing your event';
          inqNotesError.classList.add('visible');
        }
        if (!firstInvalid) firstInvalid = inqNotes;
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Inquiry...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Inquiry Received!';
          submitBtn.style.backgroundColor = '#16A34A';
        }
        const feedback = document.getElementById('inquiryFeedback');
        if (feedback) {
          feedback.style.display = 'block';
          feedback.textContent = `Thank you, ${nameVal}! Our head baker Elena Vance will review your request and reply to ${emailVal} within 24 hours.`;
        }
        setTimeout(() => {
          closeInquiryModal();
          inquiryForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Submit Catering Request</span>';
            submitBtn.style.backgroundColor = '';
          }
          if (feedback) feedback.style.display = 'none';
        }, 2200);
      }, 800);
    });
  }

  // --------------------------------------------------------------------------
  // 4. NEWSLETTER STRIP SUBSCRIPTION
  // --------------------------------------------------------------------------
  const stripForm = document.getElementById('stripForm');
  const stripEmail = document.getElementById('stripEmail');
  const stripBtn = document.getElementById('stripSubmitBtn');
  const stripFeedback = document.getElementById('stripFeedback');

  if (stripForm && stripEmail) {
    stripEmail.addEventListener('input', () => {
      stripEmail.classList.remove('is-invalid');
      stripEmail.style.borderColor = '';
      if (stripFeedback) {
        stripFeedback.textContent = '';
        stripFeedback.className = 'strip-feedback';
      }
    });

    stripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = stripEmail.value.trim();

      if (!email) {
        stripEmail.focus();
        stripEmail.classList.add('is-invalid');
        if (stripFeedback) {
          stripFeedback.textContent = 'Email is required';
          stripFeedback.className = 'strip-feedback error';
        }
        return;
      }

      if (!emailRegex.test(email)) {
        stripEmail.focus();
        stripEmail.classList.add('is-invalid');
        if (stripFeedback) {
          stripFeedback.textContent = 'Please enter a valid email address';
          stripFeedback.className = 'strip-feedback error';
        }
        return;
      }

      stripEmail.classList.remove('is-invalid');
      stripEmail.style.borderColor = '';
      if (stripFeedback) {
        stripFeedback.className = 'strip-feedback';
        stripFeedback.textContent = '';
      }
      stripBtn.disabled = true;
      stripBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';

      setTimeout(() => {
        stripBtn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
        stripBtn.style.backgroundColor = '#16A34A';
        if (stripFeedback) {
          stripFeedback.textContent = `You're on the list! We've sent morning hold perks to ${email}.`;
          stripFeedback.className = 'strip-feedback active';
        }
        stripEmail.value = '';

        try {
          localStorage.setItem('stackly_contact_subscribed', 'true');
        } catch (_) {}
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 5. FLOATING HERO BADGE CLICK SCROLL
  // --------------------------------------------------------------------------
  const heroBadge = document.querySelector('.hero-floating-badge');
  if (heroBadge) {
    heroBadge.addEventListener('click', () => {
      const locationSection = document.getElementById('location');
      if (locationSection) {
        locationSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. MAIN ON-PAGE CONTACT FORM (Section 4)
  // --------------------------------------------------------------------------
  const mainContactForm = document.getElementById('mainContactForm');
  const mainContactSubmitBtn = document.getElementById('mainContactSubmitBtn');
  const mainContactFeedback = document.getElementById('mainContactFeedback');

  if (mainContactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const subjectSelect = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const nameError = document.getElementById('contactNameError');
    const emailError = document.getElementById('contactEmailError');
    const phoneError = document.getElementById('contactPhoneError');
    const messageError = document.getElementById('contactMessageError');

    // Real-time error dismissal on input
    const clearError = (input, errorEl) => {
      if (!input) return;
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        if (errorEl) errorEl.classList.remove('visible');
      });
    };

    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(phoneInput, phoneError);
    clearError(messageInput, messageError);

    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const subjectVal = subjectSelect ? subjectSelect.value : 'General Bakery Inquiry';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      let isValid = true;
      let firstInvalidInput = null;

      // Validate Name
      if (!nameVal) {
        isValid = false;
        if (nameInput) nameInput.classList.add('is-invalid');
        if (nameError) {
          nameError.textContent = 'Name is required';
          nameError.classList.add('visible');
        }
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else if (nameVal.length < 2 || !nameRegex.test(nameVal)) {
        isValid = false;
        if (nameInput) nameInput.classList.add('is-invalid');
        if (nameError) {
          nameError.textContent = 'Please enter a valid name (letters only, min 2 characters)';
          nameError.classList.add('visible');
        }
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        if (nameInput) nameInput.classList.remove('is-invalid');
        if (nameError) nameError.classList.remove('visible');
      }

      // Validate Email
      if (!emailVal) {
        isValid = false;
        if (emailInput) emailInput.classList.add('is-invalid');
        if (emailError) {
          emailError.textContent = 'Email is required';
          emailError.classList.add('visible');
        }
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!emailRegex.test(emailVal)) {
        isValid = false;
        if (emailInput) emailInput.classList.add('is-invalid');
        if (emailError) {
          emailError.textContent = 'Please enter a valid email address';
          emailError.classList.add('visible');
        }
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        if (emailInput) emailInput.classList.remove('is-invalid');
        if (emailError) emailError.classList.remove('visible');
      }

      // Validate Phone (optional, but strict format if provided)
      if (phoneVal && !phoneRegex.test(phoneVal)) {
        isValid = false;
        if (phoneInput) phoneInput.classList.add('is-invalid');
        if (phoneError) {
          phoneError.textContent = 'Please enter a valid phone number (e.g. 9876543210)';
          phoneError.classList.add('visible');
        }
        if (!firstInvalidInput) firstInvalidInput = phoneInput;
      } else {
        if (phoneInput) phoneInput.classList.remove('is-invalid');
        if (phoneError) phoneError.classList.remove('visible');
      }

      // Validate Message
      if (!messageVal) {
        isValid = false;
        if (messageInput) messageInput.classList.add('is-invalid');
        if (messageError) {
          messageError.textContent = 'Message is required';
          messageError.classList.add('visible');
        }
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else if (messageVal.length < 10) {
        isValid = false;
        if (messageInput) messageInput.classList.add('is-invalid');
        if (messageError) {
          messageError.textContent = 'Message must be at least 10 characters';
          messageError.classList.add('visible');
        }
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else {
        if (messageInput) messageInput.classList.remove('is-invalid');
        if (messageError) messageError.classList.remove('visible');
      }

      if (!isValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      // Valid: Start submission feedback
      if (mainContactSubmitBtn) {
        mainContactSubmitBtn.disabled = true;
        mainContactSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';
      }

      setTimeout(() => {
        if (mainContactSubmitBtn) {
          mainContactSubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';
          mainContactSubmitBtn.style.backgroundColor = '#16A34A';
        }

        if (mainContactFeedback) {
          mainContactFeedback.className = 'contact-feedback-box success';
          mainContactFeedback.innerHTML = `
            <i class="fa-solid fa-circle-check" style="color: #22c55e; font-size: 1.25rem; flex-shrink: 0; margin-top: 2px;"></i>
            <div>
              <strong>Thank you, ${nameVal}!</strong> Your message regarding <em>${subjectVal}</em> has been received. Our Salem hearth counter team will reply to <u>${emailVal}</u> within 24 hours.
            </div>
          `;
          mainContactFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset inputs
        mainContactForm.reset();

        // Save submission record in localStorage
        try {
          const inquiries = JSON.parse(localStorage.getItem('stackly_inquiries') || '[]');
          inquiries.push({
            name: nameVal,
            email: emailVal,
            phone: phoneVal,
            subject: subjectVal,
            message: messageVal,
            submittedAt: new Date().toISOString()
          });
          localStorage.setItem('stackly_inquiries', JSON.stringify(inquiries));
        } catch (_) {}

        // Restore button after 5 seconds
        setTimeout(() => {
          if (mainContactSubmitBtn) {
            mainContactSubmitBtn.disabled = false;
            mainContactSubmitBtn.innerHTML = '<span class="btn-label">Send Message</span> <i class="fa-solid fa-paper-plane btn-icon"></i>';
            mainContactSubmitBtn.style.backgroundColor = '';
          }
        }, 5000);
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 6. AOS (ANIMATE ON SCROLL) CDNJS INITIALIZATION
  // --------------------------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
      disableMutationObserver: false
    });
  }
});

