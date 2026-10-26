/**
 * STACKLY ARTISAN BAKERY — PRELOADER CONTROLLER
 * Controls the stone deck hearth loading animation across pages
 */
(function() {
  function initPreloader() {
    const sitePreloader = document.getElementById('sitePreloader');
    const preloaderBar = document.getElementById('preloaderBar');
    const preloaderStatus = document.getElementById('preloaderStatus');

    if (!sitePreloader) return;

    document.body.classList.add('preload-active');

    // Default status steps; pages can configure via window.__PRELOADER_STEPS__
    const statusSteps = window.__PRELOADER_STEPS__ || [
      { progress: 28, text: 'Warming stone deck hearth...' },
      { progress: 58, text: 'Nurturing 10-year wild starter...' },
      { progress: 86, text: 'Proofing 81 flaky butter layers...' },
      { progress: 100, text: 'Fresh morning bakes ready!' }
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < statusSteps.length - 1) {
        currentStep++;
        if (preloaderBar) preloaderBar.style.width = statusSteps[currentStep].progress + '%';
        if (preloaderStatus) preloaderStatus.textContent = statusSteps[currentStep].text;
      }
    }, 240);

    let isDismissed = false;
    const dismissPreloader = () => {
      if (isDismissed) return;
      isDismissed = true;

      clearInterval(progressInterval);
      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderStatus) {
        preloaderStatus.textContent = statusSteps[statusSteps.length - 1].text || 'Fresh morning bakes ready!';
      }

      setTimeout(() => {
        sitePreloader.classList.add('preloader-hidden');
        document.body.classList.remove('preload-active');

        // Refresh AOS scroll triggers if present
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }

        setTimeout(() => {
          sitePreloader.style.display = 'none';
        }, 750);
      }, 300);
    };

    if (document.readyState === 'complete') {
      setTimeout(dismissPreloader, 650);
    } else {
      window.addEventListener('load', () => {
        setTimeout(dismissPreloader, 550);
      });
      // Safety timeout so user is never locked out
      setTimeout(dismissPreloader, 2200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
