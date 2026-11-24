"use client";

import Script from "next/script";
import { useState } from "react";

import { edmingleIframeSrc, edmingleSdkScriptSrc, isEdmingleConfigured } from "@/lib/edmingle";

/**
 * Edmingle's signup-sdk.js is a jQuery plugin — it expects jQuery to
 * already be on the page before it loads, so jQuery's onLoad chains into
 * loading the SDK script next rather than relying on Next's script
 * ordering (afterInteractive doesn't guarantee render order across
 * separate <Script> tags).
 *
 * Renders nothing until both NEXT_PUBLIC_EDMINGLE_LMS_DOMAIN and
 * NEXT_PUBLIC_EDMINGLE_SUBDOMAIN are set — see lib/edmingle.ts.
 */
export default function EdmingleWidget() {
  const [jqueryLoaded, setJqueryLoaded] = useState(false);

  if (!isEdmingleConfigured()) return null;

  const iframeSrc = edmingleIframeSrc();
  const sdkSrc = edmingleSdkScriptSrc();

  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => setJqueryLoaded(true)}
      />
      {jqueryLoaded && sdkSrc && <Script src={sdkSrc} strategy="afterInteractive" />}
      {iframeSrc && (
        <iframe
          className="iframe"
          id="iframe"
          title="Student login"
          src={iframeSrc}
          style={{
            width: "100vw",
            height: "100vh",
            border: "none",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 10000,
            display: "none",
          }}
        />
      )}
    </>
  );
}
