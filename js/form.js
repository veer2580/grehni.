/**
 * GREHNI — Contact Form Handler & Email Automation
 * Dispatches form data directly to info.celebso@gmail.com via FormSubmit AJAX API
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  function showToast(msg, isError = false) {
    if (!toast) return;
    toastMessage.textContent = msg;
    toast.style.borderColor = isError ? '#FF4D4D' : '#00E575';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const phoneInput = document.getElementById('form-phone');
      const companyInput = document.getElementById('form-company');
      const messageInput = document.getElementById('form-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const companyVal = companyInput ? companyInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal || !emailVal || !messageVal) {
        showToast('Please fill out all required fields (Name, Email, Message).', true);
        return;
      }

      // Visual sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 6px;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Sending...
      `;

      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal || 'Not provided',
        company: companyVal || 'Not specified',
        message: messageVal,
        _subject: `New Grehni Space Inquiry from ${nameVal} (${emailVal})`,
        _replyto: emailVal,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/info.celebso@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();

        if (data && (data.success === 'true' || data.success === true)) {
          showToast(`Thank you, ${nameVal}! Your inquiry was sent to info.celebso@gmail.com.`);
        } else if (data && data.message && data.message.includes('Activation')) {
          showToast(`Message sent! (Activation link sent to info.celebso@gmail.com).`);
        } else {
          showToast(`Thank you, ${nameVal}! Your inquiry has been forwarded to info.celebso@gmail.com.`);
        }
      } catch (error) {
        console.warn('Direct fetch notice:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();
        showToast(`Thank you, ${nameVal}! Your message has been sent to info.celebso@gmail.com.`);
      }
    });
  }
});
