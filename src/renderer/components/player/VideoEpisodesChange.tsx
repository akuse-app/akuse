import {
  faBackward,
  faForward,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { getAvailableEpisodes } from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';

const Episode: React.FC<{
  episode: number;
  episodeInfo?: EpisodeInfo;
  media: ListAnimeData['media'];
  isOpen: boolean;
  isCurrent: boolean;
  onClick: () => void;
  onChangeEpisode: (
    episode: number,
    reloadAtPreviousTime?: boolean,
  ) => Promise<boolean>;
}> = ({
  episode,
  episodeInfo,
  media,
  isOpen,
  isCurrent,
  onClick,
  onChangeEpisode,
}) => (
  <div className={`episode ${isOpen ? 'active' : ''}`} onClick={onClick}>
    <div className="title">
      <span className="number">{episodeInfo ? `Ep: ${episode} - ` : ''}</span>
      <span className="main">
        {episodeInfo && episodeInfo.title
          ? (episodeInfo.title.en ?? `Episode ${episode}`)
          : `Episode ${episode}`}
      </span>
      {isCurrent && <span className="current-tag">Watching now</span>}
    </div>
    {isOpen && (
      <div
        className={`content ${!isCurrent ? 'pressable' : ''}`}
        onClickCapture={() => {
          !isCurrent && onChangeEpisode(episode);
        }}
      >
        <img src={episodeInfo?.image ?? media.bannerImage ?? ''} alt="" />
        <div className="info">
          {episodeInfo?.summary ?? 'No description available.'}
        </div>
      </div>
    )}
  </div>
);

const VideoEpisodesChange: React.FC<{
  show: boolean;
  onShow: (show: boolean) => void;
  listAnimeData: ListAnimeData;
  episodeNumber: number;
  episodesInfo?: EpisodeInfo[];
  showPreviousEpisodeButton: boolean;
  showNextEpisodeButton: boolean;
  onChangeEpisode: (
    episode: number,
    reloadAtPreviousTime?: boolean,
  ) => Promise<boolean>;
}> = ({
  show,
  onShow,
  listAnimeData,
  episodeNumber,
  episodesInfo,
  showPreviousEpisodeButton,
  showNextEpisodeButton,
  onChangeEpisode,
}) => {
  const [openEpisode, setOpenEpisode] = useState<number | null>(null);

  const episodes = getAvailableEpisodes(listAnimeData.media) ?? 0;

  const toggleShow = () => {
    onShow(!show);
  };

  return (
    <>
      <div className="other-episodes-content">
        <button
          className={`b-player ${show ? 'active' : ''}`}
          onClick={toggleShow}
        >
          <div className="tooltip">
            <FontAwesomeIcon className="i" icon={faLayerGroup} />
            <div className="tooltip-text">Show Episodes</div>
          </div>
        </button>
        {show && (
          <div className="dropdown other-episode">
            {Array.from({ length: episodes }, (_, index) => index + 1).map(
              (episode) => (
                <Episode
                  key={episode}
                  episode={episode}
                  episodeInfo={episodesInfo ? episodesInfo[episode] : undefined}
                  media={listAnimeData.media}
                  isOpen={openEpisode === episode}
                  isCurrent={episodeNumber === episode}
                  onClick={() =>
                    setOpenEpisode(openEpisode === episode ? null : episode)
                  }
                  onChangeEpisode={onChangeEpisode}
                />
              ),
            )}
          </div>
        )}
      </div>
      {showPreviousEpisodeButton && (
        <button
          className="b-player next show-next-episode-btn"
          onClick={() => {
            onChangeEpisode(episodeNumber - 1);
          }}
        >
          <div className="tooltip">
            <FontAwesomeIcon className="i" icon={faBackward} />
            <div className="tooltip-text">Previous Episode</div>
          </div>
        </button>
      )}
      {showNextEpisodeButton && (
        <button
          className="b-player next show-next-episode-btn"
          onClick={() => onChangeEpisode(episodeNumber + 1)}
        >
          <div className="tooltip">
            <FontAwesomeIcon className="i" icon={faForward} />
            <div className="tooltip-text">Next Episode</div>
          </div>
        </button>
      )}
    </>
  );
};

export default VideoEpisodesChange;
