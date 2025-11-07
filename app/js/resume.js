const toggleExperienceCard = (button) => {
  const card = button.closest('.experience-card');
  if (!card) return;

  const details = card.querySelector('.experience-card__details');
  if (!details) return;

  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isExpanded));
  card.classList.toggle('is-open', !isExpanded);
  details.hidden = isExpanded;
  button.textContent = isExpanded ? 'Детальніше' : 'Згорнути';
};

const calculateTenure = (card) => {
  const tenureElement = card.querySelector('[data-tenure]');
  if (!tenureElement) return;

  const start = parseInt(card.dataset.startYear, 10);
  const endRaw = card.dataset.endYear;
  const currentYear = new Date().getFullYear();
  const end = endRaw ? parseInt(endRaw, 10) : currentYear;
  const endLabel = endRaw ? end : 'дотепер';

  if (Number.isNaN(start) || Number.isNaN(end)) return;

  const duration = Math.max(0, end - start);
  const yearsText = duration === 0 ? '<1 року' : `${duration} ${declineYears(duration)}`;
  tenureElement.textContent = `${start} – ${endLabel} · ${yearsText}`;
};

const declineYears = (value) => {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return 'рік';
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'роки';
  }

  return 'років';
};

const initSkillFilter = (container) => {
  const buttons = Array.from(container.querySelectorAll('[data-skill-filter]'));
  const items = Array.from(document.querySelectorAll('.skills-list__item'));

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.skillFilter || 'all';

      buttons.forEach((btn) => btn.classList.toggle('is-active', btn === button));

      items.forEach((item) => {
        const type = item.dataset.skillType || 'all';
        const shouldHide = filter !== 'all' && filter !== type;
        item.dataset.hidden = shouldHide ? 'true' : 'false';
      });
    });
  });
};

const setCurrentYear = () => {
  const target = document.getElementById('current-year');
  if (target) {
    target.textContent = new Date().getFullYear();
  }
};

const initResume = () => {
  const experienceButtons = document.querySelectorAll('[data-action="toggle-details"]');
  experienceButtons.forEach((button) => {
    button.addEventListener('click', () => toggleExperienceCard(button));
  });

  document.querySelectorAll('.experience-card').forEach(calculateTenure);

  const skillFilter = document.querySelector('.skills-switcher');
  if (skillFilter) {
    initSkillFilter(skillFilter);
  }

  setCurrentYear();
};

document.addEventListener('DOMContentLoaded', initResume);
