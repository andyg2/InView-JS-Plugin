/**
 * InView Vanilla JS
 *
 * Watches elements on the page and fires a callback function when they are viewed.
 * Author: Adapted from Vasanth Krishnamoorthy's jQuery plugin
 * License: Do What The F*ck You Want To Public License (WTFPL)
 */

(function () {
    let cache = new Set();
    let inViewItems = 0;
    let ticking = false;

    function throttle(callback, delay = 500) {
        let wait = false;
        return function () {
            if (!wait) {
                callback();
                wait = true;
                setTimeout(() => (wait = false), delay);
            }
        };
    }

    function checkInView() {
        const winHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollDepth = window.scrollY + winHeight;

        document.querySelectorAll("[data-inview]").forEach((element) => {
            if (!cache.has(element) && scrollDepth >= element.getBoundingClientRect().top + window.scrollY) {
                const callbackName = element.getAttribute("data-inview-callback");
                if (callbackName && typeof window[callbackName] === "function") {
                    window[callbackName].call(element);
                }
                cache.add(element);
            }
        });

        if (cache.size >= inViewItems) {
            window.removeEventListener("scroll", onScroll);
        }
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkInView();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.inView = function (selector, callback) {
        if (typeof callback !== "function") return;
        document.querySelectorAll(selector).forEach((element) => {
            element.setAttribute("data-inview", "true");
            element.setAttribute("data-inview-callback", callback.name);
        });
        inViewItems++;
        window.addEventListener("scroll", throttle(onScroll));
    };
})();
