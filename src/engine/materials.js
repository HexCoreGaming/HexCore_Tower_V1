import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
export const HEXCORE_PALETTE=Object.freeze({obsidian:0x101019,graphite:0x25283a,metal:0x474b60,violet:0x9165ff,blue:0x568dff,cyan:0x6de9ed});
export function createMaterialLibrary(){const p=HEXCORE_PALETTE;return {
 obsidian:new THREE.MeshStandardMaterial({color:p.obsidian,metalness:.48,roughness:.52}),
 graphite:new THREE.MeshStandardMaterial({color:p.graphite,metalness:.66,roughness:.36}),
 metal:new THREE.MeshStandardMaterial({color:p.metal,metalness:.8,roughness:.28}),
 luminousViolet:new THREE.MeshBasicMaterial({color:p.violet,toneMapped:false}),
 luminousCyan:new THREE.MeshBasicMaterial({color:p.cyan,toneMapped:false}),
 glass:new THREE.MeshPhysicalMaterial({color:0x6282b1,metalness:.12,roughness:.12,transmission:.25,transparent:true,opacity:.5,depthWrite:false}),
 floor:new THREE.MeshStandardMaterial({color:0x10111b,metalness:.2,roughness:.72})
 }}
export function disposeLibrary(m){for(const mat of Object.values(m))mat.dispose()}
