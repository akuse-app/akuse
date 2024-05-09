import axios from 'axios';
import { useEffect, useState } from 'react';

import { getAvailableEpisodes, parseAirdate } from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';
import EpisodeEntry from './EpisodeEntry';

const EPISODES_INFO_URL = 'https://api.ani.zip/mappings?anilist_id=';
const EPISODES_PER_PAGE = 30;

interface EpisodesSectionProps {
  listAnimeData: ListAnimeData;
}

const EpisodesSection: React.FC<EpisodesSectionProps> = ({ listAnimeData }) => {
  const [episodesInfoHasFetched, setEpisodesInfoHasFetched] =
    useState<boolean>(false);
  const [episodeInfo, setEpisodeInfo] = useState<EpisodeInfo[] | null>(null);
  const [activeSection, setActiveSection] = useState<number>(0);

  const fetchEpisodesInfo = async () => {
    axios.get(`${EPISODES_INFO_URL}${listAnimeData.media.id}`).then((data) => {
      if (data.data && data.data.episodes) setEpisodeInfo(data.data.episodes);
      setEpisodesInfoHasFetched(true);
    });
  };

  useEffect(() => {
    if (!episodesInfoHasFetched) fetchEpisodesInfo();
  }, []);

  const episodes = getAvailableEpisodes(listAnimeData.media) ?? 0;

  const getEpisodesArray = () => {
    const total_pages: number = Math.ceil(episodes / EPISODES_PER_PAGE);
    const episodesArray: number[][] = [];

    for (let page = 0; page < total_pages; page++) {
      const start_index: number = page * EPISODES_PER_PAGE;
      const end_index: number = Math.min(
        start_index + EPISODES_PER_PAGE,
        episodes,
      );
      const page_episodes: number[] = Array.from(
        { length: end_index - start_index },
        (_, index) => start_index + index + 1,
      );
      episodesArray.push(page_episodes);
    }

    return episodesArray;
  };

  const pages = getEpisodesArray();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveSection(parseInt(event.target.value));
  };

  return (
    <div className="episodes-section">
      <div className="episodes-scroller">
        <div className="episodes-options">
          <h2>Episodes</h2>
          {episodes > EPISODES_PER_PAGE && (
            <select
              className="main-select-0"
              onChange={handleChange}
              value={activeSection}
            >
              {pages.map((page, index) => (
                <option key={index} value={index}>
                  {page[0]}
                  <span> - </span>
                  {page.slice(-1)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="episodes">
          {pages.length !== 0 &&
            pages[activeSection].map((episode, index) => (
              <EpisodeEntry
                key={index}
                hasInfoLoaded={episodesInfoHasFetched}
                number={episodeInfo ? `Ep: ${episode} - ` : ''}
                cover={
                  episodeInfo
                    ? episodeInfo[episode]?.image ??
                      listAnimeData.media.bannerImage ??
                      ''
                    : listAnimeData.media.bannerImage ?? ''
                }
                title={
                  episodeInfo && episodeInfo[episode]?.title
                    ? episodeInfo[episode]?.title?.en ?? `Episode ${episode}`
                    : `Episode ${episode}`
                }
                description={
                  episodeInfo ? episodeInfo[episode]?.summary ?? '' : ''
                }
                releaseDate={
                  episodeInfo
                    ? parseAirdate(episodeInfo[episode]?.airdate || '') ?? ''
                    : ''
                }
                duration={
                  episodeInfo ? `${episodeInfo[episode]?.length}min` ?? '' : ''
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default EpisodesSection;
