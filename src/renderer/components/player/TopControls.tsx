import 'react-activity/dist/Dots.css';

import {
  faAngleLeft,
  faBackward,
  faCompress,
  faExpand,
  faForward,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

import { ListAnimeData } from '../../../types/anilistAPITypes';
import Settings from './VideoSettings';

interface TopControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  listAnimeData: ListAnimeData;
  episodeNumber: number;
  episodeTitle: string;
  showPreviousEpisodeButton: boolean;
  showNextEpisodeButton: boolean;
  fullscreen: boolean;
  onSettingsToggle: (isShowed: boolean) => void;
  onFullScreentoggle: () => void;
  onChangeEpisode: (episode: number, reloadAtPreviousTime?: boolean) => void;
  onExit: () => void;
  onClick?: (event: any) => void;
  onDblClick?: (event: any) => void;
}

const TopControls: React.FC<TopControlsProps> = ({
  videoRef,
  listAnimeData,
  episodeNumber,
  episodeTitle,
  showPreviousEpisodeButton,
  showNextEpisodeButton,
  fullscreen,
  onSettingsToggle,
  onFullScreentoggle,
  onChangeEpisode,
  onExit,
  onClick,
  onDblClick,
}) => {
  const handleSettingsToggle = (isShowed: boolean) => {
    onSettingsToggle(isShowed);
  };

  return (
    <div className="up-controls" onClick={onClick} onDoubleClick={onDblClick}>
      <div className="left">
        <div className="info exit-video" onClick={onExit}>
          <span className="title">{listAnimeData.media.title?.english}</span>
          <span className="back">
            <FontAwesomeIcon className="i" icon={faAngleLeft} />
            <span className="episode">
              <span>{`Ep. ${episodeNumber} - `}</span>
              {episodeTitle}
            </span>
          </span>
        </div>
      </div>
      <div className="center"></div>
      <div className="right">
        <Settings
          videoRef={videoRef}
          onToggle={handleSettingsToggle}
          onChangeEpisode={onChangeEpisode}
        />
        {showPreviousEpisodeButton && (
          <button
            className="next show-next-episode-btn"
            onClick={() => {
              onChangeEpisode(-1);
            }}
          >
            <FontAwesomeIcon className="i" icon={faBackward} />
          </button>
        )}
        {showNextEpisodeButton && (
          <button
            className="next show-next-episode-btn"
            onClick={() => onChangeEpisode(1)}
          >
            <FontAwesomeIcon className="i" icon={faForward} />
          </button>
        )}
        <button className="fullscreen" onClick={onFullScreentoggle}>
          <FontAwesomeIcon
            className="i"
            icon={fullscreen ? faCompress : faExpand}
          />
        </button>
      </div>
    </div>
  );
};

export default TopControls;
