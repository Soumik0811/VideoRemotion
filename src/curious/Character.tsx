import React from 'react';
import {OUTLINE, PALETTE} from './theme';

export type Mood = 'happy' | 'calm' | 'sad' | 'shocked' | 'thinking' | 'smug';
export type ArmPose = 'down' | 'up' | 'point';

// Keep this API compatible with existing Remotion scenes.
export const SELLER_A = {
  shirt: '#F68A29',
  pants: '#563B2C',
  hair: '#75472D',
  skin: '#F3BD8A',
  headband: '#E94C42',
};

export const SELLER_B = {
  shirt: '#269869',
  pants: '#344B70',
  hair: '#292522',
  skin: '#F2BF95',
  headband: null as string | null,
};

type CharacterProps = {
  x: number;
  y: number;
  scale?: number;
  mood?: Mood;
  pose?: ArmPose;
  shirt?: string;
  pants?: string;
  hair?: string;
  skin?: string;
  headband?: string | null;
  bob?: number;
  flip?: boolean;
};

// Coordinates are still anchored at the character's feet (0, 0).
// Its height is roughly 680 design pixels, similar to the original component.
export const CutoutCharacter: React.FC<CharacterProps> = ({
  x,
  y,
  scale = 1,
  mood = 'calm',
  pose = 'down',
  shirt = SELLER_A.shirt,
  pants = SELLER_A.pants,
  hair = SELLER_A.hair,
  skin = SELLER_A.skin,
  headband = SELLER_A.headband,
  bob = 0,
  flip = false,
}) => {
  const ink = PALETTE.ink ?? '#211B22';
  const line = Math.max(5.5, OUTLINE - 1);
  const hasCurlyHair = Boolean(headband);
  const isSurprised = mood === 'shocked';
  const isSad = mood === 'sad';
  const isHappy = mood === 'happy' || mood === 'smug';
  const eyeDirectionX = mood === 'thinking' ? 4 : 3;
  const eyeDirectionY = isSad ? 4 : mood === 'thinking' ? -3 : 0;

  // Only the far-side/right arm gestures. Keeping the other arm down
  // avoids the broken limb intersections that occurred in previous videos.
  const arm = (side: -1 | 1) => {
    const gestureAngle = side === 1 ? (pose === 'up' ? -145 : pose === 'point' ? -82 : -5) : 5;
    return (
      <g transform={`translate(${side * 76} -404) rotate(${gestureAngle})`}>
        {/* Straight sleeve, hand at the end: intentionally no elbow/finger rig. */}
        <rect
          x={-18}
          y={0}
          width={36}
          height={161}
          rx={17}
          fill={shirt}
          stroke={ink}
          strokeWidth={line}
        />
        <circle cx={0} cy={161} r={19} fill={skin} stroke={ink} strokeWidth={line} />
      </g>
    );
  };

  const face = () => (
    <g>
      {/* Slightly off-center eyes make the characters look alive. */}
      {([-1, 1] as const).map((side) => {
        const centerX = side * 29;
        const cy = -514;
        return (
          <g key={side}>
            {mood === 'thinking' && (
              <path
                d={`M${centerX - 19} -538 Q${centerX} -545 ${centerX + 17} -538`}
                fill="none"
                stroke={ink}
                strokeWidth={5}
                strokeLinecap="round"
              />
            )}
            <ellipse
              cx={centerX}
              cy={cy}
              rx={isSurprised ? 20 : 17}
              ry={isSurprised ? 23 : 19}
              fill="#FFFFFF"
              stroke={ink}
              strokeWidth={5}
            />
            <circle
              cx={centerX + eyeDirectionX}
              cy={cy + eyeDirectionY + 2}
              r={isSurprised ? 7 : 9}
              fill={ink}
            />
            <circle
              cx={centerX + eyeDirectionX - 3}
              cy={cy + eyeDirectionY - 2}
              r={3.3}
              fill="#FFFFFF"
            />
          </g>
        );
      })}

      {/* Expressive small eyebrows, no elaborate face rig. */}
      {mood !== 'thinking' && (
        <g fill="none" stroke={ink} strokeWidth={5.5} strokeLinecap="round">
          <path d={isSad ? 'M-49 -546 Q-35 -563 -17 -546' : 'M-48 -549 Q-34 -555 -20 -548'} />
          <path d={isSad ? 'M18 -546 Q36 -563 49 -546' : 'M20 -548 Q35 -554 48 -549'} />
        </g>
      )}

      {/* Small rounded nose, rather than a realistic protruding profile. */}
      <path d="M7 -496 q7 5 0 9" fill="none" stroke="#BD7C5A" strokeWidth={3.2} strokeLinecap="round" />

      {isSurprised ? (
        <ellipse cx={0} cy={-470} rx={12} ry={16} fill="#783A3E" stroke={ink} strokeWidth={4.5} />
      ) : isSad ? (
        <path d="M-21 -462 Q0 -488 21 -462" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
      ) : mood === 'thinking' ? (
        <path d="M-13 -466 Q0 -463 12 -468" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
      ) : (
        <g>
          <path
            d={mood === 'smug'
              ? 'M-19 -475 Q2 -462 22 -479 Q14 -451 -2 -454 Q-17 -456 -19 -475 Z'
              : isHappy
                ? 'M-22 -476 Q0 -461 22 -476 Q13 -446 0 -446 Q-14 -447 -22 -476 Z'
                : 'M-16 -471 Q0 -460 17 -471 Q10 -454 0 -457 Q-10 -458 -16 -471 Z'}
            fill="#743337"
            stroke={ink}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path d="M-10 -466 Q0 -463 12 -467" stroke="#FFE9DA" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      )}

      {(isSad || isSurprised) && (
        <path
          d="M77 -543 Q96 -521 87 -507 Q73 -506 73 -523 Z"
          fill="#74C7ED"
          stroke={ink}
          strokeWidth={4}
        />
      )}
    </g>
  );

  return (
    <g transform={`translate(${x} ${y + Math.sin(bob) * 5}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* Ground shadow. */}
      <ellipse cx={0} cy={-12} rx={92} ry={15} fill={ink} opacity={0.12} />

      {/* Narrow trouser legs and big rounded shoes. */}
      <path d="M-54 -231 L-12 -231 L-17 -47 L-53 -47 Z" fill={pants} stroke={ink} strokeWidth={line} strokeLinejoin="round" />
      <path d="M12 -231 L54 -231 L53 -47 L17 -47 Z" fill={pants} stroke={ink} strokeWidth={line} strokeLinejoin="round" />
      <ellipse cx={-40} cy={-28} rx={35} ry={17} fill="#403027" stroke={ink} strokeWidth={line} />
      <ellipse cx={40} cy={-28} rx={35} ry={17} fill="#403027" stroke={ink} strokeWidth={line} />

      {/* Arms go BEHIND the shirt. */}
      {arm(-1)}
      {arm(1)}

      {/* Boxy, simple T-shirt with a subtle hem and neck hole. */}
      <rect x={-77} y={-416} width={154} height={197} rx={17} fill={shirt} stroke={ink} strokeWidth={line} />
      <path d="M-68 -227 H68" stroke={ink} strokeWidth={4} opacity={0.4} />
      <rect x={-21} y={-446} width={42} height={32} rx={13} fill={skin} stroke={ink} strokeWidth={4} />
      <path d="M-26 -414 Q0 -399 26 -414" fill="none" stroke="#000000" strokeOpacity={0.18} strokeWidth={7} />

      {/* Ear silhouettes, then large circular head. */}
      <circle cx={-71} cy={-506} r={17} fill={skin} stroke={ink} strokeWidth={line} />
      <circle cx={71} cy={-506} r={17} fill={skin} stroke={ink} strokeWidth={line} />
      <circle cx={0} cy={-514} r={75} fill={skin} stroke={ink} strokeWidth={line + 1} />

      {hasCurlyHair ? (
        <g>
          {/* Rounded curly mop and red headband: orange-shirt character. */}
          <path
            d="M-71 -543 Q-100 -563 -82 -589 Q-89 -623 -57 -623 Q-39 -648 -12 -630 Q18 -649 38 -631 Q66 -636 79 -611 Q97 -593 81 -568 Q84 -547 68 -541 L62 -558 Q47 -579 20 -576 Q-19 -568 -58 -559 Z"
            fill={hair}
            stroke={ink}
            strokeWidth={line}
            strokeLinejoin="round"
          />
          <g fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" opacity={0.6}>
            <path d="M-68 -598 Q-57 -611 -43 -607" />
            <path d="M-27 -621 Q-9 -626 -3 -614" />
            <path d="M18 -622 Q39 -620 41 -605" />
            <path d="M58 -601 Q78 -594 69 -575" />
          </g>
          <path d="M-71 -560 Q0 -574 70 -560" fill="none" stroke={headband ?? '#E94C42'} strokeWidth={15} strokeLinecap="round" />
          <path d="M70 -560 l17 -9" fill="none" stroke={headband ?? '#E94C42'} strokeWidth={8} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          {/* Neat side-swept dark hair: green-shirt character. */}
          <path
            d="M-75 -530 Q-87 -585 -44 -609 Q-4 -637 45 -609 Q83 -590 76 -539 Q58 -554 34 -555 Q10 -568 -13 -564 Q-43 -555 -75 -530 Z"
            fill={hair}
            stroke={ink}
            strokeWidth={line}
            strokeLinejoin="round"
          />
          <path d="M-50 -574 Q-22 -554 26 -561" fill="none" stroke="#FFFFFF" strokeWidth={3.2} strokeOpacity={0.15} />
        </g>
      )}

      {face()}
    </g>
  );
};
