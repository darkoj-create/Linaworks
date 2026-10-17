(() => {
  'use strict';
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const hr = document.documentElement.lang === 'hr';
  const email = 'hello@lina-works.eu';
  const service = form.elements.service;
  const selected = new URLSearchParams(location.search).get('service');
  if (Array.from(service.options).some(option => option.value === selected)) service.value = selected;
  try {
    const draft = JSON.parse(sessionStorage.getItem('linaworks-inquiry') || 'null');
    if (draft && typeof draft.description === 'string') {
      form.elements.problem.value = draft.description.slice(0, 4000);
      if (Array.from(service.options).some(option => option.value === draft.service)) service.value = draft.service;
      sessionStorage.removeItem('linaworks-inquiry');
    }
  } catch { /* Contact works normally when browser storage is unavailable. */ }
  const status = document.getElementById('inquiry-status');
  function prepare() {
    if (!form.reportValidity()) return null;
    const data = new FormData(form);
    const subject = `LinaWorks — ${service.options[service.selectedIndex].text}`;
    const body = `${hr ? 'Ime' : 'Name'}: ${String(data.get('name')).trim()}\nEmail: ${String(data.get('email')).trim()}\n${hr ? 'Područje' : 'Service'}: ${service.options[service.selectedIndex].text}\n\n${String(data.get('problem')).trim()}`;
    document.getElementById('prepared-message').value = body;
    document.getElementById('prepared-mail').href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('inquiry-preview').hidden = false;
    return body;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!prepare()) return;
    status.textContent = hr ? 'Poruka je pripremljena. Provjerite tekst pa otvorite aplikaciju za e-poštu ili ga kopirajte. Upit još nije poslan.' : 'Your message is ready. Review it, then open your email app or copy the text. Nothing has been sent yet.';
    document.getElementById('prepared-mail').focus();
  });
  document.getElementById('copy-inquiry').addEventListener('click', async () => {
    const body = prepare();
    if (!body) return;
    try {
      await navigator.clipboard.writeText(body);
      status.textContent = hr ? `Tekst je kopiran. Zalijepite ga u e-mail na ${email}. Upit još nije poslan.` : `Text copied. Paste it into an email to ${email}. Nothing has been sent yet.`;
    } catch {
      document.getElementById('prepared-message').focus();
      document.getElementById('prepared-message').select();
      status.textContent = hr ? 'Označeni tekst kopirajte ručno i pošaljite e-poštom.' : 'Copy the selected text manually and send it by email.';
    }
  });
})();
