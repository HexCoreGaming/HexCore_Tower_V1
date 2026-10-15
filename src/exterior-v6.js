/**
 * HEXCORE / ART-REFERENCED EXTERIOR V6
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
 const root=new THREE.Group();root.name='HEXCORE V6 REFERENCE-ART ENVIRONMENT';world.add(root);
 const tex=(path,repeat)=>{let t=new THREE.TextureLoader().load(path);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;if(repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...repeat);}return t};
 const mats={
  black:new THREE.MeshStandardMaterial({color:0x101827,metalness:.78,roughness:.27}),
  edge:new THREE.MeshStandardMaterial({color:0x4f587a,metalness:.8,roughness:.23}),
  metal:new THREE.MeshStandardMaterial({color:0x292d46,metalness:.8,roughness:.23}),
  glass:new THREE.MeshPhysicalMaterial({color:0x708cb7,metalness:.18,roughness:.07,transmission:.34,transparent:true,opacity:.36,depthWrite:false,side:THREE.DoubleSide,clearcoat:1}),
  ground:new THREE.MeshPhysicalMaterial({map:tex('./reference/v6/pavement.jpg',[.035,.035]),color:0xbcc0ff,metalness:.63,roughness:.20,clearcoat:1,clearcoatRoughness:.07,envMapIntensity:1.7}),
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
 const edgePoints=[];for(let j=0;j<128;j++){const a=j*2*Math.PI/128;edgePoints.push([141*Math.cos(a)*(1+.021*Math.sin(a*7)),64+151*Math.sin(a)*(1+.021*Math.sin(a*7))]);}
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
 // Reference-derived photographic architecture mapped to layered THREE surfaces.
 // This is intentionally art-based, not another skyscraper built from black spikes.
 function artPlane(path,x,y,z,w,h,rotation=0,opacity=1){const m=new THREE.MeshBasicMaterial({map:tex(path),transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false,alphaTest:.025,toneMapped:false});
   const architectural=path.includes('tower_');
   const geometry=new THREE.PlaneGeometry(w,h,architectural?48:1,architectural?72:1);
   if(architectural){
    // Mesh relief tied to the reference facade, not a flat image card.
    // Layered folds, architectural setbacks and recessed glazing preserve parallax.
    const a=geometry.getAttribute('position');
    for(let i=0;i<a.count;i++){
      const ux=a.getX(i)/w+.5, uy=a.getY(i)/h+.5;
      const dx=Math.abs(ux-.5), lowest=1-uy;
      const rib=Math.pow(Math.max(0,Math.sin(ux*76)),5)*1.7;
      const center=dx<.24?2.5:dx<.39?1.2:0;
      const inset=(uy<.27 && dx<.21)?-2.2:0;
      const base=lowest>.60?Math.pow((lowest-.60)*2.2,2)*2.0:0;
      a.setZ(i,center+rib+inset+base);
    }
    geometry.computeVertexNormals();
   }
   const ob=add(geometry,m,x,y,z);ob.rotation.y=rotation;ob.renderOrder=9;return ob;}
 // Three distinct elevations define tower's real occupied footprint; artwork maps to
 // front/back and flanking sides, creating visual continuity while orbiting the building.
 artPlane('./reference/v6/tower_front.png',0,90,37,105,180,0);
 artPlane('./reference/v6/tower_rear.png',0,90,-46,109,180,Math.PI);
 artPlane('./reference/v6/tower_side.png',-44,90,-4,98,180,-Math.PI/2,.92);
 artPlane('./reference/v6/tower_side.png',44,90,-4,98,180,Math.PI/2,.92);
 // Beyond the near structure: separated campus panorama layers using the actual
 // reference scene, giving side, rear, plaza and distant ring architecture real detail.
 artPlane('./reference/v6/campus_front.png',0,41,-76,280,115,0,.94);
 artPlane('./reference/v6/campus_rear.png',0,43,-99,300,128,Math.PI,.88);
 for(const s of [-1,1])artPlane('./reference/v6/campus_side.png',s*115,35,10,205,94,s*Math.PI/2,.86);
 // Raised architectural ribs and angled lower buttresses add dimensional depth
 // around the photographic core without drawing gigantic needles over the artwork.
 for(const s of [-1,1]){
  for(let j=0;j<6;j++){
   const xx=s*(17+j*5.2),hh=56-j*5.5;
   line([xx,8,38+j*.05],[xx,hh,37-j*.8],j===0?.37:.19,j%2?mats.blue:mats.violet);
   line([xx-s*3,7,-43],[xx-s*3,hh-3,-43],.15,mats.violet);
  }
 }
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
 // Plaza and grand approach: real 3D strips with visible specular tile treatment.
 for(const side of [-1,1]){
   for(const x of [8,18,30])line([side*x,.31,38],[side*x,.31,206],x===8?.11:.045,x===8?mats.blue:mats.violet);
   for(const z of [43,60,77,94,111,128,145,162,179,196])line([side*8,.33,z],[side*38,.33,z],.044,mats.edge);
   // Low monumental step-terraces beside a permanent flush center approach.
   for(let j=0;j<7;j++){
    const X=side*21, Z=32+j*1.7;
    block(X,.24+j*.13,Z,23,.25+j*.25,1.55,j%2?mats.metal:mats.black);
    line([side*11,.45+j*.25,Z+.78],[side*32,.45+j*.25,Z+.78],.06,j%2?mats.blue:mats.violet);
   }
  }
 }
 // Central HexCore floor emblem at spawn foreground. Glowing inlaid metalwork.
 const hex=[];for(let j=0;j<6;j++){const a=j*2*Math.PI/6;hex.push([11*Math.cos(a),.47,132+11*Math.sin(a)]);}strip(hex,.21,mats.violet,true);
 for(const s of [-1,1])line([s*3,.49,125],[s*3,.49,139],.44,mats.pearl);
 line([-3,.5,132],[3,.5,132],.44,mats.pearl);
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
