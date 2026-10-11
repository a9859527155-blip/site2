document.addEventListener('DOMContentLoaded', () => {
    // 1. Мобильное меню (Drawer)
    const burger = document.querySelector("[data-burger]");
    const nav = document.querySelector("[data-nav]");
    const overlay = document.querySelector("[data-overlay]");
    const closeBtn = document.querySelector("[data-menu-close]");
    const body = document.body;

    function toggleMenu() {
        body.classList.toggle("menu-open");
    }

    if (burger && nav) {
        burger.addEventListener("click", toggleMenu);
        
        // Закрытие при клике на ссылку
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (body.classList.contains("menu-open")) {
                    toggleMenu();
                }
            });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener("click", toggleMenu);
    }


    // 2. Аккордеон услуг (Toggle Details)
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        const btn = card.querySelector(".toggle-details");
        const details = card.querySelector(".service-details");
        
        if (btn && details) {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); // Предотвращаем переход, если это ссылка
                
                // Закрываем другие открытые карточки (опционально, для эффекта "один за раз")
                serviceCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains("active")) {
                        otherCard.classList.remove("active");
                        const otherBtn = otherCard.querySelector(".toggle-details");
                        if(otherBtn) otherBtn.textContent = "Подробнее о пакете";
                    }
                });

                // Переключаем текущую
                card.classList.toggle("active");
                
                // Меняем текст кнопки
                if (card.classList.contains("active")) {
                    btn.textContent = "Свернуть детали ▲";
                } else {
                    btn.textContent = "Подробнее о пакете ▼";
                }
            });
        }
    });


    // 3. Форма заявки
    const form = document.querySelector("[data-form]");
    const message = document.querySelector("[data-form-message]");

    if (form && message) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const data = new FormData(form);
            const name = (data.get("name") || "").toString().trim();
            const phone = (data.get("phone") || "").toString().trim();
            const type = (data.get("type") || "").toString();

            if (!name || !phone) {
                message.textContent = "Пожалуйста, заполните имя и телефон.";
                message.className = "form__message form__message--error";
                return;
            }

            // Имитация успешной отправки
            message.textContent = `Заявка принята! Мы свяжемся с вами по поводу "${type || 'ремонта'}".`;
            message.className = "form__message form__message--ok";
            form.reset();
            
            setTimeout(() => {
                message.textContent = "";
            }, 5000);
        });
    }
});