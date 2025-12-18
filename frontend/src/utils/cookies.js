import Cookies from 'js-cookie';

export const cookieManager = {

  getConsent: () => Cookies.get('cookie_consent'),
  
  setConsent: (value = 'accepted', options = {}) => {
    const defaultOptions = {
      expires: 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    };
    
    Cookies.set('cookie_consent', value, { ...defaultOptions, ...options });

    localStorage.setItem('cookie_consent', value);

    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: value }));
  },
  
  hasConsent: () => {
    return Cookies.get('cookie_consent') === 'accepted' || 
           localStorage.getItem('cookie_consent') === 'accepted';
  },

  getPreferences: () => {
    try {
      return JSON.parse(localStorage.getItem('user_preferences') || '{}');
    } catch {
      return {};
    }
  },
  
  setPreference: (key, value) => {
    const preferences = cookieManager.getPreferences();
    preferences[key] = value;
    localStorage.setItem('user_preferences', JSON.stringify(preferences));

    if (cookieManager.hasConsent()) {
      Cookies.set(`pref_${key}`, value, { expires: 30 });
    }
  },
  
  getTheme: () => {
    const prefs = cookieManager.getPreferences();
    return prefs.theme || 'light';
  },
  
  setTheme: (theme) => {
    cookieManager.setPreference('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  setSession: (key, value, options = {}) => {
    const sessionOptions = {
      expires: 1/24,
      sameSite: 'lax',
      ...options
    };
    
    Cookies.set(key, value, sessionOptions);
  },
  
  getSession: (key) => {
    return Cookies.get(key);
  },
  
  clearSession: (key) => {
    Cookies.remove(key);
  },

  trackEvent: (eventName, data = {}) => {
    if (!cookieManager.hasConsent()) return;
    
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push({
      name: eventName,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100)));
  }
};