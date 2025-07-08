const NAV_TOGGLE_ANIMATION_DURATION = 210;

document.addEventListener("DOMContentLoaded", () => {
    adjustCarouselMargin();

    // Images
    fetch(
        "https://raw.githubusercontent.com/MatheoGermanos/InvictusMensWearAssets/master/final.json"
    )
        .then((res) => res.json())
        .then((data) => {
            const logo = data.Logo; // Read the image object by key

            const Nav = document.getElementById("Navbar-Logo");
            Nav.src = logo.src;
            Nav.alt = logo.alt;
            Nav.title = logo.title;

            const Footer = document.getElementById("Footer-Logo");
            Footer.src = logo.src;
            Footer.alt = logo.alt;
            Footer.title = logo.title;

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
                console.log(
                    "Initial load:",
                    currentCarouselType,
                    CarouselImages
                );
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
                    console.log("Resized:", newType, newImages);
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

            // Set Main-Banner-Box backgrounds
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
                        // Remove any previous dynamic background
                        contentDiv.style.backgroundImage = `url('${boxes[idx].src}')`;
                        contentDiv.style.backgroundSize = "cover";
                        contentDiv.style.backgroundPosition = "center";
                        contentDiv.setAttribute("title", boxes[idx].title);
                        // Optionally set alt as data attribute for accessibility
                        contentDiv.setAttribute("data-alt", boxes[idx].alt);
                    }
                }
            });

            // Dynamically add social media icons to the footer (fixed for 'Social Media' key)
            if (Array.isArray(data["Social Media"])) {
                const socialIconsContainer = document.getElementById(
                    "Footer-Social-Icons"
                );
                socialIconsContainer.innerHTML = "";
                data["Social Media"].forEach((social) => {
                    const a = document.createElement("a");
                    a.href = "#"; // No href in your JSON, so default to '#'. Add URLs to your JSON for real links.
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                    a.title = social.title || social.alt || "Social Link";

                    const img = document.createElement("img");
                    img.src = social.src;
                    img.alt = social.alt || social.title || "Social Icon";
                    img.className = "Footer-Section-Social-Icon";

                    a.appendChild(img);
                    socialIconsContainer.appendChild(a);
                });
            }
            // Assuming the JSON has a property called 'mainImage' with the image URL
            const img = document.getElementById("main-image");
            img.src = data.home.boxes[2].src;
            img.alt = data.home.boxes[2].alt;
            img.title = data.home.boxes[2].title;

            const footerMap = document.getElementById("Footer-Address");
            footerMap.href = data.address[0].src;
            const footerMapFrame = document.getElementById(
                "Footer-Address-Frame"
            );
            footerMapFrame.src = data.address[1].src;
            footerMapFrame.title = data.address[1].src;
        })
        .catch((err) => console.error("Failed to load JSON:", err));

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

// <div class="Front-Carousel-Items-Slide">
//     <img id="Carousel-Image-1" />
// </div>
