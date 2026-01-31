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
      const option = document.createElement('li');
      option.classList.add('language-option-item');
      option.setAttribute('data-lang', lang);
      option.setAttribute('role', 'option');
      option.setAttribute('tabindex', '0');
      option.setAttribute('aria-selected', 'false');

      const img = document.createElement('img');
      img.src = `https://flagcdn.com/${flag}.svg`;
      img.alt = name;

      const span = document.createElement('span');
      span.textContent = name;

      option.appendChild(img);
      option.appendChild(span);
      languageOptions.appendChild(option);
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
      const selectedContent = selectedLanguage.querySelector('.language-option-item');
      selectedContent.innerHTML = `<i class="icon-world" style="vertical-align: middle; margin-right: 0.25em;"></i> ${lang.toUpperCase()}`;

      // Update ARIA attributes
      selectedLanguage.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('#language-options [role="option"]').forEach(option => {
        option.setAttribute('aria-selected', option.getAttribute('data-lang') === lang);
      });

      // Hide options
      languageOptions.style.display = 'none';
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = (show) => {
    const willShow = show !== undefined ? show : languageOptions.style.display !== 'block';
    languageOptions.style.display = willShow ? 'block' : 'none';
    selectedLanguage.setAttribute('aria-expanded', willShow);
  };

  selectedLanguage.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  selectedLanguage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    } else if (event.key === 'Escape') {
      toggleMenu(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      toggleMenu(true);
      languageOptions.querySelector('[role="option"]')?.focus();
    }
  });

  languageOptions.addEventListener('keydown', (event) => {
    const options = Array.from(languageOptions.querySelectorAll('[role="option"]'));
    const currentIndex = options.indexOf(document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      options[nextIndex].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      options[prevIndex].focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const lang = document.activeElement.getAttribute('data-lang');
      if (lang) setLanguage(lang);
    } else if (event.key === 'Escape') {
      toggleMenu(false);
      selectedLanguage.focus();
    }
  });

  languageOptions.addEventListener('click', (event) => {
    const target = event.target.closest('.language-option-item');
    if (target) {
      const lang = target.getAttribute('data-lang');
      setLanguage(lang);
    }
  });

  document.addEventListener('click', () => {
    languageOptions.style.display = 'none';
  });

  // Populate language options and set initial language
  populateLanguageOptions();
  setLanguage(getStoredLanguage());
});
