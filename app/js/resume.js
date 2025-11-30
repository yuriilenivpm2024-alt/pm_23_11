// ===============================================
// === ФУНКЦІЇ ДЛЯ ЛР4 (МОДИФІКОВАНІ ДЛЯ ЛР5) ===
// ===============================================

/**
 * Завдання 1 (ЛР4, модифіковане для ЛР5): Підставляє повне ім'я з об'єкта даних.
 * @param {object} personalInfo - Об'єкт, що містить firstName та lastName.
 */
function setUserName(personalInfo) {
    const nameElement = document.getElementById('personName');
    if (nameElement) {
        // Використовуємо поля firstName та lastName з JSON
        nameElement.textContent = `${personalInfo.firstName} ${personalInfo.lastName}`;
    }
}

/**
 * Завдання 2 (ЛР4): Налаштовує перемикання видимості контенту.
 */
function setupContentToggle() {
    const toggleHeaders = document.querySelectorAll('.js-toggle-header');

    toggleHeaders.forEach(header => {
        const content = header.nextElementSibling;
        const arrow = header.querySelector('.js-arrow-icon');

        if (content) {
            content.classList.add('is-hidden');
        }

        header.addEventListener('click', () => {
            if (content) {
                content.classList.toggle('is-hidden');
            }
            if (arrow) {
                arrow.classList.toggle('is-rotated');
            }
        });
    });
}

/**
 * Завдання 3 (ЛР4, модифіковане для ЛР5): Генерує розмітку Досвіду роботи з масиву.
 * @param {Array} data - Масив записів про досвід роботи.
 */
function renderJobExperience(data) {
    const container = document.getElementById('experience-container');

    if (!container) return;

    // Очищення вмісту (вимога ЛР4)
    container.innerHTML = '';

    let htmlContent = data.map((job, index) => {
        const suffix = index === 0 ? '' : index + 1;

        const itemClass = `experience-item${suffix}`;
        const headerClass = `experience-header${suffix}`;
        const titleClass = `experience-title${suffix}`;
        const dateClass = `experience-date${suffix}`;
        const companyClass = `experience-company${suffix}`;
        const descriptionClass = `experience-description${suffix}`;

        return `
            <div class="${itemClass}">
                <div class="${headerClass}">
                    <h3 class="${titleClass}">${job.title}</h3>
                    <span class="${dateClass}">${job.date}</span>
                </div>
                <p class="${companyClass}"><em>${job.company}</em></p>
                <div class="${descriptionClass}">
                    <p>${job.description}</p>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = htmlContent;
}


// ==========================================
// === ОСНОВНА ЛОГІКА ЛР5 (AJAX / FETCH) ===
// ==========================================

/**
 * Функція для інтеграції всіх завантажених даних у веб-інтерфейс (Завдання 3 ЛР5).
 * @param {object} data - Об'єкт, завантажений з data.json.
 */
function integrateData(data) {
    // 1. Заміна імені (personalInfo)
    setUserName(data.personalInfo);

    // 2. Побудова списку Досвіду роботи (jobs)
    renderJobExperience(data.jobs);

    // (Тут могли б бути виклики для навичок, мов тощо)
}


/**
 * Функція завантаження даних із data.json засобами AJAX (Fetch API) (Завдання 2 ЛР5).
 */
function loadData() {
    // Використовуємо відносний шлях, який має працювати на локальному сервері
    fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                // Кидаємо помилку, якщо статус HTTP не 200
                throw new Error(`Помилка завантаження даних: статус ${response.status} ${response.statusText}`);
            }
            // Перетворення відповіді у JavaScript-об'єкт (JSON)
            return response.json();
        })
        .then(data => {
            // Успішне завантаження: інтегруємо дані
            integrateData(data);
        })
        .catch(error => {
            // Обробка помилок та відображення повідомлення (вимога Завдання 2 ЛР5)
            console.error('AJAX/Fetch Error:', error.message);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML =
                    '<div style="text-align: center; padding: 50px; color: #cc0000; border: 1px solid #ffcccc; background: #ffeeee;">' +
                    'Помилка: Не вдалося завантажити дані. (Перевірте консоль та запуск через локальний сервер)</div>';
            }
        });
}


// ==========================================
// === ЗАПУСК ===
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Завдання 2 ЛР5: Спочатку завантажуємо дані
    loadData();

    // Завдання 2 ЛР4: Налаштування перемикання (виконується одразу)
    setupContentToggle();
});