import React from 'react';
import {Audio, staticFile} from 'remotion';

type Props = {file: string; volume?: number};

export const OneShot: React.FC<Props> = ({file, volume = 0.45}) => (
  <Audio src={staticFile(`videos/002-black-hole-spaghetti/sfx/${file}`)} volume={volume} />
);
