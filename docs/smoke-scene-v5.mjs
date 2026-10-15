/** Offline geometry construction smoke test. Does NOT render WebGL or certify appearance. */
import { buildExteriorV5, updateExteriorV5 } from '../src/exterior-v5.js';
let nodes=0;
class DummyNode{
 constructor(){nodes++;this.position=new Vector3();this.rotation={set(...a){}};this.scale={setScalar(){},set(){}};this.quaternion={setFromUnitVectors(){}};this.children=[];this.matrix={};this.material={};this.holes=[];this.repeat={set(){}};this.offset={y:0};}
 add(...o){this.children.push(...o)}
 load(){return new DummyNode()}
 moveTo(){} lineTo(){}closePath(){}quadraticCurveTo(){}setMatrixAt(){}updateMatrix(){}setAttribute(){}setIndex(){}computeVertexNormals(){}
 clone(){return new DummyNode()}
}
class Vector3 {
 constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}
 set(x,y,z){this.x=x;this.y=y;this.z=z;return this}
 copy(o){this.x=o.x;this.y=o.y;this.z=o.z;return this}
 clone(){return new Vector3(this.x,this.y,this.z)}
 sub(o){this.x-=o.x;this.y-=o.y;this.z-=o.z;return this}
 add(o){this.x+=o.x;this.y+=o.y;this.z+=o.z;return this}
 multiplyScalar(n){this.x*=n;this.y*=n;this.z*=n;return this}
 normalize(){let n=this.length()||1;return this.multiplyScalar(1/n)}
 length(){return Math.hypot(this.x,this.y,this.z)}
}
const THREE=new Proxy({Vector3,SRGBColorSpace:'srgb',DoubleSide:2,AdditiveBlending:3}, {get(target,key){return target[key]||DummyNode}});
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({createLinearGradient:()=>({addColorStop(){}}),fillRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},stroke(){},fillText(){},fillRect(){}})})};
const world=new DummyNode(),scene={environment:null};const mk=()=>{};
const built=buildExteriorV5({THREE,scene,world,automaticEntrance:mk,guard:mk,hexcoreFloorLogo:mk,skyNebula:mk,buildOrbitingPlanets:mk});
updateExteriorV5(24);
if(!built || nodes<100)throw new Error('Exterior construction did not complete');
console.log('Exterior geometry construction calls completed, total mock allocations:',nodes);
