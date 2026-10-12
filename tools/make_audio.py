"""Offline draft voice, royalty-free synthesized music and SRT. Replace narration.wav with ElevenLabs for publishing."""
import json, subprocess, wave, tempfile, os, math, numpy as np
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
episode=json.loads((ROOT/'src/data/episode.json').read_text())
RATE=22050
scenes=episode['scenes']
TOTAL=sum(s['seconds'] for s in scenes)

def read_wav(path):
    with wave.open(str(path),'rb') as w:
        rate=w.getframerate(); n=w.getnframes(); channels=w.getnchannels(); raw=w.readframes(n)
        x=np.frombuffer(raw,dtype=np.int16).astype(np.float32)/32768
        if channels>1:x=x.reshape(-1,channels).mean(1)
    if rate!=RATE:
        # no dependency other than numpy
        t=np.arange(int(len(x)*RATE/rate)); x=np.interp(t*rate/RATE,np.arange(len(x)),x)
    return x

def wav(path,x):
    x=np.clip(x,-0.99,0.99)
    with wave.open(str(path),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes((x*32767).astype('<i2').tobytes())

voice=np.zeros(int(TOTAL*RATE),np.float32)
start=0
for i,s in enumerate(scenes):
    tmp=ROOT/'public/audio'/f'_narration_{i}.wav'
    subprocess.run(['espeak','-v','en-us','-p','45','-s','177','-a','170','-w',str(tmp),s['narration']],check=True)
    v=read_wav(tmp)
    allowance=s['seconds']-0.75
    if len(v)>allowance*RATE:
        from scipy.signal import resample_poly
        ratio=(allowance*RATE)/len(v)
        # Use interpolation for preview voice (tempo increases minimally)
        v=np.interp(np.linspace(0,len(v)-1,int(allowance*RATE)),np.arange(len(v)),v)
    offset=int((start+0.50)*RATE)
    copy=min(len(v),len(voice)-offset)
    voice[offset:offset+copy]+=v[:copy]*0.90
    print('Scene',i,'voice',(len(v)/RATE),'s / slot',s['seconds'],'s')
    tmp.unlink()
    start+=s['seconds']

# Simple original synthesized music: plucked marimba notes + soft pads, no samples used.
n=int(TOTAL*RATE); music=np.zeros(n,dtype=np.float32)
progression=[(261.626,329.628,392.0),(220.,261.626,329.628),(174.614,220.,261.626),(196.,246.942,293.665)]
bpm=106; beat=60/bpm
for beat_i in range(math.ceil(TOTAL/beat)):
    chord=progression[(beat_i//8)%4]
    ti=int(beat_i*beat*RATE)
    if ti>=n:break
    choice=[0,1,2,1,0,2,1,2][beat_i%8]
    freq=chord[choice]
    length=min(int(0.39*RATE),n-ti)
    t=np.arange(length)/RATE
    env=np.exp(-t*10.2)*(1-np.exp(-t*110))
    tone=(np.sin(2*np.pi*freq*t)+0.25*np.sin(2*np.pi*freq*2*t))*env*.14
    music[ti:ti+length]+=tone
    if beat_i%4==0:
        f=chord[0]/2;length2=min(int(1.25*RATE),n-ti);t2=np.arange(length2)/RATE
        music[ti:ti+length2]+=0.07*np.sin(2*np.pi*f*t2)*np.exp(-t2*2.8)
# soft chord sustained
for k in range(math.ceil(TOTAL/(beat*8))):
    start=int(k*beat*8*RATE); chord=progression[k%4]; length=min(int(beat*8*RATE),n-start)
    if length<=0:break
    t=np.arange(length)/RATE
    for freq in chord:
        music[start:start+length]+=.010*np.sin(2*np.pi*freq*t)*(np.minimum(1,t/.4))*(np.minimum(1,(length/RATE-t)/.65))
# little UI 'pop' tones at scene/caption moments
secs=0
for s in scenes:
    for j,cap in enumerate(s['captions']):
        if j==0:continue
        ti=int((secs+cap['at'])*RATE)
        count=min(int(.12*RATE),n-ti)
        t=np.arange(count)/RATE
        music[ti:ti+count]+=.05*np.sin(2*np.pi*(680+160*t)*t)*np.exp(-t*28)
    secs+=s['seconds']
peak=np.max(np.abs(music))
if peak>0.5:music*=0.5/peak
wav(ROOT/'public/audio/narration.wav',voice)
wav(ROOT/'public/audio/music.wav',music)

# Text captions are on-screen punchlines, not a verbatim subtitle transcript.
def ts(t):
    ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
rows=[];ncap=1;t0=0
for s in scenes:
    for i,c in enumerate(s['captions']):
        st=t0+c['at']; en=t0+(s['captions'][i+1]['at'] if i+1<len(s['captions']) else s['seconds'])
        rows.append(f'{ncap}\n{ts(st)} --> {ts(en)}\n{c["text"]}\n')
        ncap+=1
    t0+=s['seconds']
(ROOT/'out/captions.srt').write_text('\n'.join(rows))
print('Produced narration and original music,',TOTAL,'seconds')
