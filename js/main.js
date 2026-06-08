/* ============================================
   Sterling & Associates - Law Firm Website
   Main JavaScript (Vanilla JS)
   ============================================ */

(function () {
  'use strict';

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileNav();
    initStickyHeader();
    initSmoothScroll();
    initFormValidation();
    initActiveNavHighlighting();
    initScrollAnimations();
    initBackToTop();
  }

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.nav-mobile');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });

    // Close on link click
    var mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('active') &&
        !mobileNav.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // ============================================
  // Sticky Header on Scroll
  // ============================================
  function initStickyHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    var scrollThreshold = 50;
    var lastScroll = 0;

    function handleScroll() {
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    // Use passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run on load in case page is already scrolled
    handleScroll();
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');

        // Ignore plain "#" or empty
        if (!targetId || targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var headerHeight = document.querySelector('.header')
          ? document.querySelector('.header').offsetHeight
          : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ============================================
  // Form Validation
  // ============================================
  function initFormValidation() {
    var forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var isValid = validateForm(form);
        if (!isValid) {
          e.preventDefault();
        }
      });

      // Real-time validation on blur
      var inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
      inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
          validateField(input);
        });

        // Clear error on input
        input.addEventListener('input', function () {
          if (input.classList.contains('error')) {
            clearFieldError(input);
          }
        });
      });
    });
  }

  function validateForm(form) {
    var isValid = true;
    var requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(function (field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Validate email fields
    var emailFields = form.querySelectorAll('[type="email"]');
    emailFields.forEach(function (field) {
      if (field.value.trim() && !isValidEmail(field.value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
      }
    });

    // Validate phone fields
    var phoneFields = form.querySelectorAll('[type="tel"]');
    phoneFields.forEach(function (field) {
      if (field.value.trim() && !isValidPhone(field.value)) {
        showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
      }
    });

    // Focus first error field
    if (!isValid) {
      var firstError = form.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
      if (firstError) {
        firstError.focus();
      }
    }

    return isValid;
  }

  function validateField(field) {
    var value = field.value.trim();
    var isRequired = field.hasAttribute('required');

    // Required check
    if (isRequired && !value) {
      var label = field.getAttribute('data-label') || 'This field';
      showFieldError(field, label + ' is required');
      return false;
    }

    // Email format check
    if (value && field.type === 'email' && !isValidEmail(value)) {
      showFieldError(field, 'Please enter a valid email address');
      return false;
    }

    // Phone format check
    if (value && field.type === 'tel' && !isValidPhone(value)) {
      showFieldError(field, 'Please enter a valid phone number');
      return false;
    }

    clearFieldError(field);
    return true;
  }

  function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');

    var errorEl = field.parentNode.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(field) {
    field.classList.remove('error');
    field.classList.add('success');

    var errorEl = field.parentNode.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function isValidPhone(phone) {
    // Allow digits, spaces, dashes, parentheses, plus sign; min 7 digits
    var cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d{7,15}$/.test(cleaned);
  }

  // ============================================
  // Active Page Highlighting in Navigation
  // ============================================
  function initActiveNavHighlighting() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

    navLinks.forEach(function (link) {
      var linkPath = link.getAttribute('href');

      if (!linkPath) return;

      // Normalize paths
      var currentFile = currentPath.split('/').pop() || 'index.html';
      var linkFile = linkPath.split('/').pop() || 'index.html';

      // Exact match or index match
      if (
        linkFile === currentFile ||
        (currentFile === '' && linkFile === 'index.html') ||
        (currentFile === 'index.html' && linkFile === 'index.html')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ============================================
  // Scroll-Triggered Fade-In Animations
  // ============================================
  function initScrollAnimations() {
    var fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length === 0) return;

    // Check for IntersectionObserver support
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -60px 0px',
          threshold: 0.1
        }
      );

      fadeElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all elements immediately
      fadeElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ============================================
  // Back to Top Button
  // ============================================
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    var scrollThreshold = 400;

    function handleScroll() {
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > scrollThreshold) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Initial check
    handleScroll();
  }
})();
