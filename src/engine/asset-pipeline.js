import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const ADDONS='https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/';
// Explicit, memoized loaders. Asset URLs resolve against the website rather than a CDN.
export class AssetPipeline {
 constructor(renderer){this.renderer=renderer;this.cache=new Map();this.textureLoader=new THREE.TextureLoader();}
 async texture(url,{color=true,repeat=null,anisotropy=8}={}){
  const key=JSON.stringify(['texture',url,color,repeat,anisotropy]);if(this.cache.has(key))return this.cache.get(key);
  const promise=this.textureLoader.loadAsync(url).then(t=>{t.colorSpace=color?THREE.SRGBColorSpace:THREE.NoColorSpace;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=Math.min(anisotropy,this.renderer.capabilities.getMaxAnisotropy());if(repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...repeat);}return t;});
  this.cache.set(key,promise);try{return await promise}catch(e){this.cache.delete(key);throw e}
 }
 async model(url,{draco='/third_party/draco/',ktx2='/third_party/basis/'}={}){
  if(this.cache.has('model:'+url))return (await this.cache.get('model:'+url)).scene.clone(true);
  const task=(async()=>{const [{GLTFLoader},{DRACOLoader},{KTX2Loader}]=await Promise.all([import(ADDONS+'loaders/GLTFLoader.js'),import(ADDONS+'loaders/DRACOLoader.js'),import(ADDONS+'loaders/KTX2Loader.js')]);const loader=new GLTFLoader();
   if(draco){const d=new DRACOLoader();d.setDecoderPath(draco);loader.setDRACOLoader(d)}
   if(ktx2){const k=new KTX2Loader();k.setTranscoderPath(ktx2);k.detectSupport(this.renderer);loader.setKTX2Loader(k)}
   return loader.loadAsync(url)})();this.cache.set('model:'+url,task);try{return (await task).scene.clone(true)}catch(e){this.cache.delete('model:'+url);throw e}
 }
 async preload(urls){return Promise.all(urls.map(x=>x.endsWith('.glb')||x.endsWith('.gltf')?this.model(x):this.texture(x)))}
 clear(){this.cache.clear()}
}
