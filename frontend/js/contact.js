/**
 * WhatNext Vision Motors - Contact & Concierge Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFaqAccordion();
});

// Handle contact form submission
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim() || '';
    const subject = document.getElementById('contactSubject').value.trim();
    const inquiryType = document.getElementById('contactInquiryType').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      window.WN_API.showToast('Required Fields', 'Please complete all required fields.', 'warning');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; margin: 0; border-width: 2px;"></span> Sending...';

      const res = await window.WN_API.contact.submit({
        name,
        email,
        phone,
        subject,
        inquiryType,
        message,
      });

      window.WN_API.showToast('Message Received', res.message, 'success');
      form.reset();

      // Show friendly confirmation box
      const statusBox = document.getElementById('contactStatusBox');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 12px; padding: 1.25rem; color: #34D399; margin-top: 1.5rem; text-align: center;">
            ✓ Message transmitted to WhatNext Client Services. Our team will review your inquiry shortly.
          </div>
        `;
      }
    } catch (err) {
      window.WN_API.showToast('Submission Error', err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Transmit Message';
    }
  });
}

// Interactive FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach((i) => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}
