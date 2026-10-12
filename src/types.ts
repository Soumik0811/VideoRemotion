export type SceneType = 'hook' | 'inventory' | 'preorder' | 'math' | 'compare';
export type Caption = {at: number; text: string};
export type EpisodeScene = {
  type: SceneType;
  seconds: number;
  eyebrow: string;
  headline: string;
  narration: string;
  captions: Caption[];
};
export type Episode = {
  id: string;
  title: string;
  brand: string;
  series: string;
  fps: number;
  width: number;
  height: number;
  scenes: EpisodeScene[];
};
