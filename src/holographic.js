import {managedContent,managedReady} from './managed-content.js';
import {baseContent} from '../data/siteContent.js';
import {adminStaffDialogue} from '../data/preservedLegalDialogue.js';
const departments=[
 ['company','01','COMPANY & NEWS','Company mission, announcements and what HexCore Gaming is building.'],
 ['games','02','GAMES & DEVELOPMENT','Discover our gaming worlds and ongoing projects.'],
 ['support','03','SUPPORT & FEEDBACK','Help, troubleshooting, contacting the company and reporting issues.'],
 ['legal','04','LEGAL & POLICIES','Privacy, ownership, intellectual property and player rights.'],
 ['community','05','COMMUNITY & MEDIA','Official channels, video updates and news.'],
 ['business','06','CAREERS & BUSINESS','Work, partnerships and business inquiries.'],
 ['hardware','07','HARDWARE & MERCHANDISE','Gaming hardware, controllers and merchandise information.']
];
const $=id=>document.getElementById(id);
let current='company';
const nav=$('nav');
for(const [id,num,name] of departments){const b=document.createElement('button');b.type='button';b.dataset.id=id;b.innerHTML=`<span class="num">${num}</span><span>${name}</span>`;b.onclick=()=>{location.hash=id;show(id)};nav.append(b)}
function text(el,val){el.textContent=val||''}
function readEdits(){try{return JSON.parse(localStorage.getItem('hexcore_edits_v1')||'{}')}catch{return {}}}
function show(id){if(!departments.some(d=>d[0]===id))id='company';current=id;const d=departments.find(x=>x[0]===id);for(const b of nav.children)b.classList.toggle('active',b.dataset.id===id);const data={...baseContent[id],...(managedContent.departments[id]||{}),...(readEdits()[id]||{})};text($('title'),d[2]);text($('lede'),d[3]);text($('coord'),`${d[1]}.00 / HX`);text($('dept-label'),`DEPARTMENT ${d[1]}`);
 const content=$('content');content.replaceChildren();for(const [label,head,value,extra] of [['PRIMARY INFORMATION',data.headline,data.description,''],['STATUS & UPDATES','CURRENT INFORMATION',data.updates,'secondary']]){const el=document.createElement('article');el.className=`glass ${extra}`;const sm=document.createElement('small');text(sm,label);const h=document.createElement('h2');text(h,head);const p=document.createElement('p');text(p,value);el.append(sm,h,p);content.append(el)}
 for(const m of (managedContent.media||[]).filter(m=>m.department===id)){
  const a=document.createElement('article');a.className='glass secondary';
  const h=document.createElement('h2');h.textContent=m.title||'Media';a.append(h);
  const link=document.createElement('a');link.href=m.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open media ↗';
  if(m.type==='image' && /^https?:|^\.\.\//.test(m.url)){
    const img=document.createElement('img');img.src=m.url;img.alt=m.title||'HexCore media';img.loading='lazy';img.style.cssText='display:block;max-width:100%;max-height:350px;object-fit:contain;margin:12px 0;border-radius:10px';a.append(img);
  }
  a.append(link);content.append(a);
 }
 $('search').value='';fillFAQ(id,'');document.querySelector('.rail').classList.remove('open');$('navToggle').setAttribute('aria-expanded','false');}
function fillFAQ(id,search){const container=$('faq');container.replaceChildren();const q=search.toLowerCase().trim();const staff=adminStaffDialogue.find(group=>group.id===id);const questions=managedContent.faq['preserved:'+id]||managedContent.faq[id]||staff?.questions||[];const visible=questions.filter(item=>(item.question+' '+item.answer).toLowerCase().includes(q));text($('count'),visible.length+' RECORDS');if(!visible.length){const empty=document.createElement('article');empty.className='glass';text(empty,questions.length?'No matching answers. Try another search.':'Additional employee questions have not been published for this department.');container.append(empty);return}for(const entry of visible){const detail=document.createElement('details');const summary=document.createElement('summary');text(summary,entry.question);const answer=document.createElement('div');answer.className='answer';text(answer,entry.answer);detail.append(summary,answer);container.append(detail)}}
$('search').addEventListener('input',e=>fillFAQ(current,e.target.value));window.addEventListener('hashchange',()=>show(location.hash.slice(1)));$('navToggle').onclick=()=>{const rail=document.querySelector('.rail');const opened=rail.classList.toggle('open');$('navToggle').setAttribute('aria-expanded',String(opened))};show(location.hash.slice(1));
// The brief 60-second decorative glitch never blocks inputs or hides information.
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(()=>{if(document.hidden)return;document.body.classList.remove('glitching');void document.body.offsetWidth;document.body.classList.add('glitching');setTimeout(()=>document.body.classList.remove('glitching'),460)},60000)}

managedReady.then(()=>show(current));
