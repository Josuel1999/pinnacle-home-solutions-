// Add these values from your EmailJS account before publishing.
// The public key is intended for browser use; never put a private key here.
const emailConfig = {
  serviceId: '',
  templateId: '',
  publicKey: ''
};

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const submitButton = form.querySelector('button[type="submit"]');
const isConfigured = Object.values(emailConfig).every(Boolean);
const nameField = form.querySelector('#name');
const emailField = form.querySelector('#email');
const phoneField = form.querySelector('#phone');
const detailsField = form.querySelector('#details');
const fields = [nameField, emailField, phoneField, detailsField];

function formatPhone(value) {
  const international = value.trim().startsWith('+');
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (international) return '+' + digits;
  // Format US-style numbers as they are typed; longer numbers stay readable.
  if (digits.length > 10) return digits;
  if (digits.length <= 3) return digits ? '(' + digits : '';
  if (digits.length <= 6) return '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
  return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
}

function validateField(field) {
  let message = '';
  if (field === nameField && !field.value.trim()) {
    message = 'Please enter your name.';
  } else if (field === emailField) {
    if (!field.value.trim()) message = 'Please enter your email address.';
    else if (field.validity.typeMismatch) message = 'Please enter a valid email address.';
  } else if (field === phoneField) {
    const digits = field.value.replace(/\D/g, '');
    if (field.value && (digits.length < 10 || digits.length > 15)) {
      message = 'Please enter a phone number with 10 to 15 digits.';
    }
  } else if (field === detailsField && field.value.trim().length < 20) {
    message = 'Please describe your project in at least 20 characters.';
  }
  field.setCustomValidity(message);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  document.querySelector('#' + field.id + '-error').textContent = message;
}

fields.forEach((field) => {
  field.addEventListener('input', () => {
    if (field === phoneField) {
      // Keep the cursor next to the same digit when editing in the middle.
      const cursor = field.selectionStart;
      const before = field.value.slice(0, cursor);
      const digitsBefore = before.replace(/\D/g, '').length;
      const formatted = formatPhone(field.value);
      field.value = formatted;
      let position = 0;
      let seen = 0;
      while (position < formatted.length && seen < digitsBefore) {
        if (/\d/.test(formatted[position])) seen++;
        position++;
      }
      if (digitsBefore === 0 && formatted.startsWith('+')) position = 1;
      field.setSelectionRange(position, position);
    }
    validateField(field);
  });
  field.addEventListener('invalid', () => validateField(field));
});

if (!isConfigured) {
  status.textContent = 'The contact form is being set up. Please check back soon.';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  fields.forEach(validateField);
  if (!form.reportValidity() || !isConfigured) return;

  const data = new FormData(form);
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  status.textContent = '';

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailConfig.serviceId,
        template_id: emailConfig.templateId,
        user_id: emailConfig.publicKey,
        template_params: {
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          details: data.get('details')
        }
      })
    });
    if (!response.ok) throw new Error('Email service rejected the request');
    form.reset();
    fields.forEach((field) => {
      field.setCustomValidity('');
      field.removeAttribute('aria-invalid');
      document.querySelector('#' + field.id + '-error').textContent = '';
    });
    status.textContent = 'Thanks for reaching out! Your message has been sent.';
  } catch (error) {
    status.textContent = 'Sorry, your message could not be sent. Please try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send message ↗';
  }
});
