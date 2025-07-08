const NAV_TOGGLE_ANIMATION_DURATION = 210;

document.addEventListener("DOMContentLoaded", () => {
    adjustMainPadding();
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

            // --- Load products dynamically ---
            if (Array.isArray(data.products)) {
                const productsSection = document.querySelector(".Info-Card");
                if (productsSection) {
                    productsSection.innerHTML = "";
                    // Duplicate products for testing
                    let testProducts = [];
                    for (let i = 0; i < 10; i++) {
                        testProducts = testProducts.concat(data.products);
                    }
                    testProducts.forEach((product, idx) => {
                        // Create product card as a link
                        const link = document.createElement("a");
                        link.href =
                            "/InvictusMensWear/products/info?prod=" +
                            encodeURIComponent(product.title);
                        link.className = "Info-Card-Single-Link";
                        link.style.textDecoration = "none";
                        link.style.color = "inherit";
                        link.tabIndex = 0;

                        const card = document.createElement("div");
                        card.className = "Info-Card-Single";
                        card.style.cursor = "pointer";

                        // Main image (first color's main image)
                        let mainImgSrc =
                            product.colors && product.colors[0]
                                ? product.colors[0].main
                                : "";
                        let selectedColor =
                            product.colors && product.colors[0]
                                ? product.colors[0].name
                                : "";
                        const img = document.createElement("img");
                        img.className = "Info-Card-Single-Image";
                        img.src = mainImgSrc;
                        img.alt = product.title;
                        card.appendChild(img);

                        // Title and price
                        const textDiv = document.createElement("div");
                        textDiv.className = "Info-Card-Single-Text";
                        const titleP = document.createElement("p");
                        titleP.textContent = product.title;
                        const priceP = document.createElement("p");
                        priceP.textContent = product.price;
                        textDiv.appendChild(titleP);
                        textDiv.appendChild(priceP);
                        card.appendChild(textDiv);

                        // Colors
                        const colorsDiv = document.createElement("div");
                        colorsDiv.className = "Info-Card-Single-Colors";
                        if (Array.isArray(product.colors)) {
                            product.colors.forEach((color, cidx) => {
                                const colorDiv = document.createElement("div");
                                colorDiv.className =
                                    "Info-Card-Single-Colors-Color";
                                colorDiv.title = color.name;
                                let colorMap = {
                                    Black: "#000",
                                    Blue: "#00f",
                                    Gray: "#888",
                                    Green: "#0a0",
                                    Yellow: "#ff0",
                                };
                                colorDiv.style.backgroundColor =
                                    colorMap[color.name] ||
                                    color.name.toLowerCase();
                                // Change main image and update link on color click
                                colorDiv.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    img.src = color.main;
                                    selectedColor = color.name;
                                    link.href =
                                        "/InvictusMensWear/products/info?prod=" +
                                        encodeURIComponent(product.title) +
                                        "&color=" +
                                        encodeURIComponent(selectedColor);
                                });
                                colorsDiv.appendChild(colorDiv);
                            });
                        }
                        card.appendChild(colorsDiv);

                        // Set initial link href with color
                        link.href =
                            "/InvictusMensWear/products/info?prod=" +
                            encodeURIComponent(product.title) +
                            "&color=" +
                            encodeURIComponent(selectedColor);

                        link.appendChild(card);
                        productsSection.appendChild(link);
                    });
                }
            }
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
            adjustMainPadding();
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

    // Fix nav overlap: set .Main padding-top to navbar height
    function adjustMainPadding() {
        var navbar = document.querySelector(".Main-Navbar");
        var main = document.querySelector(".Main");
        if (navbar && main) {
            main.style.paddingTop = navbar.offsetHeight + "px";
        }
    }

    // --- Resize logic from main.js ---
    $(window).on("resize", function () {
        adjustMainPadding();
    });

    adjustMainPadding();
    window.addEventListener("resize", adjustMainPadding);
});
