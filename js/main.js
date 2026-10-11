document.addEventListener('DOMContentLoaded', () => {
    // 1. Мобильное меню (Drawer)
    const burger = document.querySelector("[data-burger]");
    const nav = document.querySelector("[data-nav]");
    const overlay = document.querySelector("[data-overlay]");
    const body = document.body;

    function toggleMenu() {
        body.classList.toggle("menu-open");
    }

    if (burger && nav) {
        burger.addEventListener("click", toggleMenu);
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (body.classList.contains("menu-open")) toggleMenu();
            });
        });
    }
    if (overlay) overlay.addEventListener("click", toggleMenu);

    // 2. Аккордеон услуг
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach(card => {
        const btn = card.querySelector(".toggle-details");
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); 
                serviceCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains("active")) {
                        otherCard.classList.remove("active");
                        const otherBtn = otherCard.querySelector(".toggle-details");
                        if(otherBtn) otherBtn.textContent = "Подробнее о пакете ▼";
                    }
                });
                card.classList.toggle("active");
                btn.textContent = card.classList.contains("active") ? "Свернуть детали ▲" : "Подробнее о пакете ▼";
            });
        }
    });

    // 3. Маска телефона
    const phoneInput = document.getElementById("phone-input");
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.startsWith("8")) value = "7" + value.slice(1);
            if (!value.startsWith("7")) value = "7" + value;
            let formattedValue = "+7";
            if (value.length > 1) formattedValue += " (" + value.substring(1, 4);
            if (value.length >= 5) formattedValue += ") " + value.substring(4, 7);
            if (value.length >= 8) formattedValue += "-" + value.substring(7, 9);
            if (value.length >= 10) formattedValue += "-" + value.substring(9, 11);
            e.target.value = formattedValue;
        });
    }

    // 4. Форма заявки (ИЗОЛИРОВАННАЯ ВЕРСИЯ)
    const form = document.querySelector("[data-form]");
    const message = document.querySelector("[data-form-message]");

    if (form && message) {
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Блокируем стандартную отправку браузера

            const data = new FormData(form);
            const name = (data.get("name") || "").toString().trim();
            const phone = (data.get("phone") || "").toString().trim();
            const type = (data.get("type") || "").toString();

            // Простая проверка заполнения (без отправки на сервер)
            if (!name || !phone) {
                message.textContent = "Пожалуйста, заполните имя и телефон.";
                message.className = "form__message form__message--error";
                return;
            }

            if (phone.replace(/\D/g, "").length < 11) {
                 message.textContent = "Введите полный номер телефона.";
                 message.className = "form__message form__message--error";
                 return;
            }

            // Имитация успешной отправки (данные НИКУДА не уходят)
            message.textContent = `Заявка принята! Мы свяжемся с вами по поводу "${type || 'ремонта'}".`;
            message.className = "form__message form__message--ok";
            
            // Очищаем форму
            form.reset();
            
            // Через 5 секунд убираем сообщение
            setTimeout(() => {
                message.textContent = "";
            }, 5000);
        });
    }

    // 5. Анимации появления (Intersection Observer)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 6. Логика Калькулятора (Обновленная с Custom Select)
    
    const prices = {
        standard: 4500,
        capital: 8500,
        designer: 15000
    };

    // Элементы DOM
    const selectWrapper = document.querySelector(".custom-select-wrapper");
    const selectBtn = document.getElementById("calc-type-btn");
    const optionsList = document.querySelectorAll(".option-item");
    const currentOptionText = document.querySelector(".current-option");
    const hiddenInput = document.getElementById("calc-type"); // Наш скрытый input
    
    const calcArea = document.getElementById("calc-area");
    const areaVal = document.getElementById("area-val");
    const totalPrice = document.getElementById("total-price");

    // Функция расчета цены
    function calculatePrice() {
        if(!hiddenInput || !calcArea || !totalPrice) return;
        
        const type = hiddenInput.value;
        const area = parseInt(calcArea.value);
        
        if(areaVal) areaVal.textContent = area;
        
        const pricePerMeter = prices[type];
        const total = area * pricePerMeter;
        
        totalPrice.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }

    // Открытие/закрытие списка
    if (selectBtn && selectWrapper) {
        selectBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Чтобы клик не уходил дальше по документу
            selectWrapper.classList.toggle("open");
        });
    }

    // Выбор опции из списка
    optionsList.forEach(option => {
        option.addEventListener("click", () => {
            // 1. Убираем выделение со всех
            optionsList.forEach(opt => opt.classList.remove("selected"));
            
            // 2. Ставим выделение на текущий
            option.classList.add("selected");
            
            // 3. Меняем текст в кнопке
            currentOptionText.textContent = option.textContent;
            
            // 4. Обновляем значение в скрытом инпуте
            hiddenInput.value = option.getAttribute("data-value");
            
            // 5. Закрываем список
            selectWrapper.classList.remove("open");
            
            // 6. Пересчитываем цену
            calculatePrice();
        });
    });

    // Закрытие списка при клике вне его области
    document.addEventListener("click", (e) => {
        if (selectWrapper && !selectWrapper.contains(e.target)) {
            selectWrapper.classList.remove("open");
        }
    });

    // Слушатель ползунка площади
    if (calcArea) {
        calcArea.addEventListener("input", calculatePrice);
    }

    // Первоначальный расчет
    calculatePrice();
});

// 7. Функция открытия Лайтбокса
function openLightbox(src, captionText) {
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lb-img");
    const lbCaption = document.getElementById("lb-caption");
    
    if(lightbox && lbImg) {
        lbImg.src = src;
        
        // Если подпись пустая - скрываем элемент подписи
        if(captionText && captionText.trim() !== "") {
            lbCaption.textContent = captionText;
            lbCaption.style.display = "block";
        } else {
            lbCaption.style.display = "none";
        }
        
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
    }
}

// Закрытие лайтбокса
document.addEventListener("DOMContentLoaded", () => {
    const closeLb = document.querySelector(".close-lb");
    const lightbox = document.getElementById("lightbox");
    
    if(closeLb && lightbox) {
        closeLb.addEventListener("click", () => {
            lightbox.classList.remove("open");
            document.body.style.overflow = "";
        });
        
        lightbox.addEventListener("click", (e) => {
            if(e.target === lightbox) {
                lightbox.classList.remove("open");
                document.body.style.overflow = "";
            }
        });
    }
});