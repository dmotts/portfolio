## 2024-07-25 - Animations Can Break Screenshot Verification

**Learning:** CSS-based fade-in animations, like those triggered by Waypoints.js in this project, can interfere with automated screenshot capture tools like Playwright. The screenshot may be taken before the animation completes, resulting in a blank or partially rendered image. This can cause a valid code change to fail verification.

**Action:** When verifying changes on a page with scroll-triggered animations, update the verification script to temporarily disable the animations before capturing the screenshot. This can be done by injecting JavaScript to remove the animation-triggering classes (e.g., `.animate-box`) from the relevant elements. This ensures the screenshot accurately reflects the final rendered state of the UI, not an intermediate animation state.

## 2026-02-02 - Fragmented Font Loading and Missing Declarations

**Learning:** This codebase suffered from "death by a thousand cuts" in the header: fragmented Google Font requests, redundant CSS preloads, and a massive `<noscript>` block that duplicated the entire asset list. Most critically, the primary design font ('Poppins') was declared in CSS but never loaded in HTML, forcing a fallback that negatively impacted the visual design and potentially LCP.

**Action:** Always audit the HTML head for resource consolidation. Combine font requests into a single v2 API call, use resource hints (`preconnect`, `dns-prefetch`) for critical 3rd-party domains like Cloudinary and Google Fonts, and ensure that every font family specified in CSS is actually being requested in the HTML to avoid layout shifts and broken typography.
