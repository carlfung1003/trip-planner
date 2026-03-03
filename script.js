// ===== COUNTDOWN =====
// Departure: Apr 2, 2026 22:50 PDT (UTC-7)
const DEPARTURE = new Date('2026-04-02T22:50:00-07:00');

function updateCountdown() {
  const now = new Date();
  const diff = DEPARTURE - now;
  const el = document.getElementById('countdown');
  if (!el) return;

  if (diff <= 0) {
    // Trip has started (or departed)
    document.getElementById('cd-days').textContent  = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
    document.querySelector('.countdown-label').textContent = 'WE\'RE ON THE TRIP ✈';
    el.classList.add('departed');
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');

  // Pulse the seconds block
  const secsEl = document.getElementById('cd-secs');
  secsEl.style.opacity = '0.6';
  setTimeout(() => { secsEl.style.opacity = '1'; }, 100);

  // Turn gold in the last 24 hours
  if (diff < 24 * 60 * 60 * 1000) el.classList.add('departing');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== DAY TABS =====
document.querySelectorAll('.day-tabs').forEach(tabGroup => {
  const city = tabGroup.dataset.city;
  const tabs = tabGroup.querySelectorAll('.day-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll(`.day-content[data-city="${city}"]`).forEach(content => {
        if (content.dataset.day === day) {
          content.classList.remove('hidden');
          // Stagger animate newly revealed items
          content.querySelectorAll('.fi:not(.visible)').forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.07}s`;
            // Force reflow then add visible
            requestAnimationFrame(() => el.classList.add('visible'));
          });
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });
});

// ===== SCROLL FADE-IN (IntersectionObserver) =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

function observeAll() {
  document.querySelectorAll('.fi:not(.visible)').forEach(el => {
    if (!el.closest('.hidden')) io.observe(el);
  });
}

observeAll();

// Re-observe after tab switches
document.querySelectorAll('.day-tab').forEach(tab => {
  tab.addEventListener('click', () => setTimeout(observeAll, 60));
});

// ===== ACTIVE NAV ON SCROLL =====
const citySections = document.querySelectorAll('.city-section');
const navLinks = document.querySelectorAll('.nav-link[data-city]');

const sectionIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const city = entry.target.dataset.city;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.city === city);
      });
    }
  });
}, { threshold: 0.25, rootMargin: '-60px 0px 0px 0px' });

citySections.forEach(s => sectionIO.observe(s));

// ===== EXPAND / COLLAPSE RESTAURANT GRIDS =====
document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const grid = document.getElementById(btn.dataset.target);
    const isOpen = grid.classList.toggle('expanded');
    btn.classList.toggle('open', isOpen);
    btn.querySelector('.expand-label').textContent = isOpen ? 'Show fewer' : 'Show all saved places';
    if (isOpen) {
      grid.querySelectorAll('.rest-extra:not(.visible)').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.06}s`;
        requestAnimationFrame(() => el.classList.add('visible'));
      });
    }
  });
});

// ===== HERO CITY CYCLING =====
const cycleEl = document.querySelector('.city-cycle');
if (cycleEl) {
  const cities = [
    { name: 'BANGKOK', color: '#F5A623' },
    { name: 'HONG KONG', color: '#E8003D' },
    { name: 'SANYA', color: '#00C9A7' },
  ];
  let idx = 0;

  cycleEl.style.color = cities[0].color;

  setInterval(() => {
    idx = (idx + 1) % cities.length;
    cycleEl.style.opacity = '0';
    setTimeout(() => {
      cycleEl.textContent = cities[idx].name;
      cycleEl.style.color = cities[idx].color;
      cycleEl.style.opacity = '1';
    }, 300);
  }, 2200);
}
