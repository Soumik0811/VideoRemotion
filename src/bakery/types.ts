export type CharacterId = 'oliver' | 'noah';
export type BakerAction = 'idle' | 'wave' | 'talk' | 'point' | 'bread' | 'money' | 'receive' | 'scratch' | 'surprised' | 'confused' | 'happy' | 'worried' | 'walk';
export type BakeryEpisode = {
  id: string; title: string; fps: number; width: number; height: number; durationSeconds: number;
  narration: {src: string | null; timing: string; text: string; sentences: {start:number;end:number;text:string}[]};
  financials: {startingCash:number;sales:number;productionCost:number;grossProfit:number;paymentDays:number;oliverCashReceived:number;noahCashReceived:number;unpaidInvoice:number;scope:string};
  characters: Record<CharacterId,{name:string;color:string;skin:string;hair:string}>;
  scenes: {id:string;start:number;end:number;label:string;heading:string}[];
  captions: {start:number;end:number;text:string}[];
  assets: {music:string}; soundEvents: {at:number;sound:string}[];
};
