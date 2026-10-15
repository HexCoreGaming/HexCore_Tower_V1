/**
 * HEXCORE // Stylized Character Art V6
 * Sculpted poly-surface people (lofted faces/torso, facial features,
 * asymmetrical hairstyles, clothes, boots, shaped elf ears). Distinct from
 * the V5 block and sphere mannequins. Intentionally modest PS2-style meshes;
 * they are not scans or externally authored AAA character models.
 */
export function createStylizedEmployee(THREE,{index=0,elf=false,female=false,role='Staff',skinColor=0xb6876a,hairColor=0x201b30}){
 const g=new THREE.Group();g.name='HexCore / character / '+index;
 const clothColors=[0x20283c,0x26243c,0x1d3445,0x202c33,0x302537];
 const coatColor=role==='Security'?0x111b2d:(role==='Staff'?clothColors[index%clothColors.length]:0x24243c);
 const fabric=new THREE.MeshStandardMaterial({color:coatColor,metalness:.14,roughness:.76,flatShading:false});
 const inset=new THREE.MeshStandardMaterial({color:0x111724,metalness:.31,roughness:.57});
 const fabricLite=new THREE.MeshStandardMaterial({color:0x434762,metalness:.22,roughness:.55});
 const accentColors=[0xa98ee8,0x6de7ff,0xb47cff,0x8ad5ff,0xf0a4ff];
 const accent=role==='Security'?0x65cfff:accentColors[index%accentColors.length];
 const lining=new THREE.MeshStandardMaterial({color:accent,emissive:accent,emissiveIntensity:.27,metalness:.55,roughness:.28});
 const skin=new THREE.MeshStandardMaterial({color:skinColor,roughness:.86});
 const hair=new THREE.MeshStandardMaterial({color:hairColor,roughness:.85,metalness:.04});
 const eyes=new THREE.MeshStandardMaterial({color:0xddd4cd,roughness:.38});
 const iris=new THREE.MeshStandardMaterial({color:(index%3===0?0x4f8b8f:0x423b5b),roughness:.29});
 const lip=new THREE.MeshStandardMaterial({color:0x764947,roughness:.89});
 const boot=new THREE.MeshStandardMaterial({color:0x0e121d,roughness:.48,metalness:.2});
 const buckle=new THREE.MeshStandardMaterial({color:0x7489ab,roughness:.27,metalness:.75});
 const carbon=new THREE.MeshStandardMaterial({color:0x121625,metalness:.68,roughness:.28});
 const geoMesh=(geom,material,par=g)=>{const m=new THREE.Mesh(geom,material);par.add(m);return m;};
 // Cross-section lathed shells yield anatomically tapered contours, not primitive blocks.
 function loft(levels,mat,parent=g,segments=18){const pts=[],uv=[],indices=[];
  for(let j=0;j<levels.length;j++){
   const [y,rx,rz,x=0,z=0]=levels[j];
   for(let k=0;k<=segments;k++){
    const a=k/segments*Math.PI*2;
    const s=Math.sin(a),c=Math.cos(a);
    pts.push(x+rx*c,y,z+rz*s);uv.push(k/segments,j/(levels.length-1));
   }
  }
  for(let j=0;j<levels.length-1;j++)for(let k=0;k<segments;k++){
   const i=j*(segments+1)+k,jj=i+segments+1;indices.push(i,jj,i+1,jj,jj+1,i+1);
  }
  const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));geom.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geom.setIndex(indices);geom.computeVertexNormals();return geoMesh(geom,mat,parent);
 }
 function wedge(p1,p2,p3,p4,material,parent=g){let vertices=[...p1,...p2,...p3,...p4];let geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geom.setIndex([0,1,2,0,2,3]);geom.computeVertexNormals();material.side=THREE.DoubleSide;return geoMesh(geom,material,parent)}
 function pebble(x,y,z,rx,ry,rz,mat,segments=16,parent=g){const g0=new THREE.SphereGeometry(1,segments,12);const ob=geoMesh(g0,mat,parent);ob.position.set(x,y,z);ob.scale.set(rx,ry,rz);return ob;}
 function rod(a,b,r,mat,segments=9,parent=g){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A),m=geoMesh(new THREE.CylinderGeometry(r*.77,r,d.length(),segments),mat,parent);m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
 // Independently hinged hips: leg and boot mesh share one pivot for real strides.
 const legs=[];
 for(const side of [-1,1]){
  const pivot=new THREE.Group();pivot.position.set(side*.157,1.12,0);g.add(pivot);
  const leg=new THREE.Group();leg.position.set(-side*.157,-1.12,0);pivot.add(leg);legs.push(pivot);
  const cx=side*.157;
  loft([[.02,.117,.19,cx,.095],[.08,.16,.28,cx,.12],[.17,.15,.245,cx,.085],[.22,.13,.19,cx,.025],[.30,.13,.155,cx,.00]],boot,leg);
  rod([cx,.16,.21],[cx,.16,.29],.075,boot,9,leg);
  loft([[.22,.108,.127,cx,0],[.46,.111,.119,cx,0],[.77,.113,.132,cx,0],[1.07,.132,.147,cx,0],[1.16,.139,.147,cx,0]],inset,leg);
  rod([cx-.085,.84,.138],[cx+.085,.84,.138],.017,lining,6,leg);
  // Segmented boot armor and luminous shin seam; both follow the leg pivot.
  loft([[.37,.120,.147,cx,.03],[.52,.126,.150,cx,.025],[.69,.115,.143,cx,.03]],carbon,leg);
  rod([cx,.35,.175],[cx,.71,.165],.016,lining,6,leg);
 }
 // Fitted jacket/trousers with collar, neck, seams and tapered waist.
 const shoulder=female?.395:.455;
 loft([[1.03,.28,.22],[1.12,.295,.23],[1.23,.27,.20],[1.32,.29,.20],[1.47,.34,.21],[1.69,shoulder*.90,.24],[1.82,shoulder,.24],[1.92,shoulder*.84,.21],[2.01,.30,.17],[2.06,.19,.155]],fabric);
 loft([[1.02,.30,.22],[1.14,.305,.23],[1.20,.295,.21]],fabricLite);
 // Jacket's v-collar, left/right lapels, subtle striping, and undershirt.
 wedge([-.24,1.94,.19],[-.03,1.73,.256],[-.01,1.62,.237],[-.105,1.95,.193],fabricLite);
 wedge([.24,1.94,.19],[.03,1.73,.256],[.01,1.62,.237],[.105,1.95,.193],fabricLite);
 wedge([-.10,1.97,.20],[0,1.73,.274],[.10,1.97,.20],[0,2.04,.16],inset);
 rod([-.025,1.74,.27],[-.025,1.14,.242],.013,lining,6);
 for(const side of [-1,1]){
  rod([side*.30,1.62,.198],[side*.22,1.48,.22],.026,lining,7);
  rod([side*.26,1.15,.20],[side*.26,1.09,.20],.025,buckle,7);
 }
 // Sleeves belong to separate pivots and have curved elbow/forearm proportions.
 const arms=[];
 for(const side of [-1,1]){
  const pivot=new THREE.Group();pivot.position.set(side*shoulder*.94,1.90,0);g.add(pivot);arms.push(pivot);
  const sl=side;
  loft([[ -.77,.100,.102,sl*.070,0],[-.61,.118,.127,sl*.08,0],[-.40,.128,.14,sl*.055,0],[-.20,.144,.155,sl*.023,0],[0,.174,.174,0,0]],fabric,pivot);
  loft([[-.92,.086,.087,sl*.078,.01],[-.84,.105,.106,sl*.07,.005],[-.72,.103,.105,sl*.07,0]],skin,pivot);
  rod([sl*.04,-.73,.13],[sl*.08,-.73,.13],.027,lining,7,pivot);
 }
 // Sculpted neck and full head: cheeks, chin, jaw, eyebrow, eyelid and nose.
 loft([[2.00,.145,.139],[2.07,.14,.145],[2.19,.13,.134],[2.22,.14,.132]],skin);
 loft([
  [2.16,.14,.15,0,.035],[2.21,.205,.173,0,.015],[2.27,.248,.210,0,-.004],
  [2.34,.292,.224,0,-.009],[2.43,.300,.229,0,-.011],[2.54,.292,.223,0,-.018],
  [2.65,.246,.199,0,-.029],[2.73,.175,.145,0,-.045],[2.766,.085,.074,0,-.05]
 ],skin);
 // Narrow bridge, formed tip, sculpted nostrils.
 pebble(0,2.386,.215,.072,.104,.071,skin,14);
 pebble(0,2.326,.264,.090,.05,.071,skin,12);
 for(const side of [-1,1]){
  pebble(side*.13,2.442,.207,.106,.064,.020,eyes);
  pebble(side*.124,2.438,.225,.039,.047,.024,iris);
  pebble(side*.124,2.436,.245,.020,.028,.013,inset);
  rod([side*.065,2.518,.221],[side*.219,2.518,.191],.023,hair,9);
  pebble(side*.163,2.300,.168,.1,.051,.049,skin);
  pebble(side*.23,2.393,-.012,.073,.13,.084,skin,14);
 }
 // Sculpted mouth with a gentle lower-lip shape; not a black pixel line.
 pebble(0,2.273,.216,.09,.022,.029,lip,15);
 pebble(0,2.248,.208,.094,.026,.034,skin,15);
 // Slender pointed elf ears taper outwards from anatomically placed roots.
 if(elf)for(const side of [-1,1]){
  const p0=[side*.255,2.41,-.01],p1=[side*.327,2.49,.008],tip=[side*.50,2.63,.018],p2=[side*.345,2.33,.07];
  wedge(p0,p1,tip,p2,skin);
  rod([side*.317,2.408,.075],[side*.469,2.588,.043],.018,lip,6);
 }
 // Hairstyle cap with narrow shaped strands. Multiple stylistic variations.
 loft([[2.59,.28,.219,0,-.045],[2.67,.270,.207,0,-.045],[2.76,.184,.15,0,-.055],[2.79,.055,.068,0,-.055]],hair);
 const long=female || index%5===0;
 const strands=long?12:9;
 for(let j=0;j<strands;j++){
  const a=j*2*Math.PI/strands;
  const x=Math.cos(a)*.22,z=-.05+Math.sin(a)*.18;
  const y0=2.70-(j%3)*.017,dy=(long?.34:.10)+(j%4)*.035;
  rod([x,y0,z],[x*1.12,y0-dy,z+.015],long?.047:.040,hair,6);
 }
 if(long)for(const side of [-1,1]){
   for(let k=0;k<5;k++){
    const xx=side*(.205+k*.014),zz=-.12-k*.022;
    rod([xx,2.65,zz],[xx+side*.04,2.09+(k%3)*.1,zz-.02],.048,hair,7);
   }
 }
 // Utility insignia and small costume accessories (mesh based, not text labels).
 rod([-.22,1.6,.230],[-.10,1.6,.237],.018,lining,6);
 pebble(.265,1.80,.22,.058,.072,.023,buckle,10);
 for(const side of [-1,1])pebble(side*.17,1.085,.24,.025,.03,.02,buckle,9);

 // HexCore world identity: illuminated tailored armor, distinct shoulders and equipment,
 // plus subtle cybernetic surface treatment. No primitive helmet or block mannequins.
 for(const side of [-1,1]){
  loft([[1.80,.11,.19,side*.395,0],[1.88,.17,.22,side*.395,0],[1.94,.12,.19,side*.395,0]],carbon);
  rod([side*.31,1.83,.231],[side*.425,1.85,.18],.026,lining,7);
  rod([side*.34,1.73,.236],[side*.37,1.81,.224],.012,buckle,6);
 }
 if(role==='Security'){
  // Compact armored collar, duty chest plate and communicator.
  loft([[1.86,.30,.215],[1.96,.31,.19],[2.035,.20,.17]],carbon);
  rod([-.17,1.76,.249],[.17,1.76,.249],.026,lining,8);
  pebble(.21,1.83,.239,.072,.075,.023,lining,12);
 }else{
  // Tailored HexCore staff tabard, asymmetric lapel clasp and optical badge.
  wedge([-.13,1.69,.257],[.07,1.64,.264],[.06,1.22,.232],[-.12,1.22,.228],fabricLite);
  pebble(-.16,1.83,.247,.065,.042,.017,lining,12);
 }
 if(index%4===0){
  // Refined temple implant fitted to the face, not a face-obscuring mask.
  rod([.264,2.48,.125],[.286,2.54,.02],.018,buckle,7);
  pebble(.281,2.49,.112,.031,.025,.017,lining,9);
 }
 // Small articulated collar pips and longline coat variation.
 if(index%3===1){
  loft([[.94,.32,.21],[1.03,.34,.22],[1.12,.29,.22]],fabric);
  for(const side of [-1,1])rod([side*.27,1.02,.22],[side*.31,.82,.19],.016,lining,6);
 }

 g.userData.armPivots=arms;
 g.userData.legPivots=legs;
 return g;
}
