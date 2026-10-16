import {AssetPipeline} from './asset-pipeline.js';
import {WorldSceneManager} from './scene-system.js';
export class HexCoreRuntime {
 constructor({renderer,scene}){this.renderer=renderer;this.scene=scene;this.assets=new AssetPipeline(renderer);this.worlds=new WorldSceneManager(scene);this.frames=0;this.fps=0;this.elapsed=0;this.lastFrameMs=0;this.drawCalls=0;this.triangles=0;this.enabled=true;}
 frame(dt){if(!this.enabled)return;const clamped=Math.max(0,Math.min(dt,.1));this.worlds.update(clamped);this.frames++;this.elapsed+=clamped;if(this.elapsed>=1){this.fps=Math.round(this.frames/this.elapsed);this.frames=0;this.elapsed=0;}this.lastFrameMs=dt*1000;this.drawCalls=this.renderer.info.render.calls;this.triangles=this.renderer.info.render.triangles;}
 stats(){return {fps:this.fps,frameMs:this.lastFrameMs,drawCalls:this.drawCalls,triangles:this.triangles,activeWorld:this.worlds.current?.id??'legacy'};}
}
export function installRuntime({renderer,scene}){const rt=new HexCoreRuntime({renderer,scene});if(typeof window!=='undefined'){Object.defineProperty(window,'hexcoreEngine',{value:rt,writable:false,configurable:true})}return rt}
