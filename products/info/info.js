$(document).ready(function () {
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
                `<div><img src="${src}" alt="Main ${i + 1}" /></div>`
            );
            $thumbSlider.append(
                `<div><img src="${src}" alt="Thumb ${i + 1}" /></div>`
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
            const footerMap = document.getElementById("Footer-Address");
            footerMap.href = data.address[0].src;
            const footerMapFrame = document.getElementById(
                "Footer-Address-Frame"
            );
            footerMapFrame.src = data.address[1].src;
            footerMapFrame.title = data.address[1].src;

            if (!Array.isArray(data.products)) return;
            const product = data.products.find(
                (p) =>
                    p.title &&
                    p.title.toLowerCase() ===
                        decodeURIComponent(prodName).toLowerCase()
            );
            if (!product) return;

            let selectedColorIdx = 0;
            if (colorName && Array.isArray(product.colors)) {
                const idx = product.colors.findIndex(
                    (c) =>
                        c.name.toLowerCase() ===
                        decodeURIComponent(colorName).toLowerCase()
                );
                if (idx !== -1) selectedColorIdx = idx;
            }

            // Update product text
            const rightDivs = $(".Product-Card-Right > div");
            if (rightDivs.length >= 3) {
                $(rightDivs[0]).text(product.title);
                $(rightDivs[1]).text(product.price);
                $(rightDivs[2]).text(product.description || "");
            }

            const selectedColor = product.colors[selectedColorIdx];
            const allImages = [
                selectedColor.main,
                ...(selectedColor.sub || []),
            ];
            initSliders(allImages);

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
        });
});

// Resize handling (debounced to avoid overcalls)
let resizeTimeout;
$(window).on("resize", function () {
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
});

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
