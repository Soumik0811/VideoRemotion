import React from 'react';
import {Camera} from './motion';

/** All people, props and scenery share world coordinates; cuts never reparent a prop. */
export const EnvironmentCamera:React.FC<{camera:Camera;children:React.ReactNode}>=({camera,children})=><g clipPath="url(#cinematic-stage)">
  <g transform={`translate(540 840) scale(${camera.zoom}) translate(${-camera.x} ${-camera.y})`}>{children}</g>
</g>;
export const Parallax:React.FC<{camera:Camera;depth?:number;children:React.ReactNode}>=({camera,depth=.08,children})=><g transform={`translate(${(camera.x-800)*depth} ${(camera.y-740)*depth})`}>{children}</g>;
