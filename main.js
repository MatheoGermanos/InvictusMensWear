const NAV_TOGGLE_ANIMATION_DURATION = 210;

document.addEventListener("DOMContentLoaded", () => {
    adjustCarouselMargin();

    // ————— Theme switcher —————
    const themeSwitch = document.getElementById("Light-Day-Switch");
    const HTMLBody = document.body;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "night") {
        HTMLBody.classList.add("night-theme");
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener("change", () => {
        if (themeSwitch.checked) {
            HTMLBody.classList.add("night-theme");
            localStorage.setItem("theme", "night");
        } else {
            HTMLBody.classList.remove("night-theme");
            localStorage.setItem("theme", "day");
        }
    });

    // ————— Mobile nav toggle —————
    const navToggleBtn = document.querySelector(".Desktop-Nav-Toggles-Mobile");
    const mobileNav = document.querySelector(".Mobile-Nav");

    navToggleBtn.addEventListener("click", () => {
        mobileNav.classList.toggle("isOpen");
        setTimeout(() => {
            adjustCarouselMargin();
        }, NAV_TOGGLE_ANIMATION_DURATION);
    });

    // ------ Resize ---------
    const MOBILE_BREAKPOINT = 767;

    window.addEventListener("resize", () => {
        if (
            window.innerWidth > MOBILE_BREAKPOINT &&
            mobileNav.classList.contains("isOpen")
        ) {
            mobileNav.classList.remove("isOpen");
            setTimeout(() => {
                adjustCarouselMargin();
            }, NAV_TOGGLE_ANIMATION_DURATION);
        }
    });
});

$(document).ready(function () {
    const $carousel = $(".Front-Carousel-Items");

    // Initialize Slick
    $carousel.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 700,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    });

    // Custom buttons controlling slick
    $("#Button1").click(() => $carousel.slick("slickPrev"));
    $("#Button2").click(() => $carousel.slick("slickNext"));
});
$(window).on("resize", function () {
    $(".Front-Carousel-Items").slick("setPosition");
    adjustCarouselMargin();
});

function adjustCarouselMargin() {
    const navbar = document.querySelector(".Main-Navbar");
    const carousel = document.querySelector(".Front-Carousel");
    const buttons = document.querySelectorAll(".Front-Carousel-Button");

    if (navbar && carousel) {
        const navHeight = navbar.offsetHeight;
        carousel.style.paddingTop = `${navHeight}px`;

        buttons.forEach((btn) => {
            btn.style.top = `calc(50% + ${navHeight / 2}px)`;
        });
    }
}
