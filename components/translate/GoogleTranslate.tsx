"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (options: object, id: string) => void } };
  }
}

export function GoogleTranslate() {
  const [open, setOpen] = useState(false);

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
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-xs uppercase tracking-[0.1em] text-neutral-400 transition-opacity hover:text-black"
        title="Translate"
      >
        🌐
      </button>
      <div
        className={`absolute right-0 top-full z-50 mt-1 border border-neutral-200 bg-white p-2 shadow-sm transition-all ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div id="google_translate_element" />
      </div>
    </div>
  );
}
