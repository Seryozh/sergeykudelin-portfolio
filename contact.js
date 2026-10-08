(() => {
  'use strict';
  const button = document.getElementById('email-toggle');
  const details = document.getElementById('email-details');
  function hideEmail() {
    details.hidden = true;
    details.replaceChildren();
    button.setAttribute('aria-expanded', 'false');
  }
  button.addEventListener('click', () => {
    if (!details.hidden) { hideEmail(); return; }
    const address = atob('a3VkZWxpbi5kZXZAZ21haWwuY29t');
    const link = document.createElement('a');
    link.href = 'mailto:' + address;
    link.textContent = address;
    details.replaceChildren(link);
    details.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    link.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !details.hidden) {
      hideEmail();
      button.focus({ preventScroll: true });
    }
  });
})();
