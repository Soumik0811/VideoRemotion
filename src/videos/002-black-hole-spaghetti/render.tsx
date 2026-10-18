import React from 'react';
import {Audio, Composition, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {BeebopActor} from '../../core/BeebopActor';
import {Captions} from '../../core/Captions';
import {SceneRenderer} from '../../core/SceneRenderer';
import {TopTitle} from '../../core/TopTitle';
import {FPS, VIDEO_HEIGHT, VIDEO_WIDTH} from '../../core/theme';
import {video} from './index';
import {VoidStage} from './backgrounds/VoidStage';

/**
 * Opaque, always-on stage underneath every scene. During fade / slide / zoom transitions the
 * outgoing and incoming scene layers are partly transparent or offset, which used to expose the
 * empty canvas (the grey/white checkerboard). This layer keeps something dark behind them.
 * Frame here is the global frame, so offsetSeconds stays 0.
 */
const StageBase: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // the split-screen scene (23.7s to 28.5s) has no hole, so the base drops it too
  return <VoidStage offsetSeconds={0} showHole={!(t >= 23.5 && t < 28.7)} />;
};

const BeebopPlacement: React.FC = () => <div style={{position: 'absolute', inset: 0, translate: '633px -584.5px'}}><BeebopActor timeline={video.scenes} segments={video.config.segments as any} /></div>;
const Video: React.FC = () => <>
  <Audio src={staticFile(video.config.audio)} />
  <StageBase />
  <SceneRenderer scenes={video.scenes} />
  <BeebopPlacement />
  <TopTitle title={video.config.title} />
  <Captions segments={video.config.segments} />
</>;
const Root: React.FC = () => <Composition
  id={video.id}
  component={Video}
  width={VIDEO_WIDTH}
  height={VIDEO_HEIGHT}
  fps={FPS}
  durationInFrames={Math.ceil(video.scenes.at(-1)!.end * FPS)}
  calculateMetadata={async () => ({durationInFrames: Math.ceil((await getAudioDurationInSeconds(staticFile(video.config.audio))) * FPS)})}
/>;

registerRoot(Root);