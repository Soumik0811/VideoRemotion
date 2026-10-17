import type {Scene} from '../../core/types'; import {DarkGrid} from '../../library/backgrounds/DarkGrid'; import {Neon} from './backgrounds/Neon'; import {Badge} from './props/Badge';
export const scenes:Scene[]=[
  {start:0,end:4.5,background:DarkGrid,beebop:{gesture:'wave',position:'left',size:'normal'},transition:'fade'},
  {start:4.5,end:9,background:Neon,props:[{component:Badge,at:5.2,duration:3}],beebop:{gesture:'point-left',position:'right',size:'normal',expression:'surprised',pointAt:{x:.72,y:.43}},transition:'slide'},
  {start:9,end:15,background:DarkGrid,beebop:{gesture:'think',position:'center',size:'normal'},transition:'zoom'}
];
