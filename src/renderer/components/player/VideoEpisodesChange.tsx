import {
  faLayerGroup,
  faBackward,
  faForward,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EpisodeInfo } from '../../../types/types';
import { useEffect, useState } from 'react';
import { getAvailableEpisodes } from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import Heading from '../Heading';

const Episode: React.FC<{
  currentEpisode: number;
  episode: number;
  episodeInfo?: EpisodeInfo;
  media: ListAnimeData['media'];
  isOpen: boolean;
  onClick: () => void;
  onChangeEpisode: (episode: number, reloadAtPreviousTime?: boolean) => void;
}> = ({
  currentEpisode,
  episode,
  episodeInfo,
  media,
  isOpen,
  onClick,
  onChangeEpisode,
}) => (
  <div className={`episode ${isOpen ? 'active' : ''}`} onClick={onClick}>
    <div className="title">
      <span className="number">{episodeInfo ? `Ep: ${episode} - ` : ''}</span>
      <span className='main'>
        {episodeInfo && episodeInfo.title
          ? episodeInfo.title.en ?? `Episode ${episode}`
          : `Episode ${episode}`}
      </span>
      {currentEpisode === episode && (
        <span className="current-tag">Watching now</span>
      )}
    </div>
    {isOpen && (
      <div
        className={`content ${currentEpisode !== episode ? 'pressable' : ''}`}
        onClick={() => {
          currentEpisode !== episode && onChangeEpisode(episode);
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
  listAnimeData: ListAnimeData;
  episodeNumber: number;
  episodesInfo?: EpisodeInfo[];
  showPreviousEpisodeButton: boolean;
  showNextEpisodeButton: boolean;
  onChangeEpisode: (episode: number, reloadAtPreviousTime?: boolean) => void;
}> = ({
  listAnimeData,
  episodeNumber,
  episodesInfo,
  showPreviousEpisodeButton,
  showNextEpisodeButton,
  onChangeEpisode,
}) => {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [openEpisode, setOpenEpisode] = useState<number | null>(null);

  const episodes = getAvailableEpisodes(listAnimeData.media) ?? 0;

  return (
    <>
      <div className="other-episodes-content">
        <button
          className="b-player"
          onClick={() => {
            setShowContent(!showContent);
          }}
        >
          <FontAwesomeIcon className="i" icon={faLayerGroup} />
        </button>
        {showContent && (
          <div className="dropdown other-episode">
            {Array.from({ length: episodes }, (_, index) => index + 1).map(
              (episode) => (
                <Episode
                  key={episode}
                  currentEpisode={episodeNumber}
                  episode={episode}
                  episodeInfo={episodesInfo ? episodesInfo[episode] : undefined}
                  media={listAnimeData.media}
                  isOpen={openEpisode === episode}
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
          <FontAwesomeIcon className="i" icon={faBackward} />
        </button>
      )}
      {showNextEpisodeButton && (
        <button
          className="b-player next show-next-episode-btn"
          onClick={() => onChangeEpisode(episodeNumber + 1)}
        >
          <FontAwesomeIcon className="i" icon={faForward} />
        </button>
      )}
    </>
  );
};

export default VideoEpisodesChange;
