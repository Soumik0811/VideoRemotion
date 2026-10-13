export type CharacterId = 'beebop';
/** Two-axis rig: arms/legs pose + facial expression. No finger or object work (V5.1). */
export type BeebopPose = 'idle' | 'wave' | 'point' | 'explain' | 'think' | 'fly';
export type BeebopExpression = 'happy' | 'neutral' | 'surprised' | 'worried' | 'angry';
export type BeebopLook = 'left' | 'center' | 'right';
/** A time cue switching the character's state; latest active cue (at <= t) wins. */
export type BeebopCue = {
  at: number;
  pose?: BeebopPose;
  expression?: BeebopExpression;
  talking?: boolean;
  look?: BeebopLook;
};
export type BeeBopEpisode = {
  id: string; title: string; fps: number; width: number; height: number; durationSeconds: number;
  narration: {src: string | null; timing: string; text: string; sentences: {start:number;end:number;text:string}[]};
  facts: {potassiumIsotope:string; singleBananaBecquerel:number; truckBananas:number; bodyPotassiumLabel:string};
  character: Record<CharacterId,{name:string; body:string; stripe:string; wing:string; scarf:string; cheek:string}>;
  scenes: {id:string;start:number;end:number;label:string;heading:string}[];
  captions: {start:number;end:number;text:string}[];
  assets: {music:string}; soundEvents: {at:number;sound:string}[];
};
