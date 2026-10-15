from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from pathlib import Path
import numpy as np
P=Path(__file__).parent/'reference';D=P/'v6';D.mkdir(exist_ok=True)

def cut(name,source,box,poly,hole=None):
    im=Image.open(P/source).convert('RGBA')
    m=Image.new('L',im.size,0);d=ImageDraw.Draw(m);d.polygon(poly, fill=255)
    if hole:
        d.polygon(hole,fill=0)
    m=m.filter(ImageFilter.GaussianBlur(2.2))
    im.putalpha(m);im=im.crop(box)
    im.save(D/name,optimize=True)
    print('cut',name,im.size)

cut('tower_front.png','exterior-v5-front.png',(490,0,1190,780),[
    (630,0),(1013,0),(1018,94),(1045,130),(1050,218),(1089,292),
    (1096,365),(1149,443),(1160,711),(1103,764),(555,764),(512,698),
    (517,454),(555,365),(563,295),(596,171),(622,114)],
    [(804,719),(875,719),(875,780),(804,780)])
cut('tower_rear.png','exterior-v5-rear.png',(490,0,1190,800),[
    (655,0),(952,0),(1021,85),(1059,162),(1091,312),(1135,410),(1158,733),
    (1101,787),(546,787),(514,714),(532,434),(557,277),(606,150)],
    [(805,735),(870,735),(870,800),(805,800)])
# Backdrop campus panels are foreground/skyline silhouettes from original art;
# keep only terrain, distant towers, skybridge structures. Sky itself stays the existing cosmic background.
for name,src,high in [('campus_front.png','exterior-v5-wide.png',660),('campus_rear.png','exterior-v5-rear.png',750),('campus_side.png','exterior-v5-side.png',540)]:
    im=Image.open(P/src).convert('RGBA');w,h=im.size
    ar=np.array(im); yy=np.arange(h).reshape(-1,1)
    # sky fades above structures; mid-band full detail at the architecture horizon
    start=int(h*.28); end=int(h*.59)
    alpha=np.clip((yy-start)/max(1,end-start),0,1)*255
    alpha=np.broadcast_to(alpha,(h,w)).copy()
    # edge alpha softened to eliminate hard rectangular photo plates
    edge=np.minimum(np.arange(w),np.arange(w)[::-1]);a2=np.clip(edge/80,0,1)
    alpha=(alpha*a2[None,:]).astype('uint8')
    ar[:,:,3]=alpha
    out=Image.fromarray(ar).crop((0,0,w,min(high,h)))
    out.save(D/name,optimize=True)
    print('campus',name,out.size)
# Floor: use actual architectural reflected colors from a supplied photograph as source.
# Build repeatable panel grain with stronger seams and soft violet bloom.
s=1024
tex=Image.new('RGB',(s,s),'#111526');d=ImageDraw.Draw(tex)
for j in range(0,s,256):
 for i in range(0,s,256):
  v=((i//256)*9+(j//256)*13)%16
  base=(18+v//2,22+v//3,39+v//2)
  d.rectangle([i+5,j+5,i+251,j+251],fill=base)
  d.line([(i+7,j+7),(i+245,j+7)],fill=(65,52,100),width=2)
  d.line([(i+7,j+7),(i+7,j+245)],fill=(33,41,79),width=2)
  d.line([(i+250,j+10),(i+250,j+245)],fill=(22,30,62),width=3)
  if (i//256+j//256)%3==0:
   d.line([(i+12,j+244),(i+244,j+244)],fill=(139,77,225),width=3)
# Slightly high contrast for screenshot visibility
tex=tex.filter(ImageFilter.GaussianBlur(.5));tex.save(D/'pavement.jpg',quality=93)
print('done')
cut('tower_side.png','exterior-v5-side.png',(486,25,1040,535),[
 (625,25),(835,25),(845,70),(887,122),(906,175),(910,247),
 (945,307),(989,360),(1034,478),(994,526),(528,526),(492,467),
 (515,365),(551,289),(575,196),(604,103)])
