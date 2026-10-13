import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { adminStaffDialogue } from '../data/preservedLegalDialogue.js';

// CLEAN REBUILD: This module creates all geometry from scratch. No original world imports.
const $=id=>document.getElementById(id);
const floors=[
 {id:'lobby',label:'G • Main Lobby',title:'HEXCORE MAIN LOBBY',summary:'Reception, visitor guidance, after-hours holographic assistant, and access to every company service.'},
 {id:'company',label:'01 • Company & News',title:'COMPANY & NEWS',summary:'Company mission, official announcements, development news, and public information.'},
 {id:'games',label:'02 • Games & Development',title:'GAMES & DEVELOPMENT',summary:'Current projects, release information, development updates, media, and future downloadable demos.'},
 {id:'support',label:'03 • Support & Feedback',title:'SUPPORT & FEEDBACK',summary:'FAQs, contact routes, technical help, bug reporting, and feedback.'},
 {id:'legal',label:'04 • Legal & Policies',title:'LEGAL & POLICIES',summary:'Original approved policy statements, ownership, privacy, copyrights, player rights, and Q&A.'},
 {id:'community',label:'05 • Community & Media',title:'COMMUNITY & MEDIA',summary:'Official platforms, press material, announcements, and community information.'},
 {id:'business',label:'06 • Careers & Business',title:'CAREERS & BUSINESS',summary:'Career opportunities, business inquiries, partnerships, and supporter information.'},
 {id:'hardware',label:'07 • Hardware & Merchandise',title:'HARDWARE & MERCHANDISE',summary:'Planned gaming hardware, controllers, company merchandise, and future store information.'},
 {id:'admin',label:'08 • Private Office',title:'ADMINISTRATIVE OFFICE',summary:'Private in-world content editor. Free local export workflow; publishing remains authenticated through GitHub.'},
];
const groups=[...adminStaffDialogue]; // Preserved verbatim source data; V3 interaction layer reads it without modification.
// The exact original 41 Q&A entries are the only retained old-world data.

const baseContent={
 company:{headline:'HEXCORE GAMING',description:'A game and hardware development company created by a gamer, for gamers.',updates:'Official announcements can be added using the administration office.'},
 games:{headline:'GAMES & DEVELOPMENT',description:'Cyber_Arena HEX//BREAK • Untamed Horizon • Where Light Dies • City of Thieves / The Forgotten Ashes',updates:'Official demos and releases will appear here when published.'},
 support:{headline:'VISITOR SUPPORT',description:'For support, post in the Support channel of the official Discord server: https://discord.gg/WKC53ZJsH7. This is where issues are more likely to be seen.',updates:'Alternatively, email hexcoregaming@proton.me with Support in the subject line. HexCore does not have a dedicated support email.'},
 legal:{headline:'LEGAL KNOWLEDGE ARCHIVE',description:'The original 41 NPC questions and answers are preserved exactly as authored.',updates:'These are existing company statements; not a substitute for formally issued legal documents.'},
 community:{headline:'COMMUNITY & MEDIA',description:'Official community channels, video updates, and media resources will be listed when added.',updates:'Links are not configured.'},
 business:{headline:'BUSINESS & CAREERS',description:'Partnerships, press, hiring, and funding information can be published here.',updates:'No active job postings or solicitations are represented.'},
 hardware:{headline:'HARDWARE & MERCHANDISE',description:'HexCore Gaming plans gaming hardware and controller concepts alongside its games.',updates:'Products are not offered for sale here.'},
 lobby:{headline:'WELCOME TO HEXCORE',description:'A playable digital headquarters. Explore, approach a terminal, or use the menu to locate information.',updates:'No accounts required.'},
 admin:{headline:'PRIVATE OFFICE',description:'Content editing interface.',updates:'Local editing only; use GitHub to publish.'}
};
let edits={};try{edits=JSON.parse(localStorage.getItem('hexcore_edits_v1')||'{}')}catch{};
const content=id=>({...baseContent[id],...(edits[id]||{})});
let selected={species:'human',body:'masculine'};
for(const name of ['species','body'])$(name).querySelectorAll('button').forEach(btn=>btn.onclick=()=>{$(name).querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');selected[name]=btn.dataset.value});
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setClearColor(0x090d1c);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.72;document.body.appendChild(renderer.domElement);renderer.domElement.style.position='fixed';renderer.domElement.style.inset='0';renderer.domElement.style.zIndex='0';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x090c18);scene.fog=new THREE.FogExp2(0x101326,.0031);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.08,1100);camera.rotation.order='YXZ';
const lighting=new THREE.AmbientLight(0xd5dcff,2.05);scene.add(lighting);
const hemi=new THREE.HemisphereLight(0xb1b2ff,0x272132,2.45);scene.add(hemi);
const lobbyFill=new THREE.DirectionalLight(0xd6dfff,1.1);lobbyFill.position.set(20,50,18);scene.add(lobbyFill);
function marbleTexture(){const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');const grad=g.createLinearGradient(0,0,512,512);grad.addColorStop(0,'#0f1017');grad.addColorStop(.48,'#141826');grad.addColorStop(1,'#0a0b12');g.fillStyle=grad;g.fillRect(0,0,512,512);for(let i=0;i<1500;i++){const x=Math.random()*512,y=Math.random()*512,a=Math.random()*Math.PI*2,l=15+Math.random()*80;g.strokeStyle=i%5===0?'rgba(166,196,255,0.06)':'rgba(255,255,255,0.025)';g.lineWidth=Math.random()*1.4+.1;g.beginPath();g.moveTo(x,y);for(let s=0;s<4;s++){g.lineTo(x+Math.cos(a+s*.35)*(l*(s+1)/4),y+Math.sin(a+s*.35)*(l*(s+1)/4)+Math.sin((x+y+s)*.08)*6)}g.stroke()}const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(8,8);return tx}
const marbleMap=marbleTexture();
const M={dark:new THREE.MeshStandardMaterial({color:0x0a0e1b,metalness:.82,roughness:.19}),floor:new THREE.MeshPhysicalMaterial({color:0x12151f,map:marbleMap,metalness:.63,roughness:.16,clearcoat:1,clearcoatRoughness:.09,reflectivity:1}),wall:new THREE.MeshStandardMaterial({color:0x283147,metalness:.55,roughness:.24}),glass:new THREE.MeshPhysicalMaterial({color:0x304a88,metalness:.15,roughness:.04,transparent:true,opacity:.28,side:THREE.DoubleSide,depthWrite:false,clearcoat:1,clearcoatRoughness:.04,transmission:0}),violet:new THREE.MeshBasicMaterial({color:0xaf74ff}),blue:new THREE.MeshBasicMaterial({color:0x8ed8ff}),white:new THREE.MeshBasicMaterial({color:0xe6efff}),leaf:new THREE.MeshStandardMaterial({color:0x7a3fd4,emissive:0x5c24ba,emissiveIntensity:.65,roughness:.86}),skin:new THREE.MeshStandardMaterial({color:0xc8aa9f}),hair:new THREE.MeshStandardMaterial({color:0xd5c8ef,metalness:.12}),black:new THREE.MeshStandardMaterial({color:0x171a28,metalness:.4,roughness:.34})};
const world=new THREE.Group();scene.add(world);let entities=[],colliders=[],animatedDoors=[],staffActors=[];
const box=(p,s,m,parent=world)=>{let o=new THREE.Mesh(new THREE.BoxGeometry(...s),m);o.position.set(...p);parent.add(o);return o};
const cyl=(p,rTop,rBottom,h,m,parent=world,n=12)=>{let o=new THREE.Mesh(new THREE.CylinderGeometry(rTop,rBottom,h,n),m);o.position.set(...p);parent.add(o);return o};
const sphere=(p,r,m,parent=world,n=16)=>{let o=new THREE.Mesh(new THREE.SphereGeometry(r,n,12),m);o.position.set(...p);parent.add(o);return o};
const torus=(p,r,t,m,rot=[0,0,0],parent=world)=>{let o=new THREE.Mesh(new THREE.TorusGeometry(r,t,6,52),m);o.position.set(...p);o.rotation.set(...rot);parent.add(o);return o};
const textCanvas=(txt,{size=82,color='#ddd9ff',bg=null,width=1024,height=160}={})=>{let c=document.createElement('canvas');c.width=width;c.height=height;const ct=c.getContext('2d');if(bg){ct.fillStyle=bg;ct.fillRect(0,0,width,height)}ct.fillStyle=color;ct.textAlign='center';ct.textBaseline='middle';ct.font=`500 ${size}px Segoe UI, Arial`;ct.fillText(txt,width/2,height/2);let tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx};
const sign=(text,p,w=9,h=1)=>{let mat=new THREE.MeshBasicMaterial({map:textCanvas(text),transparent:true,side:THREE.DoubleSide,depthWrite:false});let ob=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);ob.position.set(...p);world.add(ob);return ob};
const interact=(name,p,cb,range=4)=>entities.push({name,pos:new THREE.Vector3(...p),cb,range});
function trim(p,s,material=M.violet){box(p,s,material)}
function tree(x,z,scale=1){cyl([x,.9*scale,z],.12*scale,.22*scale,1.8*scale,M.dark);sphere([x,2.05*scale,z],.85*scale,M.leaf);for(let i=0;i<5;i++){let a=i*Math.PI*2/5;sphere([x+Math.cos(a)*.65*scale,1.9*scale,z+Math.sin(a)*.65*scale],.42*scale,M.leaf)}}
function portal(label,x,z,cb){box([x,1.8,z],[4.7,3.6,.35],M.dark);box([x,3.6,z],[4.9,.08,.5],M.violet);for(let dx of [-2.36,2.36])box([x+dx,1.8,z],[.09,3.6,.5],M.blue);sign(label,[x,4.65,z+.32],5.8,.7);interact(label,[x,1.7,z],cb,5)}
function hologram(x,y,z){sphere([x,y,z],2.25,new THREE.MeshBasicMaterial({color:0x5555ef,transparent:true,opacity:.42,wireframe:true}));torus([x,y,z],3.05,.04,M.blue,[1.05,0,.2]);torus([x,y,z],2.55,.04,M.violet,[.3,.2,0]);}
function employee(x,z,i){let g=new THREE.Group();g.position.set(x,0,z);g.userData={baseY:0,phase:Math.random()*Math.PI*2,turn:(Math.random()-.5)*.22};world.add(g);staffActors.push(g);cyl([0,1.15,0],.25,.31,1.35,M.black,g);sphere([0,2.06,0],.27,i%2?M.skin:M.hair,g);box([-.37,1.2,0],[.15,.88,.18],M.black,g);box([.37,1.2,0],[.15,.88,.18],M.black,g);box([-.14,.3,0],[.18,.67,.23],M.black,g);box([.14,.3,0],[.18,.67,.23],M.black,g);box([0,1.35,.27],[.25,.15,.05],i%2?M.violet:M.blue,g);return g;}

// V7: exactly ONE portal per floor. The destination display is a hologram in the 3D scene.
let portalSelection=null, portalHologram=null;
function floorPortalNexus(isLobby=false){
 const x=isLobby?21:21, z=isLobby?-4:23;
 const frame=new THREE.Group();frame.position.set(x,0,z);world.add(frame);
 panel([0,.17,0],[6,.34,5],M.dark,frame);
 panel([0,.36,0],[5.8,.045,4.8],M.glass,frame);
 panel([-2.45,2.18,0],[.22,3.9,.65],M.blue,frame);
 panel([2.45,2.18,0],[.22,3.9,.65],M.violet,frame);
 panel([0,4.1,0],[5.2,.2,.65],M.violet,frame);
 panel([0,2.1,.06],[4.45,3.72,.05],new THREE.MeshBasicMaterial({color:0x6155d7,transparent:true,opacity:.18,depthWrite:false}),frame);
 sign('FLOOR TRANSIT',[x,5.12,z+.2],7.3,.7);
 interact('Select floor at portal',[x,1.6,z+1.15],()=>openPortalSelector(),5.2);
}
function closePortalSelector(){
 portalSelection=null;
 if(portalHologram){camera.remove(portalHologram);portalHologram.geometry.dispose();portalHologram.material.map?.dispose();portalHologram.material.dispose();portalHologram=null}
 $('portalMobile').classList.add('hidden');$('portalMobile').innerHTML='';
}
function refreshPortalSelector(){
 if(!portalSelection)return;
 const {choices,index}=portalSelection;
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='rgba(6,10,29,.87)';ctx.fillRect(0,0,1024,1024);
 ctx.strokeStyle='#8c69e8';ctx.lineWidth=8;ctx.strokeRect(10,10,1004,1004);
 ctx.font='bold 44px Arial';ctx.fillStyle='#a5cdff';ctx.fillText('HEXCORE  /  FLOOR TRANSIT',55,91);
 ctx.font='26px Arial';ctx.fillStyle='#c1badb';ctx.fillText('UP / DOWN: SELECT    E / ENTER: TRAVEL    ESC: CANCEL',55,145);
 choices.forEach((f,i)=>{let y=210+i*87;if(i===index){ctx.fillStyle='rgba(123,80,255,.37)';ctx.fillRect(40,y-49,940,75)}ctx.fillStyle=i===index?'#ffffff':'#9dadd6';ctx.font=(i===index?'bold ':'')+'33px Arial';ctx.fillText((i===index?'▶  ':'   ')+f.label,72,y)});
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
 if(!portalHologram){portalHologram=new THREE.Mesh(new THREE.PlaneGeometry(2.85,2.85),new THREE.MeshBasicMaterial({map,transparent:true,depthTest:false,side:THREE.DoubleSide}));portalHologram.position.set(0,0,-3.3);camera.add(portalHologram);scene.add(camera)}
 else{portalHologram.material.map.dispose();portalHologram.material.map=map;portalHologram.material.needsUpdate=true}
 const box=$('portalMobile');box.innerHTML='<strong>HEXCORE FLOOR TRANSIT</strong>';
 choices.forEach((f,i)=>{const b=document.createElement('button');b.textContent=f.label;b.className=i===index?'active':'';b.onclick=()=>{const choice=f.id;closePortalSelector();travel(choice)};box.appendChild(b)});
 let cancel=document.createElement('button');cancel.textContent='CANCEL';cancel.onclick=closePortalSelector;box.appendChild(cancel);
 box.classList.toggle('hidden',!mobile);
}
function openPortalSelector(){
 portalSelection={choices:floors.filter(f=>f.id!==floor),index:0};
 keys={};refreshPortalSelector();
 // Never call setPanel or exitPointerLock here.
}
function portalInput(code){
 if(!portalSelection)return false;
 if(code==='Escape'){closePortalSelector();return true}
 if(code==='ArrowUp'||code==='KeyW'||code==='ArrowLeft'||code==='KeyA'){portalSelection.index=(portalSelection.index+portalSelection.choices.length-1)%portalSelection.choices.length;refreshPortalSelector();return true}
 if(code==='ArrowDown'||code==='KeyS'||code==='ArrowRight'||code==='KeyD'){portalSelection.index=(portalSelection.index+1)%portalSelection.choices.length;refreshPortalSelector();return true}
 if(code==='Enter'||code==='KeyE'||code==='Space'){const target=portalSelection.choices[portalSelection.index].id;closePortalSelector();travel(target);return true}
 return true;
}
// NEW ART DIRECTION: all geometric forms below are procedurally created for the new world.
function panel(p,s,m=M.wall,parent=world){let o=box(p,s,m,parent);return o}
function pillar(x,z,height=32,width=2,parent=world){
  panel([x,height/2,z],[width,height,width],M.dark,parent);
  panel([x,height/2,z+width/2+.025],[.07,height-.4,.05],M.violet,parent);
  panel([x,height-.2,z],[width+.35,.16,width+.35],M.blue,parent);
}
function floorMedallion(x,z,r=8){
  let sh=new THREE.Shape();for(let k=0;k<6;k++){let a=Math.PI/3*k+Math.PI/6;let px=Math.cos(a)*r,py=Math.sin(a)*r;k===0?sh.moveTo(px,py):sh.lineTo(px,py)}sh.closePath();
  let edges=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({length:6},(_,k)=>new THREE.Vector3(x+Math.cos(k*Math.PI/3+Math.PI/6)*r,.10,z+Math.sin(k*Math.PI/3+Math.PI/6)*r))),new THREE.LineBasicMaterial({color:0x9958ff}));world.add(edges);
  for(let k=0;k<3;k++){let a=Math.PI*2*k/3;panel([x+Math.cos(a)*r*.35,.085,z+Math.sin(a)*r*.35],[r*.62,.025,.1],M.blue).rotation.y=-a}
}

function hexcoreFloorLogo(x,z,s=6.6){
 floorMedallion(x,z,s);
 panel([x-s*.22,.07,z],[s*.18,.022,s*.92],M.blue);
 panel([x+s*.22,.07,z],[s*.18,.022,s*.92],M.blue);
 panel([x,.07,z],[s*.54,.022,s*.18],M.violet);
 torus([x,.082,z],s*.78,.07,M.violet,[-Math.PI/2,0,0]);
 torus([x,.084,z],s*.48,.05,M.blue,[-Math.PI/2,0,0]);
}
function automaticEntrance(x,z){
 const g=new THREE.Group();g.position.set(x,0,z);world.add(g);
 panel([-7.8,4.9,0],[3.5,9.8,.9],M.dark,g);
 panel([7.8,4.9,0],[3.5,9.8,.9],M.dark,g);
 panel([0,9.3,0],[12.3,.3,.9],M.violet,g);
 panel([-6.1,4.5,0],[.22,8.9,.65],M.blue,g);
 panel([6.1,4.5,0],[.22,8.9,.65],M.violet,g);
 const left=panel([-2.75,3.65,.06],[5.5,7.3,.12],M.glass,g);
 const right=panel([2.75,3.65,.06],[5.5,7.3,.12],M.glass,g);
 animatedDoors.push({left,right,travel:5.6,open:0,center:new THREE.Vector3(x,1.8,z),rest:2.75});
}
// V13: closer tower reconstruction with wraparound architecture and corrected side/rear design.

function towerFacadeV13(){
 const stone=new THREE.MeshStandardMaterial({color:0x14192c,metalness:.78,roughness:.22});
 const sideStone=new THREE.MeshStandardMaterial({color:0x171d31,metalness:.74,roughness:.24});
 const champagne=new THREE.MeshStandardMaterial({color:0x959dbc,metalness:.84,roughness:.17});
 const face=35, tz=35;

 // central body and stacked crown so the building reads like a full tower, not a flat wall.
 panel([0,42,tz+1],[26,84,24],M.dark);
 panel([0,80,tz+1],[18,34,16],stone);
 panel([0,105,tz],[13,18,11],M.dark);
 panel([0,121,tz],[9,14,8],stone);

 // front monumental spires framing the entrance silhouette.
 for(const side of [-1,1]){
  for(let j=0;j<6;j++){
   const x=side*(9.5+j*4.9), h=146-j*15.2, wid=j<2?4.6:3.7;
   panel([x,h/2+10,face-2-j*.5],[wid,h,wid+2],j%2?stone:M.dark);
   panel([x,h/2+10,face+.62-j*.5],[.10,h-2,.11],j%2?M.blue:M.violet);
   const top=new THREE.Mesh(new THREE.ConeGeometry(wid*.46,12,4),stone);
   top.rotation.y=Math.PI/4;top.position.set(x,h+14,face-2-j*.5);world.add(top);
  }
 }

 // side and rear architecture so the tower is designed from every angle.
 for(const side of [-1,1]){
  // side shell walls cover the previously bare lobby exterior.
  panel([side*13.8,16,tz],[1.8,32,36],sideStone);
  panel([side*15.4,26,tz],[1.8,52,28],M.dark);
  panel([side*17.2,40,tz],[2.2,80,22],stone);
  for(let i=0;i<5;i++){
   const z=tz-12+i*6.1, h=110-i*9.5;
   panel([side*20.2,h/2+10,z],[3.6,h,5.5],i%2?sideStone:stone);
   panel([side*20.2,h/2+10,z+2.9],[.09,h-2,.12],i%2?M.violet:M.blue);
  }
  for(let i=0;i<4;i++){
   const z=tz-13+i*8.7, h=86-i*7;
   panel([side*25.2,h/2+8,z],[3.2,h,4.4],stone);
   panel([side*25.2,h/2+8,z+2.25],[.09,h-2,.1],M.blue);
  }
 }

 // rear support cluster and corners for a 360-degree silhouette.
 for(let i=-2;i<=2;i++){
  const x=i*6.2, h=88-Math.abs(i)*8;
  panel([x,h/2+7,tz+18],[3.8,h,4.8],stone);
  panel([x,h/2+7,tz+20.45],[.09,h-2,.11],i===0?M.blue:M.violet);
 }
 for(const sx of [-1,1]) for(const sz of [-1,1]){
  const x=sx*28,z=tz+sz*19,h=78;
  panel([x,h/2+6,z],[3.3,h,3.3],sideStone);
  panel([x,h/2+6,z+1.72],[.08,h-2,.1],sz>0?M.blue:M.violet);
 }

 // wraparound elevated rings inspired by the reference image.
 for(const spec of [[49,53,0xad72ff],[57,49,0x86ccff]]){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(spec[1],.18,8,140),new THREE.MeshBasicMaterial({color:spec[2]}));
  ring.rotation.x=Math.PI/2;ring.position.set(0,spec[0],tz);world.add(ring);
 }

 // emblem graphic reused on front and rear so both hero and reverse views feel intentional.
 const logoCanvas=document.createElement('canvas'); logoCanvas.width=512; logoCanvas.height=512;
 const ctx=logoCanvas.getContext('2d'); ctx.clearRect(0,0,512,512);
 ctx.strokeStyle='#b179ff'; ctx.lineWidth=17; ctx.shadowColor='#9e60ff'; ctx.shadowBlur=25;
 ctx.beginPath();
 for(let i=0;i<6;i++){
  const a=i*Math.PI/3-Math.PI/2; const x=256+195*Math.cos(a), y=256+195*Math.sin(a);
  if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
 }
 ctx.closePath(); ctx.stroke();
 ctx.lineWidth=37; ctx.strokeStyle='#d3a8ff'; ctx.lineCap='square';
 ctx.beginPath(); ctx.moveTo(202,158); ctx.lineTo(202,352); ctx.moveTo(310,158); ctx.lineTo(310,352); ctx.moveTo(202,256); ctx.lineTo(310,256); ctx.stroke();
 const tx=new THREE.CanvasTexture(logoCanvas); tx.colorSpace=THREE.SRGBColorSpace;
 const frontEmblem=new THREE.Mesh(new THREE.PlaneGeometry(17,17),new THREE.MeshBasicMaterial({map:tx,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
 frontEmblem.position.set(0,83,face+3.2); world.add(frontEmblem);
 const rearEmblem=new THREE.Mesh(new THREE.PlaneGeometry(11,11),new THREE.MeshBasicMaterial({map:tx,transparent:true,side:THREE.DoubleSide,depthWrite:false,opacity:.75}));
 rearEmblem.position.set(0,67,tz+22.3); rearEmblem.rotation.y=Math.PI; world.add(rearEmblem);
 sign('HEXCORE GAMING',[0,64,face+3.24],25,3);

 // entrance framing: taller, glassier, closer to the approved tower image.
 panel([0,57,face+2],[14,86,.35],stone);
 for(const y of [9.5,15,22]) panel([0,y,35],[13.4,.16,.72],y===15?champagne:M.violet);
 for(const x of [-6.8,6.8]) panel([x,11.2,36.15],[.2,22,.3],M.blue);
 panel([0,23,35.65],[14,.2,.52],M.white);
 for(const side of [-1,1]){
  panel([side*8.1,8.6,35.25],[4.1,17.2,2.7],stone);
  panel([side*5.84,9,36.8],[.15,16,.2],M.blue);
  panel([side*12,8.1,35.8],[3,16.2,2.1],stone);
  panel([side*12,13.1,36.92],[3.2,.14,.24],M.violet);
 }
 const flood=new THREE.PointLight(0x9b69ff,23,45,2); flood.position.set(0,12,51); world.add(flood);

 // front and side landscaping, water accents, and lit architectural pads.
 const waterMat=new THREE.MeshBasicMaterial({color:0x72bcff,transparent:true,opacity:.62,side:THREE.DoubleSide});
 for(const side of [-1,1]){
  for(const datum of [[30,60],[54,82],[78,110]]){
   const x=side*datum[0], z=datum[1];
   panel([x,1.1,z],[17,2.1,15],stone);
   panel([x,2.3,z],[17.1,.12,15.1],M.violet);
   tree(x+side*4,z,1.55);
   const waterfall=new THREE.Mesh(new THREE.PlaneGeometry(5,1.7),waterMat);
   waterfall.position.set(x-side*5,.85,z+7.65); world.add(waterfall);
  }
  for(const z of [28,45]){
   panel([side*34,1.0,z],[9,2,8],stone);
   panel([side*34,2.08,z],[9.1,.12,8.1],M.blue);
   tree(side*34,z,1.15);
  }
 }
}
function continuousPlaza(){
 // Plaza and tower share the same scene; walking through the entrance never teleports.
 box([0,-.36,99],[190,.69,136],M.floor);
 for(const x of [-32,-16,16,32])trim([x,.014,102],[.10,.023,123],M.blue);
 for(let z=48;z<166;z+=15)trim([0,.017,z],[174,.035,.075],z%2?M.violet:M.blue);
 for(let side of [-1,1]){
  // Open framing pylons are secondary to the central tower.
  for(let k=0;k<4;k++){
   const x=side*(46+k*13),z=69+k*25,h=20+(k%2)*9;
   panel([x,h/2,z],[2.6,h,3.2],M.dark);
   panel([x,h/2,z+1.75],[.10,h-1,.12],M.blue);
  }
  for(const z of [53,86,124])tree(side*43,z,1.45);
  // High curving transport-like light rings are architectural, not a train or spawn hub.
  const arc=new THREE.Mesh(new THREE.TorusGeometry(72,.2,6,90,Math.PI*.92),new THREE.MeshBasicMaterial({color:side===1?0x874cfb:0x6aa9ff}));
  arc.rotation.x=Math.PI/2;arc.rotation.z=side===1?.14:Math.PI+.14;arc.position.set(0,60,25);world.add(arc);
 }
 towerFacadeV13();
 // Keep the SAME walk-through entrance, no E prompt and no area transition.
 automaticEntrance(0,35);
 // Prominent celestial atmosphere built from lightweight geometry (not old assets).
 const planetMat=new THREE.MeshBasicMaterial({color:0x40316f,depthWrite:false});
 sphere([-185,168,165],69,planetMat);
 const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(72,32,20),new THREE.MeshBasicMaterial({color:0x735eff,side:THREE.BackSide,transparent:true,opacity:.13,depthWrite:false}));atmosphere.position.set(-185,168,165);world.add(atmosphere);
 sphere([171,154,208],21,new THREE.MeshBasicMaterial({color:0x5c518c,depthWrite:false}));
 const cloud=new THREE.Group();world.add(cloud);
 for(let i=0;i<42;i++){
  let a=i*.48,r=35+(i%6)*6,xx=125+Math.cos(a)*r,yy=140+Math.sin(a)*r;
  let star=sphere([xx,yy,225],1.3+(i%3)*.8,new THREE.MeshBasicMaterial({color:i%2?0x865cdd:0x597acb,transparent:true,opacity:.42,depthWrite:false}),cloud,6);
 }
 const sg=new THREE.BufferGeometry(),v=[];
 for(let i=0;i<260;i++){let a=i*2.399,r=90+(i*43)%260;v.push(Math.cos(a)*r,72+(i*61)%170,100+Math.sin(a)*r)}
 sg.setAttribute('position',new THREE.Float32BufferAttribute(v,3));world.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xc4bbff,size:1.35,sizeAttenuation:false})));
}

function spire(x,z,height,width=5,parent=world){
 panel([x,height*.43,z],[width,height*.86,width],M.dark,parent);
 panel([x,height*.89,z],[width*.63,height*.18,width*.63],M.wall,parent);
 let tip=new THREE.Mesh(new THREE.ConeGeometry(width*.28,height*.14,4),M.dark);tip.rotation.y=Math.PI/4;tip.position.set(x,height*.99,z);parent.add(tip);
 for(let s of [-1,1])panel([x+s*width*.32,height*.51,z+width*.501],[.07,height*.84,.055],s===1?M.blue:M.violet,parent);
}
function lounge(x,z,angle=0){let g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;world.add(g);panel([0,.48,0],[7,.85,2.5],M.wall,g);panel([0,1,1.03],[7,1,.46],M.dark,g);panel([0,.97,-1.15],[7,.045,.06],M.blue,g);panel([0,.22,-4],[4.5,.45,2],M.dark,g);panel([0,.47,-4],[4.5,.045,.07],M.violet,g)}
// V1.1 visual upgrade: newly authored minimalist architectural details.
function columnLight(x,z,y=17){
 panel([x,y,z],[1.5,y*2,1.5],M.dark);
 panel([x+.77,y,z],[.055,y*1.93,.11],M.blue);
 panel([x-.77,y,z],[.055,y*1.93,.11],M.violet);
}
function lightBench(x,z,rotation=0){
 const root=new THREE.Group();root.position.set(x,0,z);root.rotation.y=rotation;world.add(root);
 panel([0,.7,0],[5.8,.24,1.9],M.wall,root);
 panel([0,.49,.95],[5.8,.08,.11],M.blue,root);
 panel([0,1.3,-.83],[5.8,1.3,.18],M.dark,root);
 for(const dx of [-2.5,2.5])panel([dx,.39,0],[.23,.7,1.3],M.dark,root);
}
function atriumUpgrade(){
 // Large, clear structural planes rather than dense cyberpunk ornament.
 for(const side of [-1,1]){
  for(const z of [-28,-7,14,29])columnLight(side*31,z,19);
  for(const z of [-16,12])lightBench(side*17,z,side*Math.PI/2);
  panel([side*31.8,28,0],[.24,17,64],M.glass);
  panel([side*31.4,38.6,0],[.15,.15,64],M.blue);
  for(const y of [11,22]){
   panel([side*26.2,y,0],[10,.34,62],M.dark);
   panel([side*21.1,y+.19,0],[.14,.12,62],M.violet);
  }
  for(let j=0;j<4;j++){
   const zz=-26+j*17;
   panel([side*30,34,zz],[3,7,.12],M.wall);
   panel([side*30,34,zz+.08],[2.4,5.9,.055],M.glass);
  }
 }
 // Light-backed sculpture around the reception and holographic information sphere.
 for(const r of [6.4,9.6,13])torus([0,32,-26],r,.13,r===9.6?M.blue:M.violet,[-Math.PI/2,0,0]);
 for(const dx of [-11,11]){
  panel([dx,1.7,-13.9],[.18,3.4,2.8],M.dark);
  panel([dx,3.55,-13.9],[2.2,.09,2.8],M.blue);
 }
 panel([0,.07,-7],[4,.065,11],M.dark);
 for(const x of [-2.1,2.1])panel([x,.105,-7],[.09,.065,11],M.violet);
 const lamp=new THREE.PointLight(0x646aff,11,44,2);lamp.position.set(0,21,-26);world.add(lamp);
}
function towerUpgrade(){
 // Vertical nested fins are self-contained and newly generated from geometry.
 for(const side of [-1,1]){
  for(let j=0;j<7;j++){
   const x=side*(5+j*2.7);
   const hh=84-j*6;
   panel([x,hh/2+11,-34.85],[1.1,hh,.56],j%2?M.dark:M.wall);
   panel([x,hh/2+11,-34.48],[.055,hh-.5,.065],j%2?M.blue:M.violet);
  }
  for(const y of [14,26,40,58,78]){
   panel([side*20.5,y,-35],[.16,.11,8],M.blue);
  }
 }
 panel([0,12.7,-34.25],[25,.22,.9],M.violet);
 for(const y of [16,19,22])panel([0,y,-34.25],[24,.09,.06],y===19?M.blue:M.violet);
 for(const x of [-8,8])columnLight(x,-23,5);
 const entryGlow=new THREE.PointLight(0x7754e7,15,34,2);entryGlow.position.set(0,8,-29);world.add(entryGlow);
}
function lobbyAccents(){
 // The lobby is one grand sculptural atrium. A ceiling opening, balconies and recessed art panels create vertical depth.
 panel([0,39.5,0],[64,1.3,69],M.dark);
 for(let side of [-1,1]){
   panel([side*27,10.5,-3],[11,.55,59],M.wall);panel([side*27,20.5,-3],[11,.55,59],M.wall);
   for(let y of [10.85,20.85]){panel([side*20.8,y,-3],[.12,.13,58],M.blue);panel([side*26.5,y,-3],[.11,.09,58],M.violet)}
   for(let z of [-25,-6,13,27]){
     pillar(side*31,z,39,2.25);
     panel([side*31,21,z],[.12,38,.08],M.blue);
   }
   // Reception lounge, smaller than the main navigation concourse.
   lounge(side*22,17,side===1?Math.PI/2:-Math.PI/2);
   for(let z of [-16,16]){
     panel([side*29,6,z],[5,10,.28],M.glass);
     panel([side*29,11.1,z],[5,.12,.3],M.blue);
   }
 }
 for(let z of [-27,-14,0,14,29]){panel([0,39,z],[62,.2,.1],M.violet)}
 // Futuristic hanging ring luminaires and suspended orb.
 for(let radius of [7,11,16])torus([0,33-radius*.13,-26],radius,.09,radius===11?M.blue:M.violet,[-Math.PI/2,0,0]);
 for(let y of [13,17,21])torus([0,y,-27],3.6+(y-13)*.09,.043,M.blue,[.4+(y*.03),0,.2]);
 panel([0,29.5,-34.15],[34,1.4,.25],M.dark);sign('HEXCORE GAMING',[0,30,-33.9],27,2);
 floorMedallion(0,17,6.7);
 for(let x of [-15,15]){panel([x,1.2,-14],[3,2.4,3],M.dark);panel([x,2.45,-14],[3.1,.1,3.1],M.violet)}
}
function exteriorAccents(){
 // The city is deliberately unfinished: immediate plaza only, not the old city's models.
 for(let side of [-1,1]){
  for(let k=0;k<6;k++){
   let x=side*(15+k*4.5);spire(x,-55,64+k*9,2.6);
  }
  for(let k=0;k<4;k++)spire(side*(51+k*14),-108,27+k*17,6);
  panel([side*44,1.4,18],[21,2.7,14],M.dark);
  panel([side*44,2.8,18],[21,.1,14],M.violet);
  for(let z of [8,23,40]){tree(side*55,z,1.7)}
 }
 for(let k=0;k<10;k++){
   let z=25-k*7;panel([0,.06,z],[.13,.04,4],M.violet);
   for(let side of [-1,1])panel([side*11,.06,z],[.065,.05,4],M.blue);
 }
 for(let side of [-1,1]){
  for(let y of [24,42,64,85])panel([side*20,y,-35.2],[.1,.09,5.2],y===42?M.blue:M.violet);
 }
 floorMedallion(0,31,9);
}

// V2: original mobile-efficient simulated atrium architecture. No legacy scene imports.
function v2LobbyArchitecture(){
 // Suspended monumental ceiling, concentric light rims, and broad clean skylight.
 for(let x of [-31,-20,0,20,31]){
  panel([x,39.4,0],[x===0?1.0:.42,.48,68],M.dark);
  if(x!==0)panel([x,39.1,0],[.07,.075,67],Math.abs(x)===20?M.blue:M.violet);
 }
 for(let z of [-33,-21,-9,3,15,27,33]){
  panel([0,39.5,z],[65,.36,.65],M.dark);
  panel([0,39.24,z],[64,.07,.08],M.violet);
 }
 // Open lightwell with three lightweight suspended luminous rings.
 for(let r of [5,8,11])torus([0,35,-19],r,.10,r===8?M.blue:M.violet,[-Math.PI/2,0,0]);
 // Architectural lobby wings, with edge-lit informational surfaces.
 for(let side of [-1,1]){
  panel([side*30.9,6,8],[.35,10,17],M.wall);
  panel([side*30.62,6,8],[.09,8.7,15.5],M.glass);
  panel([side*30.48,10.6,8],[.13,.085,16],M.blue);
  for(let z of [-9,8,24]){
   panel([side*30.3,2.1,z],[.7,4.2,3.5],M.dark);
   panel([side*30.2,4.26,z],[.12,.09,3.6],M.violet);
  }
 }
 // Open circulation here. Department selection is available ONLY inside the elevator.

}
function v2TowerApproach(){
 // Restraint and negative space: sparse architectural flanking pylons.
 for(let side of [-1,1]){
  for(const z of [-9,17,41]){
   panel([side*34,4.4,z],[1.4,8.8,1.4],M.dark);
   panel([side*33.25,4.4,z],[.08,8.4,.14],M.violet);
  }
  panel([side*39,.13,29],[15,.23,43],M.wall);
  panel([side*39,.28,29],[14.5,.035,42],M.glass);
  for(const z of [10,47])tree(side*46,z,1.35);
 }
}
// V9: restrained, solid architectural forms that make the atrium feel less like wireframe.
function ambientVisitor(x,z,seed=0){
 const g=employee(x,z,seed);
 g.userData.walkPath=true;
 g.userData.homeX=x;g.userData.homeZ=z;
 g.userData.range=3.0+(seed%3)*1.2;
 g.userData.speed=.25+(seed%4)*.08;
 return g;
}
// V10: economical luminous skyline panels, detail is texture-based rather than heavy geometry.
function skylineTexture(seed=0){
 const c=document.createElement('canvas');c.width=768;c.height=512;const q=c.getContext('2d');
 const sky=q.createLinearGradient(0,0,0,512);sky.addColorStop(0,'#0a0c22');sky.addColorStop(.48,'#272154');sky.addColorStop(.8,'#2a174b');sky.addColorStop(1,'#111529');q.fillStyle=sky;q.fillRect(0,0,768,512);
 const glow=q.createRadialGradient(400,220,10,400,220,280);glow.addColorStop(0,'rgba(163,100,255,.23)');glow.addColorStop(1,'rgba(93,70,203,0)');q.fillStyle=glow;q.fillRect(0,0,768,512);
 q.fillStyle='rgba(166,190,255,.12)';q.beginPath();q.arc(seed?660:95,74,104,0,Math.PI*2);q.fill();q.strokeStyle='rgba(157,179,255,.6)';q.lineWidth=2;q.stroke();
 for(let i=0;i<85;i++){const x=((i*83+seed*127)%758)+5,y=((i*149+seed*43)%260)+8;q.fillStyle=i%7?'rgba(226,215,255,.48)':'rgba(208,155,255,.8)';q.fillRect(x,y,1.2,1.2)}
 for(let i=0;i<38;i++){const x=i*22+((i*13+seed*4)%13),h=85+((i*79+seed*31)%260),w=9+((i*7)%17);q.fillStyle=i%3===0?'#131a37':'#101329';q.fillRect(x,512-h,w,h);q.fillStyle=i%3?'rgba(174,105,255,.7)':'rgba(123,206,255,.62)';q.fillRect(x+w*.65,512-h+10,1.7,h-15)}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function skylineWindow(x,z,seed){
 const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=x<0?Math.PI/2:-Math.PI/2;world.add(g);
 const art=new THREE.Mesh(new THREE.PlaneGeometry(16,24),new THREE.MeshBasicMaterial({map:skylineTexture(seed),side:THREE.DoubleSide}));art.position.y=19;g.add(art);
 panel([0,19,-.09],[16.4,24.5,.16],M.dark,g);
 // Art in front of dark backing: no old-world geometry or texture imported.
 art.position.z=.16;
 for(const ax of [-8.2,8.2])panel([ax,19,.25],[.16,24.5,.24],M.blue,g);
 panel([0,31.4,.25],[16.5,.16,.24],M.violet,g);
}
function v10LobbyFinish(){
 const stone=new THREE.MeshPhysicalMaterial({color:0x252a3c,metalness:.55,roughness:.25,clearcoat:.8});
 const platinum=new THREE.MeshStandardMaterial({color:0x8790aa,metalness:.65,roughness:.22});
 // Strong visible reception area, staff remain visible over counter.
 panel([0,.44,-13.78],[9.8,.88,1.45],stone);
 panel([0,.93,-13.78],[10.2,.08,1.65],platinum);
 panel([0,.98,-13.78],[10.2,.06,1.7],M.violet);
 sign('HEXCORE GAMING',[0,.55,-12.98],6.8,.5);
 for(const x of [-3.1,0,3.1]){
  panel([x,1.75,-14.4],[1.8,1.15,.08],M.glass);
  panel([x,2.35,-14.4],[1.85,.07,.11],M.blue);
 }
 // Stylized light panels keep dark atmosphere legible without excessive neon traces.
 for(const side of [-1,1]){
  skylineWindow(side*32.18,3,side>0?1:0);
  for(const z of [-24,17]){
   panel([side*30.3,14,z],[1.5,23,3.5],stone);
   panel([side*29.45,14,z],[.08,22,3.4],platinum);
  }
  const light=new THREE.PointLight(0xd5d8ff,14,38,2);light.position.set(side*17,14,5);world.add(light);
  const warm=new THREE.PointLight(0x8d80ff,10,24,2);warm.position.set(side*22,8,-16);world.add(warm);
 }
 for(const z of [-18,12,29]){
  panel([0,.017,z],[55,.017,.05],platinum);
 }
 // Larger illuminated centerpiece above reception.
 const l=new THREE.PointLight(0xb7a4ff,16,26,2);l.position.set(0,15,-24);world.add(l);
}
function lobbyV9Dressing(){
 const stone=new THREE.MeshStandardMaterial({color:0x20243a,metalness:.52,roughness:.27});
 const silver=new THREE.MeshStandardMaterial({color:0x707b9b,metalness:.78,roughness:.23});
 // Architectural wall relief, illuminated alcoves and reception back-wall.
 for(const side of [-1,1]){
   for(const z of [-23,-7,9,25]){
     panel([side*31.1,12,z],[.65,16,8.2],stone);
     panel([side*30.65,12,z],[.08,14.5,6.5],M.glass);
     panel([side*30.48,19.2,z],[.12,.13,7.4],M.blue);
     panel([side*29.95,3.1,z],[1.25,6,1.2],silver);
   }
   for(const z of [-24,-6,12,26]){
     panel([side*23,.7,z],[9,.55,4],stone);
     panel([side*23,.99,z],[8.8,.07,3.8],silver);
     panel([side*23,1.05,z+1.85],[7.4,.07,.06],M.violet);
   }
   // Soft reflected light on marble, not a full-scene neon outline.
   const wash=new THREE.PointLight(0xb4baff,13,29,2);
   wash.position.set(side*18,8,-1);world.add(wash);
 }
 for(let z of [-29,-21,-13,-5,3,11,19,27]){
   panel([0,.03,z],[56,.025,.035],silver);
 }
 panel([0,6,-34.12],[37,12,.24],stone);
 panel([0,12.2,-33.98],[38,.14,.3],M.blue);
 // Subtle metallic display plinths flanking the welcome desk.
 for(const x of [-12,12]){
   panel([x,1.1,-14],[2.8,2.2,2.6],stone);
   panel([x,2.28,-14],[3.05,.14,2.85],silver);
   panel([x,2.4,-14],[2.65,.1,2.4],M.glass);
 }
}
function lobby(){
 const w=66,d=70;
 box([0,-.23,0],[w,.46,d],M.floor);
 box([0,20,-35],[w,40,1.2],M.wall);
 box([-33,20,0],[1.2,40,d],M.wall);box([33,20,0],[1.2,40,d],M.wall);
 for(let side of [-1,1]){
  for(let i=0;i<5;i++){const z=-25+i*13;box([side*28,15,z],[2,30,2],M.dark);trim([side*27.93,15,z+1.05],[.12,29.8,.06],M.violet)}
  for(let i=0;i<3;i++){let z=-24+i*21;tree(side*23,z,1.25);box([side*22,.3,z+3],[9,.5,2.5],M.dark);trim([side*22,.6,z+4.3],[9,.08,.07],M.blue)}
  box([side*20,11,-32.7],[20,19,.25],M.glass);
 }
 for(let i=0;i<9;i++){let x=-28+i*7;trim([x,-.004,0],[.038,.015,68],i%2?M.blue:M.violet)}
 for(let i=0;i<7;i++){let z=-30+i*10;trim([0,.01,z],[63,.018,.04],i%2?M.blue:M.violet)}
 box([0,.03,17],[12,.06,12],M.dark);hexcoreFloorLogo(0,17,6.4);
 // Lower, narrower desk: staff heads and bodies remain visible above the counter.
 box([0,.53,-14],[8.6,1.06,1.5],M.dark);
 box([0,1.08,-14],[8.8,.07,1.65],M.violet);
 sign('RECEPTION',[0,.78,-13.18],4.4,.35);
 // Public-facing employees, no legal/policy archive access in this lobby.
 for(const [x,z,i] of [[-2.6,-15.45,1],[0,-15.45,2],[2.6,-15.45,3],[-13,-21,4],[13,-21,5],[-20,9,6],[20,9,7],[-18,24,8],[18,24,9]])employee(x,z,i);
 lightBench(-17,-6,.35);lightBench(17,-6,-.35);lightBench(-17,24,-.3);lightBench(17,24,.3);
 ambientVisitor(-12,11,10);ambientVisitor(12,11,11);ambientVisitor(-8,-2,12);ambientVisitor(9,-2,13);
 interact('Reception — floor directions',[0,1.4,-14],()=>openReception(),5);
 hologram(0,12,-27);sign('WELCOME TO HEXCORE',[0,25,-34.2],23,2);
 for(let side of [-1,1]){box([side*29,20,-25],[.35,35,4],M.dark);trim([side*29,20,-22.9],[.07,34,.08],M.violet);box([side*22,7,-24],[.6,12,.8],M.dark)}
 // All department information belongs on its respective floor, never the lobby.
 floorPortalNexus(true);
 continuousPlaza();
 for(let x of [-25,25]){let lamp=new THREE.PointLight(0x8f65ff,34,24,2);lamp.position.set(x,7,-8);world.add(lamp)}
 for(let x of [-18,18]){let uplight=new THREE.PointLight(0xaebfff,10,12,2);uplight.position.set(x,.8,18);world.add(uplight)}
 lobbyAccents();atriumUpgrade();v2LobbyArchitecture();lobbyV9Dressing();v10LobbyFinish();
}
function openReception(){
 setPanel('<div class="eyebrow">HEXCORE / RECEPTION</div><h2>WELCOME TO HEXCORE TOWER</h2><p>Each website department occupies its own floor. Use the floor transit portal in the lobby to choose your destination.</p><p>Company information and questions are handled by employees on their respective floors. The front entrance doors lead out to the plaza.</p><button id="receptionClose">THANK YOU</button>');
 $('receptionClose').onclick=()=>{$('panel').classList.add('hidden');if(active&&!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{})};
}

function floorRoom(data){box([0,-.2,0],[65,.4,69],M.floor);box([0,11,-34],[65,22,1],M.wall);box([-32.5,11,0],[1,22,69],M.wall);box([32.5,11,0],[1,22,69],M.wall);for(let i=0;i<7;i++){let x=-28+i*9;trim([x,.012,0],[.045,.025,67],i%2?M.blue:M.violet)}for(let side of [-1,1]){for(let j=0;j<5;j++){let z=-25+j*12;box([side*29,10,z],[2,20,2],M.dark);trim([side*27.9,10,z],[.08,19,.06],j%2?M.blue:M.violet)}}box([0,2.2,-25],[23,4.5,1],M.dark);sign(data.title,[0,4,-24.35],24,2.1);sign(data.summary.slice(0,54).toUpperCase(),[0,1.7,-24.35],25,1);hexcoreFloorLogo(0,18,4.4);for(let side of [-1,1]){tree(side*22,-18,1.2);box([side*20,.35,9],[15,.7,8],M.dark);trim([side*20,.72,13],[15,.07,.09],M.blue);panel([side*20,3.7,10.8],[11,5.8,.22],M.glass);panel([side*20,6.7,10.85],[11.2,.12,.3],side===1?M.blue:M.violet);sign('QUESTIONS',[side*20,8.45,10.98],6.8,.8);employee(side*20,2,side);employee(side*17,-3,side+2);employee(side*23,-8,side+4);employee(side*15,8,side+6);
 interact('Speak to '+data.title+' staff',[side*20,1.5,2],()=>openDepartmentEmployee(data.id),4.4);
 interact('Ask '+data.title+' staff',[side*17,1.5,-3],()=>openDepartmentEmployee(data.id),4.4)}floorPortalNexus();portal('DEPARTMENT CONSOLE',0,-18,()=>openService(data.id));if(data.id==='legal'){for(let i=0;i<4;i++)representative(-22+i*14,1,i);portal('POLICY Q & A',-21,-7,()=>openKnowledge());}if(data.id==='admin'){portal('CONTENT EDITOR',0,-7,()=>openAdmin())}for(let x of [-23,23]){let l=new THREE.PointLight(0x9862ff,22,24,2);l.position.set(x,6,-14);world.add(l)}for(let x of [-12,12]){let floorLight=new THREE.PointLight(0xc9d6ff,6,10,2);floorLight.position.set(x,.8,18);world.add(floorLight)}}
function exterior(){lobby()} // Legacy alias: same continuous lobby/plaza scene; no exterior teleport geometry.

function resetWorld(){while(world.children.length){let c=world.children[0];world.remove(c);c.traverse(o=>{o.geometry?.dispose();if(o.material && !Object.values(M).includes(o.material)){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(mat=>{mat.map?.dispose();mat.dispose()})}})}entities=[];animatedDoors=[];staffActors=[];scene.fog.density=.0031}
let floor='lobby',yaw=0,pitch=0,keys={},pos=new THREE.Vector3(0,1.8,21),active=false,nearest=null,quality='low';
function travel(id){closePortalSelector();floor=id;resetWorld();if(id==='outside'){floor='lobby';lobby();pos.set(0,1.8,48);yaw=0}else if(id==='lobby'){lobby();pos.set(0,1.8,21);yaw=0}else{floorRoom(floors.find(f=>f.id===id)||floors[0]);pos.set(0,1.8,21);yaw=0}pitch=0;camera.position.copy(pos);camera.rotation.set(pitch,yaw,0);$('zone').textContent=id==='outside'?'HEXCORE // EXTERIOR':(floors.find(f=>f.id===id)?.label||'TOWER').toUpperCase();hideAll();}
function hideAll(){const hadOverlay=!$('panel').classList.contains('hidden')||!$('nav').classList.contains('hidden');$('panel').classList.add('hidden');$('nav').classList.add('hidden');keys={};if(hadOverlay&&document.pointerLockElement===renderer.domElement)document.exitPointerLock()}
function setPanel(html){$('panelBody').innerHTML=html;$('panel').classList.remove('hidden');keys={};if(document.pointerLockElement)document.exitPointerLock()}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function openService(id){const c=content(id);const qaLink=id==='legal'?'<button id="seeQA">OPEN PRESERVED POLICY Q & A</button>':'';setPanel(`<div class="eyebrow">HEXCORE / ${esc(id.toUpperCase())}</div><h2>${esc(c.headline)}</h2><p>${esc(c.description)}</p><div class="directory-item"><h3>INFORMATION</h3><p>${esc(c.updates)}</p></div>${qaLink}<p class="small">This is an editable content location. Unpublished contact links, sales, and submissions are not represented as live services.</p>`);$('seeQA')?.addEventListener('click',()=>openKnowledge())}
function openDepartmentEmployee(id){
 const c=content(id),f=floors.find(f=>f.id===id);
 const safe='Official HexCore wording for this answer will be provided later. This placeholder exists so the department can already function while final copy is being approved.';
 const sets={
  lobby:[
   ['Where should I go first?','Start by using the floor transit portal to visit the department you need. Reception is here to guide visitors through the tower.'],
   ['What is HexCore Tower?','HexCore Tower is the company website presented as a playable digital headquarters.'],
   ['Can I get all information in the lobby?',safe],
   ['Will the holographic AI answer questions later?','Yes. The after-hours holographic AI is planned to provide tower-wide guidance later.']
  ],
  company:[
   ['What is HexCore Gaming?',c.description],
   ['Where will company announcements appear?','Official announcements and company news will appear on this floor.'],
   ['What values define the company?',safe],
   ['Is all company information final?',safe]
  ],
  games:[
   ['What games are being developed?',c.description],
   ['Where will demos and media appear?','Official demos, trailers, screenshots, and progress updates are intended to appear on this floor.'],
   ['What stage is each game at?',safe],
   ['Can I play arcade versions here later?','Yes. The wider site plan includes playable arcade-style experiences before full Unreal demos.']
  ],
  support:[
   ['How do I contact HexCore Gaming Support?','Post in the Support channel on the official Discord server at https://discord.gg/WKC53ZJsH7 where your issue is more likely to be seen. Or email hexcoregaming@proton.me with Support in the subject line. There is no dedicated support email.'],
   ['Where do I report a bug?','For now, use the Support channel in the official Discord server or email hexcoregaming@proton.me with Support in the subject line.'],
   ['Can I send feedback or suggestions?','Yes. Feedback and suggestions can be sent through the same support routes until a dedicated feedback flow is added.'],
   ['Do you have a separate support inbox?','No. HexCore Gaming does not currently have a dedicated support email address.']
  ],
  legal:[
   ['Where is the preserved Legal Q&A?','Use the Policy Q & A access point on this floor to open the preserved 41 legal questions and answers.'],
   ['Are these legal answers final legal documents?','The preserved answers are company statements, not a substitute for formally issued legal documents.'],
   ['Where are the full policies?',safe],
   ['Can I ask a representative directly?','Yes. The legal representatives on this floor provide the preserved authored answers.']
  ],
  community:[
   ['Where can I find the community?','Community channels, media links, and public-facing platforms will be listed on this floor as they are finalized.'],
   ['Will Discord and other platforms appear here?','Yes. Community and media destinations belong on this floor.'],
   ['Can I find press resources here?',safe],
   ['Are all public links active yet?','Not all public links are configured yet.']
  ],
  business:[
   ['What belongs in this department?','Business inquiries, careers, partnerships, hiring, and funding-related public information belong on this floor.'],
   ['Are there active job postings?','No active job postings or solicitations are represented at this time.'],
   ['How do partnerships work?',safe],
   ['Where should a business inquiry go?',safe]
  ],
  hardware:[
   ['What is this department for?','This floor is for HexCore hardware concepts, controllers, merchandise, and future store-related information.'],
   ['Can I buy products yet?','No products are being offered for sale here at this time.'],
   ['What hardware is planned?',c.description],
   ['When will merchandise be available?',safe]
  ],
  admin:[
   ['What is this office?','This is the private administrative office for local content management and future admin functions.'],
   ['Can visitors use the admin systems?','No. Administrative tools are intended for HexCore management use only.'],
   ['Does this publish live changes automatically?','No. The current free workflow still requires publishing through GitHub.'],
   ['Will more admin abilities be added later?','Yes. Expanded editing and management features are planned for later versions.']
  ]
 };
 const questions=(sets[id]||[['What does this department handle?',c.description],['What is the latest information?',c.updates],['Is more information coming later?',safe],['Can I get an official answer later?',safe]]);
 const html=`<div class="eyebrow">HEXCORE / DEPARTMENT EMPLOYEE</div>
 <h2>${esc(f?.title||c.headline)}</h2><p>How can I help you?</p>
 <div class="floor-buttons">${questions.map((q,i)=>`<button data-staffq="${i}">${esc(q[0])}</button>`).join('')}</div>
 <div id="staffAnswer" class="directory-item hidden" aria-live="polite"></div>
 <p class="small">These placeholder questions establish each department now. Final official wording can be replaced later with HexCore-approved answers.</p>`;
 setPanel(html);
 $('panelBody').querySelectorAll('[data-staffq]').forEach(b=>b.onclick=()=>{
 const q=questions[Number(b.dataset.staffq)],answer=$('staffAnswer');
 answer.innerHTML=`<h3>${esc(q[0])}</h3><p>${esc(q[1])}</p>`;
 answer.classList.remove('hidden');
 });
}
function openKnowledge(ai=false){const title=ai?'HEXCORE HOLOGRAPHIC ASSISTANT':'LEGAL KNOWLEDGE ARCHIVE';let html=`<div class="eyebrow">HEXCORE / VERIFIED SOURCE CONTENT</div><h2>${title}</h2><p>${ai?'The after-hours assistant searches the preserved NPC dialogue library.':'All original NPC questions and answers are preserved word for word.'}</p><input id="qaSearch" placeholder="Search all questions and answers…" aria-label="Search knowledge archive"><div id="qaResults"></div>`;setPanel(html);const draw=()=>{let term=$('qaSearch').value.toLowerCase().trim();let items=groups.flatMap(g=>g.questions.map(q=>({...q,who:g.name,title:g.title}))).filter(q=>!term||(`${q.question} ${q.answer} ${q.title}`).toLowerCase().includes(term));$('qaResults').innerHTML=`<div class="category">${items.length} MATCHING ANSWERS</div>`+items.map((q,i)=>`<div class="qa-item"><button data-qa="${i}">${esc(q.question)} ▾</button><div class="qa-answer hidden" id="qa-${i}"><span class="subtle">${esc(q.who)} • ${esc(q.title)}</span><p>${esc(q.answer)}</p></div></div>`).join('');$('qaResults').querySelectorAll('[data-qa]').forEach(b=>b.onclick=()=>$("qa-"+b.dataset.qa).classList.toggle('hidden'))};$('qaSearch').addEventListener('input',draw);draw()}
// V3: Department representatives use their original, unaltered dialogue source.
function openRepresentative(index){
 const person=groups[index];if(!person)return;
 setPanel(`<div class="eyebrow">HEXCORE / EMPLOYEE INTERACTION</div><h2>${esc(person.name)}</h2><p class="subtle">${esc(person.title)}</p><p>Select a question to hear this representative's preserved answer.</p><div id="representativeQuestions" class="floor-buttons"></div>`);
 const holder=$('representativeQuestions');
 person.questions.forEach((q,i)=>{
  const b=document.createElement('button');b.textContent=q.question;b.onclick=()=>{
   setPanel(`<div class="eyebrow">HEXCORE / ${esc(person.title)}</div><h2>${esc(person.name)}</h2><div class="directory-item"><h3>${esc(q.question)}</h3><p>${esc(q.answer)}</p></div><button id="backToEmployee">BACK TO QUESTIONS</button>`);
   $('backToEmployee').onclick=()=>openRepresentative(index);
  };holder.appendChild(b);
 });
}
function representative(x,z,index){
 const person=groups[index];if(!person)return;
 employee(x,z,index);
 panel([x,0.62,z-1.15],[2.9,1.2,.68],M.dark);
 panel([x,1.26,z-1.15],[2.95,.07,.72],index%2?M.blue:M.violet);
 sign(person.name.toUpperCase(),[x,3.02,z-.9],4.6,.55);
 interact('Speak with '+person.name,[x,1.6,z],()=>openRepresentative(index),5.2);
}
function openElevator(){setPanel(`<div class="eyebrow">HEXCORE TOWER / PORTAL TRANSIT</div><h2>PORTAL TRANSIT</h2><p>Use the in-world portal gates in the lobby to travel directly to each floor without leaving mouse-look.</p><button id="transitClose">UNDERSTOOD</button>`);$('transitClose').onclick=()=>{$('panel').classList.add('hidden');if(active&&!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{})}}
function openAdmin(){let html=`<div class="eyebrow">HEXCORE / PRIVATE OFFICE</div><h2>CONTENT MANAGEMENT</h2><p class="subtle">FREE LOCAL EDITOR: edits are saved in this browser. Export JSON to publish manually. This is not secure public-server administration.</p><label>DEPARTMENT</label><select id="editDept">${floors.filter(f=>f.id!=='admin').map(f=>`<option value="${f.id}">${esc(f.label)}</option>`).join('')}</select><label>HEADLINE</label><input id="editHeadline"><label>DESCRIPTION</label><textarea id="editDesc"></textarea><label>UPDATES / DISPLAY CONTENT</label><textarea id="editUpdates"></textarea><div class="actions"><button id="saveEdit">SAVE LOCALLY</button><button id="exportEdit">EXPORT CHANGES</button><button id="importEdit">IMPORT CHANGES</button></div><input type="file" id="importFile" accept="application/json" class="hidden"><p id="editStatus" class="status"></p><p class="small">Admin publication to GitHub, asset uploads, permanent multiplayer state and secure identity checks are not implemented in this build. Existing Q&A is protected from edits in this interface.</p>`;setPanel(html);function loadFields(){let id=$('editDept').value,c=content(id);$('editHeadline').value=c.headline;$('editDesc').value=c.description;$('editUpdates').value=c.updates};$('editDept').onchange=loadFields;loadFields();$('saveEdit').onclick=()=>{let id=$('editDept').value;edits[id]={headline:$('editHeadline').value,description:$('editDesc').value,updates:$('editUpdates').value};localStorage.setItem('hexcore_edits_v1',JSON.stringify(edits));$('editStatus').textContent='Saved locally on this device.'};$('exportEdit').onclick=()=>{let blob=new Blob([JSON.stringify({format:'hexcore-content-v1',edits},null,2)],{type:'application/json'});let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hexcore-content.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};$('importEdit').onclick=()=>$('importFile').click();$('importFile').onchange=async e=>{try{let d=JSON.parse(await e.target.files[0].text());if(d.format!=='hexcore-content-v1')throw Error('Unknown format');edits=d.edits||{};localStorage.setItem('hexcore_edits_v1',JSON.stringify(edits));loadFields();$('editStatus').textContent='Imported and saved locally.'}catch(err){$('editStatus').textContent='Import failed: '+err.message}}}
$('closePanel').onclick=()=>{$('panel').classList.add('hidden');if(active&&!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{})};$('closeNav').onclick=()=>{$('nav').classList.add('hidden');if(active&&!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{})};$('menuBtn').onclick=()=>{hideAll();$('nav').classList.remove('hidden')};$('settingsBtn').onclick=()=>{hideAll();setPanel(`<h2>GRAPHICS & CONTROLS</h2><p>Adaptive rendering supports mobile and desktop devices.</p><select id="liveQuality"><option value="low">LOW / MOBILE</option><option value="medium">BALANCED</option><option value="high">HIGH</option></select><button id="applyQuality">APPLY</button><p>Desktop: WASD, mouse, Shift, E. Mobile: dual joysticks, USE and RUN.</p>`);$('liveQuality').value=quality;$('applyQuality').onclick=()=>{quality=$('liveQuality').value;resizeRenderer();$('panel').classList.add('hidden')}};$('returnLobby').onclick=()=>travel('lobby');$('floorButtons').innerHTML=floors.map(f=>`<div class="directory-item">${esc(f.label)}</div>`).join('')+'<div class="directory-item">OUTSIDE • EXIT THROUGH LOBBY</div>';
function resizeRenderer(){let dpr=quality==='low'?Math.min(devicePixelRatio,1):quality==='medium'?Math.min(devicePixelRatio,1.35):Math.min(devicePixelRatio,1.7);renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}window.addEventListener('resize',resizeRenderer);
let prev=performance.now(),movePad={x:0,y:0},lookPad={x:0,y:0},running=false,mobile=matchMedia('(pointer:coarse)').matches;
function initPad(id,target){let el=$(id),nub=el.querySelector('.nub'),activeId=null;function update(e){let b=el.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;let dx=(e.clientX-cx)/(b.width/2-22),dy=(e.clientY-cy)/(b.height/2-22);let len=Math.max(1,Math.hypot(dx,dy));target.x=dx/len;target.y=dy/len;nub.style.transform=`translate(${target.x*33}px,${target.y*33}px)`}el.onpointerdown=e=>{activeId=e.pointerId;el.setPointerCapture(activeId);update(e)};el.onpointermove=e=>{if(activeId===e.pointerId)update(e)};const end=e=>{if(activeId!==e.pointerId)return;activeId=null;target.x=target.y=0;nub.style.transform='translate(0,0)'};el.onpointerup=end;el.onpointercancel=end}initPad('movePad',movePad);initPad('lookPad',lookPad);$('interactTouch').onclick=()=>{if(!portalSelection)nearest?.cb()};$('runTouch').onpointerdown=()=>running=true;$('runTouch').onpointerup=$('runTouch').onpointercancel=()=>running=false;
window.addEventListener('keydown',e=>{if(portalSelection){if(portalInput(e.code))e.preventDefault();return}if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(['KeyW','KeyA','KeyS','KeyD','Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(!$('panel').classList.contains('hidden')||!$('nav').classList.contains('hidden')){if(e.code==='Escape')hideAll();return}keys[e.code]=true;if(e.code==='KeyE'&&!e.repeat)nearest?.cb();if(e.code==='Escape')$('menuBtn').click()});window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',()=>{keys={};running=false});renderer.domElement.addEventListener('click',()=>{if(active&&!mobile&&$('panel').classList.contains('hidden')&&$('nav').classList.contains('hidden'))renderer.domElement.requestPointerLock?.()});window.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){yaw-=e.movementX*.0023;pitch=Math.max(-1.32,Math.min(1.32,pitch-e.movementY*.0023))}});
function tick(now){requestAnimationFrame(tick);let dt=Math.min((now-prev)/1000,.045);prev=now;if(!active)return;if(!portalSelection&&$('panel').classList.contains('hidden')&&$('nav').classList.contains('hidden')){yaw-=lookPad.x*dt*2.5;pitch=Math.max(-1.3,Math.min(1.3,pitch-lookPad.y*dt*2));let forward=(Number(!!keys.KeyW)-Number(!!keys.KeyS))-movePad.y;let strafe=(Number(!!keys.KeyD)-Number(!!keys.KeyA))+movePad.x;let len=Math.hypot(forward,strafe);if(len>.05){const speed=(keys.ShiftLeft||keys.ShiftRight||running?11:6.5)*dt/Math.max(1,len);const forwardX=-Math.sin(yaw),forwardZ=-Math.cos(yaw);const rightX=Math.cos(yaw),rightZ=-Math.sin(yaw);let nx=pos.x+(forwardX*forward+rightX*strafe)*speed;let nz=pos.z+(forwardZ*forward+rightZ*strafe)*speed;if(floor==='lobby'){const exteriorSide=nz>36;pos.x=Math.max(exteriorSide?-87:-30,Math.min(exteriorSide?87:30,nx));pos.z=Math.max(-31,Math.min(155,nz));}else{pos.x=Math.max(-30,Math.min(30,nx));pos.z=Math.max(-31,Math.min(31,nz))}}}camera.position.copy(pos);camera.rotation.set(pitch,yaw,0);
if(floor==='lobby')$('zone').textContent=pos.z>36?'HEXCORE // EXTERIOR PLAZA':'G • MAIN LOBBY';
for(const g of staffActors){const ph=g.userData.phase||0;g.position.y=(g.userData.baseY||0)+Math.sin(now*.0012+ph)*.035;g.rotation.y=(g.userData.turn||0)+Math.sin(now*.00065+ph)*.09;
 if(g.userData.walkPath){const t=now*.001*g.userData.speed+ph;
 g.position.x=g.userData.homeX+Math.sin(t)*g.userData.range;
 g.position.z=g.userData.homeZ+Math.cos(t)*g.userData.range*.65;
 g.rotation.y=Math.atan2(Math.cos(t),-Math.sin(t));}
}
for(const d0 of animatedDoors){const dist=pos.distanceTo(d0.center),target=dist<8.2?1:0;d0.open+= (target-d0.open)*Math.min(1,dt*4.8);d0.left.position.x=-(d0.rest||1.55)-d0.open*d0.travel; d0.right.position.x=(d0.rest||1.55)+d0.open*d0.travel;}
nearest=null;let d=1000;for(let ent of entities){let dist=pos.distanceTo(ent.pos);if(dist<ent.range&&dist<d){nearest=ent;d=dist}}$('prompt').classList.toggle('hidden',!nearest||!$('panel').classList.contains('hidden')||!$('nav').classList.contains('hidden')||!!portalSelection);if(nearest)$('prompt').textContent=(mobile?'USE':'[ E ]')+'  '+nearest.name;renderer.render(scene,camera)}requestAnimationFrame(tick);
$('enter').onclick=()=>{quality=$('quality').value==='auto'?(mobile?'low':(devicePixelRatio>1.5?'medium':'high')):$('quality').value;resizeRenderer();$('loading').classList.add('hidden');$('entry').classList.add('hidden');$('hud').classList.remove('hidden');if(mobile)$('mobileUI').classList.remove('hidden');active=true;travel('lobby');if(!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{});try{localStorage.setItem('hexcore_character',JSON.stringify(selected))}catch{}};
try{Object.assign(selected,JSON.parse(localStorage.getItem('hexcore_character')||'{}'));for(let name of ['species','body']){let match=$(name).querySelector(`[data-value="${selected[name]}"]`);if(match)match.click()}}catch{}
resizeRenderer();$('loading').classList.add('hidden');$('entry').classList.remove('hidden');
