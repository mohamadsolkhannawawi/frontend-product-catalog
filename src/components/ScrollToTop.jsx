import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        // small timeout to allow new page content to render
        const t = setTimeout(() => {
            try {
                const hash = window.location.hash;
                if (hash) {
                    const id = hash.replace(/^#/, "");
                    const el = document.getElementById(id);
                    if (el) {
                        el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                        return;
                    }
                }

                // prefer scrolling the document <main> if present
                const main = document.querySelector("main");
                if (main) {
                    main.scrollIntoView({ behavior: "smooth", block: "start" });
                    return;
                }

                // fallback to window scroll
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } catch (e) {
                // ignore
            }
        }, 40);

        return () => clearTimeout(t);
    }, [location.pathname, location.search, location.hash]);
    useEffect(() => {
        // small timeout to allow new page content to render
        const t = setTimeout(() => {
            try {
                // calculate offset so target content is visible below any fixed header
                const headerEl = document.querySelector("header");
                const headerHeight = headerEl ? headerEl.offsetHeight : 0;
                // extra spacing so the title isn't flush to the top
                const extra = 20;
                const offset = headerHeight + extra;

                const hash = window.location.hash;
                if (hash) {
                    const id = hash.replace(/^#/, "");
                    const el = document.getElementById(id);
                    if (el) {
                        const y =
                            el.getBoundingClientRect().top +
                            window.pageYOffset -
                            offset;
                        window.scrollTo({
                            top: Math.max(0, y),
                            left: 0,
                            behavior: "smooth",
                        });
                        return;
                    }
                }

                // prefer scrolling the document <main> if present
                const main = document.querySelector("main");
                if (main) {
                    const y =
                        main.getBoundingClientRect().top +
                        window.pageYOffset -
                        offset;
                    window.scrollTo({
                        top: Math.max(0, y),
                        left: 0,
                        behavior: "smooth",
                    });
                    return;
                }

                // fallback to window scroll (with offset)
                window.scrollTo({
                    top: Math.max(0, 0 - offset),
                    left: 0,
                    behavior: "smooth",
                });
            } catch (e) {
                // ignore
            }
        }, 40);

        return () => clearTimeout(t);
    }, [location.pathname, location.search, location.hash]);

    return null;
}
