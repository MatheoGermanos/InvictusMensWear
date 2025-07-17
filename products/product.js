showLoadingIndicator("Loading products...");

const NAV_TOGGLE_ANIMATION_DURATION = 210;

let allProducts = [];
let fuse = null;

// Make adjustMainPadding globally available
function adjustMainPadding() {
    var navbar = document.querySelector(".Main-Navbar");
    var main = document.querySelector(".Main");
    if (navbar && main) {
        main.style.paddingTop = navbar.offsetHeight + "px";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Show improved loading indicator
    showLoadingIndicator("Loading products...");

    adjustMainPadding();
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

            allProducts = data.products || [];

            // Init Fuse with relevant keys and fuzzy settings
            fuse = new Fuse(allProducts, {
                keys: ["title", "description", "category"],
                threshold: 0.3, // lower = stricter match
            });

            if (Array.isArray(data.categories)) {
                populateCategoryMenu(data.categories);
            }

            // Use utility to set social icons
            setSocialIcons(data["Social Media"]);

            // --- Load products dynamically ---
            if (Array.isArray(data.products)) {
                const productsSection = document.querySelector(".Info-Card");
                if (productsSection) {
                    productsSection.innerHTML = "";
                    // Duplicate products for testing
                    let testProducts = [];
                    for (let i = 0; i < 1; i++) {
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
            // Use utility to set map links
            setFooterMap(data.address);
        })
        .catch((err) => {
            // Hide loading indicator
            hideLoadingIndicator();
            // Show user-friendly error message
            const main = document.querySelector("main");
            if (main) {
                main.innerHTML = '<div style="color:red;text-align:center;padding:2em;">Failed to load products. Please check your connection and try again.</div>';
            }
            console.error("Failed to load JSON:", err);
        });

    // ————— Search Bar Setup —————
    const searchInput = document.getElementById("ProductSearch");
    const searchButton = document.getElementById("ProductSearchButton");
    console.log("hi1");
    if (searchInput && searchButton) {
        console.log("hi2");
        // Trigger search on Enter key
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                searchButton.click();
            }
        });

        // Trigger search on click
        searchButton.addEventListener("click", () => {
            const query = searchInput.value.trim();
            const results =
                query.length === 0
                    ? allProducts
                    : fuse.search(query).map((r) => r.item);
            displayProducts(results);
        });
    }

    // Use utility for theme switcher
    setupThemeSwitcher("Light-Day-Switch");

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
        adjustMainPadding();
    }, 150));

    // Debounced Slick resize and margin adjustment
    $(window).on("resize", debounce(function () {
        adjustMainPadding();
    }, 150));

    adjustMainPadding();
    window.addEventListener("resize", adjustMainPadding);
});

// ------------------------------------------ search and filter ---------------------------------------------

function toggleFilterMenu() {
    const searchInput = document.getElementById("ProductSearch");
    searchInput.value = "";
    document.getElementById("FilterMenu").classList.toggle("active");
}

function selectCategory(category) {
    console.log(category);
    fetch(
        "https://raw.githubusercontent.com/MatheoGermanos/InvictusMensWearAssets/master/final.json"
    )
        .then((res) => res.json())
        .then((data) => {
            // Load and filter products
            const productsSection = document.querySelector(".Info-Card");
            if (productsSection) {
                productsSection.innerHTML = "";

                const allProducts = data.products || [];

                // Filter based on category
                const filtered =
                    category === "All"
                        ? allProducts
                        : allProducts.filter(
                              (p) =>
                                  (p.category || "").toLowerCase() ===
                                  category.toLowerCase()
                          );
                console.log(filtered);

                // Duplicate for testing
                const repeated = Array(1).fill(filtered).flat();

                repeated.forEach((product) => {
                    const link = document.createElement("a");
                    link.className = "Info-Card-Single-Link";
                    link.style.textDecoration = "none";
                    link.style.color = "inherit";
                    link.tabIndex = 0;

                    const card = document.createElement("div");
                    card.className = "Info-Card-Single";
                    card.style.cursor = "pointer";

                    const mainColor = product.colors?.[0] || {};
                    const img = document.createElement("img");
                    img.className = "Info-Card-Single-Image";
                    img.src = mainColor.main || "";
                    img.alt = product.title;
                    card.appendChild(img);

                    const textDiv = document.createElement("div");
                    textDiv.className = "Info-Card-Single-Text";
                    const titleP = document.createElement("p");
                    titleP.textContent = product.title;
                    const priceP = document.createElement("p");
                    priceP.textContent = product.price;
                    textDiv.appendChild(titleP);
                    textDiv.appendChild(priceP);
                    card.appendChild(textDiv);

                    const colorsDiv = document.createElement("div");
                    colorsDiv.className = "Info-Card-Single-Colors";
                    let selectedColor = mainColor.name || "";

                    product.colors?.forEach((color) => {
                        const colorDiv = document.createElement("div");
                        colorDiv.className = "Info-Card-Single-Colors-Color";
                        colorDiv.title = color.name;

                        const colorMap = {
                            Black: "#000",
                            Blue: "#00f",
                            Gray: "#888",
                            Green: "#0a0",
                            Yellow: "#ff0",
                        };

                        colorDiv.style.backgroundColor =
                            colorMap[color.name] || color.name.toLowerCase();

                        colorDiv.addEventListener("click", (e) => {
                            e.preventDefault();
                            img.src = color.main;
                            selectedColor = color.name;
                            link.href = `/InvictusMensWear/products/info?prod=${encodeURIComponent(
                                product.title
                            )}&color=${encodeURIComponent(selectedColor)}`;
                        });

                        colorsDiv.appendChild(colorDiv);
                    });

                    card.appendChild(colorsDiv);

                    link.href = `/InvictusMensWear/products/info?prod=${encodeURIComponent(
                        product.title
                    )}&color=${encodeURIComponent(selectedColor)}`;
                    link.appendChild(card);
                    productsSection.appendChild(link);
                });
            }
        })
        .catch((err) => {
            console.error("Error loading or processing data:", err);
        });
}

// Optional: Close dropdown when clicking outside
document.addEventListener("click", function (e) {
    const dropdown = document.getElementById("FilterMenu");
    if (!e.target.closest(".Filter-Dropdown")) {
        dropdown.classList.remove("active");
    }
});

// ------------------------------------------ Category filter ---------------------------------------------

function populateCategoryMenu(categories) {
    const filterMenu = document.getElementById("FilterMenu");

    // Clear any existing menu items
    filterMenu.innerHTML = "";

    // Always add the "All" option
    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.onclick = () => selectCategory("All");
    filterMenu.appendChild(allBtn);

    // Add buttons for each category
    categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.textContent = cat;
        btn.onclick = () => selectCategory(cat);
        filterMenu.appendChild(btn);
    });
}

// ------------------------------------------ search ---------------------------------------------

function displayProducts(products) {
    const productsSection = document.querySelector(".Info-Card");
    if (!productsSection) return;

    productsSection.innerHTML = "";

    products.forEach((product) => {
        const link = document.createElement("a");
        link.className = "Info-Card-Single-Link";
        link.style.textDecoration = "none";
        link.style.color = "inherit";
        link.tabIndex = 0;

        const card = document.createElement("div");
        card.className = "Info-Card-Single";
        card.style.cursor = "pointer";

        const mainColor = product.colors?.[0] || {};
        const img = document.createElement("img");
        img.className = "Info-Card-Single-Image";
        img.src = mainColor.main || "";
        img.alt = product.title;
        card.appendChild(img);

        const textDiv = document.createElement("div");
        textDiv.className = "Info-Card-Single-Text";
        const titleP = document.createElement("p");
        titleP.textContent = product.title;
        const priceP = document.createElement("p");
        priceP.textContent = product.price;
        textDiv.appendChild(titleP);
        textDiv.appendChild(priceP);
        card.appendChild(textDiv);

        const colorsDiv = document.createElement("div");
        colorsDiv.className = "Info-Card-Single-Colors";
        let selectedColor = mainColor.name || "";

        product.colors?.forEach((color) => {
            const colorDiv = document.createElement("div");
            colorDiv.className = "Info-Card-Single-Colors-Color";
            colorDiv.title = color.name;

            const colorMap = {
                Black: "#000",
                Blue: "#00f",
                Gray: "#888",
                Green: "#0a0",
                Yellow: "#ff0",
            };

            colorDiv.style.backgroundColor =
                colorMap[color.name] || color.name.toLowerCase();

            colorDiv.addEventListener("click", (e) => {
                e.preventDefault();
                img.src = color.main;
                selectedColor = color.name;
                link.href = `/InvictusMensWear/products/info?prod=${encodeURIComponent(
                    product.title
                )}&color=${encodeURIComponent(selectedColor)}`;
            });

            colorsDiv.appendChild(colorDiv);
        });

        card.appendChild(colorsDiv);

        link.href = `/InvictusMensWear/products/info?prod=${encodeURIComponent(
            product.title
        )}&color=${encodeURIComponent(selectedColor)}`;
        link.appendChild(card);
        productsSection.appendChild(link);
    });
}
