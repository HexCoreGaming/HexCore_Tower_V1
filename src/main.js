import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {installRuntime} from './engine/runtime.js';
import {buildExteriorV6,updateExteriorV6} from './exterior-v6.js?v=6.0.29';
import {createStylizedEmployee} from './stylized-characters.js';
import { adminStaffDialogue } from '../data/preservedLegalDialogue.js';
import { baseContent } from '../data/siteContent.js';
import { npcDepartments, courtyardGuide, npcSharedQuestions } from '../data/npcContent.js';
import {managedContent, managedReady} from './managed-content.js';

// CLEAN REBUILD: This module creates all geometry from scratch. No original world imports.
const $=id=>document.getElementById(id);
const EYE_HEIGHT=2.7;
const NPC_SCALE=1.08; // In-world eye height 2.7; NPC head ~2.8, not towering overhead.
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
const groups=adminStaffDialogue; // Preserved verbatim source data; V3 interaction layer reads it without modification.
managedReady.then(()=>{for(const g of groups){const override=managedContent.faq['preserved:'+g.id];if(Array.isArray(override))g.questions=override;}});
// The exact original 41 Q&A entries are the only retained old-world data.


let edits={};try{edits=JSON.parse(localStorage.getItem('hexcore_edits_v1')||'{}')}catch{};
const content=id=>({...baseContent[id],...(managedContent.departments[id]||{}),...(edits[id]||{})});
let selected={species:'human',body:'male',preset:'standard',outfit:'casual'};
function updateAppearanceButtons(){
 for(const [name,key] of [['species','species'],['body','body'],['presets','preset'],['outfits','outfit']]){
  const el=$(name);if(!el)continue;
  el.querySelectorAll('button').forEach(btn=>btn.classList.toggle('active',btn.dataset.value===selected[key]));
 }
 drawCharacterPreview();
}
for(const [name,key] of [['species','species'],['body','body'],['presets','preset'],['outfits','outfit']]){
 $(name).querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{selected[key]=btn.dataset.value;updateAppearanceButtons();}));
}
$('toggleCreator').onclick=()=>{const showing=$('creatorContent').classList.toggle('hidden');$('toggleCreator').setAttribute('aria-expanded',String(!showing));if(!showing)drawCharacterPreview();};
// Lightweight 2D preview keeps character selection responsive before WebGL is ready.
// Character creator now renders the SAME modeled style as the in-world NPCs.
// This is a real Three.js model preview, not the former flat rectangle drawing.
let previewYaw=.14, previewRenderer=null, previewScene=null, previewCamera=null, previewModel=null;
function drawCharacterPreview(){
 const cv=$('characterPreview');if(!cv || !cv.isConnected)return;
 if(!previewRenderer){
  previewRenderer=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true,powerPreference:'low-power'});
  previewRenderer.outputColorSpace=THREE.SRGBColorSpace;
  previewRenderer.setPixelRatio(Math.min(devicePixelRatio,1.3));
  previewRenderer.setSize(cv.width,cv.height,false);
  previewScene=new THREE.Scene();previewScene.background=new THREE.Color(0x12172b);
  previewCamera=new THREE.PerspectiveCamera(40,cv.width/cv.height,.1,50);
  previewCamera.position.set(0,1.52,5.5);previewCamera.lookAt(0,1.43,0);
  const ambient=new THREE.HemisphereLight(0xd9e7ff,0x24142e,3.3);previewScene.add(ambient);
  const key=new THREE.DirectionalLight(0xe4daff,4.2);key.position.set(3.4,6,6.5);previewScene.add(key);
  const rim=new THREE.DirectionalLight(0x8366ff,3.3);rim.position.set(-3,4,-5);previewScene.add(rim);
  const floorMat=new THREE.MeshStandardMaterial({color:0x282943,metalness:.48,roughness:.25});
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.6,.20,48),floorMat);
  base.position.y=-.15;previewScene.add(base);
 }
 if(previewModel){previewScene.remove(previewModel);previewModel.traverse(ob=>{
   if(ob.geometry)ob.geometry.dispose();if(ob.material){const mm=Array.isArray(ob.material)?ob.material:[ob.material];mm.forEach(m=>m.dispose());}
  });}
 const skinColors=[0xb6876a,0x97634d,0x765044,0xe6ba95];
 const pick=selected.preset==='slim'?1:selected.preset==='tall'?2:selected.preset==='athletic'?3:0;
 const outfitIndex={casual:1,executive:2,techwear:3,cybernetic:4};
 previewModel=createStylizedEmployee(THREE,{index:outfitIndex[selected.outfit]??1,elf:selected.species==='elf',female:selected.body==='female',
  role:selected.outfit==='cybernetic'?'Security':'Staff',skinColor:skinColors[pick],hairColor:selected.body==='female'?0x21192b:0x282033});
 if(selected.preset==='tall')previewModel.scale.set(1,1.08,1);
 else if(selected.preset==='slim')previewModel.scale.set(.89,1,.89);
 else if(selected.preset==='athletic')previewModel.scale.set(1.07,1,1.07);
 previewModel.rotation.y=previewYaw;
 previewScene.add(previewModel);previewRenderer.render(previewScene,previewCamera);
}
let dragPreview=null;const pv=$('characterPreview');pv.addEventListener('pointerdown',e=>{dragPreview=e.clientX;pv.setPointerCapture(e.pointerId)});pv.addEventListener('pointermove',e=>{if(dragPreview===null)return;previewYaw+=(e.clientX-dragPreview)*.017;dragPreview=e.clientX;drawCharacterPreview();});pv.addEventListener('pointerup',()=>dragPreview=null);pv.addEventListener('pointercancel',()=>dragPreview=null);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setClearColor(0x090d1c);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.72;document.body.appendChild(renderer.domElement);renderer.domElement.style.position='fixed';renderer.domElement.style.inset='0';renderer.domElement.style.zIndex='0';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x090c18);scene.fog=new THREE.FogExp2(0x101326,.0031);
// V6.0.29 engine foundation: registered without changing the existing world or controls.
const hexcoreRuntime=installRuntime({renderer,scene});
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.08,1100);camera.rotation.order='YXZ';
const lighting=new THREE.AmbientLight(0xd5dcff,2.05);scene.add(lighting);
const hemi=new THREE.HemisphereLight(0xb1b2ff,0x272132,2.45);scene.add(hemi);
const lobbyFill=new THREE.DirectionalLight(0xd6dfff,1.1);lobbyFill.position.set(20,50,18);scene.add(lobbyFill);
function marbleTexture(){
 const c=document.createElement('canvas');c.width=c.height=1024;
 const g=c.getContext('2d');let seed=28051;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 g.fillStyle='#040507';g.fillRect(0,0,1024,1024);
 const bg=g.createLinearGradient(0,0,1024,1024);bg.addColorStop(0,'rgba(26,28,34,.25)');bg.addColorStop(.55,'rgba(12,14,20,.0)');bg.addColorStop(1,'rgba(38,40,48,.22)');g.fillStyle=bg;g.fillRect(0,0,1024,1024);
 for(let k=0;k<58;k++){
  let x=rand()*1260-120,y=rand()*1024,angle=-.72+(rand()-.5)*.26,len=240+rand()*640;
  g.beginPath();g.moveTo(x,y);
  for(let j=1;j<=18;j++){let t=j/18;g.lineTo(x+Math.cos(angle)*len*t+Math.sin(t*15+k)*4.5,y+Math.sin(angle)*len*t+Math.cos(t*11+k)*3.5)}
  g.strokeStyle=k%7===0?'rgba(210,214,224,.26)':k%3===0?'rgba(142,148,162,.13)':'rgba(92,96,108,.10)';
  g.lineWidth=k%7===0?2.2:1.1;g.stroke();
 }
 for(let i=0;i<1800;i++){let x=rand()*1024,y=rand()*1024;g.fillStyle=`rgba(255,255,255,${rand()*.018})`;g.fillRect(x,y,1+rand()*1.6,1+rand()*1.6)}
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(.85,.85);tx.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return tx;
}
const marbleMap=marbleTexture();
function stableFloorTexture(path,repeatX=1,repeatY=1){
 const tx=new THREE.TextureLoader().load(path);
 tx.colorSpace=THREE.SRGBColorSpace;
 tx.wrapS=tx.wrapT=THREE.RepeatWrapping;
 tx.repeat.set(repeatX,repeatY);
 tx.minFilter=THREE.LinearMipmapLinearFilter;
 tx.magFilter=THREE.LinearFilter;
 tx.generateMipmaps=true;
 tx.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());
 return tx;
}
const lobbyFloorMap=stableFloorTexture('./reference/v603/floor_tile_base.png',3.2,3.4);
const exteriorFloorMap=stableFloorTexture('./reference/v603/floor_tile_base.png',5.2,5.2);
const M={dark:new THREE.MeshStandardMaterial({color:0x0a0e1b,metalness:.82,roughness:.19}),floor:new THREE.MeshBasicMaterial({color:0xffffff,map:lobbyFloorMap,depthWrite:true}),exteriorFloor:new THREE.MeshBasicMaterial({color:0xffffff,map:exteriorFloorMap,depthWrite:true}),wall:new THREE.MeshStandardMaterial({color:0x283147,metalness:.55,roughness:.24}),glass:new THREE.MeshPhysicalMaterial({color:0x304a88,metalness:.15,roughness:.04,transparent:true,opacity:.28,side:THREE.DoubleSide,depthWrite:false,clearcoat:1,clearcoatRoughness:.04,transmission:0}),violet:new THREE.MeshBasicMaterial({color:0xaf74ff}),blue:new THREE.MeshBasicMaterial({color:0x8ed8ff}),white:new THREE.MeshBasicMaterial({color:0xe6efff}),leaf:new THREE.MeshStandardMaterial({color:0x7a3fd4,emissive:0x5c24ba,emissiveIntensity:.65,roughness:.86}),skin:new THREE.MeshStandardMaterial({color:0xc8aa9f}),hair:new THREE.MeshStandardMaterial({color:0xd5c8ef,metalness:.12}),black:new THREE.MeshStandardMaterial({color:0x171a28,metalness:.4,roughness:.34})};
let world=new THREE.Group();scene.add(world);let entities=[],colliders=[],animatedDoors=[],staffActors=[];
let spaceClouds=[]; // Active only for the exterior world; other floors have no cosmic cloud meshes.
let cosmicSkyLayers=[],orbitPlanets=[],spaceDepthLayers=[];
let cosmicElapsedMs=0; // Uninterrupted, slow orbital and ambient animation clock.
const TWO_PI=Math.PI*2;
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
// V2.9: deterministic named humans and elves with visual sex/body, hairstyle, skin-tone,
// uniforms, security patrols and lightweight in-world conversations. No external models required.
const npcGiven=['Amara','Dorian','Keiko','Marek','Sora','Nadia','Elias','Imani','Ari','Yara','Felix','Liora','Jun','Talia','Ren','Zara','Cassian','Mina','Oren','Ayla','Vera','Theo'];
const npcLast=['Vale','Chen','Sato','Voss','Reyes','Hale','Okafor','Mercer','Kade','Solari','Bell','Arden','Park','Orion'];
const npcSkin=[0x6a3d32,0x9c624b,0xd19c77,0xedc5a2,0x6c4b3d,0xb78361];
const npcHair=[0x0b101b,0x33201d,0x8c6650,0xc2b6ba,0x2b2848,0x52311e];
const npcDialogue=[['Good to see you.','Welcome back.'],['Did you see the new starfield?','The view is incredible.'],['Security check complete.','Everything looks clear.'],['Heading to my department.','I will see you upstairs.'],['The tower is looking beautiful.','That lighting is something else.']];
function npcLabel(text,width=4.3,height=.55){
 const tex=textCanvas(text,{size:47,color:'#e9eeff',width:1024,height:128});
 const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide,depthTest:false});
 return new THREE.Mesh(new THREE.PlaneGeometry(width,height),mat);
}
function employee(x,z,i,role='Staff'){
 const n=Math.abs(Math.round(i*10)),elf=n%4===0,female=n%2===0;
 const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(NPC_SCALE);
 const name=npcGiven[n%npcGiven.length]+' '+npcLast[(n*3+7)%npcLast.length];
 g.userData={baseY:0,phase:(n%19)*.27,turn:((n%7)-3)*.07,role,name,elf,female};
 world.add(g);staffActors.push(g);
 // Replace the former collection of rectangular torsos, spherical heads, and cone ears.
 // Character mesh visuals are separate from existing names, roles, interaction callbacks.
 const model=createStylizedEmployee(THREE,{index:n,elf,female,role,
   skinColor:npcSkin[n%npcSkin.length],hairColor:npcHair[(n*7+2)%npcHair.length]});
 g.add(model);g.userData.visualModel=model;
 const tag=npcLabel(name+'  |  '+role,role==='Security'?4.9:4.5,.52);
 tag.position.set(0,3.15,0);g.add(tag);g.userData.tag=tag;
 const speech=npcLabel('',5,.53);speech.position.set(0,3.64,0);speech.visible=false;g.add(speech);g.userData.speech=speech;
 return g;
}
function guard(x,z,i,patrol=false){
 const g=employee(x,z,i,'Security');
 g.userData.guard=true;
 g.userData.walkPath=patrol;
 if(patrol){g.userData.homeX=x;g.userData.homeZ=z;g.userData.range=4+(i%3)*2;g.userData.speed=.24+(i%3)*.04}
 return g;
}
function npcConversationPulse(now){
 // NPCs exchange short, timed dialogue only when they are naturally near one another.
 // Avoid touching service dialogue / preserved legal Q&A.
 const beat=Math.floor(now/10500);const progress=now%10500;
 if(beat===npcConversationPulse.lastBeat && progress>5800){for(const a of staffActors){if(a.userData.speech)a.userData.speech.visible=false}return}
 if(beat!==npcConversationPulse.lastBeat){
  npcConversationPulse.lastBeat=beat;
  for(const a of staffActors){if(a.userData.speech)a.userData.speech.visible=false}
  for(let j=0;j<staffActors.length;j++){
   const a=staffActors[j];if((j+beat)%5!==0)continue;
   let b=null,dist=4.9;
   for(const other of staffActors){if(other===a)continue;
    const d=a.position.distanceTo(other.position);if(d<dist){dist=d;b=other}}
   if(!b)continue;
   const set=npcDialogue[(beat+j)%npcDialogue.length];
   const aTag=a.userData.speech,bTag=b.userData.speech;
   if(!aTag||!bTag)continue;
   for(const [mesh,line] of [[aTag,set[0]],[bTag,set[1]]]){
    const next=npcLabel(line,4.5,.5);mesh.material.map.dispose();mesh.material.map=next.material.map;
    mesh.material.needsUpdate=true;next.material.dispose();next.geometry.dispose();mesh.visible=true;
   }
   a.rotation.y=Math.atan2(b.position.x-a.position.x,b.position.z-a.position.z);
   b.rotation.y=Math.atan2(a.position.x-b.position.x,a.position.z-b.position.z);
  }
 }
 if(progress>5200){for(const a of staffActors){if(a.userData.speech)a.userData.speech.visible=false}}
}
npcConversationPulse.lastBeat=-1;

// V7: exactly ONE portal per floor. The destination display is a hologram in the 3D scene.
let portalSelection=null, portalHologram=null;
let departmentPortalFX=[];
function floorPortalNexus(isLobby=false){
 // One animated world-space gateway behind the reception desk; department gates use the same visual language.
 const x=isLobby?0:21, z=isLobby?-22:23;
 const gateway=new THREE.Group();gateway.position.set(x,0,z);world.add(gateway);
 const energy=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,
  uniforms:{time:{value:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`varying vec2 vUv;uniform float time;void main(){vec2 p=(vUv-.5)*vec2(1.,1.33);float r=length(p);float waves=sin(23.*r-3.8*time+sin(p.y*17.+time*1.6));float streak=sin(p.x*35.+time*2.1)*sin(p.y*27.-time*1.7);float alpha=(1.-smoothstep(.32,.5,r))*(.48+.22*waves+.09*streak);vec3 c=mix(vec3(.16,.14,.68),vec3(.14,.78,.99),.5+.5*sin(12.*r-time*1.8));gl_FragColor=vec4(c,max(0.,alpha));}`});
 const disk=new THREE.Mesh(new THREE.PlaneGeometry(4.0,4.75),energy);disk.position.set(0,2.75,0);gateway.add(disk);
 const rimMat=new THREE.MeshBasicMaterial({color:0x9e74ff,toneMapped:false});
 const rimBlue=new THREE.MeshBasicMaterial({color:0x65d5ff,toneMapped:false});
 for(const [radius,tube,mat,offset] of [[2.22,.13,rimMat,0],[2.38,.035,rimBlue,.11]]){
  const rim=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,10,112),mat);rim.scale.y=1.15;rim.position.set(0,2.75,offset);gateway.add(rim);
 }
 const movingRim=new THREE.Mesh(new THREE.TorusGeometry(2.13,.045,8,90),rimBlue);
 movingRim.scale.y=1.15;movingRim.position.set(0,2.75,.17);gateway.add(movingRim);
 const base=box([0,.16,0],[5.5,.32,2.8],M.dark,gateway);
 const lamp=new THREE.PointLight(0x795aff,3.5,12,2);lamp.position.set(0,3,1.1);gateway.add(lamp);
 departmentPortalFX.push({energy,movingRim});
 sign(isLobby?'DEPARTMENT PORTAL':'FLOOR TRANSIT',[x,5.9,z+.22],7.2,.65);
 interact('Select department at portal',[x,1.7,z+1.6],()=>openPortalSelector(),isLobby?6.3:5.2);
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

function lobbyEntranceAirlock(){
 // Only automatic sliding doors: no airlock, passage corridor, or secondary geometry.
 automaticEntrance(0,32);
}


function makeVistaTexture(width=1600,height=900,style='exterior'){
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');
 const bg=c.createLinearGradient(0,0,0,height);
 bg.addColorStop(0,'#04050d');bg.addColorStop(.45,'#0b0f23');bg.addColorStop(.78,'#120f2e');bg.addColorStop(1,'#1e1440');
 c.fillStyle=bg;c.fillRect(0,0,width,height);
 let seed=style==='exterior'?90210:777;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
 for(let i=0;i<1500;i++){const x=rand()*width,y=rand()*height;const a=.2+rand()*.8;c.fillStyle=`rgba(235,236,255,${a})`;const s=rand()>.96?2:1;c.fillRect(x,y,s,s)}
 for(let j=0;j<220;j++){const x=width*.72+(rand()-.5)*width*.42,y=height*.28+(rand()-.5)*height*.34,r=18+rand()*120;const g=c.createRadialGradient(x,y,0,x,y,r);const rgb=rand()>.48?'154,95,255':'96,138,255';g.addColorStop(0,`rgba(${rgb},${.1+rand()*.2})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
 c.fillStyle='rgba(116,88,210,.95)';c.beginPath();c.arc(width*.14,height*.33,height*.18,0,Math.PI*2);c.fill();
 const rg=c.createRadialGradient(width*.14,height*.33,height*.12,width*.14,height*.33,height*.2);rg.addColorStop(0,'rgba(170,140,255,.18)');rg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=rg;c.beginPath();c.arc(width*.14,height*.33,height*.24,0,Math.PI*2);c.fill();
 c.fillStyle='rgba(129,116,220,.85)';c.beginPath();c.arc(width*.81,height*.27,height*.05,0,Math.PI*2);c.fill();
 const tx=new THREE.CanvasTexture(canvas);tx.colorSpace=THREE.SRGBColorSpace;return tx;
}
function lobbyExteriorVista(){
 const g=new THREE.Group();g.position.set(0,0,0);world.add(g);
 const sky=new THREE.Mesh(new THREE.PlaneGeometry(270,156),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,depthWrite:false,fog:false}));
 sky.position.set(0,70,168);g.add(sky);
 new THREE.TextureLoader().load('./reference/space-backdrop.webp',t=>{t.colorSpace=THREE.SRGBColorSpace;sky.material.map=t;sky.material.needsUpdate=true;});
 panel([0,-.18,96],[148,.36,136],M.exteriorFloor,g);
 for(const z of [52,96,140])panel([0,.006,z],[132,.012,.08],M.wall,g);
 for(const x of [-42,0,42])panel([x,.006,96],[.08,.012,132],M.wall,g);
 for(const side of [-1,1]){
  for(const z of [58,92,128]){panel([side*54,1.8,z],[18,3.4,12],M.dark,g);panel([side*54,3.52,z],[18.2,.1,12.2],M.blue,g);panel([side*57,2.4,z+4.5],[5.5,2.2,.16],M.glass,g);tree(side*60,z,1.45)}
  for(let j=0;j<6;j++){const x=side*(18+j*8.2),h=82-j*8.5,z=62-j*2.5;panel([x,h/2+2,z],[j<2?4.2:3.3,h,4.8],M.dark,g);panel([x+side*1.55,h/2+2,z+2.45],[.09,h-1,.11],j%2?M.blue:M.violet,g)}
 }
 for(const spec of [[62,44,0xb176ff],[69,40,0x8bcfff]]){const ring=new THREE.Mesh(new THREE.TorusGeometry(spec[1],.16,7,128),new THREE.MeshBasicMaterial({color:spec[2]}));ring.rotation.x=Math.PI/2;ring.position.set(0,spec[0],88);g.add(ring)}
 for(const [x,z] of [[-66,143],[-42,143],[42,143],[66,143]]){const wf=new THREE.Mesh(new THREE.PlaneGeometry(9,34),new THREE.MeshBasicMaterial({color:0x8bd9ff,transparent:true,opacity:.72,side:THREE.DoubleSide,depthWrite:false}));wf.position.set(x,-16,z);g.add(wf)}
 const fill1=new THREE.PointLight(0x8f78ff,15,120,2);fill1.position.set(-22,14,76);g.add(fill1);const fill2=new THREE.PointLight(0x88c8ff,15,120,2);fill2.position.set(22,14,76);g.add(fill2);
}
function exteriorLobbySlice(){
 const g=new THREE.Group();g.position.set(0,0,0);world.add(g);
 panel([0,.03,21],[15,.06,12],M.exteriorFloor,g);hexcoreFloorLogo(0,21,4.1);
 const glowSphere=new THREE.Mesh(new THREE.SphereGeometry(2.5,22,14),new THREE.MeshBasicMaterial({color:0x6b65ff,transparent:true,opacity:.3,wireframe:true}));glowSphere.position.set(0,8.3,17);g.add(glowSphere);
 for(const rr of [3.1,4.1]){const ring=new THREE.Mesh(new THREE.TorusGeometry(rr,.05,6,42),new THREE.MeshBasicMaterial({color:rr>3.5?0xaf74ff:0x8ed8ff}));ring.rotation.x=Math.PI/2;ring.position.set(0,8.3,17);g.add(ring)}
 panel([0,1.0,14],[7.6,2.0,1.4],M.dark,g);panel([0,2.05,14],[7.8,.08,1.55],M.violet,g);
 for(const x of [-2.2,0,2.2])employee(x,12.8,30+x);
 for(const side of [-1,1]){panel([side*5.6,9.5,18.4],[.13,18,.16],side>0?M.blue:M.violet,g);panel([side*8.1,8.4,17.8],[3.1,16,2.2],M.dark,g)}
 const lobbyGlow=new THREE.PointLight(0xb47cff,18,40,2);lobbyGlow.position.set(0,9.5,18);g.add(lobbyGlow);
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
// V16 exterior: full tower, floating platform, waterfalls and cosmic sky.
// Keep this world separate from the large interior; the same automatic doorway is the threshold.
function glowingLine(points,color=0xb57aff,width=.12){
 for(let i=1;i<points.length;i++){
   let a=new THREE.Vector3(...points[i-1]),b=new THREE.Vector3(...points[i]);
   let d=new THREE.Vector3().subVectors(b,a),o=new THREE.Mesh(new THREE.CylinderGeometry(width,width,d.length(),6),new THREE.MeshBasicMaterial({color}));
   o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());world.add(o);
 }
}
function elevationBand(x,y,z,sx,sz,mat=M.dark){panel([x,y,z],[sx,.55,sz],mat);panel([x,y+.32,z],[sx+.05,.05,sz+.05],M.violet)}
function platformIsland(x,z,sx,sz,h=11){
 // A giant floating architectural platform with thickness, edge treatment, and a polished upper deck.
 panel([x,-h*.5,z],[sx,h,sz],M.dark);
 panel([x,-.26,z],[sx,.55,sz],M.exteriorFloor);
 // beveled edge lip
 panel([x,-.02,z-sz/2+2.2],[sx-10,.16,4.3],M.dark);
 panel([x,-.02,z+sz/2-2.2],[sx-10,.16,4.3],M.dark);
 panel([x-sx/2+2.2,-.02,z],[4.3,.16,sz-10],M.dark);
 panel([x+sx/2-2.2,-.02,z],[4.3,.16,sz-10],M.dark);
 // luminous seam around platform edge
 panel([x,.02,z-sz/2+.18],[sx,.05,.22],M.violet);panel([x,.02,z+sz/2-.18],[sx,.05,.22],M.violet);
 panel([x-sx/2+.18,.02,z],[.22,.05,sz],M.blue);panel([x+sx/2-.18,.02,z],[.22,.05,sz],M.blue);
 // underside support masses so it reads as a huge suspended structure
 for(const dx of [-sx*.28,0,sx*.28])for(const dz of [-sz*.28,0,sz*.28])panel([x+dx,-h*.72,z+dz],[sx*.12,h*.44,sz*.12],M.dark);
}
function waterfall(x,z,width=12,drop=35,rotation=0){
 let group=new THREE.Group();group.position.set(x,0,z);group.rotation.y=rotation;world.add(group);
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=512;const c=canvas.getContext('2d');
 const grad=c.createLinearGradient(0,0,128,0);grad.addColorStop(0,'rgba(62,132,255,0.1)');grad.addColorStop(.22,'rgba(111,203,255,.7)');grad.addColorStop(.5,'rgba(218,243,255,.9)');grad.addColorStop(.8,'rgba(99,145,255,.65)');grad.addColorStop(1,'rgba(47,96,235,.12)');c.fillStyle=grad;c.fillRect(0,0,128,512);
 for(let i=0;i<28;i++){c.fillStyle=`rgba(255,255,255,${.04+(i%4)*.04})`;c.fillRect(Math.random()*128,0,.4+Math.random()*3,512)}
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
 const sheet=new THREE.Mesh(new THREE.PlaneGeometry(width,drop),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.86,depthWrite:false,side:THREE.DoubleSide}));
 sheet.position.y=-drop/2;group.add(sheet);
 const streak=new THREE.MeshBasicMaterial({color:0xa5ddff,transparent:true,opacity:.55,depthWrite:false});
 for(const dx of [-width*.38,width*.30]){const line=new THREE.Mesh(new THREE.PlaneGeometry(.11,drop),streak);line.position.set(dx,-drop/2,.08);group.add(line)}
}
function skyNebula(){
 // 360-degree sky mapped from the user-supplied space reference: planets, clouds, nebula and stars.
 // Prebuilt in the exterior world; it is not a hallway, screen or physical obstruction.
 const material=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.BackSide,depthWrite:false,depthTest:true,fog:false,transparent:true,opacity:1});
 const sky=new THREE.Mesh(new THREE.SphereGeometry(420,64,36),material);
 sky.position.set(0,72,80);
 sky.rotation.y=Math.PI;
 sky.renderOrder=-100;
 world.add(sky);
 cosmicSkyLayers.push({mesh:sky,type:'sphere',speedY:0.00022,speedX:0.00003,origin:sky.position.clone()});
 // Black-void sectors occupy the opposite and lateral sky, while the original
 // user-approved illustrated panorama remains untouched in the tower-facing sky.
 const voidMaterial=new THREE.ShaderMaterial({
   side:THREE.BackSide,transparent:true,depthWrite:false,depthTest:true,fog:false,
   uniforms:{uOpacity:{value:.99}},
   vertexShader:`varying vec3 vDir;void main(){vDir=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`varying vec3 vDir;uniform float uOpacity;
     void main(){
       // Sphere rotation and camera viewpoints vary. Preserve the full front vista;
       // gently mask the rear and two flanks rather than cutting a hard seam.
       float rear=smoothstep(.12,.78,vDir.z);
       float flank=smoothstep(.84,.99,abs(vDir.x))*.55;
       float mask=max(rear,flank);
       gl_FragColor=vec4(.003,.004,.012,mask*uOpacity);
     }`
 });
 const voidSky=new THREE.Mesh(new THREE.SphereGeometry(414,48,32),voidMaterial);
 voidSky.position.copy(sky.position);voidSky.rotation.copy(sky.rotation);
 voidSky.renderOrder=-99;world.add(voidSky);
 new THREE.TextureLoader().load('./reference/space-backdrop.webp',t=>{t.colorSpace=THREE.SRGBColorSpace;material.map=t;material.needsUpdate=true;});
 // A restrained distant-star layer gives depth when looking around in first person.
 const vertices=[];let seed=7823;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<500;i++){
  const theta=rand()*Math.PI*2,phi=Math.acos(2*rand()-1),r=340+rand()*38;
  vertices.push(Math.sin(phi)*Math.cos(theta)*r,72+Math.cos(phi)*r,80+Math.sin(phi)*Math.sin(theta)*r);
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 world.add(new THREE.Points(geometry,new THREE.PointsMaterial({color:0xd8d5ff,size:0.48,transparent:true,opacity:.48,sizeAttenuation:false,depthWrite:false,fog:false})));
}
// V3.1: time-varying, camera-facing, shader-softened cloud volumes.
// Cloud sprites exist only in the exterior world, so none render indoors.
function makeSpaceCloudMaterial(){
 return new THREE.ShaderMaterial({
  transparent:true,depthWrite:false,depthTest:true,side:THREE.DoubleSide,
  uniforms:{
   uTime:{value:0},uPhase:{value:0},uAlpha:{value:0},
   uColor:{value:new THREE.Color(0x8565db)}
  },
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`varying vec2 vUv;uniform float uTime,uPhase,uAlpha;uniform vec3 uColor;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
                 mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    void main(){
      vec2 p=(vUv-.5)*2.;float r=length(p*vec2(1.,1.4));
      float n=.54*noise(p*3.4+uPhase+vec2(uTime*.011,0.))
             +.29*noise(p*8.0-vec2(uTime*.014,uPhase))
             +.17*noise(p*17.1+uPhase);
      float density=smoothstep(.78,.15,r)*smoothstep(.32,.70,n+.16);
      float transparency=density*uAlpha*.44;
      if(transparency<.006)discard;
      vec3 col=uColor*mix(.5,1.5,n);
      gl_FragColor=vec4(col,transparency);
    }`
 });
}
function createLivingSpace(){
 spaceClouds=[];
 const seedFn=()=>{let x=482791;return ()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296}};const rand=seedFn();
 const amount=quality==='low'?6:quality==='medium'?11:17;
 const palette=[0x8b65ef,0x5f85ff,0x8e72ff,0xb78cff,0x60b9ff];
 const cloudPlane=new THREE.PlaneGeometry(1,1);
 for(let i=0;i<amount;i++){
  const mat=makeSpaceCloudMaterial();
  mat.forceSinglePass=true;
  mat.uniforms.uPhase.value=rand()*17;
  mat.uniforms.uColor.value.setHex(palette[i%palette.length]);
  const cloud=new THREE.Mesh(cloudPlane,mat);
  const size=43+rand()*84;cloud.scale.set(size,size*.68,1);
  const theta=rand()*6.283;
  const distance=34+rand()*220;
  cloud.position.set(Math.cos(theta)*distance,8+rand()*125,Math.sin(theta)*distance+78);
  // Large distant clouds stay behind most structural details while a few pass through.
  cloud.userData={phase:rand()*6.28,period:75+rand()*120,speed:.35+rand()*1.25,
    origin:cloud.position.clone(),wander:new THREE.Vector3((rand()-.5)*70,(rand()-.5)*16,(rand()-.5)*70)};
  cloud.renderOrder=-3;
  world.add(cloud);spaceClouds.push(cloud);
 }
 // Additional 3D stellar depth beyond the nearby cloud layer.
 const positions=[];for(let i=0;i<(quality==='low'?500:1600);i++){
  const az=rand()*Math.PI*2,el=Math.acos(rand()*2-1),rad=185+rand()*185;
  positions.push(Math.cos(az)*Math.sin(el)*rad,70+Math.cos(el)*rad,80+Math.sin(az)*Math.sin(el)*rad);
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 world.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xb8c9ff,size:.65,
   transparent:true,opacity:.56,sizeAttenuation:false,depthWrite:false,fog:false})));
 // Real positions at three different distances: nearby dust, middle stars and
 // distant pinpricks shift slightly relative to one another as the viewer moves.
 // Keep each field in one GPU-friendly draw call; no screen-filling overlays.
 spaceDepthLayers=[];
 const ranges=[
  {inner:128,outer:183,count:quality==='low'?130:250,color:0x94a8e1,opacity:.16,size:1.2,rotationSpeed:.000005},
  {inner:225,outer:314,count:quality==='low'?300:620,color:0xacc5ff,opacity:.28,size:.92,rotationSpeed:-.000003},
  {inner:338,outer:385,count:quality==='low'?340:760,color:0xe2d4ff,opacity:.33,size:.82,rotationSpeed:.0000015}
 ];
 for(const cfg of ranges){
  const coords=[];
  for(let j=0;j<cfg.count;j++){
   const a=rand()*TWO_PI,lat=Math.acos(rand()*2-1),radius=cfg.inner+(cfg.outer-cfg.inner)*rand();
   coords.push(Math.sin(lat)*Math.cos(a)*radius,Math.cos(lat)*radius,Math.sin(lat)*Math.sin(a)*radius);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));
  const mat=new THREE.PointsMaterial({color:cfg.color,size:cfg.size,transparent:true,
    opacity:cfg.opacity,depthWrite:false,sizeAttenuation:false,fog:false});
  const starField=new THREE.Points(geometry,mat);
  starField.position.set(0,72,81);starField.renderOrder=-12;
  world.add(starField);
  spaceDepthLayers.push({mesh:starField,opacity:cfg.opacity,rotationSpeed:cfg.rotationSpeed});
 }
 // A few tiny star glints break the flat texture without adding dense effects.
 const bright=[];
 for(let j=0;j<(quality==='low'?18:30);j++){
   const az=rand()*TWO_PI,el=Math.acos(rand()*2-1),rad=300+rand()*80;
   bright.push(Math.sin(el)*Math.cos(az)*rad,Math.cos(el)*rad,Math.sin(el)*Math.sin(az)*rad);
 }
 const gleamGeo=new THREE.BufferGeometry();gleamGeo.setAttribute('position',new THREE.Float32BufferAttribute(bright,3));
 const gleam=new THREE.Points(gleamGeo,new THREE.PointsMaterial({color:0xe6e6ff,size:2.1,
   transparent:true,opacity:.32,depthWrite:false,sizeAttenuation:false,fog:false}));
 gleam.position.set(0,72,81);world.add(gleam);
 spaceDepthLayers.push({mesh:gleam,opacity:.32,rotationSpeed:0});
}
function updateLivingSpace(now){
 if(floor!=='outside'&&floor!=='lobby'||!spaceClouds.length)return;
 const t=now*.001;
 for(const cloud of spaceClouds){
  const d=cloud.userData,phase=d.phase;
  const cycle=((t+phase*10)/d.period)%1;
  // Fade in, remain visible, then dissolve until the next formation.
  let fade=Math.min(1,cycle*7,(1-cycle)*6);
  fade=Math.max(0,fade);fade=fade*fade*(3-2*fade);
  cloud.material.uniforms.uAlpha.value=fade;
  cloud.material.uniforms.uTime.value=t;
  cloud.position.copy(d.origin).addScaledVector(d.wander,Math.sin(t/d.period*6.283+phase)*.5);
  cloud.position.x+=t*d.speed%35-17.5;
  cloud.lookAt(camera.position);
 }
}

// Space stays peaceful throughout the visit. There is no overlap event, code
// world, apparition, face, sound trigger, shader swap or teleporting planet.
function buildOrbitingPlanets(){
 const loader=new THREE.TextureLoader();
 const planetSpecs=[
  // Opposing platform-wide orbits, each taking several minutes per full revolution.
  // Centers are intentionally low: roughly 40% of each sphere is below the deck plane.
  {path:'./reference/planet-cracked-spherical.webp',radius:120,
   startAngle:-Math.PI*.72,dir:1,orbitX:261,orbitZ:272,planeY:24,
   orbitSeconds:195,spinSeconds:132,spinDir:1,rim:0xb68fff},
  {path:'./reference/planet-tech-spherical.webp',radius:85,
   startAngle:-Math.PI*.28,dir:-1,orbitX:324,orbitZ:305,planeY:17,
   orbitSeconds:225,spinSeconds:157,spinDir:-1,rim:0x72c2ff}
 ];
 for(const spec of planetSpecs){
  const group=new THREE.Group();group.position.set(0,spec.planeY,81);world.add(group);
  const body=new THREE.Mesh(
   new THREE.SphereGeometry(spec.radius,quality==='low'?36:56,quality==='low'?24:36),
   new THREE.MeshBasicMaterial({fog:false,color:0xffffff})
  );
  body.rotation.y=Math.PI*.9;group.add(body);
  const glow=new THREE.Mesh(
   new THREE.SphereGeometry(spec.radius*1.027,quality==='low'?32:44,quality==='low'?20:28),
   new THREE.MeshBasicMaterial({color:spec.rim,side:THREE.BackSide,transparent:true,
      opacity:.19,depthWrite:false,fog:false,blending:THREE.AdditiveBlending})
  );
  group.add(glow);
  loader.load(spec.path,t=>{t.colorSpace=THREE.SRGBColorSpace;body.material.map=t;
   body.material.needsUpdate=true;});
  orbitPlanets.push({group,body,glow,spec});
 }
}
function updatePeacefulSpace(now){
 if(floor!=='outside'&&floor!=='lobby')return;
 const seconds=cosmicElapsedMs/1000;
 for(const layer of cosmicSkyLayers){
  if(layer.type==='sphere'){
   layer.mesh.rotation.y+=layer.speedY*.30; // very slow cosmic background drift
   layer.mesh.rotation.x=Math.sin(seconds*.004)*.012;
  }
 }
 for(const layer of spaceDepthLayers){
  layer.mesh.rotation.y+=layer.rotationSpeed;
  if(layer.rotationSpeed===0)layer.mesh.material.opacity=layer.opacity*(.95+.05*Math.sin(seconds*.17));
 }
 for(const item of orbitPlanets){
  const sp=item.spec;
  const angle=sp.startAngle+sp.dir*TWO_PI*seconds/sp.orbitSeconds;
  item.group.position.set(
   Math.cos(angle)*sp.orbitX,sp.planeY,81+Math.sin(angle)*sp.orbitZ
  );
  item.body.rotation.y=Math.PI*.9+sp.spinDir*TWO_PI*seconds/sp.spinSeconds;
  item.body.rotation.x=.055*Math.sin(seconds*.026+sp.startAngle);
 }
}

function plazaLightReflections(){

 // Low-opacity luminous reflection pools on the existing glossy black marble.
 // Kept on the horizontal floor; these are not added structures or raised obstacles.
 const glowTex=document.createElement('canvas');glowTex.width=128;glowTex.height=128;
 const c=glowTex.getContext('2d');const g=c.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,'rgba(190,177,255,.37)');g.addColorStop(.24,'rgba(130,111,255,.18)');g.addColorStop(1,'rgba(110,94,255,0)');c.fillStyle=g;c.fillRect(0,0,128,128);
 const tex=new THREE.CanvasTexture(glowTex);tex.colorSpace=THREE.SRGBColorSpace;
 for(const [x,z,w,h] of [[0,49,34,24],[-22,68,18,40],[22,68,18,40],[-46,105,12,36],[46,105,12,36],[0,116,50,34]]){
  const patch=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,depthTest:true,side:THREE.DoubleSide,opacity:.42}));
  patch.rotation.x=-Math.PI/2;patch.position.set(x,.079,z);world.add(patch)
 }
}
// V2.6: geometry-aware architectural finishing, inspired by the approved tower reference.
// Unlike a front-facing picture, these textures wrap around the real 3D geometry.
function towerCladdingTexture(){
 const c=document.createElement('canvas');c.width=512;c.height=1024;
 const q=c.getContext('2d');q.fillStyle='#0c1020';q.fillRect(0,0,512,1024);
 let seed=9371;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let x=0;x<512;x+=64){
  const grad=q.createLinearGradient(x,0,x+64,0);
  grad.addColorStop(0,'#070911');grad.addColorStop(.22,'#1e263e');
  grad.addColorStop(.54,x%128?'#11172a':'#242d47');grad.addColorStop(.86,'#090e1d');
  grad.addColorStop(1,'#040712');q.fillStyle=grad;q.fillRect(x,0,64,1024);
  q.fillStyle='rgba(138,154,203,.29)';q.fillRect(x+4,0,1.5,1024);
  q.fillStyle='rgba(8,9,16,.85)';q.fillRect(x+58,0,5,1024);
  q.fillStyle=(x/64)%3?'rgba(112,160,248,.45)':'rgba(183,105,255,.55)';
  q.fillRect(x+48,0,2.3,1024);
 }
 for(let y=30;y<1024;y+=84){
   for(let x=9;x<512;x+=64){
     q.fillStyle='rgba(91,106,143,.23)';q.fillRect(x,y,40,2);
     q.fillStyle='rgba(0,0,0,.3)';q.fillRect(x,y+4,40,1);
     q.fillStyle='rgba(115,158,254,.09)';q.fillRect(x+8,y+9,24,2);
   }
 }
 for(let i=0;i<650;i++){
  const x=rnd()*512,y=rnd()*1024;
  q.fillStyle='rgba(150,171,229,.035)';q.fillRect(x,y,1+rnd()*2,1+rnd()*16);
 }
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 return t;
}
function towerFinishing(){
 const finish=towerCladdingTexture();
 const clad=new THREE.MeshStandardMaterial({map:finish,color:0x9295b1,metalness:.72,
   roughness:.22,emissive:0x15102a,emissiveIntensity:.23});
 const edgeMetal=new THREE.MeshStandardMaterial({color:0x555b78,metalness:.83,roughness:.18,
   emissive:0x191332,emissiveIntensity:.22});
 const recess=new THREE.MeshStandardMaterial({color:0x101424,metalness:.78,roughness:.24});
 const violetGlow=new THREE.MeshBasicMaterial({color:0xb58dff});
 const iceGlow=new THREE.MeshBasicMaterial({color:0x98caff});
 // Ribs follow the original fin locations on both faces; no new outside massing.
 for(const side of [-1,1]){
  for(let j=0;j<7;j++){
    const x=side*(8+j*5.0),h=156-j*14.5,z=17-j*1.4,w=j<3?3.5:2.9;
    const front=z+2.8;
    // Black-glass architectural panels, framed with shallow metallic bevel geometry.
    panel([x,h/2+5,front+.12],[w*.77,h*.87,.16],clad);
    panel([x,h/2+5,front+.22],[w*.49,h*.83,.035],recess);
    for(const offset of [-1,1]){
      panel([x+offset*w*.405,h/2+5,front+.26],[.15,h*.87,.12],edgeMetal);
    }
    panel([x+side*w*.29,h/2+5,front+.37],[.09,h*.82,.055],j%3===0?iceGlow:violetGlow);
    // Turn both ends into a proper 3D building: lateral and rear surface detailing.
    const outerX=x+side*(w/2+.12);
    panel([outerX,h*.48+5,z],[.16,h*.85,4.9],clad);
    panel([outerX+side*.11,h*.50+5,z-1.5],[.075,h*.78,.13],j%2?iceGlow:violetGlow);
    panel([x,h*.48+5,z-2.88],[w*.7,h*.81,.15],clad);
    panel([x,h*.50+5,z-3.01],[.08,h*.77,.09],j%2?violetGlow:iceGlow);
    for(let k=1;k<4;k++){
      const yy=6+k*(h*.76)/4;
      panel([x,yy,front+.4],[w*.66,.10,.05],edgeMetal);
    }
  }
  // Existing entrance shoulders become polished stacked wall elements.
  for(let j=0;j<4;j++){
    const x=side*(13.5+j*5.2);
    panel([x,11.5,31.75-j*.72],[3.1,21,.22],j%2?clad:edgeMetal);
    panel([x+side*1.55,11.4,31.93-j*.72],[.085,20.3,.10],j%2?iceGlow:violetGlow);
  }
 }
 // Tall central spine has nested bevels and high-value blue-white/violet lights.
 for(const side of [-1,1]){
    panel([side*5.1,131,8.65],[3.3,54,.30],clad);
    panel([side*6.55,131,8.85],[.16,53,.14],edgeMetal);
    panel([side*6.28,130,9.00],[.095,49,.08],side>0?iceGlow:violetGlow);
 }
 // Horizontal sign trim plus realistic light-emitting architectural canopy.
 panel([0,110.2,25.74],[29,.24,.20],edgeMetal);
 panel([0,109.97,25.87],[28.1,.065,.10],violetGlow);
 panel([0,71.2,25.76],[28,.18,.15],edgeMetal);
 // These point lights illuminate surfaces; they do not change player controls.
 for(const [x,y,z,col] of [[-19,85,39,0x9270ff],[19,85,39,0x8abfff],
                          [0,127,28,0xa48aff],[-11,15,40,0xe4c7ff],[11,15,40,0xabcfff]]){
  const light=new THREE.PointLight(col,19,72,2);light.position.set(x,y,z);world.add(light);
 }
}

function towerV16(){
 const metal=new THREE.MeshStandardMaterial({color:0x49566b,metalness:.7,roughness:.18,emissive:0x292141,emissiveIntensity:.32});
 const ink=new THREE.MeshStandardMaterial({color:0x22263a,metalness:.67,roughness:.21,emissive:0x160f2b,emissiveIntensity:.33});
 const silver=new THREE.MeshStandardMaterial({color:0x929fbe,metalness:.82,roughness:.17});
 // Central skyscraper with four sculpted facades and staggered crown, entrance toward positive Z.
 // Open ground-floor approach: no solid mass behind the automatic doors.
 // V4.8: The former solid tower base occupied the walking corridor behind
 // the automatic entrance. Keep external entrance shoulders at the facade,
 // leaving the full interior passage as genuine open geometry.
 for(const side of [-1,1])panel([side*19.8,12,26.0],[5,24,2],ink);
 panel([0,54,0],[39,60,47],ink);
 panel([0,93,-3],[31,38,33],metal);
 panel([0,121,-7],[23,27,24],ink);
 panel([0,145,-8],[13,22,14],metal);
 // Entrance wings and fascia, while preserving open centerline for the sliding doorway.
 for(const side of [-1,1]){
   panel([side*20,16,25],[13,32,15],metal);
   panel([side*29,23,15],[9,46,19],ink);
   panel([side*34,33,-4],[6,66,20],metal);
   // recognizable tall blade-fin arrays on every front side
   for(let j=0;j<7;j++){
     const x=side*(8+j*5.0),h=156-j*14.5,z=17-j*1.4;
     panel([x,h/2+5,z],[j<3?3.5:2.9,h,5.6],j%2?metal:ink);
     panel([x+side*1.54,h/2+5,z+2.86],[.095,h-1,.1],j%3?M.violet:M.blue);
     panel([x,h+5,z],[2.1,1.2,4],silver);
   }
   // Back-side fins extend the architecture through the depth of the tower.
   for(let j=0;j<6;j++){
      const z=-22+j*7.0,h=88-j*5;
      panel([side*39,h/2+6,z],[3.7,h,5],j%2?metal:ink);
      panel([side*41,h/2+6,z],[.11,h-1,3],j%2?M.blue:M.violet);
   }
 }
 // Reverse elevation is modeled, not a blank block.
 for(let i=-4;i<=4;i++){const h=90-Math.abs(i)*8,x=i*7;panel([x,h/2+6,-27],[4,h,5],metal);panel([x,h/2+6,-29.55],[.10,h-1,.13],M.violet)}
 // Elevated orbital transport-like rings and side pylons visible behind the front structure.
 for(const [radius,height,col] of [[68,69,0xb978ff],[74,62,0x639aff]]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.26,7,152),new THREE.MeshBasicMaterial({color:col}));ring.rotation.x=Math.PI/2;ring.position.set(0,height,-8);world.add(ring);
 }
 // Bold HEXCORE emblem and lettering in the exact front hierarchy of the reference.
 const lc=document.createElement('canvas');lc.width=512;lc.height=512;const cx=lc.getContext('2d');cx.shadowBlur=21;cx.shadowColor='#975bff';cx.strokeStyle='#ad78ff';cx.lineWidth=16;cx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/2,xx=256+191*Math.cos(a),yy=256+191*Math.sin(a);i?cx.lineTo(xx,yy):cx.moveTo(xx,yy)}cx.closePath();cx.stroke();
 cx.strokeStyle='#ecdcff';cx.lineWidth=35;cx.beginPath();cx.moveTo(200,172);cx.lineTo(200,340);cx.moveTo(312,172);cx.lineTo(312,340);cx.moveTo(200,256);cx.lineTo(312,256);cx.stroke();
 let t=new THREE.CanvasTexture(lc);t.colorSpace=THREE.SRGBColorSpace;
 const mark=new THREE.Mesh(new THREE.PlaneGeometry(29,29),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,side:THREE.DoubleSide}));mark.position.set(0,90,25.55);world.add(mark);
 sign('HEXCORE TOWER',[0,69,25.61],35,3.6);
 // Material detail only: restrained metallic face strips and illuminated inset panel seams.
 for(const side of [-1,1]){
  for(let i=0;i<4;i++){
   const x=side*(7.5+i*3.1);
   panel([x,44,24.02],[.16,35,.12],i%2?M.blue:M.violet);
   panel([x,61.5,24.05],[2.3,.10,.12],silver);
  }
 }
 // Narrow facade inlays and light catching trims: preserve the original silhouette.
 for(const side of [-1,1]){
  for(let i=0;i<5;i++){
   const x=side*(11+i*4.9), h=130-i*12,z=19-i*1.4;
   panel([x,h*.57,z+2.86],[.10,h*.72,.08],i%2?M.blue:M.violet);
   panel([x,h*.94,z+2.86],[2.0,.10,.1],silver);
  }
 }
 // Faceted metallic detailing on existing tower front. No main silhouette changes.
 const facePanel=new THREE.MeshStandardMaterial({color:0x333849,metalness:.72,roughness:.24,
   emissive:0x141227,emissiveIntensity:.26});
 const insetPanel=new THREE.MeshStandardMaterial({color:0x151b30,metalness:.74,roughness:.22});
 const accents=[M.violet,M.blue,M.white];
 for(const side of [-1,1]){
   for(let j=0;j<7;j++){
     const x=side*(10.2+j*4.4),height=126-j*11.5,z=20.1-j*1.4;
     panel([x,height*.49+10,z+2.78],[1.65,height*.73,.18],j%2?facePanel:insetPanel);
     panel([x+side*.9,height*.51+10,z+2.92],[.085,height*.76,.10],accents[j%3]);
     for(let k=0;k<3;k++){
       const yy=24+k*19+j*2;
       if(yy<height-8)panel([x,yy,z+2.95],[1.52,.12,.12],facePanel);
     }
   }
 }
 // Architectural perimeter framing and recessed front plaque for the existing H emblem.
 panel([0,89,25.30],[32,34,.48],insetPanel);
 panel([0,106.2,25.63],[32.4,.26,.25],M.violet);
 for(const side of [-1,1])panel([side*16.25,89,25.63],[.21,34,.25],side>0?M.blue:M.violet);
 panel([0,73,25.65],[30,.15,.24],M.blue);
 // Soft surface lighting gives relief to dark metallic facade rather than flat black silhouette.
 for(const side of [-1,1]){
  const wash=new THREE.PointLight(side<0?0x9b72ff:0x86bfff,30,95,2);
  wash.position.set(side*25,44,53);world.add(wash);
 }
 // Giant glass door atrium, framing edges only (not a blocking visual wall).
 for(const side of [-1,1]){
   panel([side*9.7,12,27.5],[2.4,24,4],metal);panel([side*8.34,12,29.5],[.10,22,.11],M.blue);
   panel([side*13.4,11.7,29],[4.8,23.4,2.4],ink);
 }
 panel([0,24,27.5],[21,1.3,4],silver);
 panel([0,25.0,30],[22,.12,.4],M.violet);
 automaticEntrance(0,32);
 // The live doorway portal renders the actual lobby; no fake lobby slice.
 // Glass architecture above entrance: distinct from the doorway so passage remains open.
 for(const y of [12,18,23]){panel([0,y,26],[16,.15,.16],y===18?M.blue:M.violet)}
}
// V2.7: atmospheric architectural highlights, landscape and clean access to the entrance.
function exteriorExperienceV27(){
 const stone=new THREE.MeshStandardMaterial({color:0x111828,metalness:.7,roughness:.21});
 const deepStone=new THREE.MeshStandardMaterial({color:0x080d18,metalness:.72,roughness:.22});
 const water=new THREE.MeshPhysicalMaterial({color:0x76baff,metalness:.28,roughness:.1,
   transparent:true,opacity:.78,depthWrite:false,side:THREE.DoubleSide,clearcoat:1});
 const foliage=new THREE.MeshStandardMaterial({color:0x432070,emissive:0x6e31cc,emissiveIntensity:.95,roughness:.6});
 const budBlue=new THREE.MeshBasicMaterial({color:0x5ec9ff});
 const budViolet=new THREE.MeshBasicMaterial({color:0xb672ff});
 // Ceiling-reaching luminous central energy spine, emerging from the existing roof.
 for(const [radius,height,opacity] of [[2.2,190,.075],[1.05,190,.16],[.35,190,.53]]){
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius*.88,height,12,1,true),
   new THREE.MeshBasicMaterial({color:radius<.5?0xdbdcff:0x9e61ff,transparent:true,opacity,
     depthWrite:false,side:THREE.DoubleSide,fog:false,blending:THREE.AdditiveBlending}));
  beam.position.set(0,169+height/2,-8);world.add(beam);
 }
 sphere([0,169,-8],3.3,new THREE.MeshBasicMaterial({color:0xb78cff,transparent:true,opacity:.65,depthWrite:false}));
 // Halo edging the logo. The existing readable H artwork is retained in front.
 for(const r of [14.1,14.8]){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.14,8,80),
   new THREE.MeshBasicMaterial({color:r<14.5?0xe3c8ff:0x765cff,transparent:true,opacity:r<14.5?.75:.42,
    depthWrite:false}));ring.position.set(0,90,25.4);world.add(ring);
 }
 // Architectural washes placed low in the ground, directed upward at the tower facade.
 for(const x of [-36,-25,-14,14,25,36]){
  const base=panel([x,.26,40],[2.1,.48,2.1],deepStone);
  panel([x,.53,40],[1.75,.045,1.75],Math.abs(x)>26?M.blue:M.violet);
  const bulb=new THREE.SpotLight(x<0?0xa66dff:0x7bafff,140,145,Math.PI/6,.62,1.4);
  bulb.position.set(x,.95,40);bulb.target.position.set(x*.58,68,12);
  world.add(bulb);world.add(bulb.target);
 }
 // Water features and bioluminescent plantings frame the walkway WITHOUT blocking the center.
 for(const side of [-1,1])for(const z of [63,89,116,143]){
  const x=side*43;
  panel([x,.56,z],[21,1.10,13],deepStone);
  panel([x,1.15,z],[19.6,.13,11.7],stone);
  panel([x,1.26,z],[17.6,.045,9.6],water);
  // Overflowing waterfall front, subtle and lit.
  const fall=new THREE.Mesh(new THREE.PlaneGeometry(17.7,1.9),
   new THREE.MeshBasicMaterial({color:0x6cbcff,transparent:true,opacity:.48,side:THREE.DoubleSide,depthWrite:false}));
  fall.position.set(x,.22,z+6.2);world.add(fall);
  for(let j=0;j<6;j++){
   const xx=x-7+j*2.8;
   const ht=.9+(j%3)*.31;
   cyl([xx,1.34+ht*.55,z-2.8],.13,.22,ht,foliage,world,7);
   sphere([xx,1.43+ht,z-2.8],.56+(j%2)*.14,foliage,world,9);
   for(let k=0;k<3;k++){
    const a=(k*2.09)+j;
    sphere([xx+Math.cos(a)*.4,1.57+ht,z-2.8+Math.sin(a)*.37],.13,k%2?budBlue:budViolet,world,7);
   }
  }
  for(const dx of [-9,9]){
   panel([x+dx,1.6,z],[.38,1.25,9.5],stone);
   panel([x+dx,2.25,z],[.40,.055,9.5],side===1?M.blue:M.violet);
  }
 }
}
// V3.0 architecture pass: spatial fixtures, not floating screen decals.
function monumentalApproachV30(){
 const polished=new THREE.MeshPhysicalMaterial({color:0x0b1020,metalness:.68,roughness:.17,clearcoat:1,clearcoatRoughness:.08});
 const brushed=new THREE.MeshStandardMaterial({color:0x434e69,metalness:.8,roughness:.21});
 const water=new THREE.MeshPhysicalMaterial({color:0x62bbf5,roughness:.12,metalness:.26,transparent:true,opacity:.68,side:THREE.DoubleSide,depthWrite:false,clearcoat:1});
 const plantMats=[new THREE.MeshStandardMaterial({color:0x251943,emissive:0x6416b3,emissiveIntensity:1.4,roughness:.7}),new THREE.MeshStandardMaterial({color:0x172c51,emissive:0x257ae9,emissiveIntensity:1.2,roughness:.65})];
 const flowers=[new THREE.MeshBasicMaterial({color:0xc890ff}),new THREE.MeshBasicMaterial({color:0x83e9ff})];
 const w=18; // Unobstructed center lane; side fixtures begin outside +/-19 units.
 for(const side of [-1,1]){
  for(const z of [51,76,101,126,151]){
   const x=side*26;
   // Channeled water basin, black metal rim, and a real three-dimensional waterfall edge.
   panel([x,.36,z],[12,.69,14],polished);
   panel([x,.74,z],[12.5,.10,14.4],brushed);
   panel([x,.83,z],[11.4,.045,13.2],water);
   for(const dx of [-5.5,5.5])panel([x+dx,.93,z],[.38,.23,13.4],polished);
   for(const dz of [-6.4,6.4])panel([x,.93,z+dz],[11,.23,.30],polished);
   // Water pours from the far outer rim, never across the walking path.
   const curtain=new THREE.Mesh(new THREE.PlaneGeometry(11.25,2.3),new THREE.MeshBasicMaterial({color:0x7ccfff,transparent:true,opacity:.58,side:THREE.DoubleSide,depthWrite:false}));
   curtain.rotation.y=side<0?-Math.PI/2:Math.PI/2;
   curtain.position.set(x+side*6.25,-.39,z);world.add(curtain);
   // Sculptural black planters with flowering, bioluminescent shrubs.
   for(const k of [-1,0,1]){
    const zz=z+k*3.9;
    panel([x+side*3,1.15,zz],[3.0,.7,3.0],polished);
    const stem=new THREE.Group();stem.position.set(x+side*3,1.45,zz);world.add(stem);
    cyl([0,.62,0],.14,.21,1.25,brushed,stem,7);
    for(let j=0;j<5;j++){
     const a=j*Math.PI*2/5;
     const px=Math.cos(a)*.65,pz=Math.sin(a)*.65;
     sphere([px,1.30+(j%2)*.24,pz],.55,plantMats[(j+k+4)%2],stem,9);
     sphere([px*1.35,1.68+(j%2)*.24,pz*1.35],.13,flowers[(j+k+4)%2],stem,8);
    }
   }
   const fixture=box([side*19.5,.44,z],[.85,.82,2.8],polished);
   panel([side*19.5,.88,z],[.7,.05,2.6],side<0?M.violet:M.blue);
   const light=new THREE.PointLight(side<0?0x9752ff:0x50adff,11,20,2);light.position.set(side*24,2.7,z);world.add(light);
  }
  // Roadside architectural needle lanterns and visible ornamental illuminated life.
  for(const z of [40,62,87,112,137,160]){
   const x=side*38;
   panel([x,2.4,z],[1.1,4.8,1.1],polished);
   panel([x,4.9,z],[1.1,.15,1.1],brushed);
   panel([x-side*.58,3.6,z+.57],[.10,2.8,.12],side<0?M.violet:M.blue);
   sphere([x,5.3,z],.3,side<0?M.violet:M.blue,world,10);
  }
 }
 // Ground light stations aimed at the facade, using actual spotlights (not uniformly lit surfaces).
 for(const x of [-44,-31,-18,-8,8,18,31,44]){
  const l=new THREE.SpotLight(x<0?0xa271ff:0x70bdff,200,190,Math.PI/7,.72,1.4);
  l.position.set(x,1.0,54);l.target.position.set(x*.55,95,9);
  world.add(l);world.add(l.target);
  panel([x,.12,54],[1.4,.17,1.5],polished);
  panel([x,.22,54],[1.1,.055,1.1],x<0?M.violet:M.blue);
 }
 // The logo's emissive polygon remains readable; halo lighting gives it architectural presence.
 const halo=new THREE.PointLight(0xb490ff,115,90,1.9);halo.position.set(0,91,39);world.add(halo);
 const logoBack=new THREE.Mesh(new THREE.RingGeometry(13.6,15.8,6),new THREE.MeshBasicMaterial({color:0x925eff,transparent:true,opacity:.35,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
 logoBack.rotation.z=Math.PI/6;logoBack.position.set(0,90,25.42);world.add(logoBack);
 // Additional bright core and soft corona for the already-existing roof energy beam.
 const beamCore=new THREE.Mesh(new THREE.CylinderGeometry(.28,.43,230,14,1,true),new THREE.MeshBasicMaterial({color:0xf1efff,transparent:true,opacity:.81,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));
 beamCore.position.set(0,169+115,-8);world.add(beamCore);
 const beamHalo=new THREE.Mesh(new THREE.CylinderGeometry(3.3,2.2,230,24,1,true),new THREE.MeshBasicMaterial({color:0x8b5fff,transparent:true,opacity:.09,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));
 beamHalo.position.copy(beamCore.position);world.add(beamHalo);
 // Eye-level design reference: 2.7-unit player, 3.4-unit security NPC, 7.3-unit automatic doors.
}
function continuousPlaza(){
 scene.fog.density=.0012;
 buildExteriorV6({THREE,scene,world,automaticEntrance,guard,hexcoreFloorLogo,skyNebula,buildOrbitingPlanets});
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
 // No solid low-ceiling cap: the atrium is open beneath the tower superstructure.
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
// V4.6 Phase 5: reference-guided, explorable lobby architecture.
// All pieces are real geometry; no backdrop picture or fake doorway is used.
function lobbyReferenceRedesign(){
 const obsidian=new THREE.MeshStandardMaterial({color:0x101423,metalness:.84,roughness:.2});
 const graphite=new THREE.MeshStandardMaterial({color:0x252b41,metalness:.71,roughness:.26});
 const silver=new THREE.MeshStandardMaterial({color:0x858faf,metalness:.87,roughness:.18});
 const pearl=new THREE.MeshBasicMaterial({color:0xe3e5ff});
 const violet=new THREE.MeshBasicMaterial({color:0xa65eff});
 const cyan=new THREE.MeshBasicMaterial({color:0x7ed3ff});
 const beamMat=new THREE.MeshBasicMaterial({color:0x9d78ff,transparent:true,opacity:.085,depthWrite:false,side:THREE.DoubleSide,fog:false});
 // Tall dark polished vertical architecture with paired recessed violet light channels.
 for(const side of [-1,1]){
  for(const z of [-27,-15,-3,9,21]){
   panel([side*31.55,21,z],[.7,36,2.3],graphite);
   panel([side*31.08,21,z],[.12,35.5,.10],silver);
   panel([side*30.99,21,z+1.18],[.12,33,.13],z%2?cyan:violet);
  }
  // Suspended mezzanine outlines, visually continuous but above player circulation.
  for(const y of [12,25]){
   panel([side*22.5,y,-8],[17,.48,43],obsidian);
   panel([side*14.03,y+.14,-8],[.12,.11,42],silver);
   panel([side*13.95,y+.18,-8],[.055,.08,41.5],y===12?violet:cyan);
   for(const z of [-26,-10,6,22])panel([side*14.1,y+1.3,z],[.10,2.4,.12],M.glass);
  }
  // Two tall narrow wall display bays (real architecture, not fake views).
  for(const z of [-24,16]){
   panel([side*32.26,18,z],[.13,22,11],obsidian);
   panel([side*32.12,18,z],[.09,20,9],M.glass);
   for(const dz of [-5,5])panel([side*31.99,18,z+dz],[.15,21,.12],silver);
   panel([side*31.9,28.6,z],[.16,.13,10],cyan);
   panel([side*31.9,7.5,z],[.16,.12,10],violet);
  }
  // Compact real seating alcoves away from the central approach and portal.
  for(const z of [-5,18]){
   panel([side*25.5,.52,z],[7.2,.95,2.7],obsidian);
   panel([side*25.5,1.05,z],[7.4,.11,2.9],silver);
   panel([side*25.5,1.13,z+1.37],[6.8,.07,.06],violet);
  }
  const accent=new THREE.PointLight(side<0?0x9a70ff:0x91c8ff,8,31,2);
  accent.position.set(side*25,19,-5);world.add(accent);
 }
 // A glowing suspended planet and orbiting light-rings form the lobby centerpiece.
 // Installed well behind the entry and high above pedestrian traffic.
 const display=new THREE.Group();display.position.set(0,19.5,-25.5);world.add(display);
 const globe=new THREE.Mesh(new THREE.SphereGeometry(3.6,28,18),new THREE.MeshStandardMaterial({color:0x6b71dc,emissive:0x5f3baf,emissiveIntensity:.75,metalness:.46,roughness:.26}));
 display.add(globe);
 const wire=new THREE.Mesh(new THREE.SphereGeometry(3.73,20,12),new THREE.MeshBasicMaterial({color:0xb3d4ff,wireframe:true,transparent:true,opacity:.31,depthWrite:false}));display.add(wire);
 for(const [r,rot,color] of [[5.1,.22,violet],[5.8,1.22,cyan],[6.45,-.51,silver]]){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.065,6,70),color);
  ring.rotation.set(rot,.24,0);display.add(ring);
 }
 const beam=new THREE.Mesh(new THREE.CylinderGeometry(2.25,1.8,30,16,1,true),beamMat);
 beam.position.set(0,19,-25.5);world.add(beam);
 for(const y of [34,36.5])torus([0,y,-25.5],6.5+(y-34)*.5,.12,y===34?violet:cyan,[-Math.PI/2,0,0]);
 // High wall signs and layered frame bars emphasize the soaring atrium.
 sign('HEXCORE GAMING',[0,31,-34.02],24,2.0);
 sign('WELCOME  /  EXPLORE  /  DISCOVER',[0,28,-33.96],24,.9);
 for(const z of [-32,-18,-4,10,25]){
  panel([0,38.25,z],[54,.24,.45],graphite);
  panel([0,38.10,z],[53,.045,.09],z%2?violet:cyan);
 }
 // Distinct elegant frame around reception; desk, employees and interactions are preserved.
 panel([0,3.85,-15.7],[12.4,.20,.35],silver);
 for(const x of [-6.05,6.05]){
  panel([x,2.5,-15.7],[.22,2.7,.35],graphite);
  panel([x,2.5,-15.44],[.08,2.5,.10],violet);
 }
 panel([0,3.98,-15.7],[12.5,.07,.14],cyan);
 // Four floor guide lines point naturally from entrance to reception, not across doorway.
 for(const x of [-5.0,-3.15,3.15,5.0])panel([x,.045,7],[.048,.025,28],x<0?violet:cyan);
}
function lobby(){
 const w=66,d=70;
 box([0,-.23,0],[w,.46,d],M.floor);
 // Dark rear architectural backing, not an untextured grey wall in the visitors' sight line.
 box([0,20,-35],[w,40,1.2],M.dark);
 for(const x of [-24,-16,16,24]){
   panel([x,19.2,-34.29],[.12,31,.08],Math.abs(x)===16?M.blue:M.violet);
 }
 panel([0,28,-34.26],[27,.14,.08],M.violet);
 // Side walls removed: mezzanines, pillars and lit inlays define the open atrium.
 for(let side of [-1,1]){
  for(let i=0;i<5;i++){const z=-25+i*13;box([side*28,15,z],[2,30,2],M.dark);trim([side*27.93,15,z+1.05],[.12,29.8,.06],M.violet)}
  for(let i=0;i<3;i++){let z=-24+i*21;tree(side*23,z,1.25);box([side*22,.3,z+3],[9,.5,2.5],M.dark);trim([side*22,.6,z+4.3],[9,.08,.07],M.blue)}
  box([side*20,11,-32.7],[20,19,.25],M.glass);
 }
 box([0,.03,17],[12,.06,12],M.dark);hexcoreFloorLogo(0,17,6.4);
 // Lower, narrower desk: staff heads and bodies remain visible above the counter.
 box([0,.53,-14],[8.6,1.06,1.5],M.dark);
 box([0,1.08,-14],[8.8,.07,1.65],M.violet);
 sign('RECEPTION',[0,.78,-13.18],4.4,.35);
 // Public-facing employees, no legal/policy archive access in this lobby.
 for(const [x,z,i] of [[-2.6,-15.45,1],[0,-15.45,2],[2.6,-15.45,3],[-13,-21,4],[13,-21,5],[-20,9,6],[20,9,7],[-18,24,8],[18,24,9]])employee(x,z,i);
 lightBench(-17,-6,.35);lightBench(17,-6,-.35);lightBench(-17,24,-.3);lightBench(17,24,.3);
 ambientVisitor(-12,11,10);ambientVisitor(12,11,11);ambientVisitor(-8,-2,12);ambientVisitor(9,-2,13);
 interact('Reception — floor directions',[0,1.4,-14],()=>openNpcDepartment('lobby'),5);
 hologram(0,12,-27);sign('WELCOME TO HEXCORE',[0,25,-34.2],23,2);
 for(let side of [-1,1]){box([side*29,20,-25],[.35,35,4],M.dark);trim([side*29,20,-22.9],[.07,34,.08],M.violet);box([side*22,7,-24],[.6,12,.8],M.dark)}
 // All department information belongs on its respective floor, never the lobby.
 floorPortalNexus(true);
 // The entrance is already part of the shared exterior/lobby geometry.
 for(let x of [-25,25]){let lamp=new THREE.PointLight(0x8f65ff,34,24,2);lamp.position.set(x,7,-8);world.add(lamp)}
 for(let x of [-18,18]){let uplight=new THREE.PointLight(0xaebfff,10,12,2);uplight.position.set(x,.8,18);world.add(uplight)}
 guard(-9,25,210,false);guard(9,25,211,false);guard(-23,-3,212,true);guard(23,-3,213,true);
 lobbyAccents();atriumUpgrade();v2LobbyArchitecture();lobbyV9Dressing();v10LobbyFinish();lobbyReferenceRedesign();
}
function openReception(){
 setPanel('<div class="eyebrow">HEXCORE / RECEPTION</div><h2>WELCOME TO HEXCORE TOWER</h2><p>Each website department occupies its own floor. Use the floor transit portal in the lobby to choose your destination.</p><p>Company information and questions are handled by employees on their respective floors. The front entrance doors lead out to the plaza.</p><button id="receptionClose">THANK YOU</button>');
 $('receptionClose').onclick=()=>{$('panel').classList.add('hidden');if(active&&!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{})};
}

const departmentAbyssImages={
 company:'./reference/pocket-dimensions/company.png',
 games:'./reference/pocket-dimensions/games.png',
 support:'./reference/pocket-dimensions/support.png',
 legal:'./reference/pocket-dimensions/legal.png',
 community:'./reference/pocket-dimensions/community.png',
 business:'./reference/pocket-dimensions/business.png',
 hardware:'./reference/pocket-dimensions/hardware.png',
 admin:'./reference/pocket-dimensions/admin.png'
};
// Department architecture is deliberately built from reusable meshes, never picture-walls.
// Keep public paths and all existing staff/interactions clear.
function departmentArchitecture(id){
 const material=(color,metalness=.48,roughness=.34)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const ink=material(0x101320),graphite=material(0x252b3e),stone=material(0x37394c),ivory=material(0x8d98aa,.38,.44);
 const accent=new THREE.MeshBasicMaterial({color:0x8170fc,toneMapped:false});
 const ice=new THREE.MeshBasicMaterial({color:0x68c8e9,toneMapped:false});
 const amber=new THREE.MeshBasicMaterial({color:0xdda680,toneMapped:false});
 const mint=new THREE.MeshBasicMaterial({color:0x72d8b6,toneMapped:false});
 const plinth=(x,z,w=7,d=4,h=.7,m=graphite)=>{box([x,h/2,z],[w,h,d],m);box([x,h+.025,z],[w,.05,d],stone)};
 const tower=(x,z,h,m=graphite,w=1.5)=>box([x,h/2,z],[w,h,w],m);
 const arch=(x,z,w,h,mat=graphite)=>{
  box([x-w/2,h/2,z],[.55,h,.95],mat);box([x+w/2,h/2,z],[.55,h,.95],mat);
  box([x,h,z],[w+.5,.55,.95],mat);
 };
 const lightLine=(a,b,mat=accent,r=.045)=>{
  const d=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));
  const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),8),mat);
  o.position.copy(new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5));
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());world.add(o);
 };
 const ring=(x,y,z,r,mat=accent,rotation=[0,0,0])=>{
  const m=new THREE.Mesh(new THREE.TorusGeometry(r,.095,8,56),mat);
  m.position.set(x,y,z);m.rotation.set(...rotation);world.add(m);return m;
 };
 const lamp=(x,z,c=ice)=>{box([x,6.5,z],[.17,11,.17],graphite);box([x,11.6,z],[3.4,.24,1.15],ink);box([x,11.43,z],[3,.055,.8],c)};
 const display=(x,z,w=6,h=3,mat=ice)=>{
  box([x,h/2+1,z],[w+.6,h+.65,.36],ink);
  const glass=new THREE.MeshBasicMaterial({color:0x1d3555,transparent:true,opacity:.45,depthWrite:false,side:THREE.DoubleSide});
  box([x,h/2+1,z+.24],[w,h,.06],glass);
  box([x,h+1.14,z+.3],[w*.85,.08,.07],mat);
 };
 switch(id){
  case 'company': // Monumental public information atrium / press gallery.
   for(const x of [-25,25]){tower(x,-22,9,stone,2);tower(x,24,7,graphite,1.4);lightLine([x,2,-23],[x,8,-23],amber)}
   arch(0,-28,18,8,stone);box([0,8.4,-28],[15,.16,.85],amber);
   for(const x of [-19,-10,10,19]){plinth(x,-18,6,2.4,.95,stone);display(x,-20.4,4,2.3,amber)}
   for(const x of [-14,14]){box([x,3,25],[7,5.6,1.2],graphite);lightLine([x-3,5.7,25.8],[x+3,5.7,25.8],amber)}
   break;
  case 'games': // Layered interactive development hangar, game exhibit stations.
   for(const x of [-23,-12,12,23]){plinth(x,-20,6,5,.9);ring(x,3.2,-20,2,ice,[.25,.3,0]);tower(x,-20,2.1,ink,1.2)}
   for(const x of [-24,24]){arch(x,13,8,8,graphite);display(x,13,5,3,accent);lightLine([x-4,7.3,13],[x+4,7.3,13],ice)}
   for(const x of [-8,8]){plinth(x,24,7,4,.6,stone);box([x,2.4,24],[.2,3.4,3],accent)}
   break;
  case 'support': // Calm customer care pods, service counters and privacy wings.
   for(const x of [-23,-13,13,23]){plinth(x,-17,6,4,.65,ivory);box([x,2.1,-18],[5,2.7,.25],graphite);ring(x,4,-17,1,mint)}
   for(const x of [-24,24]){arch(x,15,7,6,ivory);display(x,15,4.6,2.8,mint)}
   for(const z of [-8,5,22]){box([-30,2,z],[.35,4.1,6],stone);box([30,2,z],[.35,4.1,6],stone)}
   break;
  case 'legal': // Symmetrical solemn archival pillars and document repositories.
   for(const x of [-26,-18,18,26]){tower(x,-21,8,stone,2);box([x,8.15,-21],[2.8,.25,2.8],ivory)}
   arch(0,-27,21,9,graphite);box([0,9.4,-27],[20,.13,.9],amber);
   for(const x of [-24,24])for(const z of [-7,2,13,22]){box([x,2.1,z],[2.4,4.2,5],graphite);lightLine([x-1,1,z+2.7],[x+1,1,z+2.7],amber)}
   break;
  case 'community': // Amphitheater-like media gathering room without enclosure.
   for(const s of [-1,1])for(let j=0;j<3;j++){
    const x=s*(16+j*4);plinth(x,23,3.4,17,.3+j*.35,stone);
   }
   ring(0,5,-25,4.7,accent);ring(0,5,-25,3.8,ice);
   for(const x of [-24,24]){display(x,-20,6,4,accent);lamp(x,20,ice)}
   for(const x of [-10,0,10]){plinth(x,-28,7,2,.5,graphite);box([x,1.1,-28],[5,.15,1],accent)}
   break;
  case 'business': // Formal corporate meeting hall, poised abstract skyline.
   for(const x of [-27,-21,21,27]){tower(x,-24,10,stone,1.25);box([x,10.15,-24],[1.6,.25,1.6],ice)}
   for(const x of [-24,24]){plinth(x,-15,7,11,.5,ivory);display(x,-21,6,3.5,ice)}
   box([0,.52,25],[19,1,6],graphite);
   for(const x of [-7,-3.5,0,3.5,7])box([x,1.15,25],[2,.2,3.5],ivory);
   arch(0,-29,17,8,stone);
   break;
  case 'hardware': // Engineering test benches, modular tech plinths and display gantries.
   for(const x of [-24,-12,12,24]){plinth(x,-19,7,5,.65,stone);box([x,2.05,-19],[3.5,2.1,2],ink);ring(x,3.6,-19,1.4,ice,[0,.25,0])}
   for(const x of [-26,26]){arch(x,14,7,8,stone);lightLine([x-3,7.5,14],[x+3,7.5,14],mint);display(x,14,5,3,mint)}
   for(const x of [-18,18])plinth(x,26,9,3,.85,graphite);
   break;
  case 'admin': // Restrained private workspace, secure office silhouettes.
   for(const x of [-26,26]){tower(x,-20,9,graphite,1.8);lamp(x,-7,accent)}
   arch(0,-29,17,8,stone);box([0,8.2,-29],[15,.16,.95],accent);
   for(const x of [-19,19]){plinth(x,15,7,11,.6,ink);display(x,10,6,2.7,accent)}
   for(const z of [-15,3,25]){box([-31,1.7,z],[.6,3.3,5],stone);box([31,1.7,z],[.6,3.3,5],stone)}
   break;
 }
}
function floorRoom(data){guard(-27,22,300+floors.findIndex(f=>f.id===data.id),true);// Floating platform stays unchanged; individual abyss images replace only the black background.
 scene.background.setHex(0x000000);scene.fog=new THREE.FogExp2(0x000000,.00005);
 const abyssPath=departmentAbyssImages[data.id];
 if(abyssPath){
  const abyssTexture=new THREE.TextureLoader().load(abyssPath);
  abyssTexture.colorSpace=THREE.SRGBColorSpace;
  abyssTexture.mapping=THREE.EquirectangularReflectionMapping;
  abyssTexture.minFilter=THREE.LinearMipmapLinearFilter;
  abyssTexture.magFilter=THREE.LinearFilter;
  // A panoramic inside-facing background, not a billboard placed in the room.
  const abyssMaterial=new THREE.MeshBasicMaterial({map:abyssTexture,side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false});
  const abyssSky=new THREE.Mesh(new THREE.SphereGeometry(380,64,40),abyssMaterial);
  abyssSky.name='HexCore department abyss backdrop';
  abyssSky.renderOrder=-500;
  world.add(abyssSky);
 }

 box([0,-.58,0],[65,1.16,69],M.dark);
 box([0,.018,0],[64.7,.035,68.7],M.floor);
 const platformGlow=new THREE.MeshBasicMaterial({color:0x554383,toneMapped:false});
 for(const side of [-1,1]){box([side*32.35,.015,0],[.10,.07,68.7],platformGlow);box([0,.015,side*34.35],[64.7,.07,.10],platformGlow)}
 // Suspended fixtures are the only department illumination apart from existing displays.
 const fixtureMat=new THREE.MeshBasicMaterial({color:0x9cafff,toneMapped:false});
 for(const x of [-18,0,18])for(const z of [-19,5,24]){
  box([x,11.7,z],[5.8,.23,.9],M.dark);box([x,11.51,z],[5.4,.035,.54],fixtureMat);
  const light=new THREE.PointLight(0x9daeff,2.0,20,2);light.position.set(x,10.8,z);world.add(light);
 }departmentArchitecture(data.id);box([0,2.2,-25],[23,4.5,1],M.dark);sign(data.title,[0,4,-24.35],24,2.1);sign(data.summary.slice(0,54).toUpperCase(),[0,1.7,-24.35],25,1);hexcoreFloorLogo(0,18,4.4);for(let side of [-1,1]){tree(side*22,-18,1.2);box([side*20,.35,9],[15,.7,8],M.dark);trim([side*20,.72,13],[15,.07,.09],M.blue);panel([side*20,3.7,10.8],[11,5.8,.22],M.glass);panel([side*20,6.7,10.85],[11.2,.12,.3],side===1?M.blue:M.violet);sign('QUESTIONS',[side*20,8.45,10.98],6.8,.8);employee(side*20,2,side);employee(side*17,-3,side+2);employee(side*23,-8,side+4);employee(side*15,8,side+6);
 interact('Speak to '+data.title+' staff',[side*20,1.5,2],()=>openNpcDepartment(data.id),4.4);
 interact('Ask '+data.title+' staff',[side*17,1.5,-3],()=>openNpcDepartment(data.id),4.4)}floorPortalNexus();portal('DEPARTMENT CONSOLE',0,-18,()=>openService(data.id));if(data.id==='legal'){for(let i=0;i<4;i++)representative(-22+i*14,1,i);portal('POLICY Q & A',-21,-7,()=>openKnowledge());}if(data.id==='admin'){portal('CONTENT EDITOR',0,-7,()=>openAdmin())}}
// Keep the interior air volume free of tower-facade geometry. The exterior
// silhouette stays, but nothing from the exterior construction pass may fill
// the main lobby where a visitor actually walks.
function clearTowerFromLobbyVolume(){
 const occupied=new THREE.Box3(new THREE.Vector3(-26,0,-30),new THREE.Vector3(26,33,29));
 const bounds=new THREE.Box3();
 world.updateMatrixWorld(true);
 const toRemove=[];
 for(const child of world.children){
  if(!child.isMesh||!child.geometry||!child.material)continue;
  // Only structural exterior solids, never floor, glass, text, doors or lights.
  if(!child.geometry.type?.includes('BoxGeometry'))continue;
  if(child.material.transparent || child.material===M.glass)continue;
  child.geometry.computeBoundingBox();bounds.copy(child.geometry.boundingBox).applyMatrix4(child.matrixWorld);
  const dim=bounds.getSize(new THREE.Vector3());
  const overlaps=bounds.intersectsBox(occupied);
  const solidVertical=dim.y>9 && (dim.x>1.15 || dim.z>1.15);
  const largeHorizontal=dim.y>3 && dim.x>8 && dim.z>7;
  if(overlaps&&(solidVertical||largeHorizontal))toRemove.push(child);
 }
 for(const child of toRemove)world.remove(child);
 console.info('HexCore: cleared',toRemove.length,'exterior obstructions from lobby walking volume');
}
function exterior(){continuousPlaza();clearTowerFromLobbyVolume();createLivingSpace();lobby();
 const guide=employee(-9,158,41,'Welcome Guide');
 guide.userData.role='Welcome Guide';
 interact('Speak with '+guide.userData.name+' — Welcome Guide',[-9,1.6,158],()=>openNpcGuide(guide),5.5);
} // Single shared real-world exterior and lobby; no doorway textures.

function resetWorld(){departmentPortalFX=[];scene.background.setHex(0x090c18);while(world.children.length){let c=world.children[0];world.remove(c);c.traverse(o=>{o.geometry?.dispose();if(o.material && !Object.values(M).includes(o.material)){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(mat=>{mat.map?.dispose();mat.dispose()})}})}entities=[];animatedDoors=[];staffActors=[];spaceClouds=[];cosmicSkyLayers=[];orbitPlanets=[];spaceDepthLayers=[];npcConversationPulse.lastBeat=-1;scene.environment=null;scene.fog.density=.0031;scene.fog.color.setHex(0x101326)}
let floor='outside',yaw=0,pitch=0,keys={},pos=new THREE.Vector3(0,EYE_HEIGHT,181),active=false,nearest=null,quality='low',transitionCooldown=0;
// V4.2: The courtyard and lobby share one continuous scene. No doorway render targets.
let doorCache=null,initialWorldReady=false,preparingWorld=false;
const DOOR_Z=32;
function syncDoorOpenings(dt){
 for(const door of animatedDoors){
  const near=Math.hypot(pos.x-door.center.x,pos.z-door.center.z);
  const target=near<10.5?1:0;
  door.open+=(target-door.open)*Math.min(1,dt*8.5);
  door.left.position.x=-(door.rest||1.55)-door.open*door.travel;
  door.right.position.x=(door.rest||1.55)+door.open*door.travel;
 }
}
function updateDoorPreview(now,dt){
 if(floor==='outside'||floor==='lobby')syncDoorOpenings(dt);
}
function scheduleDoorPrebuild(){} // Both spaces are already present in the same scene.
function warmInitialExterior(){
 if(active||initialWorldReady||preparingWorld)return;
 preparingWorld=true;
 floor='outside';
 resetWorld();
 // Spread the large scene construction over multiple animation frames.
 // This avoids doing all of it inside the Quick Entry click handler.
 const jobs=[
  ()=>continuousPlaza(),
  ()=>createLivingSpace(),
  ()=>{
    lobby();
    const guide=employee(-9,158,41,'Welcome Guide');
    guide.userData.role='Welcome Guide';
    interact('Speak with '+guide.userData.name+' — Welcome Guide',[-9,1.6,158],()=>openNpcGuide(guide),5.5);
  },
  ()=>{
    pos.set(0,EYE_HEIGHT,181);yaw=0;pitch=0;
    camera.position.copy(pos);camera.rotation.set(0,0,0);
    // Force the first view's shader/material initialization during transit, not after arrival.
    if(!active){try{renderer.render(scene,camera)}catch(e){console.warn('Scene prewarm skipped',e)}}
    initialWorldReady=true;
    preparingWorld=false;
    const status=$('worldPrepStatus');if(status)status.textContent='HEADQUARTERS READY // AWAITING USER';
  }
 ];
 let step=0;
 const runStep=()=>{
  try{
   jobs[step++]();
   if(step<jobs.length)requestAnimationFrame(()=>setTimeout(runStep,0));
  }catch(err){
   console.error('Preparing headquarters failed',err);
   transitError=err;initialWorldReady=false;preparingWorld=false;
   const status=$('worldPrepStatus');if(status)status.textContent='Preparation failed. Reload the page to retry.';
  }
 };
 requestAnimationFrame(()=>setTimeout(runStep,0));
}
function crossDoor(target){
 if((target!=='outside'&&target!=='lobby')||floor===target)return;
 // Same scene, same camera, no rebuild and no swap.
 floor=target;
 transitionCooldown=.10;
}
function travel(id,spawn='default'){
 if((id==='lobby'||id==='outside')&&(floor==='lobby'||floor==='outside')){crossDoor(id);return;}
 doorCache=null;
 const oldPos=pos.clone(),oldYaw=yaw,oldPitch=pitch;
 closePortalSelector();floor=id;resetWorld();
 if(id==='outside'){
  cosmicElapsedMs=0;exterior();
  if(spawn==='fromLobby'){pos.set(Math.max(-4.8,Math.min(4.8,oldPos.x)),EYE_HEIGHT,32.12);yaw=oldYaw;pitch=oldPitch;}
  else{pos.set(0,EYE_HEIGHT,181);yaw=0;pitch=0;}
 }else if(id==='lobby'){
  exterior();
  if(spawn==='fromOutside'){pos.set(Math.max(-4.8,Math.min(4.8,oldPos.x)),EYE_HEIGHT,31.88);yaw=oldYaw;pitch=oldPitch;}
  else{pos.set(0,EYE_HEIGHT,21);yaw=0;pitch=0;}
 }else{
  floorRoom(floors.find(f=>f.id===id)||floors[0]);pos.set(0,EYE_HEIGHT,21);yaw=0;pitch=0;
 }
 camera.position.copy(pos);camera.rotation.set(pitch,yaw,0);
 $('zone').textContent=id==='outside'?'HEXCORE // EXTERIOR PLAZA':(floors.find(f=>f.id===id)?.label||'TOWER').toUpperCase();
 hideAll();transitionCooldown=.18;
 // Preload the other side asynchronously after the first playable frame, never on ENTER.
 if(id==='lobby'||id==='outside')scheduleDoorPrebuild();
}
function hideAll(){const hadOverlay=!$('panel').classList.contains('hidden')||!$('nav').classList.contains('hidden');$('panel').classList.add('hidden');$('nav').classList.add('hidden');keys={};if(hadOverlay&&document.pointerLockElement===renderer.domElement)document.exitPointerLock()}
function setPanel(html){$('panelBody').innerHTML=html; if($('panelBody').querySelector('#guideClose'))$('panelBody').querySelector('#guideClose').onclick=()=>$('panel').classList.add('hidden');$('panel').classList.remove('hidden');keys={};if(document.pointerLockElement)document.exitPointerLock()}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function openService(id){const c=content(id);const qaLink=id==='legal'?'<button id="seeQA">OPEN PRESERVED POLICY Q & A</button>':'';setPanel(`<div class="eyebrow">HEXCORE / ${esc(id.toUpperCase())}</div><h2>${esc(c.headline)}</h2><p>${esc(c.description)}</p><div class="directory-item"><h3>INFORMATION</h3><p>${esc(c.updates)}</p></div>${qaLink}<p class="small">This is an editable content location. Unpublished contact links, sales, and submissions are not represented as live services.</p>`);$('seeQA')?.addEventListener('click',()=>openKnowledge())}

// PHASE 3: A consistent in-world conversation flow; approved legal Q&A remain untouched.
function npcAnswerPanel({name,role,department,opening,questions}){
 const questionRows=[...questions,...npcSharedQuestions];
 const questionHtml=questionRows.map((q,i)=>`<button data-npcquestion="${i}">${esc(q.question)}</button>`).join('');
 setPanel(`<div class="eyebrow">HEXCORE // ${esc(department||'VISITOR SERVICES')}</div><h2>${esc(name||'HEXCORE STAFF')}</h2><p class="subtle">${esc(role||'EMPLOYEE')}</p><div class="directory-item"><p id="npcSpeech" aria-live="polite">${esc(opening||'Welcome to HexCore. How can I help you?')}</p></div><div class="floor-buttons">${questionHtml}</div><button id="npcGoodbye">GOODBYE</button>`);
 $('panelBody').querySelectorAll('[data-npcquestion]').forEach(btn=>{
  btn.onclick=()=>{
   const q=questionRows[Number(btn.dataset.npcquestion)];
   const display=$('npcSpeech');
   if(!q||!display)return;
   if(q.action==='directions'){
    display.innerHTML=esc(npcDirectoryDirections());
   }else{display.textContent=q.answer||'That information has not been announced yet. Please check the relevant department for official updates.';}
  };
 });
 $('npcGoodbye').onclick=()=>{hideAll();if(active&&!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{});};
}
function npcDirectoryDirections(){
 return 'Use the floor transit portal in the main lobby. Available public departments: '+floors.filter(f=>!['lobby','admin'].includes(f.id)).map(f=>f.label).join('; ')+'. The front lobby doors lead directly to the courtyard.';
}
function openNpcGuide(actor){
 npcAnswerPanel({name:actor?.userData?.name||'Welcome Guide',role:'Visitor Orientation Specialist',department:'COURTYARD',opening:courtyardGuide.greeting,questions:courtyardGuide.questions});
}
function openNpcDepartment(id,actor){
 const cfg=npcDepartments[id]||npcDepartments.lobby;
 const c=content(id);const role=cfg.role||'Department Representative';
 const questions=(managedContent.faq[id]||cfg.questions||[]).map(q=>({question:q.question,answer:q.answer==='@description'?c.description:q.answer==='@updates'?c.updates:q.answer}));
 npcAnswerPanel({name:actor?.userData?.name||cfg.name||c.headline,role,department:id.toUpperCase(),opening:cfg.greeting,questions});
}
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

// V6.0.36: The same published CMS records power a 3D visitor's news/media terminal.
// All public text is escaped; HTML elements are assembled without trusting CMS markup.
const publicPosts3D=()=>Array.isArray(managedContent.posts)?managedContent.posts.filter(p=>p.status==='published'&&(p.destination==='both'||p.destination==='3d')):[];
function mediaURL3D(url){if(!url||typeof url!=='string')return '';try{const normalized=url.startsWith('../reference/')?'./'+url.slice(3):url;const x=new URL(normalized,location.href);return ['https:','http:'].includes(x.protocol)?x.href:''}catch{return ''}}
function youtubeEmbed3D(value){try{const u=new URL(value);if(u.protocol!=='https:')return '';let id='';if(u.hostname==='youtu.be')id=u.pathname.slice(1);else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(u.hostname))id=u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]||'';return /^[\w-]{11}$/.test(id)?'https://www.youtube-nocookie.com/embed/'+id:''}catch{return ''}}
function openContentArchive3D(section='posts'){
 const posts=publicPosts3D().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
 const images=(managedContent.media||[]).filter(m=>m.type==='image'&&['both','3d'].includes(m.destination||'both'));
 setPanel(`<div class="eyebrow">HEXCORE / PUBLISHED INFORMATION</div><h2>NEWS & MEDIA</h2><p>Browse official HexCore content from the shared publishing system.</p><div class="floor-buttons"><button id="archivePosts">NEWS & UPDATES (${posts.length})</button><button id="archiveImages">IMAGE GALLERY (${images.length})</button></div><input id="archiveSearch" type="search" placeholder="Search published content…" aria-label="Search published content"><div id="archiveRecords"></div>`);
 const draw=()=>{const q=$('archiveSearch').value.toLowerCase().trim();const host=$('archiveRecords');host.replaceChildren();if(section==='posts'){const rows=posts.filter(p=>[p.title,p.summary,p.body,p.category].join(' ').toLowerCase().includes(q));rows.forEach(post=>{const row=document.createElement('div');row.className='directory-item';const btn=document.createElement('button');btn.textContent=(post.title||'Untitled')+' — '+(post.category||'Update');btn.onclick=()=>{
 setPanel(`<div class="eyebrow">HEXCORE / ${esc(post.category||'UPDATE')}</div><h2>${esc(post.title||'Untitled')}</h2><p>${esc(post.summary||'')}</p><div class="directory-item" style="white-space:pre-wrap">${esc(post.body||'')}</div><div id="archiveAttachments"></div><button id="archiveBack">BACK TO UPDATES</button>`);
 const holder=$('archiveAttachments');const cover=mediaURL3D(post.cover);if(cover){const img=document.createElement('img');img.src=cover;img.alt=post.title||'Published image';img.loading='lazy';img.style.cssText='width:100%;max-height:380px;object-fit:contain;margin:12px 0';holder.append(img)}const embed=youtubeEmbed3D(post.video);if(embed){const frame=document.createElement('iframe');frame.src=embed;frame.title='Published HexCore video';frame.allowFullscreen=true;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';frame.style.cssText='width:100%;aspect-ratio:16/9;border:0;margin:12px 0';holder.append(frame)}$('archiveBack').onclick=()=>openContentArchive3D('posts');};row.append(btn);host.append(row)});if(!rows.length)host.textContent='No matching published news yet.';
 }else{const rows=images.filter(m=>(m.title||'').toLowerCase().includes(q));for(const item of rows){const src=mediaURL3D(item.url);if(!src)continue;const row=document.createElement('div');row.className='directory-item';const title=document.createElement('h3');title.textContent=item.title||'Image';const img=document.createElement('img');img.src=src;img.alt=item.title||'HexCore image';img.loading='lazy';img.style.cssText='max-width:100%;max-height:250px;object-fit:contain';row.append(title,img);host.append(row)}if(!host.children.length)host.textContent='No matching published images yet.'}};
 $('archivePosts').onclick=()=>openContentArchive3D('posts');$('archiveImages').onclick=()=>openContentArchive3D('images');$('archiveSearch').addEventListener('input',draw);draw();
}
function openTraditionalTerminal3D(){
 setPanel(`<div class="eyebrow">HEXCORE / PUBLIC INTERFACE</div><h2>TRADITIONAL WEBSITE</h2><p>Browse the full holographic website without leaving the headquarters session.</p><div id="websiteFrameHost"></div><button id="websiteClose">CLOSE TERMINAL</button>`);
 const frame=document.createElement('iframe');frame.src='./holographic.html';frame.title='HexCore traditional holographic website';frame.loading='lazy';frame.style.cssText='width:100%;height:min(68vh,700px);border:1px solid #60539b;border-radius:9px;background:#090b18';$('websiteFrameHost').append(frame);$('websiteClose').onclick=hideAll;
}
$('contentArchiveBtn').onclick=()=>{hideAll();openContentArchive3D()};
$('websiteTerminalBtn').onclick=()=>{hideAll();openTraditionalTerminal3D()};

$('closePanel').onclick=()=>{$('panel').classList.add('hidden');if(active&&!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{})};$('closeNav').onclick=()=>{$('nav').classList.add('hidden');if(active&&!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{})};$('menuBtn').onclick=()=>{hideAll();$('nav').classList.remove('hidden')};$('settingsBtn').onclick=()=>{hideAll();setPanel(`<h2>GRAPHICS & CONTROLS</h2><p>Adaptive rendering supports mobile and desktop devices.</p><select id="liveQuality"><option value="low">LOW / MOBILE</option><option value="medium">BALANCED</option><option value="high">HIGH</option></select><button id="applyQuality">APPLY</button><p>Desktop: WASD, mouse, Shift, E. Mobile: left MOVE joystick, swipe screen to LOOK, bottom INTERACT and RUN.</p>`);$('liveQuality').value=quality;$('applyQuality').onclick=()=>{quality=$('liveQuality').value;resizeRenderer();$('panel').classList.add('hidden')}};$('returnLobby').onclick=()=>travel('lobby');$('floorButtons').innerHTML=floors.map(f=>`<div class="directory-item">${esc(f.label)}</div>`).join('')+'<div class="directory-item">OUTSIDE • EXIT THROUGH LOBBY</div>';
function resizeRenderer(){let dpr=quality==='low'?Math.min(devicePixelRatio,1):quality==='medium'?Math.min(devicePixelRatio,1.35):Math.min(devicePixelRatio,1.4);renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}window.addEventListener('resize',resizeRenderer);
let prev=performance.now(),movePad={x:0,y:0},lookPad={x:0,y:0},running=false,mobile=matchMedia('(pointer:coarse)').matches || navigator.maxTouchPoints>0 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
function initPad(id,target){
 const el=$(id),nub=el.querySelector('.nub');let activeId=null;
 const clear=()=>{activeId=null;target.x=0;target.y=0;nub.style.transform='translate(0px,0px)'};
 function update(e){const b=el.getBoundingClientRect();const dx=(e.clientX-b.left-b.width/2),dy=(e.clientY-b.top-b.height/2);
  const limit=(b.width-nub.offsetWidth)*.5;const scale=Math.max(1,limit);
  const distance=Math.hypot(dx,dy),factor=Math.min(1,limit/Math.max(distance,.0001));
  const mx=dx*factor,my=dy*factor;target.x=Math.abs(mx/scale)<.07?0:mx/scale;target.y=Math.abs(my/scale)<.07?0:my/scale;
  nub.style.transform=`translate(${mx}px,${my}px)`;
 }
 el.addEventListener('pointerdown',e=>{if(activeId!==null)return;e.preventDefault();activeId=e.pointerId;el.setPointerCapture(activeId);update(e)});
 el.addEventListener('pointermove',e=>{if(activeId!==e.pointerId)return;e.preventDefault();update(e)});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,e=>{if(activeId===e.pointerId)clear()});
 return clear;
}
const clearMovePad=initPad('movePad',movePad);
const clearLookPad=()=>{lookPad.x=0;lookPad.y=0;};
// Camera swipe: use the WebGL canvas so buttons, joystick and overlays keep their own touches.
let lookTouchId=null,lookTouchX=0,lookTouchY=0;
renderer.domElement.addEventListener('pointerdown',e=>{
 if(!mobile||!active||lookTouchId!==null||!$('panel').classList.contains('hidden')||!$('nav').classList.contains('hidden'))return;
 lookTouchId=e.pointerId;lookTouchX=e.clientX;lookTouchY=e.clientY;
 try{renderer.domElement.setPointerCapture(e.pointerId)}catch{}
});
renderer.domElement.addEventListener('pointermove',e=>{
 if(!mobile||e.pointerId!==lookTouchId||!active||!$('panel').classList.contains('hidden')||!$('nav').classList.contains('hidden'))return;
 const dx=e.clientX-lookTouchX,dy=e.clientY-lookTouchY;
 lookTouchX=e.clientX;lookTouchY=e.clientY;
 yaw-=dx*.004;pitch=Math.max(-1.32,Math.min(1.32,pitch-dy*.004));
});
for(const evt of ['pointerup','pointercancel','lostpointercapture'])renderer.domElement.addEventListener(evt,e=>{if(e.pointerId===lookTouchId)lookTouchId=null});
$('interactTouch').addEventListener('pointerdown',e=>{e.preventDefault();if(portalSelection){const choice=portalSelection.choices[portalSelection.index];if(choice){closePortalSelector();travel(choice.id)}return;}
 if(nearest && $('panel').classList.contains('hidden') && $('nav').classList.contains('hidden'))nearest.cb();});
$('runTouch').addEventListener('pointerdown',e=>{e.preventDefault();running=true;$('runTouch').setPointerCapture(e.pointerId)});
for(const evt of ['pointerup','pointercancel','lostpointercapture'])$('runTouch').addEventListener(evt,()=>running=false);
window.addEventListener('blur',()=>{clearMovePad();clearLookPad();running=false});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearMovePad();clearLookPad();running=false}});
window.addEventListener('keydown',e=>{if(portalSelection){if(portalInput(e.code))e.preventDefault();return}if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(['KeyW','KeyA','KeyS','KeyD','Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(!$('panel').classList.contains('hidden')||!$('nav').classList.contains('hidden')){if(e.code==='Escape')hideAll();return}keys[e.code]=true;if(e.code==='KeyE'&&!e.repeat)nearest?.cb();if(e.code==='Escape')$('menuBtn').click()});window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',()=>{keys={};running=false});renderer.domElement.addEventListener('click',()=>{if(active&&!mobile&&$('panel').classList.contains('hidden')&&$('nav').classList.contains('hidden'))renderer.domElement.requestPointerLock?.()});window.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){yaw-=e.movementX*.0023;pitch=Math.max(-1.32,Math.min(1.32,pitch-e.movementY*.0023))}});
function tick(now){requestAnimationFrame(tick);let dt=Math.min((now-prev)/1000,.045);prev=now;if(!active)return;if(!portalSelection&&$('panel').classList.contains('hidden')&&$('nav').classList.contains('hidden')){yaw-=lookPad.x*dt*2.5;pitch=Math.max(-1.3,Math.min(1.3,pitch-lookPad.y*dt*2));let forward=(Number(!!keys.KeyW)-Number(!!keys.KeyS))-movePad.y;let strafe=(Number(!!keys.KeyD)-Number(!!keys.KeyA))+movePad.x;let len=Math.hypot(forward,strafe);if(len>.05){const speed=(keys.ShiftLeft||keys.ShiftRight||running?11:6.5)*dt/Math.max(1,len);const forwardX=-Math.sin(yaw),forwardZ=-Math.cos(yaw);const rightX=Math.cos(yaw),rightZ=-Math.sin(yaw);let nx=pos.x+(forwardX*forward+rightX*strafe)*speed;let nz=pos.z+(forwardZ*forward+rightZ*strafe)*speed;if(floor==='outside'||floor==='lobby'){pos.x=Math.max(-101,Math.min(101,nx));pos.z=Math.max(-31,Math.min(184,nz));}else{pos.x=Math.max(-30,Math.min(30,nx));pos.z=Math.max(-31,Math.min(31,nz))}}}camera.position.copy(pos);camera.rotation.set(pitch,yaw,0);
if(floor==='lobby')$('zone').textContent='G • MAIN LOBBY';
if(floor==='outside')$('zone').textContent='HEXCORE // EXTERIOR PLAZA';
npcConversationPulse(now);if(floor==='outside'||floor==='lobby')cosmicElapsedMs+=dt*1000;updateLivingSpace(now);updatePeacefulSpace(now);
for(const g of staffActors){
 const ph=g.userData.phase||0, model=g.userData.visualModel;
 const isWalking=!!g.userData.walkPath;
 let walkIntensity=0;
 if(isWalking){
  const t=now*.001*g.userData.speed+ph;
  const nextX=g.userData.homeX+Math.sin(t)*g.userData.range;
  const nextZ=g.userData.homeZ+Math.cos(t)*g.userData.range*.65;
  const dx=g.userData.range*Math.cos(t)*g.userData.speed;
  const dz=-g.userData.range*.65*Math.sin(t)*g.userData.speed;
  const motion=Math.hypot(dx,dz);
  walkIntensity=Math.min(1,motion/1.25);
  g.position.x=nextX;g.position.z=nextZ;
  // Three.js +Z is model-forward. Face actual patrol tangent, not the orbit center.
  g.rotation.y=Math.atan2(dx,dz);
 }else if(!g.userData.speech?.visible){
  g.rotation.y=(g.userData.turn||0)+Math.sin(now*.00065+ph)*.09;
 }
 // Both legs and arms articulate, with opposite phase and a planted-foot portion.
 // Idle employees retain subtle breathing but never run in place.
 const step=(now*.001*2.9+ph*2.1), swing=Math.sin(step);
 if(model?.userData.legPivots){
   const legs=model.userData.legPivots;
   legs[0].rotation.x=swing*.48*walkIntensity;
   legs[1].rotation.x=-swing*.48*walkIntensity;
   legs[0].rotation.z=Math.cos(step)*.025*walkIntensity;
   legs[1].rotation.z=-Math.cos(step)*.025*walkIntensity;
 }
 if(model?.userData.armPivots){
   const arms=model.userData.armPivots;
   arms[0].rotation.x=-swing*.39*walkIntensity+Math.sin(now*.0014+ph)*.025;
   arms[1].rotation.x=swing*.39*walkIntensity-Math.sin(now*.0014+ph)*.025;
   arms[0].rotation.z=-walkIntensity*.04;
   arms[1].rotation.z=walkIntensity*.04;
 }
 if(g.userData.tag)g.userData.tag.rotation.y=yaw-g.rotation.y;
 if(g.userData.speech)g.userData.speech.rotation.y=yaw-g.rotation.y;
 g.position.y=(g.userData.baseY||0)+Math.abs(Math.sin(step))*walkIntensity*.033+Math.sin(now*.0012+ph)*(1-walkIntensity)*.015;
}

updateDoorPreview(now,dt);
if(transitionCooldown>0)transitionCooldown-=dt;
if(transitionCooldown<=0&&Math.abs(pos.x)<5.5){
 if(floor==='lobby'&&pos.z>=32.02)crossDoor('outside');
 else if(floor==='outside'&&pos.z<=31.98)crossDoor('lobby');
}
nearest=null;let d=1000;for(let ent of entities){let dist=pos.distanceTo(ent.pos);if(dist<ent.range&&dist<d){nearest=ent;d=dist}}$('prompt').classList.toggle('hidden',!nearest||!$('panel').classList.contains('hidden')||!$('nav').classList.contains('hidden')||!!portalSelection);if(nearest)$('prompt').textContent=(mobile?'INTERACT':'[ E ]')+'  '+nearest.name;if(floor==='outside'||floor==='lobby')updateExteriorV6(now/1000);for(const fx of departmentPortalFX){fx.energy.uniforms.time.value=now*.001;fx.movingRim.rotation.z=now*.00024;}renderer.render(scene,camera);hexcoreRuntime.frame(dt)}requestAnimationFrame(tick);
// Phase 4: travel lasts at least ten seconds, while world preparation happens behind it.
let transitRunning=false;
let transitError=null;
const transitStart=(quickSex=null)=>{
 if(transitRunning)return;
 if(quickSex){selected={species:'human',body:quickSex,preset:'standard',outfit:'casual'};updateAppearanceButtons();}
 transitRunning=true;
 const requestedQuality=$('quality').value==='auto'?(mobile?'low':'medium'):$('quality').value;
 quality=requestedQuality;resizeRenderer();
 $('entry').classList.add('hidden');$('loading').classList.add('hidden');
 $('networkTransit').classList.remove('hidden');$('authorizationText').classList.add('hidden');
 window.HexCoreNetwork?.start();
 $('transitStatus').textContent='TRANSFERRING USER INSTANCE';
 let start=performance.now();transitError=null;
 // Yield to the compositor before doing any remaining preparation work.
 const prepare=()=>{if(!initialWorldReady&&!preparingWorld&&!transitError)warmInitialExterior();};
 // Permit multiple frames of uninterrupted network animation before scene building.
 setTimeout(prepare,1600);
 const flight=now=>{
  const elapsed=now-start;
  if(transitError){$('transitStatus').textContent='STARTUP ERROR — PLEASE RELOAD';window.HexCoreNetwork?.stop();transitRunning=false;return;}
  if(elapsed>=7000)$('authorizationText').classList.remove('hidden');
  if(elapsed>=10000&&initialWorldReady){finishArrival();return;}
  if(elapsed>=10000&&!initialWorldReady){$('transitStatus').textContent='PREPARING DESTINATION';}
  requestAnimationFrame(flight);
 };
 requestAnimationFrame(flight);
};
function finishArrival(){
 window.HexCoreNetwork?.stop();
 $('networkTransit').classList.add('hidden');$('hud').classList.remove('hidden');
 if(mobile){$('mobileUI').classList.remove('hidden');document.body.classList.add('touch-mode');}
 active=true;floor='outside';pos.set(0,EYE_HEIGHT,181);yaw=0;pitch=0;
 camera.position.copy(pos);camera.rotation.set(0,0,0);
 $('zone').textContent='HEXCORE // EXTERIOR PLAZA';
 scheduleDoorPrebuild();
 $('arrivalBeam').classList.remove('hidden');
 setTimeout(()=>$('arrivalBeam').classList.add('hidden'),3000);
 if(!mobile)renderer.domElement.requestPointerLock?.().catch(()=>{});
 try{localStorage.setItem('hexcore_character',JSON.stringify(selected))}catch{}
}
$('enter').onclick=()=>transitStart();
$('quickMale').onclick=()=>transitStart('male');
$('quickFemale').onclick=()=>transitStart('female');
try{const stored=JSON.parse(localStorage.getItem('hexcore_character')||'{}');Object.assign(selected,stored);if(selected.body==='masculine')selected.body='male';if(selected.body==='feminine')selected.body='female';updateAppearanceButtons()}catch{updateAppearanceButtons()}
resizeRenderer();$('loading').classList.add('hidden');$('entry').classList.remove('hidden');
// Do not build the massive 3D scene while visitors are trying to use the menu.
// Preparation begins during the network transit, after its first animated frame.
const idleStatus=$('worldPrepStatus');
if(idleStatus)idleStatus.textContent='HEADQUARTERS TRANSIT READY // SELECT YOUR ARRIVAL';
