import { site } from './content.js';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const icons = {
  chart: '<svg viewBox="0 0 24 24"><path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7"/></svg>',
  automation: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 10-13h-7z"/></svg>',
  ai: '<svg viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3m6-14a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3 3 3 0 0 1-2 3v1a3 3 0 0 1-3 3M9 4v16m6-16v16M9 9h6M9 15h6"/></svg>',
  salesforce: '<svg viewBox="0 0 24 24"><path d="M7.2 18.8h9.9a4.1 4.1 0 0 0 .7-8.1 5.7 5.7 0 0 0-10.7-2A4.2 4.2 0 0 0 7.2 18.8Z"/><path d="M8.5 13h7M10 10.5 8 13l2 2.5M14 10.5l2 2.5-2 2.5"/></svg>',
  code: '<svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>',
  mobile: '<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 5h4M11 18.5h2"/></svg>'
};

function renderServices(){
  $('#services-grid').innerHTML = site.services.map(s => `
    <article class="service-card reveal">
      <div class="service-icon">${icons[s.icon] || icons.code}</div>
      <div><p class="micro">${s.title}</p><h3>${s.copy}</h3>
      <ul>${s.bullets.map(b=>`<li>${b}</li>`).join('')}</ul></div>
    </article>`).join('');
}

function renderProjects(){
  $('#projects-grid').innerHTML = site.projects.map((p,i)=>`
    <article class="project-card reveal" data-project="${i}" tabindex="0">
      <div class="project-image"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
      <div class="project-body"><p class="micro">${p.label}</p><h3>${p.title}</h3><p>${p.copy}</p>
      <div class="tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div></div>
    </article>`).join('');
}

function renderProcess(){
  $('#process-grid').innerHTML = site.process.map(p=>`
    <article class="process-step reveal"><span>${p.n}</span><h3>${p.title}</h3><p>${p.text}</p></article>`).join('');
}
function renderStack(){ $('#stack').innerHTML = site.stack.map(x=>`<span>${x}</span>`).join(''); }
function renderStats(){ $('#stats').innerHTML = site.stats.map(x=>`<div><b>${x.value}</b><small>${x.label}</small></div>`).join(''); }

function applyContent(){
  $('#hero-eyebrow').textContent = site.hero.eyebrow;
  $('#hero-title').innerHTML = site.hero.title;
  $('#hero-body').textContent = site.hero.body;
  $('#hero-primary').textContent = site.hero.primary.label;
  $('#hero-primary').href = site.hero.primary.href;
  $('#hero-secondary').textContent = site.hero.secondary.label;
  $('#hero-secondary').href = site.hero.secondary.href;
  $$('.email-link').forEach(a=>{a.href=`mailto:${site.contact.email}`; a.textContent=site.contact.email});
  $$('.linkedin-link').forEach(a=>a.href=site.contact.linkedin);
  $$('.github-link').forEach(a=>a.href=site.contact.github);
  $('#footer-location').innerHTML = `${site.contact.location}<br>${site.contact.availability}`;
}

function menu(){
  const btn=$('#menu-button'), nav=$('#nav');
  btn.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',open); });
  $$('#nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}));
}

function reveal(){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>io.observe(el));
}

function projectModal(){
  const modal=$('#project-modal');
  const open=i=>{
    const p=site.projects[i];
    $('#modal-image').src=p.image; $('#modal-kicker').textContent=p.label; $('#modal-title').textContent=p.title; $('#modal-copy').textContent=p.copy;
    $('#modal-tags').innerHTML=p.tags.map(t=>`<span>${t}</span>`).join(''); modal.showModal();
  };
  $('#projects-grid').addEventListener('click',e=>{const c=e.target.closest('.project-card'); if(c) open(+c.dataset.project)});
  $('#projects-grid').addEventListener('keydown',e=>{const c=e.target.closest('.project-card'); if(c && (e.key==='Enter'||e.key===' ')){e.preventDefault();open(+c.dataset.project)}});
  $('#modal-close').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',e=>{if(e.target===modal) modal.close()});
}

document.addEventListener('DOMContentLoaded',()=>{applyContent();renderStats();renderServices();renderProjects();renderProcess();renderStack();menu();projectModal();requestAnimationFrame(reveal);});
