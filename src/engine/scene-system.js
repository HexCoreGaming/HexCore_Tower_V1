import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createCodeField,createPortalMaterial,updateShaderTime} from './effects.js';
import {createMaterialLibrary,disposeLibrary} from './materials.js';
export class WorldSceneManager {
 constructor(scene){this.scene=scene;this.current=null;this.worlds=new Map();this.time=0;}
 register(id,create){if(this.worlds.has(id))throw Error('Duplicate world '+id);this.worlds.set(id,create)}
 enter(id,context={}){if(!this.worlds.has(id))throw Error('Unknown world '+id);this.leave();const g=this.worlds.get(id)(context);this.scene.add(g);this.current={id,root:g};return g;}
 update(dt){this.time+=dt;if(this.current)updateShaderTime(this.current.root,this.time)}
 leave(){if(!this.current)return;const root=this.current.root;this.scene.remove(root);root.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])if(!m.userData?.shared)m.dispose()}});this.current=null}
}
// Functional scene prototype reserved for the later department rebuild; not activated in 6.0.29.
export function createPocketDimension({title='HEXCORE',codeCount=320}={}){const root=new THREE.Group(),m=createMaterialLibrary();root.userData.materials=m;
 const base=new THREE.Mesh(new THREE.CylinderGeometry(24,26,2,8),m.obsidian);base.position.y=-1.5;root.add(base);
 const deck=new THREE.Mesh(new THREE.CylinderGeometry(23,23,.3,8),m.floor);deck.position.y=-.35;root.add(deck);
 for(let i=0;i<8;i++){let a=i*Math.PI/4;const edge=new THREE.Mesh(new THREE.BoxGeometry(16,.16,.28),i%2?m.luminousCyan:m.luminousViolet);edge.position.set(Math.sin(a)*22,0,Math.cos(a)*22);edge.rotation.y=a;root.add(edge)}
 root.add(createCodeField({count:codeCount,radius:60,height:85}),createCodeField({count:codeCount,radius:75,height:100,rising:true}));
 const portal=new THREE.Mesh(new THREE.CircleGeometry(3.3,96),createPortalMaterial());portal.position.set(0,3.5,-15);root.add(portal);root.userData.title=title;return root}
