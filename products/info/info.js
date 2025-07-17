showLoadingIndicator("Loading product details...");

$(document).ready(function () {
    // Show improved loading indicator
    showLoadingIndicator("Loading product details...");

    const $mainSlider = $(".Product-Card-Wrapper-Left-Image");
    const $thumbSlider = $(".Product-Card-Wrapper-Left-Choice");

    function getQueryParam(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }

    function initSliders(images) {
        // Clean up previous instances
        if ($mainSlider.hasClass("slick-initialized"))
            $mainSlider.slick("unslick");
        if ($thumbSlider.hasClass("slick-initialized"))
            $thumbSlider.slick("unslick");

        // Empty and append new images
        $mainSlider.empty();
        $thumbSlider.empty();

        images.forEach((src, i) => {
            $mainSlider.append(
                `<div><img src="${src}" alt="Main ${i + 1}" loading="lazy" /></div>`
            );
            $thumbSlider.append(
                `<div><img src="${src}" alt="Thumb ${i + 1}" loading="lazy" /></div>`
            );
        });

        // Reinitialize sliders
        $mainSlider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: ".Product-Card-Wrapper-Left-Choice",
        });

        $thumbSlider.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: ".Product-Card-Wrapper-Left-Image",
            centerMode: true,
            focusOnSelect: true,
            dots: false,
            infinite: true,
        });

        // Force recalculation after short delay
        setTimeout(() => {
            $mainSlider.slick("setPosition");
            $thumbSlider.slick("setPosition");
        }, 100);
    }

    const prodName = getQueryParam("prod");
    const colorName = getQueryParam("color");
    if (!prodName) return;

    fetch(
        "https://raw.githubusercontent.com/MatheoGermanos/InvictusMensWearAssets/master/final.json"
    )
        .then((res) => res.json())
        .then((data) => {
            // Hide loading indicator
            hideLoadingIndicator();
            // Set logo using utility function
            setLogo(data.Logo);
            // Use utility to set social icons
            setSocialIcons(data["Social Media"]);
            // Use utility to set map links
            setFooterMap(data.address);

            if (!Array.isArray(data.products)) {
                console.error("No products array in data");
                return;
            }
            const product = data.products.find(
                (p) =>
                    p.title &&
                    p.title.toLowerCase() ===
                        decodeURIComponent(prodName).toLowerCase()
            );
            if (!product) {
                console.error("Product not found for:", prodName);
                return;
            }
            console.log("Product found:", product);

            let selectedColorIdx = 0;
            if (colorName && Array.isArray(product.colors)) {
                const idx = product.colors.findIndex(
                    (c) =>
                        c.name.toLowerCase() ===
                        decodeURIComponent(colorName).toLowerCase()
                );
                if (idx !== -1) selectedColorIdx = idx;
            }

            const selectedColor = product.colors[selectedColorIdx];
            console.log("Selected color:", selectedColor);
            const allImages = [
                selectedColor.main,
                ...(selectedColor.sub || []),
            ];
            console.log("All images for slider:", allImages);
            if (!allImages.length || !allImages[0]) {
                console.error("No images found for product/color:", product.title, selectedColor);
            }
            initSliders(allImages);

            // Update product text
            const rightDivs = $(".Product-Card-Right > div");
            if (rightDivs.length >= 3) {
                $(rightDivs[0]).text(product.title);
                $(rightDivs[1]).text(product.price);
                $(rightDivs[2]).text(product.description || "");
            }

            // Update color swatches
            const colorOptions = $(".Product-Card-Right-Colors-options");
            colorOptions.empty();
            const colorMap = {
                Black: "#000",
                Blue: "#00f",
                Gray: "#888",
                Green: "#0a0",
                Yellow: "#ff0",
                Red: "#f00",
            };
            product.colors.forEach((color, idx) => {
                const colorDiv = $("<div></div>")
                    .addClass("Product-Card-Right-Colors-Color")
                    .attr("title", color.name)
                    .css(
                        "background",
                        colorMap[color.name] || color.name.toLowerCase()
                    );

                if (idx === selectedColorIdx) colorDiv.addClass("selected");

                colorDiv.on("click", function () {
                    const imgs = [color.main, ...(color.sub || [])];
                    initSliders(imgs);
                    colorOptions
                        .find(".Product-Card-Right-Colors-Color")
                        .removeClass("selected");
                    colorDiv.addClass("selected");
                });

                colorOptions.append(colorDiv);
            });
        })
        .catch((err) => {
            // Hide loading indicator
            hideLoadingIndicator();
            // Show user-friendly error message
            const main = document.querySelector("main");
            if (main) {
                main.innerHTML = '<div style="color:red;text-align:center;padding:2em;">Failed to load product details. Please check your connection and try again.</div>';
            }
            console.error("Failed to load JSON:", err);
        });

    // Use utility for theme switcher
    setupThemeSwitcher("Light-Day-Switch");
});

// Debounced resize handling (for Slick and layout)
$(window).on("resize", debounce(function () {
    // Get current images from DOM
    const mainImgs = [];
    $(".Product-Card-Wrapper-Left-Image > div img").each(function () {
        mainImgs.push($(this).attr("src"));
    });
    if (mainImgs.length) {
        // Unslick if needed
        if ($(".Product-Card-Wrapper-Left-Image").hasClass("slick-initialized"))
            $(".Product-Card-Wrapper-Left-Image").slick("unslick");
        if (
            $(".Product-Card-Wrapper-Left-Choice").hasClass("slick-initialized")
        )
            $(".Product-Card-Wrapper-Left-Choice").slick("unslick");
        // Empty and re-add
        $(".Product-Card-Wrapper-Left-Image").empty();
        $(".Product-Card-Wrapper-Left-Choice").empty();
        mainImgs.forEach((src, i) => {
            $(".Product-Card-Wrapper-Left-Image").append(
                `<div><img src="${src}" alt="Main ${i + 1}" /></div>`
            );
            $(".Product-Card-Wrapper-Left-Choice").append(
                `<div><img src="${src}" alt="Thumb ${i + 1}" /></div>`
            );
        });
        // Re-init
        $(".Product-Card-Wrapper-Left-Image").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: ".Product-Card-Wrapper-Left-Choice",
        });
        $(".Product-Card-Wrapper-Left-Choice").slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: ".Product-Card-Wrapper-Left-Image",
            centerMode: true,
            focusOnSelect: true,
            dots: false,
            infinite: true,
        });
    }
}, 150));

// Accessibility for Slick
function fixSlickAria(container) {
    var $container = $(container);
    var $slides = $container.find(".slick-slide");
    $slides.each(function (i, el) {
        var $el = $(el);
        if ($el.hasClass("slick-current")) {
            $el.attr("tabindex", "0").attr("aria-hidden", "false");
            $el.find("img").attr("tabindex", "0");
        } else {
            $el.attr("tabindex", "-1").attr("aria-hidden", "true");
            $el.find("img").attr("tabindex", "-1");
            if ($el.is(":focus")) $el.blur();
        }
    });
}

$(document).on(
    "init reInit afterChange",
    ".Product-Card-Wrapper-Left-Image",
    function () {
        fixSlickAria(".Product-Card-Wrapper-Left-Image");
    }
);

$(document).on(
    "init reInit afterChange",
    ".Product-Card-Wrapper-Left-Choice",
    function () {
        fixSlickAria(".Product-Card-Wrapper-Left-Choice");
    }
);

function handleBackButton() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "/InvictusMensWear/products/";
    }
}
