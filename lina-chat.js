(() => {
  'use strict';
  if (document.getElementById('lina-chat-launcher')) return;
  const hr = document.documentElement.lang === 'hr';
  const prefix = hr ? '/hr' : '';
  const t = hr ? {
    ask:'Pitaj Linu', title:'Lina', sub:'Vaša vodičica kroz LinaWorks', close:'Zatvori razgovor', badge:'Pregled · bez AI povezivanja',
    intro:'Bok, ja sam Lina. Dobre ideje volim pretvoriti u koristan prvi korak. Što vas zanima?',
    notice:'Zasad nudim pripremljene odgovore. Slobodni AI razgovor stiže nakon povezivanja API-ja.',
    topics:['Izvještaji i kapaciteti','Salesforce i AI','Što mogu automatizirati?'],
    label:'Opišite svoj problem', placeholder:'Primjer: svaki tjedan spajamo pet tablica…', send:'Nastavi',
    handoff:'Pripremi upit za Darka ↗', clear:'Novi razgovor', more:'Pogledaj primjer →',
    local:'Opis ostaje u ovom pregledniku dok ga sami ne pošaljete e-poštom.',
    free:'Za razgovor o vašem konkretnom opisu još trebam AI povezivanje. Mogu prenijeti vaš opis u kontaktni obrazac kako biste ga poslali Darku. Ondje ga možete urediti prije slanja.',
    answers:[
      'Kad se izvještaji rade ručno, dobar početak je utvrditi izvore podataka, KPI-jeve i odluke koje izvještaj treba podržati. Darkovo iskustvo uključuje cjelovit Customer Care reporting, planiranje kapaciteta i autorski pregled rezultata u reguliranom fintechu. Koji izvještaj vašem timu oduzima najviše vremena?',
      'Darkovo iskustvo uključuje Salesforce asistenta koji prevodi komunikaciju, sažima korisnički upit i predlaže nacrt odgovora, uz compliance zahtjeve i Salesforce Trust Layer u reguliranom fintechu. Za vaš tim prvi korak može biti jedan jasno definiran postupak. Što agenti danas rade ručno?',
      'Dobri kandidati su povezivanje tablica, ponavljajuće izvještavanje, rutinske obavijesti i prijenos podataka između sustava. Krenemo od jednog postupka: ulazni podaci, potrebni koraci, iznimke i očekivani rezultat. Opišite primjer pa ga možemo prenijeti u upit.'
    ]
  } : {
    ask:'Ask Lina', title:'Lina', sub:'Your guide to LinaWorks', close:'Close conversation', badge:'Preview · AI not connected',
    intro:'Hi, I’m Lina. I like turning good ideas into a useful first step. What would you like to explore?',
    notice:'For now, I offer prepared answers. Open-ended AI chat will follow once the API is connected.',
    topics:['Reporting & capacity','Salesforce & AI','What can I automate?'],
    label:'Describe your problem', placeholder:'For example: we merge five spreadsheets every week…', send:'Continue',
    handoff:'Prepare an inquiry for Darko ↗', clear:'New conversation', more:'See an example →',
    local:'Your description stays in this browser until you choose to send it by email.',
    free:'I still need an AI connection to discuss your specific description. I can transfer it to the contact form for you to send to Darko. You can edit it there before sending.',
    answers:[
      'When reports are assembled manually, start with the data sources, KPIs and decisions the report should support. Darko’s experience includes end-to-end customer care reporting, capacity planning and human-written performance overviews in regulated fintech. Which report takes your team the most time?',
      'Darko’s experience includes a Salesforce assistant that translates conversations, summarises customer requests and suggests response drafts, with compliance requirements and Salesforce Trust Layer in regulated fintech. A first step for your team can focus on one well-defined workflow. What do your agents do manually today?',
      'Good candidates include combining spreadsheets, recurring reports, routine notifications and transferring data between systems. Start with one workflow: inputs, steps, exceptions and the result you need. Describe an example and we can transfer it to an inquiry.'
    ]
  };
  const avatar = '<span class="lina-chat-avatar" aria-hidden="true"><img src="/assets/lina-sunset-brand.jpg" alt="" width="1536" height="864"></span>';
  const host = document.createElement('div');
  host.className = 'lina-chat';
  host.innerHTML = `<button type="button" id="lina-chat-launcher" aria-haspopup="dialog" aria-expanded="false" aria-controls="lina-chat-panel">${avatar}<span>${t.ask}<small>LinaWorks</small></span><span class="lina-launch-spark" aria-hidden="true">✦</span></button><section id="lina-chat-panel" role="dialog" aria-modal="true" aria-labelledby="lina-chat-title" hidden><header class="lina-chat-header">${avatar}<div><h2 id="lina-chat-title">${t.title}<span aria-hidden="true">✦</span></h2><p>${t.sub}</p></div><button type="button" class="lina-chat-close" aria-label="${t.close}">×</button></header><div class="lina-chat-disclosure"><span></span>${t.badge}</div><div class="lina-chat-log" role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div><div class="lina-chat-topics"></div><div class="lina-chat-next"><a class="lina-chat-handoff" href="${prefix}/contact">${t.handoff}</a><button type="button" class="lina-chat-reset">${t.clear}</button></div><form class="lina-chat-form"><label for="lina-chat-input">${t.label}</label><div><textarea id="lina-chat-input" rows="2" maxlength="1500" placeholder="${t.placeholder}" required></textarea><button type="submit" aria-label="${t.send}">↑</button></div><p>${t.local}</p></form></section>`;
  document.body.append(host);
  const launcher = host.querySelector('#lina-chat-launcher');
  const panel = host.querySelector('#lina-chat-panel');
  const close = host.querySelector('.lina-chat-close');
  const log = host.querySelector('.lina-chat-log');
  const input = host.querySelector('textarea');
  const handoff = host.querySelector('.lina-chat-handoff');
  let service = 'other';
  let description = '';
  function message(text, role = 'assistant', href) {
    const row = document.createElement('div');
    row.className = `lina-chat-message ${role}`;
    const who = document.createElement('small');
    who.textContent = role === 'assistant' ? 'LINA' : (hr ? 'VI' : 'YOU');
    const copy = document.createElement('p');
    copy.textContent = text;
    row.append(who, copy);
    if (href) {
      const link = document.createElement('a');link.href = href;link.textContent = t.more;row.append(link);
    }
    log.append(row);
    log.scrollTop = log.scrollHeight;
  }
  function reset() {
    service = 'other';description = '';input.value = '';log.replaceChildren();
    handoff.href = `${prefix}/contact`;
    message(t.intro);
    const note = document.createElement('p');note.className = 'lina-chat-note';note.textContent = t.notice;log.append(note);
  }
  function openChat() { panel.hidden = false;launcher.setAttribute('aria-expanded','true');close.focus(); }
  function closeChat() { panel.hidden = true;launcher.setAttribute('aria-expanded','false');launcher.focus(); }
  launcher.addEventListener('click', () => panel.hidden ? openChat() : closeChat());
  close.addEventListener('click',closeChat);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault();closeChat();return; }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(panel.querySelectorAll('button, a[href], textarea, [tabindex="0"]')).filter(node => !node.disabled && node.getClientRects().length);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  });
  t.topics.forEach((topic,index) => {
    const button = document.createElement('button');button.type = 'button';button.textContent = topic;
    button.addEventListener('click', () => {
      message(topic,'user');service = ['reporting','salesforce','automation'][index];
      message(t.answers[index],'assistant',`${prefix}/${index === 2 ? 'solutions#google-apps-script' : 'fintech-customer-care'}`);
      handoff.href = `${prefix}/contact?service=${service}`;
    });
    host.querySelector('.lina-chat-topics').append(button);
  });
  host.querySelector('.lina-chat-reset').addEventListener('click', reset);
  host.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();const text = input.value.trim();if (!text) return;
    description = text;message(text,'user');input.value = '';message(t.free);
  });
  handoff.addEventListener('click', () => {
    if (!description) return;
    try {sessionStorage.setItem('linaworks-inquiry',JSON.stringify({description,service}));} catch { /* The direct contact route remains available. */ }
  });
  reset();
})();
