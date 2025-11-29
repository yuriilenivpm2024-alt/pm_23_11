/**
 * ЗАВДАННЯ 3: Масив даних про досвід роботи.
 */
const jobExperienceData = [
    {
        title: "Senior Web Designer",
        date: "2020 - Present",
        company: "Creative Agency / Chicago",
        description: "Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when unknown printer took a galley of type."
    },
    {
        title: "Graphic Designer",
        date: "2015 - 2020",
        company: "Creative Market / Chicago",
        description: "Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when unknown printer took a galley of type."
    },
    {
        title: "Marketing Manager",
        date: "2013 - 2015",
        company: "Manufacturing Agency / NJ",
        description: "Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when unknown printer took a galley of type."
    }
];

/**
 * Завдання 1: Реалізує функцію, яка вставляє повне ім'я користувача
 * в елемент з ID 'personName' і викликається після завантаження DOM.
 */
function setUserName() {
    const fullName = "Noel Taylor";
    const nameElement = document.getElementById('personName');
    if (nameElement) {
        nameElement.textContent = fullName;
    }
}

/**
 * Завдання 2: Налаштовує перемикання видимості контенту та поворот стрілки
 * для всіх секцій, позначених класом .js-toggle-header.
 */
function setupContentToggle() {
    const toggleHeaders = document.querySelectorAll('.js-toggle-header');

    toggleHeaders.forEach(header => {
        const content = header.nextElementSibling;
        const arrow = header.querySelector('.js-arrow-icon');

        // Встановлюємо контент прихованим за замовчуванням
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
 * ЗАВДАННЯ 3: Функція, яка генерує HTML розмітку на основі масиву даних
 * та вставляє її у контейнер з ID 'experience-container'.
 */
function renderJobExperience(data) {
    const container = document.getElementById('experience-container');

    if (!container) {
        console.error("Контейнер з ID 'experience-container' не знайдено.");
        return;
    }

    // 1. Очистити вміст контейнера перед вставлянням (вимога завдання)
    container.innerHTML = '';

    // 2. Згенерувати розмітку
    let htmlContent = data.map((job, index) => {
        // Визначаємо класи на основі індексу, щоб зберегти оригінальні стилі (item, item2, item3)
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

    // 3. Вставити згенеровану розмітку
    container.innerHTML = htmlContent;
}


// ==========================================
// Виклики функцій після завантаження документа
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Завдання 1
    setUserName();

    // Завдання 2
    setupContentToggle();

    // Завдання 3
    renderJobExperience(jobExperienceData);
});