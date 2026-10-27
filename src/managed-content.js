// Shared public content from HexCore's Git-backed CMS. Public content only, never credentials.
export const managedContent = {departments:{},faq:{},media:[],posts:[],siteOverrides:{traditional:{},"3d":{}},guideLines:{}};
export const managedReady = fetch('./data/managed-content.json', {cache:'no-cache'})
  .then(r=>r.ok?r.json():null)
  .then(d=>{if(!d||d.schema!==1)return;
    Object.assign(managedContent.departments,d.departments||{});
    Object.assign(managedContent.faq,d.faq||{});
    managedContent.media=Array.isArray(d.media)?d.media:[];
    managedContent.posts=Array.isArray(d.posts)?d.posts:[];managedContent.siteOverrides=d.siteOverrides||{traditional:{},"3d":{}};managedContent.guideLines=d.guideLines||{};
  }).catch(()=>{});
