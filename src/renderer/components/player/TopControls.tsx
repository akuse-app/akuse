import 'react-activity/dist/Dots.css';

import { faAngleLeft, faBackward, faCompress, faExpand, faForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ListAnimeData } from '../../../types/anilistAPITypes';
import Settings from './VideoSettings';
import Hls from 'hls.js';
import { EpisodeInfo } from '../../../types/types';

interface TopControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  hls?: Hls
  listAnimeData: ListAnimeData;
  episodesInfo: EpisodeInfo[] | null;
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
  hls,
  listAnimeData,
  episodesInfo,
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
          hls={hls}
          onToggle={handleSettingsToggle}
          onChangeEpisode={onChangeEpisode}
        />
        {showPreviousEpisodeButton && (
          <button
            className="b-player next show-next-episode-btn"
            onClick={() => {
              onChangeEpisode(-1);
            }}
          >
            <FontAwesomeIcon className="i" icon={faBackward} />
          </button>
        )}
        {showNextEpisodeButton && (
          <button
            className="b-player next show-next-episode-btn"
            onClick={() => onChangeEpisode(1)}
          >
            <FontAwesomeIcon className="i" icon={faForward} />
          </button>
        )}
        <button className="b-player fullscreen" onClick={onFullScreentoggle}>
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
