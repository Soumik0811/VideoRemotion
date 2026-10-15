import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {GiftEpisode} from '../../giftcard/types';
import {PALETTE} from '../../curious/theme';
import {AdBill, Coin, Display, Pill, ProductBox, SkyScene, StatChip, Storefront, Sunburst, TermCard, fade, pop} from '../../curious/primitives';
import {CutoutCharacter, SELLER_A, SELLER_B} from '../../curious/Character';

const STORY_END = 48.5;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const easeOut = (p: number) => 1 - Math.pow(1 - clamp01(p), 3);

const captionData = [
  [0, 1.65, 'This man sold FIVE HUNDRED products...'],
  [1.65, 3.5, 'and LOST money on every single sale!'],
  [3.5, 5.25, 'Meanwhile, his friend sold just ONE HUNDRED...'],
  [5.25, 7, 'and came out seven hundred dollars ahead!'],
  [7, 9.5, 'Same product. Same price. So what went wrong?'],
  [9.5, 11.4, 'Both sold a twenty-dollar product'],
  [11.4, 13, 'that cost eight dollars to make and ship.'],
  [13, 15.1, 'But the first man spent FIFTEEN dollars on ads...'],
  [15.1, 17, 'just to get ONE customer!'],
  [17, 18, 'Twenty dollars in.'],
  [18, 19, 'Eight dollars out.'],
  [19, 20, 'Fifteen for ads.'],
  [20, 21.4, 'That’s THREE DOLLARS LOST'],
  [21.4, 23, 'on every sale!'],
  [23, 24.15, 'Five hundred orders?'],
  [24.15, 26, 'MINUS FIFTEEN HUNDRED DOLLARS!'],
  [26, 28, 'His friend spent just five dollars'],
  [28, 30, 'attracting each customer.'],
  [30, 32, 'Seven dollars left per order.'],
  [32, 34.5, 'One hundred sales? PLUS SEVEN HUNDRED!'],
  [34.5, 36, 'That’s called unit economics.'],
  [36, 39, 'And repeat customers? Their lifetime value can change everything.'],
  [39, 41.15, 'The first man bought customers he couldn’t afford.'],
  [41.15, 43, 'The second built a business'],
  [43, 48.5, 'that could afford to keep them.']
] as const;

const HIGHLIGHTS = ['MINUS FIFTEEN HUNDRED DOLLARS', 'PLUS SEVEN HUNDRED', 'THREE DOLLARS LOST', 'FIVE HUNDRED', 'ONE HUNDRED', 'SEVEN HUNDRED', 'unit economics', 'ONE CUSTOMER', 'FIFTEEN', 'five dollars', 'seven dollars', 'LOST'];
const hiRegex = new RegExp(`\\b(${HIGHLIGHTS.join('|')})\\b`, 'gi');
const captionSegments = (text: string) => text.split(hiRegex).map((part, i) => ({text: part, hi: i % 2 === 1}));

const Pop: React.FC<{s: number; x: number; y: number; children?: React.ReactNode}> = ({s, x, y, children}) => (
  <g transform={`translate(${x} ${y}) scale(${Math.max(0.001, s)}) translate(${-x} ${-y})`}>{children}</g>
);

const BigText: React.FC<{x: number; y: number; text: string; scale: number; fill?: string; stroke?: string; sw?: number}> = ({x, y, text, scale, fill = PALETTE.paper, stroke = PALETTE.ink, sw = 15}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <text y={0} textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize={100} fontWeight={900} fill={fill} stroke={stroke} strokeWidth={sw} paintOrder="stroke">{text}</text>
  </g>
);

const HookScene: React.FC<{lp: number; t: number}> = ({lp, t}) => {
  const boxes = Math.min(9, 2 + Math.floor(lp * 9));
  const sales = Math.min(500, Math.round(easeOut(lp / 0.7) * 500));
  return (
    <SkyScene>
      <Storefront x={70} y={800} awning={PALETTE.red}/>
      <Display x={540} y={280} text="500 SALES!" size={104} fill={PALETTE.paper}/>
      {Array.from({length: boxes}, (_, i) => (
        <ProductBox key={i} x={700 + (i % 3) * 148 - 148} y={1308 - Math.floor(i / 3) * 196} s={0.78} rotate={(i % 2 ? 1 : -1) * 2} label="ORDER"/>
      ))}
      <CutoutCharacter x={255} y={1330} scale={1.02} mood="happy" pose="up" bob={t * 2.2}/>
      <Pop s={pop(lp, 0.55, 0.4)} x={330} y={512}>
        <Pill x={170} y={452} w={330} text="−$3 EACH" fill={PALETTE.red} size={52}/>
      </Pop>
      <StatChip x={330} y={596} w={420} label="ORDERS SHIPPED" value={String(sales)} color={PALETTE.highlight}/>
      {lp > 0.55 && <Coin x={905} y={690 + Math.sin(t * 3) * 12} r={40}/>}
    </SkyScene>
  );
};

const CompareScene: React.FC<{t: number}> = ({t}) => (
  <g>
    <g clipPath="url(#half-left)"><Sunburst base={PALETTE.redBg} ray={PALETTE.redRay} cy={640}/></g>
    <g clipPath="url(#half-right)"><Sunburst base={PALETTE.greenBg} ray={PALETTE.greenRay} cy={640}/></g>
    <defs>
      <clipPath id="half-left"><rect width="540" height="1920"/></clipPath>
      <clipPath id="half-right"><rect x="540" width="540" height="1920"/></clipPath>
    </defs>
    <rect x={524} y={120} width={32} height={1440} rx={16} fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth={6}/>
    <Display x={540} y={210} text="−$1,500  vs  +$700" size={76}/>
    <Pill x={140} y={300} w={260} text="STORE A" fill={PALETTE.red} size={42}/>
    <Pill x={680} y={300} w={260} text="STORE B" fill={PALETTE.green} size={42}/>
    <StatChip x={90} y={420} w={360} label="500 SALES" value="−$1,500" color="#FF8B7E"/>
    <StatChip x={630} y={420} w={360} label="100 SALES" value="+$700" color="#7BE3A8"/>
    <CutoutCharacter x={270} y={1420} scale={0.92} mood="sad" bob={t * 1.8}/>
    <CutoutCharacter x={810} y={1420} scale={0.92} mood="happy" pose="up" bob={t * 2 + 1} {...SELLER_B} headband={null}/>
  </g>
);

const SameProductScene: React.FC<{lp: number}> = ({lp}) => (
  <Sunburst base={PALETTE.navyBg} ray={PALETTE.navyRay} cy={700}>
    <Display x={540} y={300} text="SAME PRODUCT." size={86}/>
    <Display x={540} y={410} text="SAME PRICE." size={86}/>
    <Pop s={pop(lp, 0.08)} x={300} y={1010}><ProductBox x={300} y={1010} s={1.05} label="$20 ITEM"/></Pop>
    <Pop s={pop(lp, 0.22)} x={780} y={1010}><ProductBox x={780} y={1010} s={1.05} label="$20 ITEM"/></Pop>
    <Pop s={pop(lp, 0.4, 0.5)} x={540} y={740}>
      <BigText x={540} y={800} text="?" scale={2.1} fill={PALETTE.highlight} sw={15}/>
    </Pop>
    <Display x={540} y={1330} text="SO WHAT WENT WRONG?" size={46} fill={PALETTE.highlight}/>
  </Sunburst>
);

const ProductCostScene: React.FC<{t: number}> = ({t}) => (
  <SkyScene>
    <Display x={540} y={290} text="$20 − $8 = $12" size={88} fill={PALETTE.paper}/>
    <Pill x={345} y={352} w={390} text="BEFORE ADS" fill={PALETTE.goldDeep} size={38} textFill={PALETTE.ink}/>
    <ProductBox x={400} y={940} s={1.2} label="$20 ITEM"/>
    <path d="M520 1020 C 600 1080 630 1170 664 1250" fill="none" stroke={PALETTE.ink} strokeWidth={10} strokeDasharray="1 26" strokeLinecap="round"/>
    <g transform="translate(680 1300)">
      <rect x={8} y={10} width={330} height={150} rx={20} fill={PALETTE.ink} opacity={0.3}/>
      <rect width={330} height={150} rx={20} fill={PALETTE.paper} stroke={PALETTE.red} strokeWidth={8}/>
      <text x={165} y={66} textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize={54} fontWeight={900} fill={PALETTE.red}>$8</text>
      <text x={165} y={116} textAnchor="middle" fontFamily="Arial" fontSize={27} fontWeight={800} letterSpacing={2} fill={PALETTE.slate}>MAKE + SHIP</text>
    </g>
    <Coin x={905} y={760 + Math.sin(t * 2.4) * 10} r={38}/>
    <CutoutCharacter x={185} y={1420} scale={0.9} mood="thinking" bob={t * 1.6}/>
  </SkyScene>
);

const AdCostScene: React.FC<{lp: number; t: number}> = ({lp, t}) => (
  <SkyScene>
    <Storefront x={590} y={810} awning={PALETTE.red}/>
    <Display x={540} y={285} text="AD SPEND PER ORDER" size={66} fill={PALETTE.paper}/>
    <CutoutCharacter x={300} y={1360} scale={1} mood="shocked" bob={t * 2.4}/>
    {[0, 1, 2].map(i => {
      const p = easeOut((lp - 0.12 - i * 0.22) / 0.3);
      return p > 0 ? <g key={i} opacity={clamp01(p * 1.4)}><Coin x={540 + i * 120} y={640 - Math.sin(p * Math.PI) * 130} r={42}/></g> : null;
    })}
    <Pop s={pop(lp, 0.55, 0.4)} x={540} y={1395}>
      <Display x={540} y={1395} text="$0 → $5 → $10 → $15" size={50} fill={PALETTE.paper}/>
    </Pop>
    <Pop s={pop(lp, 0.55, 0.4)} x={540} y={1478}>
      <Pill x={390} y={1448} w={300} text="ONE CUSTOMER" fill={PALETTE.chipBg} size={32}/>
    </Pop>
  </SkyScene>
);

const MathAScene: React.FC<{lp: number}> = ({lp}) => (
  <Sunburst base={PALETTE.tealBg} ray={PALETTE.tealRay} cy={760}>
    <Display x={540} y={330} text="THE PER-ORDER MATH" size={56}/>
    <Pop s={pop(lp, 0.05)} x={540} y={620}><Display x={540} y={620} text="$20" size={124} fill={PALETTE.gold}/></Pop>
    <Pop s={pop(lp, 0.3)} x={540} y={820}><Display x={540} y={820} text="− $8 PRODUCT + SHIPPING" size={52}/></Pop>
    <Pop s={pop(lp, 0.55)} x={540} y={975}><Display x={540} y={975} text="− $15 ADVERTISING" size={58} fill="#FFC9B0"/></Pop>
    <Pop s={pop(lp, 0.8, 0.5)} x={540} y={1220}><Display x={540} y={1220} text="= ?" size={110} fill={PALETTE.gold}/></Pop>
  </Sunburst>
);

const LossScene: React.FC<{lp: number; t: number}> = ({lp, t}) => (
  <Sunburst base={PALETTE.redBg} ray={PALETTE.redRay} cy={740}>
    <Display x={540} y={320} text="TWENTY IN. TWENTY-THREE OUT." size={42}/>
    <Pop s={pop(lp, 0.05, 0.5)} x={540} y={760}>
      <rect x={215} y={718} width={130} height={68} rx={30} fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth={8.5}/>
      <BigText x={560} y={860} text="$3" scale={3} sw={8.5}/>
    </Pop>
    <Display x={540} y={1010} text="PER ORDER" size={62} fill={PALETTE.highlight}/>
    <ProductBox x={785} y={1270} s={0.85} rotate={-8} tag="−$3" tint="#B98A54" label="EACH SALE"/>
    <CutoutCharacter x={255} y={1400} scale={0.85} mood="sad" bob={t * 2.6}/>
  </Sunburst>
);

const TotalLossScene: React.FC<{lp: number; t: number}> = ({lp, t}) => {
  const shown = Math.min(15, 1 + Math.floor(lp * 15));
  return (
    <SkyScene>
      <Display x={540} y={285} text="500 × −$3" size={92} fill={PALETTE.paper}/>
      <Pop s={pop(lp, 0.45, 0.5)} x={540} y={470}>
        <text x={540} y={470} textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize={120} fontWeight={900} fill={PALETTE.red} stroke={PALETTE.ink} strokeWidth={18} paintOrder="stroke">= −$1,500</text>
      </Pop>
      {Array.from({length: shown}, (_, i) => (
        <ProductBox key={i} x={118 + (i % 5) * 168} y={760 + Math.floor(i / 5) * 210} s={0.62} rotate={(i % 3 - 1) * 3} tag="−$3" tint="#C08C56" label="ORDER"/>
      ))}
      <CutoutCharacter x={880} y={1400} scale={0.9} mood="shocked" bob={t * 3}/>
    </SkyScene>
  );
};

const AdCostBScene: React.FC<{t: number}> = ({t}) => (
  <SkyScene>
    <Storefront x={700} y={830} w={360} h={480} awning={PALETTE.green}/>
    <Display x={540} y={285} text="STORE B: $5 ADS" size={80} fill={PALETTE.paper}/>
    <CutoutCharacter x={270} y={1360} scale={1} mood="calm" pose="point" bob={t * 1.8} {...SELLER_B} headband={null}/>
    <Coin x={520} y={690 + Math.sin(t * 2.2) * 10} r={46}/>
    <StatChip x={360} y={900} w={320} label="AD COST / ORDER" value="$5" color="#7BE3A8" valueSize={48}/>
    <Pill x={365} y={1060} w={310} text="ONE CUSTOMER" fill={PALETTE.chipBg} size={36}/>
  </SkyScene>
);

const MathBScene: React.FC<{lp: number}> = ({lp}) => (
  <Sunburst base={PALETTE.greenBg} ray={PALETTE.greenRay} cy={740}>
    <Pop s={pop(lp, 0.05)} x={540} y={400}><Display x={540} y={400} text="$20 − $8 − $5" size={88} fill={PALETTE.paper}/></Pop>
    <Pop s={pop(lp, 0.3, 0.5)} x={540} y={620}>
      <BigText x={540} y={620} text="= +$7" scale={1.5} fill="#7BE3A8" sw={14}/>
    </Pop>
    <Display x={540} y={760} text="PER ORDER" size={44} fill={PALETTE.gold}/>
    {Array.from({length: Math.min(5, 1 + Math.floor(lp * 5))}, (_, i) => (
      <ProductBox key={i} x={230 + i * 160} y={1010} s={0.56} label="ORDER"/>
    ))}
    <Pop s={pop(lp, 0.62, 0.5)} x={540} y={1290}>
      <BigText x={540} y={1290} text="100 x $7 = +$700" scale={0.92}/>
    </Pop>
  </Sunburst>
);

const LifetimeValueScene: React.FC<{lp: number; t: number}> = ({lp, t}) => (
  <Sunburst base={PALETTE.purpleBg} ray={PALETTE.purpleRay} cy={1120}>
    <Pop s={pop(lp, 0.05, 0.5)} x={540} y={430}>
      <TermCard x={110} y={300} w={860} term="UNIT ECONOMICS" definition="Profit per order — not just sales" termColor={PALETTE.purple} size={78}/>
    </Pop>
    <g opacity={fade(lp, 0.25, 0.22)}>
      <Pill x={120} y={770} w={250} text="ORDER" fill={PALETTE.goldDeep} size={38} textFill={PALETTE.ink}/>
      <Pill x={710} y={770} w={250} text="REPEAT" fill={PALETTE.goldDeep} size={38} textFill={PALETTE.ink}/>
      <path d="M385 812 H685" stroke={PALETTE.highlight} strokeWidth={12} strokeDasharray="26 22" strokeLinecap="round"/>
      <path d="M652 778 L700 812 L652 846" fill="none" stroke={PALETTE.highlight} strokeWidth={12} strokeLinecap="round"/>
      <Display x={540} y={905} text="CUSTOMER LIFETIME VALUE" size={48} fill={PALETTE.highlight}/>
      <Display x={540} y={968} text="REPEATS HELP — NEVER GUARANTEED" size={30}/>
    </g>
    <CutoutCharacter x={540} y={1610} scale={0.95} mood="smug" bob={t * 1.5} {...SELLER_B} headband={null}/>
  </Sunburst>
);

const ConsequenceScene: React.FC<{lp: number; t: number}> = ({lp, t}) => (
  <SkyScene>
    <Display x={540} y={300} text="MORE SALES ≠ MORE PROFIT" size={64} fill={PALETTE.paper}/>
    <Display x={540} y={392} text="BEFORE FIXED COSTS" size={34} fill={PALETTE.slate} stroke={PALETTE.paper}/>
    <CutoutCharacter x={540} y={1420} scale={1.05} mood="sad" bob={t * 2.8}/>
    {Array.from({length: 6}, (_, i) => {
      const p = (lp * 1.5 + i * 0.18) % 1;
      return (
        <g key={i} transform={`translate(${170 + i * 150} ${560 + p * 560}) rotate(${(i % 2 ? 1 : -1) * (14 + p * 20)})`} opacity={p > 0.82 ? (1 - p) * 5 : 1}>
          <AdBill x={0} y={0} s={1.05}/>
        </g>
      );
    })}
  </SkyScene>
);

const PayoffScene: React.FC<{t: number}> = ({t}) => (
  <g>
    <g clipPath="url(#pay-left)"><Sunburst base="#B04A42" ray="#C25A50" cy={620}/></g>
    <g clipPath="url(#pay-right)"><Sunburst base={PALETTE.greenBg} ray={PALETTE.greenRay} cy={620}/></g>
    <defs>
      <clipPath id="pay-left"><rect width="540" height="1920"/></clipPath>
      <clipPath id="pay-right"><rect x="540" width="540" height="1920"/></clipPath>
    </defs>
    <rect x={524} y={110} width={32} height={1500} rx={16} fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth={6}/>
    <g transform="translate(55 240)">
      <rect x={9} y={11} width={410} height={300} rx={22} fill={PALETTE.ink} opacity={0.32}/>
      <rect width={410} height={300} rx={22} fill={PALETTE.paper} stroke={PALETTE.red} strokeWidth={8}/>
      <text x={205} y={88} textAnchor="middle" fontFamily="Arial" fontSize={38} fontWeight={800} letterSpacing={3} fill={PALETTE.slate}>500 SALES</text>
      <text x={205} y={195} textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize={86} fontWeight={900} fill={PALETTE.red}>−$1,500</text>
      <text x={205} y={256} textAnchor="middle" fontFamily="Arial" fontSize={24} fontWeight={700} letterSpacing={2} fill={PALETTE.slate}>CONTRIBUTION</text>
    </g>
    <g transform="translate(615 240)">
      <rect x={9} y={11} width={410} height={300} rx={22} fill={PALETTE.ink} opacity={0.32}/>
      <rect width={410} height={300} rx={22} fill={PALETTE.paper} stroke={PALETTE.green} strokeWidth={8}/>
      <text x={205} y={88} textAnchor="middle" fontFamily="Arial" fontSize={38} fontWeight={800} letterSpacing={3} fill={PALETTE.slate}>100 SALES</text>
      <text x={205} y={195} textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize={86} fontWeight={900} fill={PALETTE.green}>+$700</text>
      <text x={205} y={256} textAnchor="middle" fontFamily="Arial" fontSize={24} fontWeight={700} letterSpacing={2} fill={PALETTE.slate}>CONTRIBUTION</text>
    </g>
    <g transform="translate(120 640)">
      <rect x={10} y={12} width={840} height={190} rx={26} fill={PALETTE.ink} opacity={0.35}/>
      <rect width={840} height={190} rx={26} fill={PALETTE.paper} stroke={PALETTE.goldDeep} strokeWidth={10}/>
      <text x={420} y={86} textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize={56} fontWeight={900} fill={PALETTE.ink}>PROFIT PER ORDER</text>
      <text x={420} y={146} textAnchor="middle" fontFamily="Arial" fontSize={30} fontWeight={700} fill={PALETTE.slate}>wins over raw sales volume</text>
    </g>
    <Display x={540} y={950} text="HYPOTHETICAL • BEFORE FIXED COSTS" size={28} fill={PALETTE.paper}/>
    <CutoutCharacter x={270} y={1560} scale={0.9} mood="sad" bob={t * 2}/>
    <CutoutCharacter x={810} y={1560} scale={0.9} mood="smug" pose="up" bob={t * 1.7 + 1} {...SELLER_B} headband={null}/>
  </g>
);

const sceneDefs = [
  {id: 'hook', start: 0, end: 3.5, dark: false},
  {id: 'compare', start: 3.5, end: 7, dark: true},
  {id: 'same-product', start: 7, end: 9.5, dark: true},
  {id: 'product-cost', start: 9.5, end: 13, dark: false},
  {id: 'ad-cost-a', start: 13, end: 17, dark: false},
  {id: 'math-a', start: 17, end: 20, dark: true},
  {id: 'loss', start: 20, end: 23, dark: true},
  {id: 'total-loss', start: 23, end: 26, dark: false},
  {id: 'ad-cost-b', start: 26, end: 30, dark: false},
  {id: 'math-b', start: 30, end: 34.5, dark: true},
  {id: 'lifetime-value', start: 34.5, end: 39, dark: true},
  {id: 'consequence', start: 39, end: 43, dark: false},
  {id: 'payoff', start: 43, end: 48.5, dark: true}
];

const sceneIndex = (story: number) => sceneDefs.findIndex(s => story >= s.start && story < s.end);

export const UnitEconomicsEpisode: React.FC<{episode: GiftEpisode}> = ({episode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const story = seconds / episode.durationSeconds * STORY_END;
  const idx = sceneIndex(story);
  const def = sceneDefs[idx] ?? sceneDefs[0];
  const lp = Math.max(0, Math.min(1, (story - def.start) / (def.end - def.start)));
  const progress = clamp01(seconds / episode.durationSeconds);
  const names = ['THE HOOK', 'TWO STORES', 'SAME PRODUCT', 'PRODUCT COST', 'AD COST', 'THE MATH', 'LOSS PER ORDER', 'TOTAL LOSS', 'LOWER AD COST', 'POSITIVE UNIT ECONOMICS', 'REPEAT CUSTOMERS', 'THE WRONG GROWTH', 'FINAL COMPARISON'];
  const t = story;

  // Captions: use the most recently started caption so there is never a gap
  // (a gap made the box fade out and back in, which looked like flicker).
  const caption = captionData.filter(c => story >= c[0]).slice(-1)[0] ?? captionData[0];
  // One-time entrance per caption. No looping opacity pulse.
  const capEase = easeOut((story - caption[0]) / 0.18);

  return (
    <AbsoluteFill style={{background: PALETTE.cream, overflow: 'hidden', fontFamily: 'Arial, sans-serif'}}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        {idx === 0 ? <HookScene lp={lp} t={t}/> :
         idx === 1 ? <CompareScene t={t}/> :
         idx === 2 ? <SameProductScene lp={lp}/> :
         idx === 3 ? <ProductCostScene t={t}/> :
         idx === 4 ? <AdCostScene lp={lp} t={t}/> :
         idx === 5 ? <MathAScene lp={lp}/> :
         idx === 6 ? <LossScene lp={lp} t={t}/> :
         idx === 7 ? <TotalLossScene lp={lp} t={t}/> :
         idx === 8 ? <AdCostBScene t={t}/> :
         idx === 9 ? <MathBScene lp={lp}/> :
         idx === 10 ? <LifetimeValueScene lp={lp} t={t}/> :
         idx === 11 ? <ConsequenceScene lp={lp} t={t}/> :
         <PayoffScene t={t}/>}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 8, background: 'rgba(30,36,48,.28)'}}>
        <div style={{height: '100%', width: `${progress * 100}%`, background: PALETTE.highlight}}/>
      </div>
      <div style={{position: 'absolute', left: 58, right: 58, top: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: def.dark ? PALETTE.paper : PALETTE.ink}}>
        <strong style={{fontSize: 27, letterSpacing: 2}}>ODDLY LOGICAL</strong>
        <span style={{fontSize: 16, letterSpacing: 2, color: def.dark ? PALETTE.highlight : PALETTE.greenDark}}>BUSINESS IN PLAIN SIGHT</span>
      </div>

      {/* Caption box: fixed height, always visible, only the text animates in */}
      <div
        style={{
          position: 'absolute', left: 52, right: 52, bottom: 176,
          height: 170,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '0 34px', borderRadius: 30,
          background: 'rgba(22,27,38,.94)',
          border: '3px solid rgba(255,255,255,.12)',
          boxShadow: '0 10px 26px rgba(0,0,0,.32)',
          color: '#fff', fontSize: 44, fontWeight: 900, lineHeight: 1.2,
          textAlign: 'center', textWrap: 'balance' as any,
          textShadow: '0 3px 0 rgba(0,0,0,.35)'
        }}
      >
        <span
          key={caption[0]}
          style={{
            display: 'inline-block',
            opacity: 0.25 + 0.75 * capEase,
            transform: `translateY(${(1 - capEase) * 14}px) scale(${0.97 + 0.03 * capEase})`
          }}
        >
          {captionSegments(caption[2]).map((seg, i) => (
            <span
              key={i}
              style={seg.hi ? {
                color: PALETTE.highlight,
                fontSize: '1.08em',
                textShadow: '0 3px 0 rgba(0,0,0,.45)'
              } : undefined}
            >
              {seg.text}
            </span>
          ))}
        </span>
      </div>

      <div style={{position: 'absolute', left: 68, right: 68, bottom: 80, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, letterSpacing: 2, color: def.dark ? 'rgba(255,253,246,.85)' : PALETTE.slate}}>
        <span>{names[idx]}</span>
        <span>{`${Math.floor(seconds)}s / ${Math.ceil(episode.durationSeconds)}s`}</span>
      </div>
      <Audio src={staticFile(episode.narration.src!)} volume={1}/>
    </AbsoluteFill>
  );
};