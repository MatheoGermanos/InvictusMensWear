// Utility functions for Invictus MensWear

/**
 * Set logo images in navbar and footer
 * @param {Object} logo - {src, alt, title}
 */
function setLogo(logo) {
    const navLogo = document.getElementById("Navbar-Logo");
    const footerLogo = document.getElementById("Footer-Logo");
    if (navLogo && logo) {
        navLogo.src = logo.src;
        navLogo.alt = logo.alt;
        navLogo.title = logo.title;
    }
    if (footerLogo && logo) {
        footerLogo.src = logo.src;
        footerLogo.alt = logo.alt;
        footerLogo.title = logo.title;
    }
}

/**
 * Set social media icons in the footer
 * @param {Array} socialArray - Array of {src, alt, title}
 */
function setSocialIcons(socialArray) {
    const socialIconsContainer = document.getElementById("Footer-Social-Icons");
    if (!socialIconsContainer || !Array.isArray(socialArray)) return;
    socialIconsContainer.innerHTML = "";
    socialArray.forEach((social) => {
        const a = document.createElement("a");
        a.href = social.href || "#";
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

/**
 * Set map link and iframe in the footer
 * @param {Array} addressArray - [mapLinkObj, mapFrameObj]
 */
function setFooterMap(addressArray) {
    if (!Array.isArray(addressArray) || addressArray.length < 2) return;
    const footerMap = document.getElementById("Footer-Address");
    const footerMapFrame = document.getElementById("Footer-Address-Frame");
    if (footerMap && addressArray[0]) {
        footerMap.href = addressArray[0].src;
    }
    if (footerMapFrame && addressArray[1]) {
        footerMapFrame.src = addressArray[1].src;
        footerMapFrame.title = addressArray[1].src;
    }
}

/**
 * Theme switcher logic (day/night)
 * @param {string} switchId - The ID of the theme switch checkbox
 */
function setupThemeSwitcher(switchId = "Light-Day-Switch") {
    const themeSwitch = document.getElementById(switchId);
    const HTMLBody = document.body;
    if (!themeSwitch) return;
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
}

/**
 * Debounce function for performance
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Export functions for use in other scripts (for ES6 modules, otherwise global)
// export { setLogo, setSocialIcons, setFooterMap, setupThemeSwitcher, debounce } 