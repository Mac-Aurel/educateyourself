"use client";

import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (options: object, id: string) => void } };
  }
}

export function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google!.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: 0,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    const observer = new MutationObserver(() => {
      const frame = document.querySelector(".goog-te-banner-frame") as HTMLElement | null;
      if (frame) frame.style.display = "none";

      document.body.style.top = "0px";
      document.body.style.position = "static";

      document.querySelectorAll("iframe.skiptranslate").forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm text-neutral-400 transition-colors hover:text-black"
        title="Translate this page"
      >
        🌐
      </button>
      <div
        className={`absolute right-0 top-full z-50 mt-2 whitespace-nowrap border border-neutral-200 bg-white p-3 shadow-sm ${
          open ? "block" : "hidden"
        }`}
      >
        <div id="google_translate_element" />
      </div>
    </div>
  );
}
