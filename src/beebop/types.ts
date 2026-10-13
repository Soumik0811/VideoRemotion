export type CharacterId = 'beebop';
/** Simple, reliable poses only — no finger or hand-to-hand object work (V5.1). */
export type BeebopPose =
  | 'idle' | 'shocked' | 'explaining' | 'point' | 'thinking'
  | 'happy' | 'laughing' | 'present' | 'walk';
export type BeeBopEpisode = {
  id: string; title: string; fps: number; width: number; height: number; durationSeconds: number;
  narration: {src: string | null; timing: string; text: string; sentences: {start:number;end:number;text:string}[]};
  facts: {potassiumIsotope:string; singleBananaBecquerel:number; truckBananas:number; bodyPotassiumLabel:string};
  character: Record<CharacterId,{name:string; body:string; stripe:string; wing:string; scarf:string; cheek:string}>;
  scenes: {id:string;start:number;end:number;label:string;heading:string}[];
  captions: {start:number;end:number;text:string}[];
  assets: {music:string}; soundEvents: {at:number;sound:string}[];
};
