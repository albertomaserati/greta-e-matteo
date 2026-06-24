/* ── COUNTDOWN ── */
function updateCountdown() {
  const target = new Date('2026-09-05T15:00:00');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-min').textContent = '0';
    document.getElementById('cd-sec').textContent = '0';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = d;
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-min').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-sec').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── PRESENZA TOGGLE ── */
document.querySelectorAll('input[name="fi-radio-presenza"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const extra = document.getElementById('attendeeDetails');
    extra.classList.toggle('hidden', this.value !== 'Sì, ci sarò!');
  });
});

/* ── RSVP – Forminit ── */
const FORMINIT_FORM_ID = 'r1yust14zjn';
const RECAPTCHA_SITE_KEY = '6LcqFxwtAAAAAOTVrc2y6AcYPw9YjgNeunptMR8y';
const forminit = new Forminit();

document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const token = await new Promise(resolve => {
    grecaptcha.ready(() => {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' }).then(resolve);
    });
  });
  const form = e.target;
  const btn  = document.getElementById('submitBtn');
  const errEl = document.getElementById('formError');
  errEl.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Invio in corso…';

  const fd = new FormData(form);
  fd.append('g-recaptcha-response', token);

  if (fd.get('website')) {
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    return;
  }
  fd.delete('website');

  const { error } = await forminit.submit(FORMINIT_FORM_ID, fd);

  if (!error) {
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  } else {
    console.error(error);
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Invia';
  }
});

/* ── NAV: MOBILE MENU ── */
const navToggle  = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');

function openNav() {
  document.body.classList.add('nav-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Chiudi il menu');
}
function closeNav() {
  document.body.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Apri il menu');
}

navToggle.addEventListener('click', () => {
  document.body.classList.contains('nav-open') ? closeNav() : openNav();
});

navOverlay.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

navOverlay.addEventListener('click', (e) => {
  if (e.target === navOverlay) closeNav();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeNav();
});
