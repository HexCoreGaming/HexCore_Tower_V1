/**
 * HEXCORE / ART-REFERENCED EXTERIOR V6.0.18
 * A visual-scene replacement, with reference-projected photographic architectural
 * relief layers PLUS walkable 3D island, atrium surrounds, substantial ring
 * bridges, paving, planted terraces and waterfalls. Four angles sourced from
 * the approved user-provided artwork. Not a pixel-identical 360-degree mesh.
 * This module DOES NOT handle collision, interaction, floor state or doors.
 */
let waterfallMaps=[];
export function updateExteriorV6(time){for(let k=0;k<waterfallMaps.length;k++)waterfallMaps[k].offset.y=-(time*.05+k*.017)%1;}
export function buildExteriorV6({THREE,scene,world,automaticEntrance,guard,hexcoreFloorLogo,skyNebula,buildOrbitingPlanets}){
 waterfallMaps=[];
 skyNebula();buildOrbitingPlanets();
 const root=new THREE.Group();root.name='HEXCORE V6.0.18 SCULPTED ART HYBRID EXTERIOR';world.add(root);
 const tex=(path,repeat)=>{let t=new THREE.TextureLoader().load(path);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.anisotropy=8;if(repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...repeat);}return t};
 const mats={
  black:new THREE.MeshStandardMaterial({color:0x101827,metalness:.78,roughness:.27}),
  edge:new THREE.MeshStandardMaterial({color:0x4f587a,metalness:.8,roughness:.23}),
  metal:new THREE.MeshStandardMaterial({color:0x292d46,metalness:.8,roughness:.23}),
  glass:new THREE.MeshPhysicalMaterial({color:0x708cb7,metalness:.18,roughness:.07,transmission:.34,transparent:true,opacity:.36,depthWrite:false,side:THREE.DoubleSide,clearcoat:1}),
  ground:new THREE.MeshBasicMaterial({map:tex('./reference/v603/floor_tile_base.png',[5.2,5.2]),color:0xffffff,depthWrite:true,side:THREE.FrontSide}),
  violet:new THREE.MeshBasicMaterial({color:0xb47cff,toneMapped:false}),
  blue:new THREE.MeshBasicMaterial({color:0x7ebaff,toneMapped:false}),
  pearl:new THREE.MeshBasicMaterial({color:0xe2daff,toneMapped:false}),
  darkSoil:new THREE.MeshStandardMaterial({color:0x10101b,roughness:.86}),
  treeTrunk:new THREE.MeshStandardMaterial({color:0x302943,roughness:.82}),
  treeLeaf:new THREE.MeshStandardMaterial({color:0x59448a,emissive:0x492376,emissiveIntensity:.42,roughness:.8,side:THREE.DoubleSide}),
  waterfall:new THREE.MeshBasicMaterial({map:tex('./reference/v5-waterfall.png'),color:0xbcdfff,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false,toneMapped:false})
 };
 const up=new THREE.Vector3(0,1,0);const add=(geo,mat,x=0,y=0,z=0,parent=root)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m};
 const block=(x,y,z,w,h,d,material=mats.black,par=root)=>add(new THREE.BoxGeometry(w,h,d),material,x,y,z,par);
 const line=(a,b,r,mat=mats.violet,par=root)=>{const v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const o=add(new THREE.CylinderGeometry(r,r,v.length(),8),mat,0,0,0,par);o.position.copy(new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5));o.quaternion.setFromUnitVectors(up,v.normalize());return o};
 const strip=(pts,r,mat=mats.violet,closed=false)=>{const c=new THREE.CatmullRomCurve3(pts.map(v=>new THREE.Vector3(...v)),closed,'centripetal');return add(new THREE.TubeGeometry(c,pts.length*3,r,7,closed),mat)};
 const plat=(x,z,rx,rz,h=.13)=>{let shp=new THREE.Shape();for(let j=0;j<56;j++){const a=2*Math.PI*j/56;const X=x+rx*Math.cos(a),Y=-(z+rz*Math.sin(a));j?shp.lineTo(X,Y):shp.moveTo(X,Y);}shp.closePath();const m=add(new THREE.ShapeGeometry(shp),mats.ground,0,h,0);m.rotation.x=-Math.PI/2;return m};
 // Physical island silhouette. The entrance and playable lobby air-volume are not blocked.
 const edgePoints=[];for(let j=0;j<128;j++){const a=j*2*Math.PI/128;edgePoints.push([(142+8*Math.cos(a*5)+4*Math.sin(a*11))*Math.cos(a),64+(155+8*Math.sin(a*5)+5*Math.cos(a*9))*Math.sin(a)]);}
 let shape=new THREE.Shape();edgePoints.forEach(([x,z],i)=>i?shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();
 const bottom=add(new THREE.ExtrudeGeometry(shape,{depth:24,bevelEnabled:true,bevelThickness:.8,bevelSize:1.1,bevelSegments:2}),mats.black,0,-.65,0);bottom.rotation.x=Math.PI/2;
 // Full walkable floor, including a recess for the actual functional lobby flooring.
 const floorShape=new THREE.Shape();edgePoints.forEach(([x,z],i)=>i?floorShape.lineTo(x,-z):floorShape.moveTo(x,-z));floorShape.closePath();
 const interiorOpening=new THREE.Path();interiorOpening.moveTo(-33,35);interiorOpening.lineTo(-33,-31);interiorOpening.lineTo(33,-31);interiorOpening.lineTo(33,35);interiorOpening.closePath();floorShape.holes.push(interiorOpening);
 const floor=add(new THREE.ShapeGeometry(floorShape),mats.ground,0,.15,0);floor.rotation.x=-Math.PI/2;
 strip(edgePoints.map(([x,z])=>[x,.33,z]),.28,mats.edge,true);
 strip(edgePoints.map(([x,z])=>[x,-.21,z]),.13,mats.violet,true);
 // Rear/side engineered drop geometry: thick faceted cliffs, not solid void below.
 for(let j=0;j<edgePoints.length;j+=4){const [x,z]=edgePoints[j],dx=x/145,dz=(z-64)/152;
  let geom=new THREE.BufferGeometry();const vv=[x,-.5,z,x+4*dz,-.5,z-4*dx,x-dx*4,-26,z-dz*4,x-dx*1.5,-33-(j%7)*2,z-dz*1.5];
  geom.setAttribute('position',new THREE.Float32BufferAttribute(vv,3));geom.setIndex([0,1,2,0,2,3,0,3,1,1,3,2]);geom.computeVertexNormals();add(geom,j%3===0?mats.metal:mats.black);
 }
 // Real panoramic terrace outlines behind / around tower, with physically detailed light strips.
 for(const [x,z,rx,rz] of [[-92,85,27,20],[92,85,27,20],[-92,-28,37,28],[92,-28,37,28],[-68,140,17,12],[68,140,17,12],[0,-55,62,19]]){
  plat(x,z,rx,rz,.22);const arr=[];for(let j=0;j<64;j++){const a=j*2*Math.PI/64;arr.push([x+rx*Math.cos(a),.40,z+rz*Math.sin(a)]);}strip(arr,.14,mats.violet,true);
 }
 // V6.0.18: IMAGE-ASSISTED 3D FACADES. Source art is divided into architectural
 // regions and each region gets its own shaped relief mesh and physical backing.
 // Not one photo on a wall: independently set-back crown, paired wings, sign
 // bay, atrium surrounds and rear/side elevations. The original real doorway
 // at z=32 remains entirely free of opaque walls or collision.
 function facadeTile(path,x,y,z,w,h,rot=0,fold=2,opacity=1){
   const mat=new THREE.MeshBasicMaterial({map:tex(path),transparent:true,opacity,
       alphaTest:.018,side:THREE.FrontSide,depthWrite:false,toneMapped:false});
   const g=new THREE.PlaneGeometry(w,h,32,36),a=g.getAttribute('position');
   for(let i=0;i<a.count;i++){
     const u=a.getX(i)/w+.5,v=a.getY(i)/h+.5;
     const ribs=Math.pow(Math.max(0,Math.sin((u*12+.05)*Math.PI)),8)*fold*.28;
     const shoulders=Math.pow(Math.max(0,(Math.abs(u-.5)-.23)*3.5),2)*-fold;
     const crease=(u<.12||u>.88)?-fold*.65:0;
     a.setZ(i,fold*.30+ribs+shoulders+crease);
   }
   a.needsUpdate=true;g.computeVertexNormals();
   const o=add(g,mat,x,y,z);o.rotation.y=rot;o.renderOrder=7;
   o.userData={visualOnly:true,architecturalImage:path};return o;
 }
 function croppedFacadeTile(path,x,y,z,w,h,rot=0,crop=[0,0,1,1],fold=2,opacity=1){
   const [u0,vTop,u1,vBottom]=crop;
   const t=tex(path);t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
   t.repeat.set(u1-u0,vBottom-vTop);t.offset.set(u0,1-vBottom);
   const mat=new THREE.MeshBasicMaterial({map:t,transparent:true,opacity,
       alphaTest:.018,side:THREE.FrontSide,depthWrite:false,toneMapped:false});
   const g=new THREE.PlaneGeometry(w,h,28,30),a=g.getAttribute('position');
   for(let i=0;i<a.count;i++){
     const u=a.getX(i)/w+.5;
     const ribs=Math.pow(Math.max(0,Math.sin((u*10+.04)*Math.PI)),8)*fold*.22;
     const shoulders=Math.pow(Math.max(0,(Math.abs(u-.5)-.24)*3.2),2)*-fold*.85;
     const crease=(u<.10||u>.90)?-fold*.58:0;
     a.setZ(i,fold*.24+ribs+shoulders+crease);
   }
   a.needsUpdate=true;g.computeVertexNormals();
   const o=add(g,mat,x,y,z);o.rotation.y=rot;o.renderOrder=7;
   o.userData={visualOnly:true,architecturalImage:path,crop};return o;
 }
 const cropW='/reference/v602/';
 function frontTile(file,rect,z,fold=2){
   const [l,t,r,b]=rect;
   const scaleX=.14,scaleY=.218;
   return facadeTile('./reference/v602/'+file+'.png',((l+r)/2-350)*scaleX,
        (780-(t+b)/2)*scaleY,z,(r-l)*scaleX,(b-t)*scaleY,0,fold);
 }
 // A polygonal, stepped, real structural tower lies underneath the graphic facade.
 // Individual silhouette tiers produce broad plinth, shoulders and telescoping crown.
 function massTier(y0,y1,bx0,bz0,bx1,bz1,centerZ=-4){
   const pts=[];const corners=(hw,hd,y)=>[
     [-hw*.8,y,centerZ+hd],[-hw,y,centerZ+hd*.77],[-hw,y,centerZ-hd*.72],
     [-hw*.70,y,centerZ-hd],[hw*.7,y,centerZ-hd],[hw,y,centerZ-hd*.72],
     [hw,y,centerZ+hd*.77],[hw*.8,y,centerZ+hd]];
   const rings=[corners(bx0,bz0,y0),corners(bx1,bz1,y1)];
   for(const c of rings)for(const p of c)pts.push(...p);
   const idx=[];for(let i=0;i<8;i++){
     const j=(i+1)%8;idx.push(i,j,i+8,j,j+8,i+8);
   }
   for(let i=1;i<7;i++){idx.push(0,i+1,i);idx.push(8,8+i,8+i+1);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setIndex(idx);g.computeVertexNormals();
   const m=new THREE.Mesh(g,mats.black);m.material.side=THREE.DoubleSide;root.add(m);return m;
 }
 // Upper masses don't seal the full-height open lobby.
 massTier(31,64,46,38,43,36);massTier(64,110,43,36,34,28);
 massTier(110,151,34,28,25,21);massTier(151,182,25,21,13,15);
 // The wide base wings are separate from the central 12-metre-wide walking lane.
 for(const side of [-1,1]){
   const x=side*45;
   block(x,14,-5,19,28,72,mats.black);
   const sgn=side;
   // Beveled wing shoulder ramps, real 3D volumes behind the art.
   const shoulder=new THREE.Mesh(new THREE.CylinderGeometry(8,13,32,5,1),mats.metal);
   shoulder.rotation.z=sgn*.23;shoulder.position.set(sgn*50,30,7);root.add(shoulder);
   for(let j=0;j<4;j++){
     const x2=sgn*(25+j*5.7),h=96+j*14;
     // Architectural ribs with varied depths, not freestanding foreground spikes.
     const b=block(x2,34+(h-34)/2,30-j*2.2,1.25,h-34,2.4,mats.metal);
     b.rotation.z=sgn*(.012+j*.007);
   }
 }
 // V6.0.18: precisely isolated tower-only elevations; no floor, planets or sky in facade textures.
 // Transparent outlines follow each tower crown and shoulder, rather than rectangle crops.
 facadeTile('./reference/v614/tower_front_isolated.png',0,92,40.9,112,184,0,.55,1);
 facadeTile('./reference/v614/tower_back_isolated.png',0,92,-48.9,94,184,Math.PI,.45,1);
 facadeTile('./reference/v614/tower_side_left_isolated.png',-45.6,92,-4.5,78,184,-Math.PI/2,.45,1);
 facadeTile('./reference/v614/tower_side_right_isolated.png',45.6,92,-4.5,78,184,Math.PI/2,.45,1);

// V6.0.18: no facade backing rectangle. Only shaped, separated structural elements.
 // Large backing boxes were the visible black/blue square. Leave the center
 // of the entry open and continue the vertical tower language around it.
 const insetMetal=new THREE.MeshStandardMaterial({color:0x20253b,metalness:.66,roughness:.31,side:THREE.DoubleSide});
 // Flat tapered blades have negligible depth, no opaque central fill, and
 // live behind the photographically-masked artwork, not in front of the H.
 function taperedRib(x,base,top,width,z){
   const g=new THREE.BufferGeometry();
   const v=[x-width*.5,base,z,x+width*.5,base,z,x+width*.22,top-6,z,x,top,z,x-width*.22,top-6,z];
   g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));
   g.setIndex([0,1,2,0,2,4,2,3,4]);g.computeVertexNormals();
   const mesh=add(g,insetMetal);mesh.userData.visualOnly=true;return mesh;
 }
 // The intentionally spaced blades prevent any single black rectangular area.
 for(const side of [-1,1]){
   taperedRib(side*5.8,29,69,3.4,38.1);
   taperedRib(side*11.2,29,70,4.8,38.1);
   taperedRib(side*16.8,29,73,2.5,37.2);
 }
 taperedRib(0,31,72,3.6,38.0);
 // Deep sculpted frame, with edge columns and illuminated notched canopy.
 for(const side of [-1,1]){
   block(side*18,27,40.5,1.8,54,2.6,mats.edge);
   line([side*19,7,42.1],[side*19,49,42.1],.17,side<0?mats.violet:mats.blue);
   block(side*33.5,56,35,1.7,63,4,mats.edge);
   line([side*33.7,31,37.4],[side*33.7,81,37.4],.22,mats.violet);
 }
 // Purple sky-beam from the tower tip.
 const skyBeamCore=add(new THREE.CylinderGeometry(.75,.75,240,18,1,true),new THREE.MeshBasicMaterial({color:0xcaa4ff,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}),0,302,-4);
 const skyBeamGlow=add(new THREE.CylinderGeometry(2.9,2.9,260,20,1,true),new THREE.MeshBasicMaterial({color:0x7b4dff,transparent:true,opacity:.18,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}),0,312,-4);
 const skyBeamHalo=add(new THREE.CylinderGeometry(6.5,6.5,280,20,1,true),new THREE.MeshBasicMaterial({color:0x6a33ff,transparent:true,opacity:.08,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}),0,322,-4);
 skyBeamCore.renderOrder=11; skyBeamGlow.renderOrder=10; skyBeamHalo.renderOrder=9;
 // Grand glass atrium: existing functional door stays at z=32, unaltered.
 // All approach paths inside x +/- 6 are completely unobstructed.
 for(const s of [-1,1]){
   block(s*13,12,34,1.1,24,3,mats.metal);
   line([s*13,1,36],[s*13,25,36],.18,mats.pearl);
   for(let j=0;j<7;j++){
    const x=s*(14.5+j*1.7);block(x,12,35.1,.12,22,.08,mats.glass);
   }
   block(s*21,26,35.5,15,.4,1.2,mats.edge);
 }
 block(0,26.2,36,40,.75,3,mats.metal);
 line([-20.4,26.7,37.5],[20.4,26.7,37.5],.19,mats.pearl);
 // Plaza and grand approach: keep the paving clean and reflective, without extra glowing grid-line geometry.
 for(const side of [-1,1]){
   // Low monumental step-terraces beside a permanent flush center approach.
   for(let j=0;j<7;j++){
    const X=side*21, Z=32+j*1.7;
    block(X,.24+j*.13,Z,23,.25+j*.25,1.55,j%2?mats.metal:mats.black);
   }
  } // V6.0.18: transparent holographic side walls at ground level, sky pixels removed.
 const holoTex=tex('./reference/v614/walkway_wall_transparent.png');
 holoTex.wrapS=THREE.RepeatWrapping;holoTex.wrapT=THREE.ClampToEdgeWrapping;
 holoTex.repeat.set(4,1);
 const holoMat=new THREE.MeshBasicMaterial({map:holoTex,transparent:true,opacity:.68,
     alphaTest:.03,side:THREE.DoubleSide,depthWrite:false,depthTest:true,toneMapped:false,color:0xddd6ff});
 function hologramStrip(x,z,rotY){
   const group=new THREE.Group();group.position.set(x,0,z);group.rotation.y=rotY;root.add(group);
   // Invisible support geometry: image baseline touches actual ground.
   const panel=add(new THREE.PlaneGeometry(126,10.8),holoMat,0,5.42,0,group);
   panel.renderOrder=9;panel.userData.visualOnly=true;
   return group;
 }
 hologramStrip(-34,112,Math.PI/2);
 hologramStrip(34,112,-Math.PI/2);
 // Central floor insignia now uses the generated H-logo floor texture instead of line-built geometry,
 // enlarged to roughly 3x the previous size.
 const emblemPlate=block(0,.115,132,102,.05,102,new THREE.MeshBasicMaterial({color:0x000000,depthWrite:true}));
 const emblemTex=tex('./reference/v603/floor_tile_center_h.png');
 const emblemMat=new THREE.MeshBasicMaterial({map:emblemTex,color:0xffffff,depthTest:true,depthWrite:true,side:THREE.FrontSide});
 const emblemPlane=add(new THREE.PlaneGeometry(93,93),emblemMat,0,.182,132);emblemPlane.rotation.x=-Math.PI/2;
 // The skybridge is a structural deck with parapet, not one thin wire.

 function skybridge(rx,rz,height,z0){
  const upper=[],lower=[],outer=[],inner=[];for(let j=0;j<150;j++){
    const a=j*2*Math.PI/150,x=Math.cos(a)*rx,z=z0+Math.sin(a)*rz;
    upper.push([x,height+1.1,z]);lower.push([x,height-.9,z]);outer.push([(rx+2.5)*Math.cos(a),height+.6,z0+(rz+2.5)*Math.sin(a)]);inner.push([(rx-2.5)*Math.cos(a),height+.6,z0+(rz-2.5)*Math.sin(a)]);
  }
  strip(upper,1.55,mats.metal,true);strip(lower,.52,mats.black,true);strip(outer,.18,mats.pearl,true);strip(inner,.17,mats.violet,true);
  for(let j=0;j<48;j++){const a=j*2*Math.PI/48,x=rx*Math.cos(a),z=z0+rz*Math.sin(a);
   line([x,height-.9,z],[x,height+1.5,z],.10,mats.edge);
  }
 }
 skybridge(83,63,61,2);skybridge(102,87,47,-5);
 // Wider side towers remain behind front architecture, never obstruct the spawn axis.
 function tower(x,z,height,scale=1){
   const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);root.add(g);
   const h=height,wide=6.7;const outline=[[0,-wide],[-wide*.7,-wide*.6],[-wide,wide*.2],[-wide*.5,wide],[wide*.55,wide],[wide,wide*.2],[wide*.7,-wide*.7]];
   const sh=new THREE.Shape();outline.forEach(([a,b],i)=>i?sh.lineTo(a,b):sh.moveTo(a,b));sh.closePath();
   const m=add(new THREE.ExtrudeGeometry(sh,{depth:h,steps:1,bevelEnabled:true,bevelSize:.6,bevelThickness:.8,bevelSegments:2}),mats.metal,0,0,0,g);m.rotation.x=-Math.PI/2;
   for(const s of [-1,1])line([s*wide*.6,3,wide*.85],[s*wide*.23,h*.91,wide*.85],.15,s<0?mats.blue:mats.violet,g);
   line([-wide*.8,h*.86,wide*.6],[0,h,wide*.8],.10,mats.pearl,g);
   line([wide*.8,h*.86,wide*.6],[0,h,wide*.8],.10,mats.pearl,g);
 }
 for(const s of [-1,1])for(const [r,z,h] of [[77,-48,83],[112,-31,55],[89,55,47],[118,123,42],[113,-72,52]])tower(s*r,z,h,.68);
 // Trees: sculpted branch networks and leaf sprays, avoiding the former spheres.
 const leafShape=new THREE.Shape();leafShape.moveTo(0,0);leafShape.bezierCurveTo(.15,.1,.32,.61,0,1.18);leafShape.bezierCurveTo(-.30,.64,-.16,.16,0,0);
 const leafGeo=new THREE.ShapeGeometry(leafShape,6);const branchGeo=new THREE.CylinderGeometry(.06,.15,1,6);
 function tree(x,z,s=1){const g=new THREE.Group();g.position.set(x,.5,z);g.scale.setScalar(s);root.add(g);
   const trunk=add(new THREE.CylinderGeometry(.085,.22,3.2,8),mats.treeTrunk,0,1.65,0,g);
   const dummy=new THREE.Object3D();let stems=new THREE.InstancedMesh(branchGeo,mats.treeTrunk,20);let leafs=new THREE.InstancedMesh(leafGeo,mats.treeLeaf,160);let anchor=[];
   for(let j=0;j<20;j++){const a=j*2.39996,d=.7+(j%5)*.19,p=new THREE.Vector3(Math.cos(a)*d,2.5+(j%5)*.34,Math.sin(a)*d);anchor.push(p);const va=p.clone().sub(new THREE.Vector3(0,2,0));dummy.position.copy(p).add(new THREE.Vector3(0,2,0)).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,va.clone().normalize());dummy.scale.set(1,va.length(),1);dummy.updateMatrix();stems.setMatrixAt(j,dummy.matrix);}
   for(let j=0;j<160;j++){const p=anchor[j%20],a=j*2.39996,rr=.26+(j%5)*.18;dummy.position.set(p.x+Math.cos(a)*rr,p.y+((j%6)-3)*.15,p.z+Math.sin(a)*rr);dummy.rotation.set(Math.sin(j*3)*.4,a,Math.cos(j)*.55);dummy.scale.set(.38+(j%3)*.12,.46+(j%5)*.065,1);dummy.updateMatrix();leafs.setMatrixAt(j,dummy.matrix);}
   g.add(stems,leafs);
 }
 for(const z of [46,65,86,108,130,156,184])for(const s of [-1,1]){
   const x=s*(50+(z%4)*3);tree(x,z,1.05);tree(s*69,z+8,.79);
   block(s*50,.7,z,13,1.2,8,mats.black);block(s*50,1.37,z,13,.13,8,mats.edge);
 }
 for(const z of [-52,-28,0,17])for(const s of [-1,1]){tree(s*91,z,1.1);tree(s*104,z-4,.72);}
 // V6.0.18: tiered island gardens physically occupy the side quarters,
 // with luminous edge retaining walls and real waterfall drop-offs. They sit
 // beyond x=+/-48, keeping the whole main 3D arrival and doorway axis open.
 function gardenDeck(side,z,depth=32){
   const x=side*78;
   const deck=block(x,1.85,z,47,3.1,depth,mats.metal);
   const walking=block(x,3.46,z,46,.12,depth-.6,mats.ground);
   line([x-23.5,3.57,z-depth/2],[x+23.5,3.57,z-depth/2],.16,mats.violet);
   line([x-23.5,3.57,z+depth/2],[x+23.5,3.57,z+depth/2],.15,mats.blue);
   block(x+side*23.4,1.0,z,.6,5.5,depth,mats.edge);
   for(let i=0;i<3;i++){
     const zz=z-10+i*10;
     block(x-side*15,3.82,zz,10,.66,6,mats.black);
     // Each planting platform has actual architectural edge and soil.
     block(x-side*15,4.19,zz,9,.14,5.6,mats.darkSoil);
   }
   for(let i=0;i<6;i++){
     let sx=side*(58+(i%3)*13),sz=z-11+Math.floor(i/3)*20;
     line([sx,3.58,sz],[sx,3.61,sz+8],.07,mats.violet);
   }
 }
 for(const side of [-1,1])for(const z of [65,121,179])gardenDeck(side,z,35);
 // Waterfall retention architecture and lower cliff-face paneling are paired;
 // a visible lip hangs over an engineered side parapet, never the walk route.
 for(const side of [-1,1])for(const z of [65,121,179]){
   let x=side*103;
   block(x,1.3,z,2.9,6.2,26,mats.metal);
   line([x-side*1.7,4.52,z-13],[x-side*1.7,4.52,z+13],.23,mats.pearl);
   // Water sheeting uses the approved art's violet-white flowing textures.
   const source='./reference/v602/'+(['cascade_a','cascade_b','cascade_c'][Math.floor((z-65)/56)] )+'.png';
   const fallMat=new THREE.MeshBasicMaterial({map:tex(source),transparent:true,opacity:.92,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});
   const falls=add(new THREE.PlaneGeometry(27,22,14,3),fallMat,x+side*2,-6.5,z);
   falls.rotation.y=side*Math.PI/2;falls.renderOrder=10;
   for(let j=0;j<5;j++)line([x+side*2,3,z-12+j*6],[x+side*2,-17,z-12+j*6],.065,j%2?mats.blue:mats.pearl);
   block(x+side*1.2,-17.3,z,2,.25,27,mats.blue);
 }
 // Curved drop-face terraces from actual approved rear artwork, clipped to the
 // architectural surfaces; keep the close-at-hand platform from looking empty.
 for(const side of [-1,1]){
   const artMat=new THREE.MeshBasicMaterial({map:tex('./reference/v602/campus_water_'+(side<0?'l':'r')+'.png'),transparent:true,opacity:.80,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});
   const panel=add(new THREE.PlaneGeometry(110,47,16,6),artMat,side*93,-14,0);
   panel.rotation.y=side*Math.PI/2;panel.renderOrder=5;
 }
 // Island-edge waterfalls: multiple continuous physically located sheets and basin glows.
 function waterfall(x,z,w,drop,rot=0){let g=new THREE.Group();g.position.set(x,-.6,z);g.rotation.y=rot;root.add(g);
   let map=tex('./reference/v5-waterfall.png');map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(Math.max(1,w/7),1);waterfallMaps.push(map);
   let mat=new THREE.MeshBasicMaterial({map,transparent:true,opacity:.92,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false});
   add(new THREE.PlaneGeometry(w,drop,15,1),mat,0,-drop/2,0,g);
   block(0,0,0,w+.3,.20,2,mats.metal,g);block(0,.14,.1,w,.09,.9,mats.blue,g);
   for(let j=0;j<14;j++){const dx=-w/2+(j+.5)*w/14;line([dx,0,.17],[dx+(j%3-1)*.35,-drop,.17],.038,j%3?mats.blue:mats.pearl,g);}
 }
 for(let j=-5;j<=5;j++)waterfall(j*21,210,13+(j%3)*3,34+(j%4)*5);
 for(let j=-4;j<=4;j++)waterfall(j*26,-80,12+(j%3)*3,38+(j%3)*7,Math.PI);
 for(const s of [-1,1])for(const z of [-35,38,112,180])waterfall(s*137,z,15,37,s*Math.PI/2);
 // Accent pools and short waterfalls placed in view on the plaza sides.
 for(const s of [-1,1])for(const z of [78,146]){
   block(s*69,.18,z,22,.2,8,mats.glass);
   line([s*80,.37,z-4],[s*80,.37,z+4],.23,mats.blue);
 }
 // Original automatic door, collision and seamless lobby state are not touched.
 automaticEntrance(0,32);
 guard(-12,39,206,true);guard(12,39,207,true);guard(-29,74,208,true);guard(29,74,209,true);
 // Separate from game logic; visual lights help photo-derived geometry read from ground.
 const fill=new THREE.DirectionalLight(0xb4c8ff,2.6);fill.position.set(10,100,165);root.add(fill);
 for(const [x,z] of [[-30,60],[30,60],[-44,111],[44,111]]){const p=new THREE.PointLight(0x9a72ff,19,57,1.6);p.position.set(x,10,z);root.add(p);}
 return root;
}
