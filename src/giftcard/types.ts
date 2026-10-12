export type Role='explainer'|'customer'|'barista'|'friend'|'analyst';
export type CastMember={name:string;color:string;skin:string;hair:string;shape:'oliver'|'noah';costume:'casual'|'barista'|'analyst'};
export type GiftEpisode={
 id:string;title:string;brand:string;fps:number;width:number;height:number;durationSeconds:number;
 narration:{src:string|null;timing:string;text:string;sentences:{start:number;end:number;text:string}[]};
 financials:{purchase:number;redeemed:number;balance:number;reportedBreakageFloorMillions:number;fiscalYear:number;illustrativeRedemptionFraction:number};
 source:{status:string;reportedAmountLabel:string;reference:string;requestedUrls:string[];accountingNotes:string[]};
 characters:Record<Role,CastMember>;
 scenes:{id:string;start:number;end:number;label:string;heading:string}[];
 captions:{start:number;end:number;text:string}[];
 assets:{music:string};soundEvents:{at:number;sound:string}[];
};
