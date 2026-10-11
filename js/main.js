// Мобильное меню
const burger = document.querySelector("[data-burger]");
const nav = document.querySelector("[data-nav]");

if (burger && nav) {
    burger.addEventListener("click", () => {
        nav.classList.toggle("is-open");
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
        });
    });
}

// Форма заявки
const form = document.querySelector("[data-form]");
const message = document.querySelector("[data-form-message]");

if (form && message) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const name = (data.get("name") || "").toString().trim();
        const phone = (data.get("phone") || "").toString().trim();

        if (!name || !phone) {
            message.textContent = "Заполните все поля.";
            message.className = "form__message form__message--error";
            return;
        }

        // Пока имитация отправки.
        // Позже подключим сервер, Telegram или почту.
        message.textContent = "Заявка отправлена! Мы свяжемся с вами.";
        message.className = "form__message form__message--ok";
        form.reset();
    });
}