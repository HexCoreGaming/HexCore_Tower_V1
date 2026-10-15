(()=>{
'use strict';
// A lightweight, true perspective flight through a spatial data network.
// One 2D canvas, no shaders, textures, WebGL contexts, or external downloads.
const canvas=document.getElementById('networkCanvas');if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
let alive=false,request=0,start=0,w=0,h=0,dpr=1,stars=[];
const rnd=(n)=>{const x=Math.sin(n*76.31+19.7)*43758.5453;return x-Math.floor(x)};
function resize(){dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);}
function point(x,y,z,t,ox=0,oy=0){const focal=Math.min(w,h)*1.15;const scale=focal/Math.max(12,z);return [w*.5+(x+ox)*scale+Math.sin(t*.00015)*8,h*.49+(y+oy)*scale+Math.cos(t*.00017)*7,scale];}
function trace(points,col,line=1,glow=0){if(points.length<2)return;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.strokeStyle=col;ctx.lineWidth=line;if(glow){ctx.shadowBlur=glow;ctx.shadowColor=col;}ctx.stroke();ctx.shadowBlur=0;}
function frame(now){if(!alive)return;
const dt=now-start,low=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const t=low?0:dt;const cx=w/2,cy=h*.49;
const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.75);bg.addColorStop(0,'#181334');bg.addColorStop(.33,'#080e24');bg.addColorStop(.72,'#030712');bg.addColorStop(1,'#000207');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
// Receding nested architecture, like flying through successive network gateways.
const off=t*.031;const corners=[[-42,-24],[42,-24],[42,24],[-42,24],[-42,-24]];
for(let i=0;i<22;i++){
 const z=18+((i*27-off)%600+600)%600;
 const a=Math.max(.02,Math.min(.85,1-z/650));
 const pts=corners.map(([x,y])=>point(x,y,z,t));
 trace(pts,`rgba(${i%3?'99,174,255':'182,102,255'},${a})`,Math.max(.5,2.1-z/430),i%3?0:12);
 if(i%2===0){for(let j=0;j<4;j++){
   const [x,y]=corners[j],p1=point(x,y,z,t),p2=point(x,y,z+42,t);
   trace([p1,p2],`rgba(112,101,244,${a*.45})`,.8);
 }}
}
// Vanishing-point highways, not a repeating flat square grid.
for(let j=-7;j<=7;j++){
 const x=j*12;
 const p1=point(x,-24,22,t),p2=point(x,-24,570,t);
 trace([p1,p2],`rgba(105,201,255,${.12+(.07*(j%2===0))})`,1);
 const q1=point(x,24,22,t),q2=point(x,24,570,t);
 trace([q1,q2],'rgba(174,92,255,.12)',1);
}
for(let j=0;j<30;j++){
 const z=25+((j*24-off*1.4)%660+660)%660;
 const p1=point(-90,-24,z,t),p2=point(90,-24,z,t);
 trace([p1,p2],`rgba(92,168,244,${Math.max(.03,.23-z/3300)})`,1);
}
// Streaming packets fly past at different depths; bounded stable object count.
for(let i=0;i<170;i++){
 const seed=i*1.71;
 const zz=12+((rnd(seed+8)*700-t*(.035+rnd(seed+3)*.022))%700+700)%700;
 const x=(rnd(seed+1)-.5)*190,y=(rnd(seed+2)-.5)*125;
 const p=point(x,y,zz,t),q=point(x,y,Math.min(zz+18,720),t);
 let a=Math.max(.05,.83-zz/800);
 trace([p,q],`rgba(${i%5===0?'185,104,255':'90,190,255'},${a})`,Math.max(.4,1.7-zz/620));
}
const halo=ctx.createRadialGradient(cx,cy,1,cx,cy,Math.min(w,h)*.22);halo.addColorStop(0,'rgba(177,225,255,.27)');halo.addColorStop(.2,'rgba(90,121,255,.08)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
if(!low)request=requestAnimationFrame(frame);
}
window.HexCoreNetwork={
 start(){this.stop();alive=true;resize();start=performance.now();request=requestAnimationFrame(frame);},
 stop(){alive=false;if(request)cancelAnimationFrame(request);request=0;}
};
window.addEventListener('resize',()=>{if(alive)resize()},{passive:true});
})();