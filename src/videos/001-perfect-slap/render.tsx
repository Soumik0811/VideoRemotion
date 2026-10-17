import React from 'react';
import {Composition, registerRoot, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {VideoTemplate} from '../../core/VideoTemplate';
import {FPS, VIDEO_HEIGHT, VIDEO_WIDTH} from '../../core/theme';
import {video} from './index';

const Video: React.FC = () => <VideoTemplate config={video.config} scenes={video.scenes}/>;
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
