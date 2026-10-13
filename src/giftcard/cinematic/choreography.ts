import {ease, mix} from '../theme';
import {CharacterState} from './CharacterAction';
import {Point, point, lerpPoint} from './motion';

const pose = (t:number, initial:Point, cues:{at:number;duration:number;to:Point}[]) => cues.reduce((p,c)=>lerpPoint(p,c.to,ease(t,c.at,c.duration)),initial);

/** Shared blocking for wide shots and inserts. Camera cuts do not reset action state. */
export const purchaseAction=(t:number):{buyer:CharacterState;cashier:CharacterState}=>({
  buyer:{role:'customer',x:mix(240,680,ease(t,24.8,4.2))-mix(0,570,ease(t,39.6,2.8)),y:1260,scale:1.5,
    walk:(1-ease(t,28.2,.8))*ease(t,24.8,.3)+ease(t,39.6,.3), expression:t>35?'happy':'calm',look:3,
    left:point(-50,-208),
    right:pose(t,point(75,-155),[
      {at:29,duration:.65,to:point(-39,-203)}, {at:30,duration:.8,to:point(50,-278)},
      {at:31.3,duration:1,to:point(139,-225)}, {at:33.2,duration:.6,to:point(91,-199)},
      {at:35.2,duration:.7,to:point(139,-225)}, {at:36.4,duration:.7,to:point(69,-271)},
    ]),
  },
  cashier:{role:'barista',x:1100,y:1120,scale:1.35,look:-3,expression:'happy',
    left:pose(t,point(-63,-168),[
      {at:31.1,duration:1,to:point(-148,-148)}, {at:33.1,duration:.9,to:point(117,-192)},
      {at:34.4,duration:.6,to:point(105,-178)}, {at:35,duration:.65,to:point(-148,-148)},
      {at:36.3,duration:.8,to:point(-56,-171)},
    ]),right:point(84,-163),
  },
});

export const giftAction=(t:number):{buyer:CharacterState;friend:CharacterState}=>({
  buyer:{role:'customer',x:590,y:1260,scale:1.5,expression:'happy',look:3,
    right:pose(t,point(55,-247),[{at:42,duration:.8,to:point(139,-216)},{at:43.4,duration:.7,to:point(67,-187)}])},
  friend:{role:'friend',x:mix(1230,967,ease(t,40.8,1.8)),y:1260,scale:1.5,look:-3,
    walk:1-ease(t,42.1,.5),expression:'happy',
    left:pose(t,point(-73,-164),[{at:42,duration:.8,to:point(-103,-216)},{at:43.4,duration:.8,to:point(-72,-280)}]),
    right:point(56,-168),
  },
});

export const redemptionAction=(t:number):{friend:CharacterState;cashier:CharacterState}=>({
  friend:{role:'friend',x:mix(492,690,ease(t,49,.95))-mix(0,240,ease(t,55,.95)),y:1260,scale:1.5,
    walk:(1-ease(t,49.65,.3))+ease(t,55,.3),expression:'happy',look:3,
    right:pose(t,point(67,-236),[{at:49.8,duration:.6,to:point(153,-351)},{at:51,duration:.65,to:point(55,-268)}]),
    left:pose(t,point(-66,-167),[{at:53.6,duration:.6,to:point(107,-220)},{at:54.5,duration:.6,to:point(-51,-244)}]),
  },
  cashier:{role:'barista',x:1100,y:1120,scale:1.35,look:-3,expression:'happy',
    left:pose(t,point(-63,-167),[{at:49.2,duration:.7,to:point(-55,-205)},{at:51.8,duration:.7,to:point(-178,-142)},{at:53.1,duration:.7,to:point(-67,-181)}]),
    right:point(91,-177),
  },
});

export const homeAction=(t:number):{friend:CharacterState;open:number;cardInDrawer:number}=>({
  friend:{role:'friend',x:mix(488,775,ease(t,56,1.7))-mix(0,493,ease(t,61.6,1.4)),y:1260,scale:1.5,
    walk:1-ease(t,57.2,.4)+ease(t,61.6,.3),expression:t>60?'calm':'thinking',look:3,
    right:pose(t,point(70,-180),[{at:57.55,duration:.3,to:point(130,-178)},{at:57.85,duration:.8,to:point(130,-126)},{at:60.45,duration:.75,to:point(130,-178)},{at:61.2,duration:.35,to:point(73,-159)}]),
    left:pose(t,point(-50,-244),[{at:58.8,duration:.8,to:point(114,-183)},{at:59.6,duration:.5,to:point(130,-167)},{at:60.1,duration:.4,to:point(-67,-169)}]),
  },
  open:ease(t,57.85,.8)*(1-ease(t,60.45,.75)),
  cardInDrawer:ease(t,59.6,.5),
});
