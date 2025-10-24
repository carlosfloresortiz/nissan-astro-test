const initHamburgerMenu = () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const body = document.body;

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            body.classList.toggle('nav-open');
        });
    }
};

const initScrolledHeader = () => {
    const header = document.getElementById('main-header');
    if (header) {
        const scrollThreshold = 50;

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initScrolledHeader();
});