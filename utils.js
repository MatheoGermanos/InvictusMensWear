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

let _loadingIndicatorShownAt = 0;
let _loadingIndicatorHideTimeout = null;

/**
 * Show a styled loading indicator (spinner bar)
 * @param {string} [message] - Optional loading message
 */
function showLoadingIndicator(message = "Loading...") {
    let loadingDiv = document.getElementById("loading-indicator");
    if (!loadingDiv) {
        loadingDiv = document.createElement("div");
        loadingDiv.id = "loading-indicator";
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <span class="loading-message">${message}</span>
        `;
        loadingDiv.style.position = "fixed";
        loadingDiv.style.top = "0";
        loadingDiv.style.left = "0";
        loadingDiv.style.width = "100%";
        loadingDiv.style.height = "100vh";
        loadingDiv.style.background = "rgba(255,255,255,0.85)";
        loadingDiv.style.display = "flex";
        loadingDiv.style.flexDirection = "column";
        loadingDiv.style.alignItems = "center";
        loadingDiv.style.justifyContent = "center";
        loadingDiv.style.zIndex = "9999";
        document.body.appendChild(loadingDiv);
    } else {
        loadingDiv.querySelector('.loading-message').textContent = message;
        loadingDiv.style.display = 'flex';
    }
}

/**
 * Hide the loading indicator
 */
function hideLoadingIndicator() {
    const loadingDiv = document.getElementById("loading-indicator");
    if (loadingDiv) loadingDiv.style.display = "none";
}

// Add spinner CSS to the page if not already present
(function addSpinnerStyles() {
    if (!document.getElementById('loading-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'loading-spinner-style';
        style.textContent = `
        .loading-spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #222;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
            margin-bottom: 1em;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-message {
            font-size: 1.2em;
            color: #222;
            font-family: inherit;
        }
        `;
        document.head.appendChild(style);
    }
})();

// Export functions for use in other scripts (for ES6 modules, otherwise global)
// export { setLogo, setSocialIcons, setFooterMap, setupThemeSwitcher, debounce } 