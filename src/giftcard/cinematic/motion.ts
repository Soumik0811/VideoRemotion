import {ease, mix} from '../theme';

export type Point = {x: number; y: number};
export type Camera = Point & {zoom: number};
export const point = (x: number, y: number): Point => ({x, y});
export const lerpPoint = (a: Point, b: Point, p: number): Point => ({x: mix(a.x, b.x, p), y: mix(a.y, b.y, p)});
export const travel = (t: number, at: number, duration: number, a: Point, b: Point, lift = 0): Point => {
  const p = ease(t, at, duration);
  const v = lerpPoint(a, b, p);
  return {...v, y: v.y - Math.sin(p * Math.PI) * lift};
};
export const blendCamera = (a: Camera, b: Camera, p: number): Camera => ({...lerpPoint(a,b,p), zoom: mix(a.zoom,b.zoom,p)});

/** Analytic two-bone IK. Endpoints are also used by props, so grips cannot drift. */
export const elbowFor = (shoulder: Point, hand: Point, bend: number): Point => {
  const dx = hand.x - shoulder.x, dy = hand.y - shoulder.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const half = distance / 2;
  const bone = Math.max(79, half + 1);
  const height = Math.sqrt(Math.max(0, bone * bone - half * half));
  return {x: (shoulder.x + hand.x)/2 - dy/distance*height*bend, y: (shoulder.y + hand.y)/2 + dx/distance*height*bend};
};
