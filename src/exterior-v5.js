/**
 * HEXCORE // EXTERIOR ART V5
 * Visual-only 3D architecture for the shared exterior/lobby scene.
 * The interaction, entrance trigger, doors, NPC data, portals and movement stay in main.js.
 * Geometry is multi-layered, bevelled and sided, not a facade screenshot/billboard.
 * User-approved exterior references: reference/exterior-v5-{front,wide,side,rear}.png.
 */
let waterMaps=[];
export function updateExteriorV5(seconds){for(let i=0;i<waterMaps.length;i++)waterMaps[i].offset.y=-(seconds*.052+i*.013)%1;}

export function buildExteriorV5({THREE,scene,world,automaticEntrance,guard,hexcoreFloorLogo,skyNebula,buildOrbitingPlanets}){
 waterMaps=[];
 skyNebula(); buildOrbitingPlanets();
 const rnd=(()=>{let s=510251;return ()=>((s=Math.imul(s,1664525)+1013904223|0)>>>0)/4294967296})();
 const loader=new THREE.TextureLoader();
 const metalTex=loader.load('./reference/v5-brushed-metal.jpg');
 metalTex.colorSpace=THREE.SRGBColorSpace;metalTex.wrapS=metalTex.wrapT=THREE.RepeatWrapping;metalTex.repeat.set(1,2);
 const floorTex=loader.load('./reference/v5-obsidian-plaza.jpg');
 floorTex.colorSpace=THREE.SRGBColorSpace;floorTex.wrapS=floorTex.wrapT=THREE.RepeatWrapping;floorTex.repeat.set(6,8);
 floorTex.anisotropy=8;metalTex.anisotropy=8;
 const metalNormal=loader.load('./reference/v5-brushed-normal.png');
 const floorNormal=loader.load('./reference/v5-obsidian-normal.png');
 metalNormal.wrapS=metalNormal.wrapT=THREE.RepeatWrapping;metalNormal.repeat.set(1,2);
 floorNormal.wrapS=floorNormal.wrapT=THREE.RepeatWrapping;floorNormal.repeat.set(6,8);
 const waterfallImage=loader.load('./reference/v5-waterfall.png');waterfallImage.colorSpace=THREE.SRGBColorSpace;
 waterfallImage.wrapS=waterfallImage.wrapT=THREE.RepeatWrapping;
 const metal=new THREE.MeshStandardMaterial({color:0x697189,map:metalTex,normalMap:metalNormal,normalScale:new THREE.Vector2(.42,.42),metalness:.82,roughness:.27});
 const armor=new THREE.MeshStandardMaterial({color:0x111622,metalness:.87,roughness:.23});
 const dark=new THREE.MeshStandardMaterial({color:0x060a14,metalness:.75,roughness:.28});
 const inset=new THREE.MeshStandardMaterial({color:0x0d1024,metalness:.63,roughness:.17});
 const silver=new THREE.MeshStandardMaterial({color:0x727c9b,metalness:.86,roughness:.23});
 const blackGlass=new THREE.MeshPhysicalMaterial({color:0x223651,metalness:.3,roughness:.055,transparent:true,opacity:.24,side:THREE.DoubleSide,depthWrite:false,clearcoat:1,clearcoatRoughness:.04});
 const sheen=new THREE.MeshPhysicalMaterial({color:0x3d4771,metalness:.8,roughness:.13,clearcoat:1,clearcoatRoughness:.07});
 const plaza=new THREE.MeshPhysicalMaterial({color:0x777b9d,map:floorTex,normalMap:floorNormal,normalScale:new THREE.Vector2(.24,.24),metalness:.74,roughness:.12,clearcoat:1,clearcoatRoughness:.045,envMapIntensity:1.9});
 const rock=new THREE.MeshStandardMaterial({color:0x171627,metalness:.33,roughness:.85,flatShading:true});
 const planting=new THREE.MeshStandardMaterial({color:0x1a2030,roughness:.6,metalness:.4});
 const wood=new THREE.MeshStandardMaterial({color:0x151324,roughness:.91});
 const leaves=new THREE.MeshStandardMaterial({color:0x493078,emissive:0x4c1d8e,emissiveIntensity:.38,roughness:.74,metalness:.02,side:THREE.DoubleSide,depthWrite:true});
 const violet=new THREE.MeshBasicMaterial({color:0x8f60fb,toneMapped:false});
 const ice=new THREE.MeshBasicMaterial({color:0x8ebdff,toneMapped:false});
 const pearl=new THREE.MeshBasicMaterial({color:0xbcc6ff,toneMapped:false});
 const warm=new THREE.MeshBasicMaterial({color:0xdaa9ff,toneMapped:false});
 const glassGlow=new THREE.MeshBasicMaterial({color:0x9c83ff,transparent:true,opacity:.11,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
 const floorLight=new THREE.MeshBasicMaterial({color:0xb88aff,toneMapped:false});
 const materials=[armor,dark,inset,metal,silver];
 const yAxis=new THREE.Vector3(0,1,0);
 const root=new THREE.Group(); root.name='HEXCORE Exterior V5 | render-only architecture';world.add(root);
 function mesh(geo,mat,position,parent=root){const o=new THREE.Mesh(geo,mat);if(position)o.position.set(...position);parent.add(o);return o;}
 function cub(p,s,mat,parent=root){return mesh(new THREE.BoxGeometry(...s),mat,p,parent);}
 function cyl(p,rt,rb,h,mat,segments=8,parent=root){return mesh(new THREE.CylinderGeometry(rt,rb,h,segments),mat,p,parent);}
 function prism(points,z,depth,mat,bevel=.23,parent=root){
   const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
   const geo=new THREE.ExtrudeGeometry(shape,{depth,steps:1,curveSegments:2,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel*.75,bevelSegments:2});
   const m=mesh(geo,mat,[0,0,z],parent);return m;
 }
 function stripe(a,b,r,mat,parent=root,edges=7){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),v=B.clone().sub(A);const ob=cyl([0,0,0],r,r,v.length(),mat,edges,parent);ob.position.copy(A).add(B).multiplyScalar(.5);ob.quaternion.setFromUnitVectors(yAxis,v.normalize());return ob;}
 function roadCurve(points,w,mat,tubular=90){const cr=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.12);return mesh(new THREE.TubeGeometry(cr,tubular,w,7,false),mat);}
 function ringPath(cx,cz,rx,rz,h,rot=0,segments=176){return Array.from({length:segments},(_,k)=>{const a=k/segments*Math.PI*2;const x=Math.cos(a)*rx,z=Math.sin(a)*rz;return [cx+x*Math.cos(rot)-z*Math.sin(rot),h+Math.sin(a*2)*1.3,cz+x*Math.sin(rot)+z*Math.cos(rot)]});}
 function closedTube(arr,r,mat){const cr=new THREE.CatmullRomCurve3(arr.map(p=>new THREE.Vector3(...p)),true,'centripetal');return mesh(new THREE.TubeGeometry(cr,arr.length*2,r,8,true),mat);}
 function logoTexture(text,type='tower'){
   const cv=document.createElement('canvas');cv.width=1024;cv.height=1024;const g=cv.getContext('2d');
   const center=cv.width/2, cy=390, rad=type==='tower'?236:203;
   g.textAlign='center';g.textBaseline='middle';
   g.shadowColor='#9770ff';g.shadowBlur=48;
   g.strokeStyle='#8c5cfc';g.lineWidth=17;if(type==='rear'){g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/6,x=center+rad*Math.cos(a),y=cy+rad*Math.sin(a);if(i)g.lineTo(x,y);else g.moveTo(x,y);}g.closePath();g.stroke();
   g.shadowBlur=13;g.strokeStyle='#d9deff';g.lineWidth=8;g.stroke();
   g.fillStyle='#d8d2ff';g.shadowBlur=15;g.font='900 295px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('H',center,cy+12);}
   if(type==='tower'||type==='rear'){
      g.shadowBlur=17;g.shadowColor='#a593ff';g.fillStyle='#e3eaff';g.font='600 85px Arial';g.fillText('H E X C O R E',center,783);
      g.shadowBlur=0;g.font='400 45px Arial';g.fillText('G  A  M  I  N  G',center,852);
   }
   const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;return tx;
 }
 // A reference-lit environment map for physical reflections on the polished architecture.
 // Does not change the supplied cosmic sky or draw a fake photograph on any 3D building.
 const faces=[];
 for(let face=0;face<6;face++){
  const cv=document.createElement('canvas');cv.width=cv.height=256;const c=cv.getContext('2d');
  const grad=c.createLinearGradient(0,0,256,256);grad.addColorStop(0,'#090d19');grad.addColorStop(.45,face%2?'#29315e':'#151b39');grad.addColorStop(1,'#685297');c.fillStyle=grad;c.fillRect(0,0,256,256);
  for(let j=0;j<7;j++){const x=15+31*j;let gr=c.createLinearGradient(x,0,x+4,0);gr.addColorStop(0,'#13172d');gr.addColorStop(.6,j%2?'#ba8cff':'#a1d1ff');gr.addColorStop(1,'#15182d');c.fillStyle=gr;c.fillRect(x,0,4,256);}
  faces.push(cv);
 }
 const reflection=new THREE.CubeTexture(faces);reflection.colorSpace=THREE.SRGBColorSpace;reflection.needsUpdate=true;scene.environment=reflection;
 // -- Massive floating engineered island. Irregular 3D outer contour, true underside --
 const boundary=[];const N=112;
 for(let i=0;i<N;i++){
    const a=i/N*Math.PI*2,mod=1+.032*Math.cos(8*a)+.018*Math.cos(13*a);
    boundary.push([136*Math.cos(a)*mod,66+155*Math.sin(a)*mod]);
 }
 const islandShape=new THREE.Shape();boundary.forEach(([x,z],i)=>i?islandShape.lineTo(x,z):islandShape.moveTo(x,z));islandShape.closePath();
 const island=new THREE.ExtrudeGeometry(islandShape,{depth:22,steps:1,bevelEnabled:true,bevelSize:1.3,bevelThickness:.9,bevelSegments:2});
 const islandMesh=mesh(island,armor,[0,-.4,0]);islandMesh.rotation.x=Math.PI/2;
 const topShape=new THREE.Shape();boundary.forEach(([x,z],i)=>i?topShape.lineTo(x,-z):topShape.moveTo(x,-z));topShape.closePath();
 // The original lobby gets its original marble floor, with no exterior pavement covering it.
 const lobbyCutout=new THREE.Path();lobbyCutout.moveTo(-33.5,35.5);lobbyCutout.lineTo(-33.5,-31.5);lobbyCutout.lineTo(33.5,-31.5);lobbyCutout.lineTo(33.5,35.5);lobbyCutout.closePath();topShape.holes.push(lobbyCutout);
 const top=new THREE.ShapeGeometry(topShape);const cap=mesh(top,plaza,[0,.08,0]);cap.rotation.x=-Math.PI/2;
 const rimPoints=boundary.map(([x,z])=>[x,.20,z]);closedTube(rimPoints,.32,silver);closedTube(boundary.map(([x,z])=>[x,-.44,z]),.17,violet);
 // Layered facets and braced hanging cliff rock at the actual island perimeter.
 for(let i=0;i<N;i+=2){const [x,z]=boundary[i], [x2,z2]=boundary[(i+1)%N],a=Math.atan2(z-66,x),length=11+rnd()*19;
  let rx=x- Math.cos(a)*(3+rnd()*3),rz=z-Math.sin(a)*(3+rnd()*3);
  const tip=[rx+Math.cos(a)*(.5-rnd()*3),-22-length,rz+Math.sin(a)*(.5-rnd()*3)];
  const verts=[x,-2,z,x2,-2,z2,rx,-18,rz, tip[0],tip[1],tip[2]];
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.setIndex([0,1,2,0,2,3,1,3,2,0,3,1]);geo.computeVertexNormals();mesh(geo,i%4===0?metal:rock);
  if(i%4===0)stripe([x,-2,z],[rx,-18,rz],.17,i%8===0?ice:violet);
 }
 // Low, real terrace geometry and separate observation landings; no floating flat text planes.
 function platformDisk(x,z,rx,rz,y=.2){const shape=new THREE.Shape();for(let i=0;i<64;i++){const a=i*Math.PI*2/64;const X=x+rx*Math.cos(a),Y=-(z+rz*Math.sin(a));i?shape.lineTo(X,Y):shape.moveTo(X,Y)}shape.closePath();
  let s=mesh(new THREE.ShapeGeometry(shape),sheen,[0,y,0]);s.rotation.x=-Math.PI/2;
  closedTube(Array.from({length:64},(_,i)=>{const a=i*Math.PI*2/64;return [x+rx*Math.cos(a),y+.08,z+rz*Math.sin(a)]}),.13,violet);
 }
 platformDisk(-95,104,26,23,.16);platformDisk(95,105,26,24,.16);
 platformDisk(-89,5,24,22,.16);platformDisk(89,2,24,22,.16);
 platformDisk(0,-60,56,23,.16);
 // Additional rear crescent terraces create 360-degree silhouette like the rear reference.
 for(const side of [-1,1]){
  const x=side*75,z=-39;platformDisk(x,z,39,29,.3);
  for(const rz of [-48,-12,43,89,139,182]){
    const xx=side*(100+(rz<20?2:0));
    cub([xx,.52,rz],[16,.86,10],planting);cub([xx,.99,rz],[16.3,.08,10.4],silver);
  }
 }
 // Pierced metallic pavement: installed panel joints and perspective guides.
 for(let x=-116;x<=116;x+=8){
  const pts=[];for(let z=-70;z<=200;z+=6) if(Math.hypot(x/136,(z-66)/155)<.90 && !(Math.abs(x)<35&&z<35&&z>-38))pts.push([x,.17,z]);
  if(pts.length>2){if(Math.abs(x)<35){const a=pts.filter(p=>p[2]<-39),b=pts.filter(p=>p[2]>35);if(a.length>2)roadCurve(a,.02,metal,30);if(b.length>2)roadCurve(b,x%24===0?.037:.016,x%24===0?ice:metal,Math.min(110,b.length*2));}else roadCurve(pts,x%24===0?.037:.016,x%24===0?ice:metal,Math.min(110,pts.length*2));}
 }
 for(let z=-70;z<=206;z+=8){let xx=130*Math.sqrt(Math.max(0,1-((z-66)/155)**2));
  if(xx>5){if(z>-36&&z<33){if(xx>36){stripe([-xx,.17,z],[-35,.17,z],.027,silver);stripe([35,.17,z],[xx,.17,z],.027,silver);}}else stripe([-xx,.17,z],[xx,.17,z],z%24===0?.039:.02,z%24===0?violet:silver);}
 }
 // Approaching the tower, grand axial pavement / emblem / lit edges.
 for(const xx of [-15,-11,11,15])stripe([xx,.24,42],[xx,.24,203],.105,xx<0?violet:ice);
 for(let z=38;z<198;z+=15) for(const side of [-1,1]){
   cub([side*12,.23,z],[3.8,.07,.07],warm);cub([side*31,.23,z],[1.8,.04,.08],ice);
 }
 // Physical inlaid illuminated H and hexagon at the floor surface, above the raised cap.
 const floorHex=Array.from({length:6},(_,k)=>{const a=k*Math.PI/3;return [9.8*Math.cos(a),.28,127+9.8*Math.sin(a)]});
 closedTube(floorHex,.17,violet);
 for(const x of [-2.6,2.6])stripe([x,.29,122.6],[x,.29,131.4],.36,ice);
 stripe([-2.6,.30,127],[2.6,.30,127],.36,pearl);
 // -- Scenic outer perimeter waterfall system, grouped and animated --
 function fall(x,z,width,drop,rotation=0){
  const g=new THREE.Group();g.position.set(x,-.5,z);g.rotation.y=rotation;root.add(g);
  const tex=waterfallImage.clone();tex.needsUpdate=true;tex.repeat.set(Math.max(1,width/9),1);waterMaps.push(tex);
  const mat=new THREE.MeshBasicMaterial({map:tex,color:0xb6cdff,transparent:true,opacity:.83,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false});
  const curtain=mesh(new THREE.PlaneGeometry(width,drop,Math.max(4,Math.floor(width/4)),1),mat,[0,-drop/2,.14],g);
  const backing=new THREE.MeshBasicMaterial({color:0x397ad7,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide});
  mesh(new THREE.PlaneGeometry(width*.96,drop*.98),backing,[0,-drop*.5,-.1],g);
  for(let k=0;k<Math.min(18,Math.floor(width/1.3));k++){
    const dx=-width*.47+width*(k+.5)/Math.max(1,Math.min(18,Math.floor(width/1.3)));
    stripe([dx,0,.26],[dx+(rnd()-.5)*.9,-drop,.26],.025+rnd()*.09,k%3?ice:warm,g);
  }
  cub([0,.04,0],[width+.6,.18,2.1],metal,g);cub([0,.18,0],[width,.07,.7],ice,g);
 }
 for(const x of [-104,-68,-27,27,68,104]) fall(x,207,12+(Math.abs(x)<35?10:0),34+rnd()*17,0);
 for(const x of [-106,-66,-24,24,66,106])fall(x,-78,11+(Math.abs(x)<30?9:0),31+rnd()*21,Math.PI);
 for(const side of [-1,1])for(const z of [-40,17,76,129,181])fall(side*132,z,13,32+rnd()*15,side*Math.PI/2);
 // -- Main tower: genuine angular interlocking extrusions, varied setbacks and visible sides --
 // Keep the physical lobby air volume entirely clear below y=10 along x±6 and z<=32.
 const coreLayers=[
   {w:41,front:25,rear:-34,low:42,high:85,top:94},
   {w:33,front:20,rear:-30,low:72,high:136,top:151},
   {w:24,front:13,rear:-25,low:128,high:172,top:187},
   {w:14,front:7,rear:-19,low:160,high:200,top:218}
 ];
 for(let n=0;n<coreLayers.length;n++){
  const L=coreLayers[n],depth=L.front-L.rear;
  prism([[-L.w/2,L.low],[L.w/2,L.low],[L.w/2,L.high-12],[L.w/2-5,L.high],[L.w/2-9,L.top],[-L.w/2+9,L.top],[-L.w/2+5,L.high],[-L.w/2,L.high-12]],L.rear,depth,n%2?metal:armor,.8);
  for(const side of [-1,1]){
   const X=side*L.w*.5;
   stripe([X,L.low+2,L.front+.24],[X,L.high-9,L.front+.24],.16,n%2?ice:violet);
   stripe([X,L.low+2,L.rear-.2],[X,L.high-12,L.rear-.2],.10,ice);
  }
 }
 function blade(x,z,wide,height,base,theme=0,depth=4){
   const crown=height+(rnd()-.5)*5;
   const pp=[[x-wide*.52,base],[x+wide*.50,base],[x+wide*.50,crown-11],[x+wide*.25,crown-4],[x+wide*.09,crown],[x-wide*.18,crown-4],[x-wide*.52,crown-15]];
   prism(pp,z-depth/2,depth,materials[theme%materials.length],.36);
   const zz=z+depth*.5+.43;
   stripe([x+wide*.24,base+5,zz],[x+wide*.19,crown-9,zz],.16,theme%3===0?ice:violet);
   stripe([x-wide*.36,base+6,zz],[x-wide*.34,crown-18,zz],.055,theme%2?pearl:silver);
   if(height>70){
     for(let k=0;k<3;k++){let yy=base+(crown-base)*(.28+k*.2);
       stripe([x-wide*.34,yy,zz+.06],[x+wide*.30,yy+1.3,zz+.06],.065,metal);
     }
   }
 }
 // Sweeping angular corner buttresses fill the monumental lower facade.
 for(const side of [-1,1]){
   for(let k=0;k<4;k++){
     const xx=side*(19+k*7.0),b=5+k*1.4,h=114-k*17;
     prism([[xx-side*5,b],[xx+side*5,b],[xx+side*5,h-17],[xx+side*2,h],[xx-side*1.3,h+13],[xx-side*3,h-4]],k<2?30:19-k*4,7,k%2?metal:armor,.32);
     blade(side*(17+k*6.2),16-k*4,4.8-k*.4,164-k*11,23+k*2,k,5.2);
     blade(side*(9+k*4.9),-32+k*1.1,3.3,138-k*10,51+k*3,k+1,4.7);
   }
 }
 // Parallel architectural blades of varied depths on every elevation, not a flat front facade.
 for(const s of [-1,1])for(let j=0;j<10;j++){
  const x=s*(4+j*3.35),height=194-j*10.4-(j%3)*5.4;
  blade(x,24-j*.35,2.0+(j%3)*.39,height,36+j*.35,j,3.9);
  blade(x,-37+j*.23,1.7+(j%4)*.26,height*.80,36,j+1,3.1);
 }
 for(let j=0;j<13;j++){
    const a=j*Math.PI*2/13,x=33*Math.cos(a),z=-12+28*Math.sin(a);
    blade(x,z,3.0+(j%3)*.7,83+(j*11)%65,32,j%5,5.2);
 }
 // Main entrance high glass concourse — centre passage stays open below head height.
 for(const s of [-1,1]){
   prism([[s*8.3,10],[s*14.5,10],[s*16.3,35],[s*11,43],[s*8.3,34]],29,3,armor,.5);
   stripe([s*8.25,10,32.6],[s*8.25,35,32.6],.14,ice);
   stripe([s*15.6,11,32.65],[s*13.2,34,32.65],.12,violet);
   for(let j=0;j<5;j++){
     const x=s*(9.2+j*1.2);
     cub([x,20.2,32.1],[.075,19.8,.085],silver);
   }
 }
 cub([0,36.8,31.6],[17.1,.55,2.1],silver);cub([0,37,32.85],[17.6,.12,.22],violet);
 // Vestibule glazing surrounds but does not fill the operating door rectangle.
 for(const s of [-1,1]){
   cub([s*10.5,21,33.01],[.12,21.8,.07],blackGlass);
   cub([s*6.5,14.2,33.01],[.08,7.3,.06],silver);
 }
 for(let y=12;y<=33;y+=5.25){cub([0,y,32.5],[12.7,.07,.05],y%2?violet:ice);}
 const lobbyOrb=mesh(new THREE.IcosahedronGeometry(3.8,4),new THREE.MeshPhysicalMaterial({color:0x5348ee,emissive:0x3124ba,emissiveIntensity:1.3,metalness:.35,roughness:.16,transparent:true,opacity:.62}),[0,18,23]);
 for(const r of [4.5,5.8]){
  const ring=mesh(new THREE.TorusGeometry(r,.08,5,84),r===4.5?ice:violet,[0,18,23]);ring.rotation.x=Math.PI*.34;ring.rotation.z=.21;
 }
 for(const s of [-1,1]){
  stripe([s*7,10,32.0],[s*7,35,32.0],.1,pearl);
 }
 // Actual animated front doors: original object and door-crossing mechanism, untouched.
 automaticEntrance(0,32);
 // Architectural logo structure, dimensioned bevelled metal with a luminous emblem inset.
 prism([[-12,71],[-16,79],[-16,100],[-10,110],[0,115],[10,110],[16,100],[16,79],[12,71]],30.6,2.2,dark,.65);
 prism([[-10,75],[-12,82],[-12,99],[-7,106],[0,110],[7,106],[12,99],[12,82],[10,75]],32.8,.5,inset,.14);
 // Emblem is a beveled, dimensional hex ring and inset H, not a flat screenshot.
 function emblem3D(z,reverse=false){
  const radius=8.1,inner=6.9,cy=96;
  const outline=new THREE.Shape();for(let k=0;k<6;k++){const a=Math.PI/3*k-Math.PI/6;
    const x=radius*Math.cos(a),y=cy+radius*Math.sin(a);k?outline.lineTo(x,y):outline.moveTo(x,y);
  }outline.closePath();
  const hole=new THREE.Path();for(let k=5;k>=0;k--){const a=Math.PI/3*k-Math.PI/6;
    const x=inner*Math.cos(a),y=cy+inner*Math.sin(a);k!==5?hole.lineTo(x,y):hole.moveTo(x,y);
  }hole.closePath();outline.holes.push(hole);
  const shape=new THREE.ExtrudeGeometry(outline,{depth:.6,bevelEnabled:true,bevelThickness:.22,bevelSize:.16,bevelSegments:2});
  const border=mesh(shape,ice,[0,0,z]);if(reverse)border.rotation.y=Math.PI;
  const innerShape=new THREE.Shape();innerShape.moveTo(-3.8,cy-4);innerShape.lineTo(-1.7,cy-4);innerShape.lineTo(-1.7,cy-.95);
  innerShape.lineTo(1.7,cy-.95);innerShape.lineTo(1.7,cy-4);innerShape.lineTo(3.8,cy-4);
  innerShape.lineTo(3.8,cy+4);innerShape.lineTo(1.7,cy+4);innerShape.lineTo(1.7,cy+1.05);
  innerShape.lineTo(-1.7,cy+1.05);innerShape.lineTo(-1.7,cy+4);innerShape.lineTo(-3.8,cy+4);innerShape.closePath();
  const H=mesh(new THREE.ExtrudeGeometry(innerShape,{depth:.45,bevelEnabled:true,bevelThickness:.1,bevelSize:.08,bevelSegments:2}),pearl,[0,0,z+.8]);
  if(reverse)H.rotation.y=Math.PI;
 }
 emblem3D(34.0,false);
 const sigMat=new THREE.MeshBasicMaterial({map:logoTexture('HEXCORE','tower'),transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});
 mesh(new THREE.PlaneGeometry(27.5,27.5),sigMat,[0,91,33.9]);
 // Rear has an independent sign and a genuine rear facade rather than copied entrance doors.
 const rearText=new THREE.MeshBasicMaterial({map:logoTexture('HEXCORE','rear'),transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});
 const rearMark=mesh(new THREE.PlaneGeometry(21,21),rearText,[0,94,-40.0]);rearMark.rotation.y=Math.PI;
 // Structural lower canopies & layered buttresses fan out horizontally.
 for(const s of [-1,1])for(let k=0;k<5;k++){
   const x=s*(19+k*6.5),h=16+k*2.7;
   prism([[x-s*4,2],[x+s*4,2],[x+s*5,h-4],[x+s*1,h+6],[x-s*2,h ]],k<2?31:26-k*4,7,armor,.32);
   stripe([x-s*2,h,34-k*4],[x+s*4,h-4,34-k*4],.095,k%2?ice:violet);
 }
 // Monumental stair banks with central at-grade accessible approach.
 // No alteration to the first-person y=2.7 movement/controller.
 for(const s of [-1,1])for(let k=0;k<12;k++){
   const z=33+k*1.68,y=.23+(.72*(11-k)/11),x=s*24;
   cub([x,y,z],[18,.20,1.5],sheen);cub([x,y+.14,z+.71],[18,.07,.08],k%2?ice:violet);
 }
 for(const s of [-1,1]){
   prism([[s*6.5,.0],[s*7.7,.0],[s*9.0,1.1],[s*9.0,2.8],[s*7.5,2.8]],32,21,metal,.13);
   stripe([s*7.3,.16,53],[s*7.3,.16,33],.12,violet);
 }
 // -- Elevated megastructure skybridges: solid decks, twin luminous rails, girders --
 function skybridge(rx,rz,y,offset=0){
   const pp=ringPath(0,-15,rx,rz,y,offset);
   closedTube(pp,1.45,armor);closedTube(pp.map(p=>[p[0],p[1]+1.1,p[2]]),.24,metal);
   closedTube(pp.map(p=>[p[0],p[1]-1.24,p[2]]),.18,violet);
   closedTube(pp.map(p=>[p[0],p[1]+1.78,p[2]]),.08,ice);
   for(let i=0;i<pp.length;i+=5){const p=pp[i];stripe([p[0],p[1]-1.4,p[2]],[p[0],p[1]+1.7,p[2]],.07,silver);}
 }
 skybridge(83,68,69);skybridge(103,89,56,.10);
 for(const s of [-1,1]){
  for(let j=0;j<4;j++){
    const x=s*(73+j*13),z=-24+j*29,h=49+j*7;
    blade(x,z,5.6,h+36,4,j,7);
    stripe([x,15,z+4],[x,h,z+4],.19,j%2?ice:violet);
  }
 }
 // Peripheral monumental towers, fully modelled on the rear and flanks.
 for(let k=0;k<46;k++){
  const a=k*Math.PI*2/46,x=Math.cos(a)*(89+(k%3)*8),z=-8+Math.sin(a)*(82+(k%4)*12);
  if(z>202||z<-83)continue;
  const h=28+(k*19)%68,w=2.8+(k%3)*1.2;
  blade(x,z,w,h,1.2,k,4.1);
  if(k%5===0){blade(x+Math.sin(a)*5,z+Math.cos(a)*5,w*.8,h*.66,2,k+2,3);}
 }
 // Wider rear campus with terraced loops and spired outlooks, not blank back wall.
 for(const s of [-1,1]){
   for(const z of [-64,-38,-12]){
      const x=s*58;
      prism([[x-s*17,2],[x+s*17,2],[x+s*14,13],[x+s*10,15],[x-s*13,15]],z-3,7,armor,.15);
      stripe([x-s*15,15,z+4],[x+s*14,15,z+4],.18,ice);
      for(let j=0;j<5;j++)blade(x+s*(-11+j*5),z+1,1.1,29+(j*13)%30,15,j,2.3);
   }
 }
 // Hexagonal floor medallions around observation pads.
 for(const s of [-1,1])for(const [x,z] of [[s*96,104],[s*88,6],[s*78,-45]]){
  closedTube(Array.from({length:6},(_,k)=>{let a=k*Math.PI/3;return [x+6*Math.cos(a),.32,z+6*Math.sin(a)]}),.08,ice);
 }
 // -- Canopy trees, botanical branching and hundreds of actual leaf blades --
 const leafShape=new THREE.Shape();leafShape.moveTo(0,0);leafShape.quadraticCurveTo(.25,.2,0,1.2);leafShape.quadraticCurveTo(-.23,.3,0,0);
 const leafGeo=new THREE.ShapeGeometry(leafShape,3);const branchGeo=new THREE.CylinderGeometry(.065,.18,1,6);
 function tree(x,z,scale=1,phase=0){
   const g=new THREE.Group();g.position.set(x,.85,z);g.scale.setScalar(scale);root.add(g);
   const trunk=mesh(new THREE.CylinderGeometry(.10,.24,3.2,7),wood,[0,1.65,0],g);trunk.rotation.z=(rnd()-.5)*.12;
   const branches=new THREE.InstancedMesh(branchGeo,wood,22);
   const leafMeshes=new THREE.InstancedMesh(leafGeo,leaves,260);
   const dummy=new THREE.Object3D();let bi=0,li=0;
   const anchors=[];
   for(let j=0;j<22;j++){
     const a=j*2.399963+phase,r=.55+rnd()*1.4,y=2.4+rnd()*2.1;
     const B=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r),A=new THREE.Vector3(0,1.9,0);
     const d=B.clone().sub(A);dummy.position.copy(A.clone().add(B).multiplyScalar(.5));dummy.quaternion.setFromUnitVectors(yAxis,d.clone().normalize());dummy.scale.set(.7+rnd()*.7,d.length(),.7+rnd()*.7);dummy.updateMatrix();branches.setMatrixAt(bi++,dummy.matrix);
     anchors.push(B);
   }
   for(let j=0;j<260;j++){
     const p=anchors[j%anchors.length],a=rnd()*Math.PI*2,r=.18+rnd()*.90;
     dummy.position.set(p.x+Math.cos(a)*r,p.y+(rnd()-.5)*.9,p.z+Math.sin(a)*r);
     dummy.rotation.set((rnd()-.5)*2,rnd()*6.28,(rnd()-.5)*1.4);
     dummy.scale.set(.30+rnd()*.3,.43+rnd()*.49,.7);dummy.updateMatrix();leafMeshes.setMatrixAt(li++,dummy.matrix);
   }
   leafMeshes.count=li;branches.count=bi;g.add(branches,leafMeshes);
   // No per-tree dynamic lights: emissive leaves deliver color without costly extra shaders.
 }
 const treeRows=[-64,-42,-9,18,48,76,102,128,154,183];
 for(const z of treeRows)for(const s of [-1,1]){
  const x=s*(z>25?76+rnd()*19:58+rnd()*27);
  tree(x,z,1.1+rnd()*.35,z*.03);
  if(z%3===0)tree(s*(x*s+11),z+7,.74+rnd()*.12,z*.08);
 }
 for(let i=0;i<24;i++){
  const a=i*2.39996,r=35+(i%4)*9,z=-32+Math.sin(a)*47,x=Math.cos(a)*r;
  if(Math.abs(x)>15)tree(x,z,.72+(i%3)*.13,i);
 }
 // Integrated glass-rail planters, carved basalt edges, lighting pylons.
 for(const s of [-1,1]){
   for(const z of [25,63,105,151,185]){
    const x=s*46;
    cub([x,.72,z],[7,1.3,12],armor);cub([x,1.39,z],[7.3,.12,12.3],silver);
    cub([x,1.47,z],[6.7,.14,11.7],planting);
    stripe([x-s*3.4,1.61,z-5],[x-s*3.4,1.61,z+5],.09,ice);
   }
   for(const z of [32,89,149,191]){
     const x=s*115,h=29+(z%3)*12;
     blade(x,z,5.6,h,0,Math.floor(z/30),6.2);
   }
 }
 // Mist clusters beneath cascade clusters, subtle and unlit geometry (not cheap gray spheres).
 const mistMat=new THREE.PointsMaterial({color:0x897bc8,size:1.7,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true});
 const mist=[];for(let i=0;i<1600;i++){
    const a=rnd()*Math.PI*2,r=118+rnd()*33,z=66+Math.sin(a)*r,x=Math.cos(a)*r;
    mist.push(x+(rnd()-.5)*18,-26-rnd()*22,z+(rnd()-.5)*23);
 }
 const ptsGeo=new THREE.BufferGeometry();ptsGeo.setAttribute('position',new THREE.Float32BufferAttribute(mist,3));const mistObject=new THREE.Points(ptsGeo,mistMat);mistObject.visible=false;root.add(mistObject);
 // Light concentrates at the entrance and major facade planes instead of flattening black metal.
 for(const [x,y,z,color,pow,range] of [[-19,19,51,0x8b5dff,60,65],[19,19,51,0x7eb6ff,60,65],
  [-47,27,39,0x835ad9,45,68],[47,27,39,0x7e91ed,45,68],[0,48,46,0x9878ee,80,85],
  [0,15,37,0xacb3ff,50,48],[0,93,40,0xa783ff,90,80]]){
   const light=new THREE.PointLight(color,pow,range,2);light.position.set(x,y,z);root.add(light);
 }
 for(let i=0;i<4;i++){let a=i*Math.PI*2/4,r=93,x=Math.cos(a)*r,z=45+Math.sin(a)*r;
   const lamp=new THREE.PointLight(i%2?0x7652d4:0x5d99e1,2.8,16,2);lamp.position.set(x,2,z);root.add(lamp);
 }
 // Existing staff and patrol behavior kept exactly; geometry added above never registers colliders.
 guard(-12,39,206,true);guard(12,39,207,true);guard(-29,74,208,true);guard(29,74,209,true);
 return root;
}
