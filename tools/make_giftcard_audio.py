"""Original instrumental score and gentle UI effects, synthesized without samples.

This creates NO narration. All output is specific to the gift-card episode.
"""
import json
import math
from pathlib import Path
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
EPISODE = json.loads((ROOT / 'src/data/giftcard-episode.json').read_text())
OUT = ROOT / 'public/audio/giftcard'
OUT.mkdir(parents=True, exist_ok=True)
RATE = 44100

def write(name, data):
    data = np.clip(data, -.92, .92)
    with wave.open(str(OUT / (name + '.wav')), 'wb') as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(RATE)
        out.writeframes((data * 32767).astype('<i2').tobytes())

duration = EPISODE['durationSeconds']
music = np.zeros(round(duration * RATE))
beat = 60 / 96
chords = [(261.63, 329.63, 392), (220, 261.63, 329.63), (174.61, 220, 261.63), (196, 246.94, 293.66)]
for i in range(math.ceil(duration / beat)):
    start = round(i * beat * RATE)
    if start >= len(music):
        break
    chord = chords[(i // 8) % 4]
    freq = chord[[0, 2, 1, 2, 0, 1, 2, 1][i % 8]] * (2 if i % 8 == 7 else 1)
    t = np.arange(min(round(RATE * .55), len(music) - start)) / RATE
    envelope = (1 - np.exp(-t * 90)) * np.exp(-t * 8)
    # Round, quiet mallet tone; no piercing transient.
    tone = (.055 * np.sin(2*np.pi*freq*t) + .011*np.sin(2*np.pi*freq*2*t)) * envelope
    music[start:start+len(tone)] += tone
    if i % 4 == 0:
        t = np.arange(min(round(RATE * 1.9), len(music) - start)) / RATE
        bass = .044 * np.sin(2*np.pi*chord[0]/2*t) * (1-np.exp(-t*20)) * np.exp(-t*2.3)
        music[start:start+len(bass)] += bass
for i in range(math.ceil(duration/(beat*8))):
    start=round(i*beat*8*RATE)
    t=np.arange(min(round(beat*8*RATE),len(music)-start))/RATE
    envelope=np.minimum(1,t/.6)*np.minimum(1,(len(t)/RATE-t)/.9)
    for freq in chords[i%4]:
        music[start:start+len(t)] += .007*np.sin(2*np.pi*freq*t)*envelope
# Pull the score down during the breakage reveal for a deliberate breath.
timeline=np.arange(len(music))/RATE
duck=1-.65*np.clip((timeline-91.0)/.45,0,1)*np.clip((94.1-timeline)/.4,0,1)
music*=duck
write('music',music)

rng=np.random.default_rng(41)
for name in ['pop','money','register','paper','flip','reveal']:
    t=np.arange(round(RATE*1.4))/RATE
    if name=='pop':
        x=.16*np.sin(2*np.pi*(450*t-380*t*t))*np.exp(-t*27)*(1-np.exp(-t*130))
    elif name=='money':
        noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(20)/20,mode='same')
        x=.12*noise*np.exp(-((t-.18)/.12)**2)+.055*np.sin(2*np.pi*760*t)*np.exp(-t*18)
    elif name=='register':
        x=.12*np.sin(2*np.pi*1100*t)*np.exp(-t*12)
        t2=np.maximum(0,t-.11)
        x+=(t>.11)*.10*np.sin(2*np.pi*1470*t2)*np.exp(-t2*10)
    elif name in ['paper','flip']:
        noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(12)/12,mode='same')
        x=.13*noise*np.exp(-((t-.11)/(.08 if name=='paper' else .045))**2)
    else:
        x=sum(.042*np.sin(2*np.pi*f*t)*np.exp(-t*4) for f in [523.25,659.25,783.99])*(1-np.exp(-t*25))
    x*=np.minimum(1,t/.008)
    write(name,x)
print(f'Created {duration}s of original music and six effects; no voiceover generated.')
