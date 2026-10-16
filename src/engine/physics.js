// Optional true rigid-body engine. Dynamically loaded only by worlds that need collisions.
export async function createPhysicsWorld({gravity={x:0,y:-9.81,z:0}}={}){
 const RAPIER=await import('https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.19.3/rapier.es.js');
 await RAPIER.init();const world=new RAPIER.World(gravity);return {
 world,RAPIER,step:(dt=1/60)=>{world.timestep=Math.min(Math.max(dt,1/240),1/30);world.step()},
 fixedStep:(accumulator,dt,step=1/60)=>{let a=Math.min(accumulator+dt,.25);while(a>=step){world.timestep=step;world.step();a-=step}return a},
 addGround:(position={x:0,y:-.5,z:0},halfExtents={x:20,y:.5,z:20})=>{const body=world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(position.x,position.y,position.z));world.createCollider(RAPIER.ColliderDesc.cuboid(halfExtents.x,halfExtents.y,halfExtents.z),body);return body}
 }
}
