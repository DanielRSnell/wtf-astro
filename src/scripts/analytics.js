// Analytics and Form Tracking Script with ViewTransitions Support

(function() {
  // Initialize global analytics object if it doesn't exist
  if (!window.WTFAnalytics) {
    window.WTFAnalytics = {
      forms: [],
      pageViews: [],
      initialized: false
    };
  }

  // Helper function to get page metadata
  function getPageMetadata() {
    const path = window.location.pathname;
    const title = document.title;
    const url = window.location.href;
    const referrer = document.referrer || 'direct';
    const timestamp = new Date().toISOString();
    
    // Try to extract slug from URL
    const pathParts = path.split('/').filter(Boolean);
    const slug = pathParts[pathParts.length - 1] || 'home';
    
    // Determine page type
    let pageType = 'other';
    if (path === '/') pageType = 'home';
    else if (path.includes('/blog/')) pageType = 'blog';
    else if (path.includes('/guides/')) pageType = 'guide';
    else if (path.includes('/wordpress-')) pageType = 'resource';
    else if (path.includes('/auth')) pageType = 'auth';
    
    return {
      path,
      title,
      url,
      slug,
      pageType,
      referrer,
      timestamp
    };
  }

  // Track page view
  function trackPageView() {
    const metadata = getPageMetadata();
    
    // Send to Umami if available
    if (window.umami) {
      window.umami.track('page-view', metadata);
    }
    
    // Store in memory for debugging
    window.WTFAnalytics.pageViews.push(metadata);
    
    // Store last page view in localStorage for form context
    localStorage.setItem('wtf-last-page-view', JSON.stringify(metadata));
    
    console.log('[Analytics] Page view tracked:', metadata.path);
  }

  // Form tracking setup
  function setupFormTracking() {
    // Remove any existing listeners to prevent duplicates
    document.removeEventListener('submit', handleFormSubmit, true);
    document.removeEventListener('input', handleFormInput, true);
    
    // Add new listeners with capture phase to catch all forms
    document.addEventListener('submit', handleFormSubmit, true);
    document.addEventListener('input', handleFormInput, true);
  }

  // Handle form submissions
  function handleFormSubmit(event) {
    const form = event.target;
    if (form.tagName !== 'FORM') return;
    
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values with same name
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    
    // Get form metadata
    const formMeta = {
      id: form.id || 'unnamed-form',
      action: form.action || 'none',
      method: form.method || 'GET',
      className: form.className || '',
      data: data,
      timestamp: new Date().toISOString()
    };
    
    // Get page context
    const pageContext = getPageMetadata();
    
    // Create submission record
    const submission = {
      page: pageContext.path,
      slug: pageContext.slug,
      url: pageContext.url,
      pageType: pageContext.pageType,
      form: formMeta,
      timestamp: formMeta.timestamp
    };
    
    // Save to localStorage (limit to last 50 submissions)
    const storageKey = 'wtf-form-submissions';
    let submissions = [];
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) {
        submissions = JSON.parse(existing);
      }
    } catch (e) {
      console.error('[Analytics] Error parsing stored submissions:', e);
    }
    
    submissions.push(submission);
    if (submissions.length > 50) {
      submissions = submissions.slice(-50);
    }
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(submissions));
      localStorage.setItem('wtf-last-form-submission', JSON.stringify(submission));
    } catch (e) {
      console.error('[Analytics] Error storing submission:', e);
    }
    
    // Track with Umami
    if (window.umami) {
      window.umami.track('form-submit', {
        formId: formMeta.id,
        page: pageContext.path,
        pageType: pageContext.pageType
      });
    }
    
    // Store in memory
    window.WTFAnalytics.forms.push(submission);
    
    console.log('[Analytics] Form submission tracked:', formMeta.id);
  }

  // Track form input changes for engagement metrics
  let formEngagement = {};
  function handleFormInput(event) {
    const input = event.target;
    if (!input.form) return;
    
    const formId = input.form.id || 'unnamed-form';
    const fieldName = input.name || input.id || 'unnamed-field';
    
    if (!formEngagement[formId]) {
      formEngagement[formId] = {
        startTime: Date.now(),
        fields: new Set(),
        lastActivity: Date.now()
      };
    }
    
    formEngagement[formId].fields.add(fieldName);
    formEngagement[formId].lastActivity = Date.now();
    
    // Track engagement after 5 seconds of interaction
    if (Date.now() - formEngagement[formId].startTime > 5000) {
      if (!formEngagement[formId].tracked) {
        formEngagement[formId].tracked = true;
        
        if (window.umami) {
          window.umami.track('form-engagement', {
            formId: formId,
            fieldsEngaged: formEngagement[formId].fields.size,
            duration: Date.now() - formEngagement[formId].startTime
          });
        }
      }
    }
  }

  // Setup click tracking for important elements
  function setupClickTracking() {
    document.addEventListener('click', function(event) {
      const target = event.target;
      
      // Track CTA button clicks
      if (target.closest('.cta-button, [data-track="cta"]')) {
        const button = target.closest('.cta-button, [data-track="cta"]');
        if (window.umami) {
          window.umami.track('cta-click', {
            text: button.textContent.trim(),
            href: button.href || button.getAttribute('data-href') || 'none',
            page: window.location.pathname
          });
        }
      }
      
      // Track outbound links
      const link = target.closest('a[href^="http"]:not([href*="' + window.location.host + '"])');
      if (link) {
        if (window.umami) {
          window.umami.track('outbound-link', {
            url: link.href,
            text: link.textContent.trim().substring(0, 50),
            page: window.location.pathname
          });
        }
      }
    }, true);
  }

  // Initialize analytics
  function initAnalytics() {
    if (window.WTFAnalytics.initialized) {
      console.log('[Analytics] Already initialized, setting up for new page');
    }
    
    // Track page view
    trackPageView();
    
    // Setup form tracking
    setupFormTracking();
    
    // Setup click tracking only once
    if (!window.WTFAnalytics.initialized) {
      setupClickTracking();
    }
    
    window.WTFAnalytics.initialized = true;
    console.log('[Analytics] Initialized successfully');
  }

  // Handle both direct page loads and ViewTransitions navigation
  if (document.readyState === 'loading') {
    // Initial page load - wait for DOM
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    // DOM already loaded (shouldn't happen with inline script, but just in case)
    initAnalytics();
  }

  // Handle ViewTransitions navigation
  document.addEventListener('astro:page-load', function() {
    console.log('[Analytics] ViewTransition detected, reinitializing');
    // Reset form engagement tracking for new page
    formEngagement = {};
    initAnalytics();
  });

  // Expose API for manual tracking
  window.WTFAnalytics.track = function(eventName, data) {
    if (window.umami) {
      window.umami.track(eventName, data);
    }
    console.log('[Analytics] Manual event tracked:', eventName, data);
  };

  // Expose API to get stored data (useful for debugging or n8n integration)
  window.WTFAnalytics.getFormSubmissions = function() {
    try {
      const stored = localStorage.getItem('wtf-form-submissions');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('[Analytics] Error getting submissions:', e);
      return [];
    }
  };

  window.WTFAnalytics.clearFormSubmissions = function() {
    localStorage.removeItem('wtf-form-submissions');
    localStorage.removeItem('wtf-last-form-submission');
    window.WTFAnalytics.forms = [];
    console.log('[Analytics] Form submissions cleared');
  };

  console.log('[Analytics] Script loaded, waiting for DOM/navigation');
})();