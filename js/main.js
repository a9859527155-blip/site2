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
                e.preventDefault(); 
                
                // Закрываем другие открытые карточки
                serviceCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains("active")) {
                        otherCard.classList.remove("active");
                        const otherBtn = otherCard.querySelector(".toggle-details");
                        if(otherBtn) otherBtn.textContent = "Подробнее о пакете ▼";
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


    // 3. Маска для телефона (+7 (XXX) XXX-XX-XX)
    const phoneInput = document.getElementById("phone-input");
    
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, ""); // Оставляем только цифры
            
            // Если начинается с 8, заменяем на 7
            if (value.startsWith("8")) {
                value = "7" + value.slice(1);
            }
            
            // Принудительно добавляем 7 в начало, если нет
            if (!value.startsWith("7")) {
                value = "7" + value;
            }

            let formattedValue = "+7";
            
            if (value.length > 1) {
                formattedValue += " (" + value.substring(1, 4);
            }
            if (value.length >= 5) {
                formattedValue += ") " + value.substring(4, 7);
            }
            if (value.length >= 8) {
                formattedValue += "-" + value.substring(7, 9);
            }
            if (value.length >= 10) {
                formattedValue += "-" + value.substring(9, 11);
            }

            e.target.value = formattedValue;
        });
    }


    // 4. Форма заявки
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

            // Проверка длины номера (минимум 11 символов включая +7)
            if (phone.replace(/\D/g, "").length < 11) {
                 message.textContent = "Введите полный номер телефона.";
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