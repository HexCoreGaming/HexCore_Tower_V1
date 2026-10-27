// HexCore holographic command layer — traditional site only.
// Scripted menu navigation; no AI network calls or credentials.
const root=document.createElement('aside');
root.id='hx-guide';root.className='hx-guide';root.setAttribute('aria-label','HexCore navigation guide');
root.innerHTML=`<div class="hx-guide-visual" aria-hidden="true"><div class="hx-guide-field"></div><div class="hx-guide-shell"><div class="hx-guide-eye"></div></div><div class="hx-guide-orbit hx-o1"></div><div class="hx-guide-orbit hx-o2"></div><div class="hx-guide-particles"></div></div><div class="hx-guide-box"><div class="hx-guide-heading">HEXCORE / NAVIGATION ASSISTANT <button type="button" id="hxGuideClose" aria-label="Dismiss guide">×</button></div><p id="hxGuideLine">Welcome. Select an option below.</p><div id="hxGuideChoices" class="hx-guide-choices"></div></div>`;
document.body.append(root);
const summon=document.createElement('button');summon.id='hxGuideSummon';summon.className='hx-guide-summon';summon.type='button';summon.setAttribute('aria-label','Summon HexCore guide');summon.innerHTML='<span class="hx-summon-glyph">◉</span><span>SUMMON GUIDE</span>';document.body.append(summon);
const line=document.getElementById('hxGuideLine'), choices=document.getElementById('hxGuideChoices');
const depart=[['Company & News','company'],['Games & Development','games'],['Support & Feedback','support'],['Legal & Policies','legal'],['Community & Media','community'],['Careers & Business','business'],['Hardware & Merchandise','hardware']];
function show(){root.classList.add('visible');summon.classList.add('active');menu('home')}
function hide(){root.classList.remove('visible');summon.classList.remove('active')}
function navigate(id){hide();const b=document.querySelector(`#nav button[data-id="${id}"]`);if(b){b.click();document.getElementById('publicDepartments')?.click();document.querySelector('.display')?.scrollIntoView({behavior:'smooth',block:'start'})}else{location.hash=id}}
const menus={home:{say:'Welcome to HexCore Gaming. What would you like to explore?',items:[['Find a department',()=>menu('departments')],['Show company updates',()=>panel('publicNews')],['Open image gallery',()=>panel('publicGallery')],['Enter the 3D headquarters',()=>location.assign('./headquarters.html')],['What can you do?',()=>menu('help')],['Dismiss',hide]]},departments:{say:'Select your destination. I will bring the relevant display online.',items:[...depart.map(([name,id])=>[name,()=>navigate(id)]),['Back',()=>menu('home')]]},help:{say:'I can open departments, bring up articles or galleries, and direct you to the interactive headquarters. All my responses are predefined.',items:[['Show departments',()=>menu('departments')],['Back',()=>menu('home')]]}};
function menu(k){const data=menus[k];line.textContent=(window.hexcoreGuideLines?.[k]||data.say);choices.replaceChildren();for(const [caption,fn] of data.items){const b=document.createElement('button');b.type='button';b.textContent=caption;b.addEventListener('click',fn);choices.append(b)}}
function panel(id){hide();document.getElementById(id)?.click();document.querySelector('.display')?.scrollIntoView({behavior:'smooth',block:'start'})}
summon.addEventListener('click',()=>root.classList.contains('visible')?hide():show());document.getElementById('hxGuideClose').addEventListener('click',hide);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('visible'))hide()});
// Provide the guide once only; no automatic dialog over visitor content.

// Public managed copy is shared with the 3D guide; static commands remain functional.
import {managedContent as guideManagedContent,managedReady as guideManagedReady} from './managed-content.js';
guideManagedReady.then(()=>{window.hexcoreGuideLines=guideManagedContent.guideLines||{};});
