import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const STARS = [
  {x: 46, y: 110, r: 2, o: 0.55, speed: 0.7}, {x: 186, y: 242, r: 1.5, o: 0.38, speed: 1.2},
  {x: 336, y: 94, r: 2.2, o: 0.5, speed: 0.9}, {x: 458, y: 300, r: 1.4, o: 0.42, speed: 1.5},
  {x: 694, y: 146, r: 2, o: 0.44, speed: 0.8}, {x: 902, y: 252, r: 1.6, o: 0.5, speed: 1.1},
  {x: 1034, y: 108, r: 2.2, o: 0.36, speed: 0.75}, {x: 122, y: 470, r: 1.5, o: 0.4, speed: 1.3},
  {x: 300, y: 568, r: 2, o: 0.43, speed: 0.65}, {x: 784, y: 420, r: 1.7, o: 0.52, speed: 1.35},
  {x: 988, y: 570, r: 1.5, o: 0.38, speed: 0.95}, {x: 60, y: 758, r: 2.1, o: 0.42, speed: 1.1},
  {x: 392, y: 828, r: 1.4, o: 0.48, speed: 1.45}, {x: 712, y: 732, r: 2, o: 0.4, speed: 0.7},
  {x: 942, y: 862, r: 1.7, o: 0.42, speed: 1.2}, {x: 198, y: 1202, r: 1.5, o: 0.42, speed: 0.8},
  {x: 440, y: 1328, r: 2, o: 0.36, speed: 1.15}, {x: 846, y: 1190, r: 1.5, o: 0.5, speed: 1.4},
  {x: 1042, y: 1416, r: 2, o: 0.4, speed: 0.75}, {x: 284, y: 1572, r: 1.8, o: 0.42, speed: 1.25},
  {x: 640, y: 1666, r: 1.5, o: 0.35, speed: 0.9}, {x: 900, y: 1784, r: 2, o: 0.46, speed: 1.1},
];

type Props = {offsetSeconds?: number; showHole?: boolean};

/** Low-contrast star field and the centered black hole used through the whole short. */
export const VoidStage: React.FC<Props> = ({offsetSeconds = 0, showHole = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = offsetSeconds + frame / fps;
  const cycle = 39.0791836734698;
  const angle = (time / cycle) * 360;
  const holeScale = interpolate(time, [9.28, 9.95], [1, 0.76], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 0.5 + 0.5 * Math.sin(time * 2.4);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 51%, #18223a 0%, #0b1021 39%, #080b16 75%, #05070e 100%)'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.55, background: 'radial-gradient(ellipse at 50% 53%, transparent 0%, transparent 19%, #1b2440 42%, transparent 70%)'}} />
      {STARS.map((star, index) => {
        const drift = (time * star.speed * 28) % 1080;
        const x = (star.x + drift) % 1080;
        const twinkle = 0.72 + 0.28 * Math.sin(time * (1.4 + star.speed) + index);
        return <div key={index} style={{position: 'absolute', left: x, top: star.y, width: star.r * 2, height: star.r * 2, borderRadius: '50%', background: '#d9e7ff', opacity: star.o * twinkle, boxShadow: `0 0 10px ${star.r > 1.8 ? '#b9d6ff' : '#788ab3'}`}} />;
      })}

      <div style={{position: 'absolute', inset: 0, opacity: showHole ? 1 : 0}}>
      {Array.from({length: 18}, (_, i) => {
        const life = (time * 0.22 + i / 18) % 1;
        const radius = 470 * Math.pow(1 - life, 1.4) + 40;
        const theta = i * 2.399 + time * (0.8 + life * 3.2);
        const size = 3 + (1 - life) * 4;
        const fade = Math.min(1, life * 5, (1 - life) * 3) * 0.8;
        const color = i % 2 ? '#ffbf68' : '#9b74f2';
        return <div key={`p${i}`} style={{position: 'absolute', left: 540 + Math.cos(theta) * radius, top: 1048 + Math.sin(theta) * radius * 0.34, width: size, height: size, borderRadius: '50%', background: color, opacity: fade, boxShadow: `0 0 8px ${color}`}} />;
      })}
      <div style={{position: 'absolute', left: '50%', top: '54.6%', width: 610, height: 205, transform: `translate(-50%, -50%) rotate(${angle - 11}deg) scale(${holeScale})`, borderRadius: '50%', border: '9px solid transparent', background: 'linear-gradient(#0a0b11, #0a0b11) padding-box, conic-gradient(from 18deg, #ffbf68, #f66d61, #9b74f2, #5dc7ed, #ffd078, #f66d61) border-box', boxShadow: `0 0 ${25 + pulse * 25}px #a866ee66`, opacity: 0.92}} />
      <div style={{position: 'absolute', left: '50%', top: '54.6%', width: 570, height: 142, transform: `translate(-50%, -50%) rotate(${11 - angle * 0.43}deg) scale(${holeScale})`, borderRadius: '50%', border: '3px solid #fff0c266', filter: 'blur(1px)', opacity: 0.75}} />
      <div style={{position: 'absolute', left: '50%', top: '54.6%', width: 238, height: 238, transform: `translate(-50%, -50%) scale(${holeScale})`, borderRadius: '50%', background: 'radial-gradient(circle at 50% 49%, #000 0 55%, #010207 68%, #1b1830 75%, #f08e56 78%, #752fb2 81%, transparent 85%)', boxShadow: `0 0 ${36 + pulse * 25}px #f0806f55`}} />
      <div style={{position: 'absolute', left: '50%', top: '54.6%', width: 185, height: 185, transform: `translate(-50%, -50%) scale(${holeScale})`, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, #000 0%, #000 68%, #03040a 82%, transparent 100%)', boxShadow: '0 0 44px #000'}} />
      <div style={{position: 'absolute', left: '50%', top: '54.6%', width: 520, height: 260, transform: `translate(-50%, -50%) rotate(${-angle * 0.38}deg) scale(${holeScale})`, borderRadius: '50%', border: '2px solid #f6b66733', opacity: 0.6}} />
      </div>
    </div>
  );
};