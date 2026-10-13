"""Original, deterministic Foley synthesized locally; no third-party samples."""
from pathlib import Path
import wave
import numpy as np
ROOT = Path(__file__).resolve().parents[1]
RATE = 44100
t = np.arange(round(RATE * 1.4)) / RATE
rng = np.random.default_rng(2025)
noise = rng.normal(0, 1, len(t))
soft = np.convolve(noise, np.ones(18) / 18, mode='same')
for name in ['door', 'terminal', 'cup', 'drawer', 'keyboard']:
    if name == 'door':
        x = sum(.07*np.sin(2*np.pi*f*t)*np.exp(-t*5.7) for f in [880,1320,1760])
    elif name == 'terminal':
        gate = (t < .13).astype(float) + ((t > .19) & (t < .31)).astype(float)
        x = .105*np.sin(2*np.pi*1030*t)*gate
    elif name == 'cup':
        x = .13*soft*np.exp(-t*33) + .065*np.sin(2*np.pi*1470*t)*np.exp(-t*31)
    elif name == 'drawer':
        x = .22*soft*np.exp(-((t-.21)/.13)**2) + .095*np.sin(2*np.pi*95*t)*np.exp(-((t-.38)/.05)**2)
    else:
        x = sum(.12*soft*np.exp(-((t-at)/.011)**2) for at in [.02,.09,.19,.27])
    x *= np.minimum(1,t/.006)*np.minimum(1,(1.4-t)/.05)
    p = ROOT / 'public/audio/giftcard' / f'{name}.wav'
    with wave.open(str(p), 'wb') as output:
        output.setnchannels(1); output.setsampwidth(2); output.setframerate(RATE)
        output.writeframes((np.clip(x,-.9,.9)*32767).astype('<i2').tobytes())
print('Generated five original Foley effects.')
