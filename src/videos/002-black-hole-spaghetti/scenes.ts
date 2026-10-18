import React, {createElement} from 'react';
import type {Scene} from '../../core/types';
import {VoidStage} from './backgrounds/VoidStage';
import {BlackHoleBeat} from './props/BlackHoleBeat';
import {OneShot} from './props/OneShot';

const backgroundAt = (offsetSeconds: number, showHole = true): React.FC => {
  const Background: React.FC = () => createElement(VoidStage, {offsetSeconds, showHole});
  return Background;
};

const beat = (mode: React.ComponentProps<typeof BlackHoleBeat>['mode'], offsetSeconds: number) => ({
  component: BlackHoleBeat,
  at: offsetSeconds,
  props: {mode, offsetSeconds},
});

const sfx = (at: number, file: string, volume = 0.45) => ({component: OneShot, at, props: {file, volume}});

export const scenes: Scene[] = [
  {start: 0, end: 4.48, background: backgroundAt(0), props: [beat('hook', 0), sfx(1.6, 'whoosh.wav'), sfx(2.96, 'pop.wav', 0.5)], beebop: {gesture: 'point-right', position: 'left', size: 'small', expression: 'surprised', pointAt: {x: 0.61, y: 0.48}}, transition: 'fade'},
  {start: 4.48, end: 7.2, background: backgroundAt(4.48), props: [beat('plate', 4.48), sfx(4.48, 'stamp-thud.wav')], beebop: {gesture: 'idle', position: 'left', size: 'small', expression: 'happy'}, transition: 'zoom'},
  {start: 7.2, end: 10.56, background: backgroundAt(7.2), props: [beat('approach', 7.2), sfx(8.08, 'whoosh.wav', 0.35), sfx(9.28, 'pop.wav')], beebop: {gesture: 'point-left', position: 'right', size: 'small', expression: 'thinking', pointAt: {x: 0.48, y: 0.55}}, transition: 'slide'},
  {start: 10.56, end: 13.36, background: backgroundAt(10.56), props: [beat('forces', 10.56), sfx(10.56, 'riser.wav', 0.35), sfx(12, 'tick.wav', 0.35)], beebop: {gesture: 'think', position: 'left', size: 'small', expression: 'thinking'}, transition: 'fade'},
  {start: 13.36, end: 18.775, background: backgroundAt(13.36), props: [beat('stretch', 13.36), sfx(14, 'riser.wav', 0.32), sfx(17.415, 'crack.wav', 0.55), sfx(17.48, 'tears.wav', 0.35)], beebop: {gesture: 'point-right', position: 'left', size: 'small', expression: 'surprised', pointAt: {x: 0.53, y: 0.47}}, transition: 'zoom'},
  {start: 18.775, end: 21.655, background: backgroundAt(18.775), props: [beat('spaghetti', 18.775), sfx(20.135, 'stamp-thud.wav')], beebop: {gesture: 'point-left', position: 'right', size: 'small', expression: 'happy', pointAt: {x: 0.51, y: 0.4}}, transition: 'fade'},
  {start: 21.655, end: 23.735, background: backgroundAt(21.655), props: [beat('twist', 21.655), sfx(22.895, 'riser.wav', 0.28)], beebop: {gesture: 'think', position: 'center', size: 'small', expression: 'thinking'}, transition: 'fade'},
  {start: 23.735, end: 28.535, background: backgroundAt(23.735, false), props: [beat('split', 23.735), sfx(25.735, 'tick.wav', 0.34)], beebop: {gesture: 'shock', position: 'center', size: 'small', expression: 'surprised'}, transition: 'slide'},
  {start: 28.535, end: 30.944187, background: backgroundAt(28.535), props: [beat('you', 28.535), sfx(29.575, 'tick.wav', 0.4)], beebop: {gesture: 'think', position: 'right', size: 'small', expression: 'thinking', pointAt: {x: 0.53, y: 0.5}}, transition: 'zoom'},
  {start: 30.944187, end: 34.224186, background: backgroundAt(30.944187), props: [beat('horizon', 30.944187), sfx(31.824188, 'whoosh.wav', 0.4), sfx(32.944187, 'stamp-thud.wav')], beebop: {gesture: 'point-right', position: 'left', size: 'small', expression: 'sad', pointAt: {x: 0.63, y: 0.52}}, transition: 'fade'},
  {start: 34.224186, end: 39.0791836734698, background: backgroundAt(34.224186), props: [beat('finale', 34.224186), sfx(34.224186, 'pop.wav', 0.45), sfx(38.384186, 'stamp-thud.wav')], beebop: {gesture: 'wave', position: 'right', size: 'small', expression: 'happy'}, transition: 'zoom'},
];
