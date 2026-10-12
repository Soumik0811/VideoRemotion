"""Fallback preview renderer if npm is inaccessible; Remotion TSX is the editable master."""
from PIL import Image, ImageDraw, ImageFont
import json, math, subprocess, time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];data=json.loads((ROOT/'src/data/episode.json').read_text())
W,H,FPS=540,960,data['fps'];DUR=sum(s['seconds'] for s in data['scenes'])
DARK='#332922';PAPER='#FBF6E9';GOLD='#F8C35B';MINT='#DAEDDB';GREEN='#548A6A';CORAL='#E38E77';BLUE='#82B7BC';SOFT='#7E7066';WHITE='#FFFEFA';LEAF='#C8DDBE'
FONT='/usr/share/fonts/truetype/lato/Lato-Black.ttf';BOLD='/usr/share/fonts/truetype/lato/Lato-Bold.ttf'
fonts={n:ImageFont.truetype(FONT,n) for n in range(11,75)};regular={n:ImageFont.truetype(BOLD,n) for n in range(11,60)}
def ease(a):a=max(0,min(1,a));return 1-(1-a)**3
def show(t,at,d=.4):return ease((t-at)/d)
def center(d,x,y,text,size=26,color=DARK):
 f=fonts[size];bb=d.multiline_textbbox((0,0),text,font=f,spacing=5,align='center');w=bb[2]-bb[0];h=bb[3]-bb[1]
 d.multiline_text((x-w/2,y-h/2-bb[1]),text,font=f,fill=color,spacing=5,align='center')
def text(d,x,y,text,size=19,color=DARK):d.text((x,y),text,font=fonts[size],fill=color)
def rect(d,x,y,w,h,bg,outline=DARK,r=13,th=3):
 d.rounded_rectangle((x+2,y+5,x+w+2,y+h+5),radius=r,fill='#E9DFCE')
 d.rounded_rectangle((x,y,x+w,y+h),radius=r,fill=bg,outline=outline,width=th)
def pill(d,x,y,w,h,textval,bg=WHITE,size=21):rect(d,x,y,w,h,bg);center(d,x+w/2,y+h/2,textval,size)
def shirt(d,x,y,sz,color=GOLD):
 w=sz;pts=[(x+.28*w,y+.1*w),(x+.40*w,y+.06*w),(x+.5*w,y+.24*w),(x+.6*w,y+.06*w),(x+.72*w,y+.1*w),(x+.97*w,y+.35*w),(x+.8*w,y+.52*w),(x+.74*w,y+.45*w),(x+.74*w,y+.94*w),(x+.26*w,y+.94*w),(x+.26*w,y+.45*w),(x+.2*w,y+.52*w),(x+.03*w,y+.35*w)]
 d.polygon(pts,fill=color);d.line(pts+[pts[0]],fill=DARK,width=max(2,int(sz*.046)),joint='curve')
 d.arc((x+.37*w,y-.003*w,x+.63*w,y+.33*w),-10,190,fill=DARK,width=max(2,int(sz*.04)))
 d.line((x+.41*w,y+.58*w,x+.6*w,y+.58*w),fill=WHITE,width=max(2,int(sz*.04)))
def cash(d,x,y,sz=1):
 w,h=103*sz,64*sz;rect(d,x,y,w,h,MINT,r=8)
 d.ellipse((x+w*.38,y+h*.18,x+w*.62,y+h*.83),fill=LEAF,outline=GREEN,width=2);center(d,x+w/2,y+h/2,'$',max(11,int(28*sz)))
def person(d,cx,top,s=1,cloth=CORAL,smile=True,wave=0):
 def p(x,y):return (int(cx+x*s),int(top+y*s))
 def line(arr,n=10):d.line([p(*a) for a in arr],fill=DARK,width=max(2,int(n*s)),joint='curve')
 line([(-23,174),(-27,220)],12);line([(26,174),(31,220)],12);line([(-27,217),(-47,219)],8);line([(31,217),(49,219)],8)
 line([(-43,108),(-57,145)],11);line([(43,107),(55,146-wave)],11)
 v=[p(x,y) for x,y in [(-30,88),(-48,104),(-42,182),(42,182),(47,104),(28,88),(0,92)]]
 d.polygon(v,fill=cloth);d.line(v+[v[0]],fill=DARK,width=max(2,int(5*s)),joint='curve')
 d.rounded_rectangle((*p(-13,78),*p(13,99)),radius=max(2,int(6*s)),fill='#E4A36D',outline=DARK,width=2)
 d.ellipse((*p(-58,0),*p(58,116)),fill='#E4A36D',outline=DARK,width=max(2,int(5*s)))
 d.pieslice((*p(-60,-3),*p(59,106)),180,345,fill=DARK)
 d.polygon([p(-50,29),p(-14,8),p(27,15),p(53,26),p(48,0),p(-25,-5)],fill=DARK)
 if smile:
  d.arc((*p(-36,52),*p(-12,65)),190,350,fill=DARK,width=3)
  d.arc((*p(14,52),*p(37,65)),190,350,fill=DARK,width=3)
 else:
  for a in [-24,24]:d.ellipse((*p(a-3,55),*p(a+3,61)),fill=DARK)
 d.arc((*p(-15,67),*p(16,88)),12,170,fill=DARK,width=3)
def bg(d,s,t,absolute):
 d.rectangle((0,0,W,H),fill=PAPER)
 d.ellipse((440,130,625,320),fill='#F3EBDC');d.ellipse((-85,480,130,700),fill='#F3EBDC')
 d.polygon([(0,570),(50,563),(150,590),(250,574),(380,582),(465,560),(540,578),(540,800),(0,800)],fill='#E3EDDA')
 d.polygon([(0,660),(122,632),(253,670),(418,638),(540,660),(540,800),(0,800)],fill=LEAF)
 d.polygon([(0,718),(140,697),(270,721),(410,705),(540,715),(540,803),(0,803)],fill='#B7CEA8')
 d.ellipse((60,574,69,584),fill=GREEN);d.ellipse((474,552,484,562),fill=GREEN)
 text(d,34,43,data['brand'],14);text(d,415,43,'● EXPLAINED',12,GREEN)
 text(d,35,98,s['eyebrow'],14,GREEN)
 d.rectangle((0,780,540,960),fill=DARK);d.rectangle((0,780,540,787),fill=GOLD)
 text(d,34,806,data['series'],13,GOLD)
 caps=s['captions'];selected=''
 for c in caps:
  if t>=c['at']:selected=c['text']
 if len(selected)>35:
  words=selected.split();res=[];cur=''
  for word in words:
   if len(cur+' '+word)>30:res.append(cur);cur=word
   else:cur=(cur+' '+word).strip()
  res.append(cur);selected='\n'.join(res)
 center(d,270,873,selected,18 if len(selected)>27 else 22,WHITE)
 d.rounded_rectangle((34,932,506,936),radius=3,fill='#6D5B50')
 d.rounded_rectangle((34,932,34+472*absolute/DUR,936),radius=3,fill=GOLD)
def heading(d,s,size=40,y=195):center(d,270,y,s['headline'],size)
def s0(d,s,t):
 heading(d,s,38)
 a=show(t,.4);b=show(t,1)
 if a>0:person(d,155,335+int(22*(1-a)),.95*a,CORAL,wave=math.sin(t*2)*5)
 if b>0:person(d,384,335+int(22*(1-b)),.95*b,BLUE,wave=math.sin(t*2+1)*5)
 if t>2.1:shirt(d,235,464+math.sin(t*2)*3,76*show(t,2.1),GOLD)
 if t>2.2:pill(d,55,610,145,60,'$100',GOLD,34)
 if t>3:pill(d,338,610,145,60,'$100',GOLD,34)
 if t>4.3:center(d,270,736,'WHO WOULD YOU BET ON?',19)
def s1(d,s,t):
 heading(d,s,42)
 for i in range(5):
  p=show(t,.4+i*.37)
  if p>.02:shirt(d,18+i*109,315-18*(1-p),82*p,CORAL)
 if t>2.4:pill(d,133,435,275,64,'5 × $20 = $100',WHITE,26)
 if t>3.2:
  person(d,141,547,.73,CORAL)
  if t>5:
   for i in range(3):
    p=show(t,5+i*.45)
    if p>.02:cash(d,265+i*55,580-36*p,.65*p)
 if t>7.4:pill(d,99,708,342,60,'+$50 GROSS MARGIN',MINT,26)
def s2(d,s,t):
 heading(d,s,42)
 person(d,125,331,.85,BLUE,wave=math.sin(t*2)*5)
 shirt(d,285,345+math.sin(t*3)*3,130,GOLD)
 if t>1.6:pill(d,256,500,216,49,'ONE SAMPLE',WHITE,21)
 for i in range(6):
  p=show(t,3.8+i*.72)
  if p<.02:continue
  x=233+(i%2)*126;y=554+(i//2)*54
  rect(d,x,y-22*(1-p),117,46,MINT if i%2 else WHITE,r=10,th=2)
  center(d,x+58,y+23-22*(1-p),'✓ ORDER',15)
 if t>9.1:pill(d,102,728,336,51,'50 PAID PREORDERS',GOLD,26)
def s3(d,s,t):
 heading(d,s,42)
 for i,(title,value,color,when) in enumerate([('CUSTOMER PAYMENTS',1500,MINT,.5),('PRODUCTION COST',-1000,'#F9DDD1',4.3),('GROSS MARGIN*',500,GOLD,8)]):
  p=show(t,when)
  if p<.01:continue
  x=33+(1-p)*(-85 if i%2==0 else 85);y=311+i*127
  rect(d,x,y,474,105,color,r=17)
  text(d,x+20,y+14,title,15,SOFT)
  n=round(abs(value)*show(t,when+.6,1.15));text(d,x+20,y+38,('-' if value<0 else '')+f'${n:,}',46)
 center(d,270,718,'*Before sample, shipping, fees,\nreturns and taxes.',14,SOFT)
def s4(d,s,t):
 heading(d,s,37)
 center(d,270,294,'GROSS MARGIN COMPARISON',17,SOFT)
 d.line((86,640,453,640),fill=DARK,width=4)
 a=show(t,1.0,1.5);b=show(t,2.0,2.2);ha=45*a;hb=238*b
 d.rounded_rectangle((123,640-ha,210,642),radius=8,fill=CORAL,outline=DARK,width=3)
 d.rounded_rectangle((325,640-hb,413,642),radius=8,fill=GREEN,outline=DARK,width=3)
 center(d,166,640-ha-37,f'${round(50*a)}',30);center(d,368,640-hb-37,f'${round(500*b)}',30)
 center(d,166,677,'ALEX\n5 SHIRTS',16);center(d,368,677,'MAYA\n50 SHIRTS',16)
 if t>5.3:pill(d,135,725,270,48,'10× MORE VOLUME',GOLD,21)
 if t>7.5:pill(d,55,309,430,55,'PREORDERS REDUCE STOCK RISK',MINT,16)
functions=[s0,s1,s2,s3,s4]
def main():
 silent=ROOT/'out/preview-silent.mp4';final=ROOT/'out/tshirt-explainer-preview.mp4'
 cmd=['ffmpeg','-y','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','ultrafast','-crf','20','-pix_fmt','yuv420p',str(silent)]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE);start=time.time();idx=0;offset=0
 for i in range(DUR*FPS):
  t=i/FPS
  while idx<len(data['scenes'])-1 and t>=offset+data['scenes'][idx]['seconds']:
   offset+=data['scenes'][idx]['seconds'];idx+=1
  local=t-offset;im=Image.new('RGB',(W,H),PAPER);d=ImageDraw.Draw(im)
  bg(d,data['scenes'][idx],local,t);functions[idx](d,data['scenes'][idx],local)
  proc.stdin.write(im.tobytes())
  if i%240==0:print(f'Rendered {i}/{DUR*FPS} frames, {round(time.time()-start,1)}s elapsed',flush=True)
 proc.stdin.close();result=proc.wait()
 if result!=0:raise RuntimeError('ffmpeg preview render failed')
 print('Mixing voice / music and upscaling to 1080 × 1920',flush=True)
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(silent),'-i',str(ROOT/'public/audio/narration.wav'),'-i',str(ROOT/'public/audio/music.wav'),'-filter_complex','[1:a]volume=1.0[v];[2:a]volume=0.30[m];[v][m]amix=inputs=2:duration=first:normalize=0[a]','-map','0:v','-map','[a]','-vf','scale=1080:1920:flags=lanczos','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',str(final)],check=True)
 print('Completed',final,flush=True)
if __name__=='__main__':main()
