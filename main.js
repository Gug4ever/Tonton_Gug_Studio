// ===== NAV MOBILE =====
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const nav = document.getElementById('navLinks');
  if (nav && !e.target.closest('nav')) nav.classList.remove('open');
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = form.querySelector('button[type="submit"]');

    const data = {
      name:    form.name.value.trim(),
      email:   form.email.value.trim(),
      subject: form.subject?.value.trim() || '',
      message: form.message.value.trim(),
    };

    btn.disabled = true;
    btn.querySelector('span').textContent = t('form.sending');
    status.textContent = '';
    status.className = 'form-status';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        status.textContent = t('form.success');
        status.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('server error');
      }
    } catch {
      status.textContent = t('form.error');
      status.className = 'form-status error';
    } finally {
      btn.disabled = false;
      btn.querySelector('span').textContent = t('form.submit');
    }
  });
}
