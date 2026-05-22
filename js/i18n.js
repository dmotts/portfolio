document.addEventListener('DOMContentLoaded', () => {
  const languageSwitcherContainer = document.getElementById('language-switcher-container');
  const selectedLanguage = document.getElementById('selected-language');
  const languageOptions = document.getElementById('language-options');

  const languages = {
    en: { name: 'English', flag: 'gb' },
    es: { name: 'Español', flag: 'es' },
    fr: { name: 'Français', flag: 'fr' },
    de: { name: 'Deutsch', flag: 'de' },
    zh: { name: '中文', flag: 'cn' },
    ja: { name: '日本語', flag: 'jp' },
    pt: { name: 'Português', flag: 'pt' },
    fa: { name: 'فارسی', flag: 'ir' }
  };

  const populateLanguageOptions = () => {
    languageOptions.innerHTML = ''; // Clear existing options
    for (const [lang, { name, flag }] of Object.entries(languages)) {
      const listItem = document.createElement('li');
      listItem.setAttribute('role', 'menuitem');
      listItem.setAttribute('data-lang', lang);
      listItem.classList.add('language-option-item');

      const img = document.createElement('img');
      img.src = `https://flagcdn.com/${flag}.svg`;
      img.alt = name;
      img.loading = 'lazy';

      const span = document.createElement('span');
      span.textContent = name;

      listItem.appendChild(img);
      listItem.appendChild(span);
      languageOptions.appendChild(listItem);
    }
  };

  const getStoredLanguage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    return langFromUrl || localStorage.getItem('language') || 'en';
  };
  const setStoredLanguage = (lang) => localStorage.setItem('language', lang);

  const fetchTranslations = async (lang) => {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    return response.json();
  };

  const updateContent = (translations) => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        if (element.hasAttribute('placeholder-i18n')) {
          element.setAttribute('placeholder', translations[key]);
        } else if (element.tagName === 'META') {
            element.setAttribute('content', translations[key]);
        }
        else {
          element.innerHTML = translations[key];
        }
      }
    });
    // Update title separately
    if (translations.title) {
        document.title = translations.title;
    }
  };

  const setLanguage = async (lang) => {
    try {
      document.documentElement.lang = lang;
      const translations = await fetchTranslations(lang);
      updateContent(translations);
      setStoredLanguage(lang);

      // Dispatch a custom event to notify other scripts of the language change
      const event = new CustomEvent('languageChanged', { detail: { language: lang } });
      document.dispatchEvent(event);

      // Update selected language display
      selectedLanguage.innerHTML = `<i class="icon-world" style="vertical-align: middle; margin-right: 0.25em;"></i> ${lang.toUpperCase()}`;

      // Hide options and update ARIA
      languageOptions.classList.add('hidden');
      selectedLanguage.setAttribute('aria-expanded', 'false');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLanguageOptions = () => {
    const isExpanded = selectedLanguage.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      languageOptions.classList.add('hidden');
      selectedLanguage.setAttribute('aria-expanded', 'false');
    } else {
      languageOptions.classList.remove('hidden');
      selectedLanguage.setAttribute('aria-expanded', 'true');
      // Focus the first item
      languageOptions.querySelector('[role="menuitem"]').focus();
    }
  };

  selectedLanguage.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleLanguageOptions();
  });

  languageOptions.addEventListener('click', (event) => {
    const target = event.target.closest('[data-lang]');
    if (target) {
      const lang = target.getAttribute('data-lang');
      setLanguage(lang);
      selectedLanguage.focus(); // Return focus to the button
    }
  });

  document.addEventListener('click', () => {
    if (selectedLanguage.getAttribute('aria-expanded') === 'true') {
      toggleLanguageOptions();
    }
  });

  languageSwitcherContainer.addEventListener('keydown', (event) => {
    const isExpanded = selectedLanguage.getAttribute('aria-expanded') === 'true';

    if (event.key === 'Escape' && isExpanded) {
      toggleLanguageOptions();
      selectedLanguage.focus();
    }

    if (event.key === 'Enter' || event.key === ' ') {
        if (document.activeElement === selectedLanguage) {
            event.preventDefault();
            toggleLanguageOptions();
        } else if (document.activeElement.parentElement === languageOptions) {
            event.preventDefault();
            const lang = document.activeElement.getAttribute('data-lang');
            setLanguage(lang);
            selectedLanguage.focus();
        }
    }

    if (isExpanded && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const items = Array.from(languageOptions.querySelectorAll('[role="menuitem"]'));
      const activeIndex = items.indexOf(document.activeElement);

      let nextIndex = activeIndex;
      if (event.key === 'ArrowDown') {
        nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
      } else if (event.key === 'ArrowUp') {
        nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
      }
      items[nextIndex].focus();
    }
  });

  // Make menu items focusable
  const makeMenuItemsFocusable = () => {
    languageOptions.querySelectorAll('[role="menuitem"]').forEach(item => {
      item.setAttribute('tabindex', '-1');
    });
  };


  // Populate language options and set initial language
  populateLanguageOptions();
  makeMenuItemsFocusable();
  setLanguage(getStoredLanguage());
});
