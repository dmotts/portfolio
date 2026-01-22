## 2024-07-25 - Accessible Interactive Controls

**Learning:** Interactive UI controls, especially custom dropdowns or menus, must be built with semantic HTML (`<button>`, `<ul>`, `<li>`) and proper ARIA attributes (`aria-expanded`, `aria-haspopup`, `role="menu"` etc.) to be accessible. Non-semantic elements like `<div>` are invisible to screen readers and unusable with keyboards, creating a major accessibility barrier.

**Action:** For any future interactive component, start with semantic HTML as the foundation. Ensure all states (expanded, collapsed, selected) are programmatically exposed via ARIA attributes, and that the component is fully navigable and operable using a keyboard. Always test with keyboard-only navigation.
