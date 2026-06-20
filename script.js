document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mainNav.classList.toggle('active');
      mobileMenuBtn.textContent = isActive ? '✕' : '☰';
    });

    // Close menu when a link is clicked
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
      });
    });
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // Bulk Inquiry Form Handler (Dual Email + WhatsApp)
  const inquiryForm = document.getElementById('bulk-inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const country = document.getElementById('country').value;
      const requirement = document.getElementById('requirement').value;
      
      // 1. Send email in the background using Web3Forms
      const formData = new FormData(inquiryForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        if (response.status === 200) {
          console.log("Email inquiry logged successfully.");
        } else {
          console.warn("Email logging failed, but proceeding with WhatsApp redirect.");
        }
      })
      .catch(error => {
        console.error("Network error logging email, but proceeding with WhatsApp redirect:", error);
      });

      // 2. Construct a professional WhatsApp B2B message
      const message = `Hello Shri Raghavendra Exports,\n\nI would like to make an inquiry regarding bulk spice sourcing.\n\n*Name:* ${name}\n*Email:* ${email}\n*Country:* ${country}\n*Requirement Details:* ${requirement}`;
      
      // Encode URI
      const whatsappUrl = `https://wa.me/919886437109?text=${encodeURIComponent(message)}`;
      
      // 3. Show custom toast notification
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = "Sending inquiry & opening WhatsApp...";
        toast.classList.add('show');
      }
      
      // 4. Redirect to WhatsApp after a brief delay so the user sees the toast
      setTimeout(() => {
        if (toast) {
          toast.classList.remove('show');
        }
        window.open(whatsappUrl, '_blank');
      }, 1500);

      // Reset form fields
      inquiryForm.reset();
    });
  }
});
