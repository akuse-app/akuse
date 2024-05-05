import { useEffect, useState } from 'react';
import { makeRequest } from '../../../modules/requests';
import { getEpisodes, parseAirdate } from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import EpisodeEntry from './EpisodeEntry';
import axios from 'axios';
import { EpisodeInfo, EpisodesInfo } from '../../../types/types';

const EPISODES_INFO_URL = 'https://api.ani.zip/mappings?anilist_id=';
const EPISODES_PER_PAGE = 30;

interface EpisodesSectionProps {
  loadEpisodesInfo: boolean;
  listAnimeData: ListAnimeData;
}

const EpisodesSection: React.FC<EpisodesSectionProps> = ({
  loadEpisodesInfo = false,
  listAnimeData,
}) => {
  // const nPages = Array.from(
  //   { length: episodes / EPISODES_PER_PAGE + 1 },
  //   (_, i) => i + 1,
  // );

  const [episodesInfoHasFetched, setEpisodesInfoHasFetched] =
    useState<boolean>(false);

  const [episodeInfo, setEpisodeInfo] = useState<EpisodeInfo[] | null>(null);

  const fetchEpisodesInfo = async () => {
    axios.get(`${EPISODES_INFO_URL}${listAnimeData.media.id}`).then((data) => {
      if (data.data && data.data.episodes) setEpisodeInfo(data.data.episodes);
      setEpisodesInfoHasFetched(true);
    });
  };

  useEffect(() => {
    if (!episodesInfoHasFetched) fetchEpisodesInfo();
  }, []);

  /**
   * @returns array with parsed episodes indexes (e.g. one piece 1103 episodes => array[36][30])
   */
  const getEpisodesArray = () => {
    const episodes = getEpisodes(listAnimeData.media) ?? 0;
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

  return (
    <div className="episodes-section">
      <div className="episodes-scroller">
        <div className="episodes-options">
          <h2>Episodes</h2>
          <select name="" id=""></select>
        </div>

        {pages.map((page, index) => (
          <div key={index} className="episodes show">
            {page.map((episode, index) => (
              <EpisodeEntry
                key={index}
                hasInfoLoaded={episodesInfoHasFetched}
                number={episodeInfo ? `Ep, ${index + 1} - ` : ''}
                cover={
                  episodeInfo
                    ? episodeInfo[index + 1]?.image ??
                      listAnimeData.media.bannerImage ??
                      ''
                    : listAnimeData.media.bannerImage ?? ''
                }
                title={
                  episodeInfo && episodeInfo[index + 1]?.title
                    ? episodeInfo[index + 1]?.title?.en ?? `Episode ${episode}`
                    : `Episode ${episode}`
                }
                description={
                  episodeInfo ? episodeInfo[index + 1]?.summary ?? '' : ''
                }
                releaseDate={
                  episodeInfo
                    ? parseAirdate(episodeInfo[index + 1]?.airdate || '') ?? ''
                    : ''
                }
                duration={
                  episodeInfo
                    ? `${episodeInfo[index + 1]?.length}min` ?? ''
                    : ''
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodesSection;
