// Requires utils.js to be loaded before this script
// Refactored to use shared utility functions for logo, social icons, map, and theme switcher

const NAV_TOGGLE_ANIMATION_DURATION = 210;

showLoadingIndicator("Loading site...");

document.addEventListener("DOMContentLoaded", () => {
    // Show improved loading indicator
    showLoadingIndicator("Loading site...");

    adjustCarouselMargin();

    // Images and dynamic content
    fetch(
        "https://raw.githubusercontent.com/MatheoGermanos/InvictusMensWearAssets/master/final.json"
    )
        .then((res) => res.json())
        .then((data) => {
            // Hide loading indicator
            hideLoadingIndicator();

            // Use utility to set logo
            setLogo(data.Logo);

            // --- Carousel image selection logic ---
            const MOBILE_BREAKPOINT = 767;
            let isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
            let currentCarouselType = isMobile ? "Mobile carousel" : "carousel";
            let CarouselImages =
                data.home && data.home[currentCarouselType]
                    ? data.home[currentCarouselType]
                    : [];
            const CarouselContainer = document.getElementById(
                "Front-Carousel-Items"
            );
            if (!CarouselContainer) {
                console.error("Carousel container not found");
                return;
            }
            if (!Array.isArray(CarouselImages) || CarouselImages.length === 0) {
                CarouselContainer.innerHTML =
                    '<div style="color:red;">No carousel images found for ' +
                    currentCarouselType +
                    "</div>";
                console.error(
                    "No images found for",
                    currentCarouselType,
                    data.home
                );
            } else {
                loadCarouselImages(CarouselImages);
            }

            function loadCarouselImages(images) {
                CarouselContainer.innerHTML = "";
                images.forEach((imageData) => {
                    const slide = document.createElement("div");
                    slide.classList.add("Front-Carousel-Items-Slide");

                    const img = document.createElement("img");
                    img.src = imageData.src;
                    img.alt = imageData.alt;
                    img.title = imageData.title;

                    slide.appendChild(img);
                    CarouselContainer.appendChild(slide);
                });
            }

            // Initialize Slick only after slides are added
            const $carousel = $(".Front-Carousel-Items");
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

            // --- Responsive carousel reload on resize ---
            let lastIsMobile = isMobile;
            window.addEventListener("resize", () => {
                const nowIsMobile = window.innerWidth <= MOBILE_BREAKPOINT;
                if (nowIsMobile !== lastIsMobile) {
                    lastIsMobile = nowIsMobile;
                    const newType = nowIsMobile
                        ? "Mobile carousel"
                        : "carousel";
                    const newImages =
                        data.home && data.home[newType]
                            ? data.home[newType]
                            : [];
                    $carousel.slick("unslick");
                    if (!Array.isArray(newImages) || newImages.length === 0) {
                        CarouselContainer.innerHTML =
                            '<div style="color:red;">No carousel images found for ' +
                            newType +
                            "</div>";
                        console.error(
                            "No images found for",
                            newType,
                            data.home
                        );
                    } else {
                        loadCarouselImages(newImages);
                    }
                    $(".Front-Carousel-Items").slick({
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
                }
            });

            // Set Main-Banner-Box backgrounds (unchanged, page-specific)
            const boxes = data.home.boxes;
            const mainBannerBoxes = document.querySelectorAll(
                ".Main-Banner-Box > div"
            );
            mainBannerBoxes.forEach((boxDiv, idx) => {
                if (boxes[idx]) {
                    const contentDiv = boxDiv.querySelector(".content");
                    if (contentDiv) {
                        contentDiv.style.position = "relative";
                        contentDiv.style.overflow = "hidden";
                        contentDiv.style.backgroundImage = `url('${boxes[idx].src}')`;
                        contentDiv.style.backgroundSize = "cover";
                        contentDiv.style.backgroundPosition = "center";
                        contentDiv.setAttribute("title", boxes[idx].title);
                        contentDiv.setAttribute("data-alt", boxes[idx].alt);
                    }
                }
            });

            // Use utility to set social icons
            setSocialIcons(data["Social Media"]);

            // Set main image (page-specific)
            const img = document.getElementById("main-image");
            img.src = data.home.boxes[2].src;
            img.alt = data.home.boxes[2].alt;
            img.title = data.home.boxes[2].title;

            // Use utility to set map links
            setFooterMap(data.address);
        })
        .catch((err) => {
            // Hide loading indicator
            hideLoadingIndicator();
            // Show user-friendly error message
            const main = document.querySelector("main");
            if (main) {
                main.innerHTML = '<div style="color:red;text-align:center;padding:2em;">Failed to load site data. Please check your connection and try again.</div>';
            }
            console.error("Failed to load JSON:", err);
        });

    // Use utility for theme switcher
    setupThemeSwitcher("Light-Day-Switch");

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

    // Debounced resize event for performance
    window.addEventListener("resize", debounce(() => {
        if (
            window.innerWidth > MOBILE_BREAKPOINT &&
            mobileNav.classList.contains("isOpen")
        ) {
            mobileNav.classList.remove("isOpen");
            setTimeout(() => {
                adjustCarouselMargin();
            }, NAV_TOGGLE_ANIMATION_DURATION);
        }
    }, 150));
});

// Debounced Slick resize and margin adjustment
$(window).on("resize", debounce(function () {
    $(".Front-Carousel-Items").slick("setPosition");
    adjustCarouselMargin();
}, 150));

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

// <div class="Front-Carousel-Items-Slide">
//     <img id="Carousel-Image-1" />
// </div>
