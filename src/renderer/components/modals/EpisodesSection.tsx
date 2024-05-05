import { useEffect, useState } from 'react';
import { makeRequest } from '../../../modules/requests';
import { getEpisodes } from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import EpisodeEntry from './EpisodeEntry';
import axios from 'axios';

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

  const fetchEpisodesInfo = async () => {
    console.log(`${EPISODES_INFO_URL}${listAnimeData.media.id}`)
    const data = await axios.get(`${EPISODES_INFO_URL}${listAnimeData.media.id}`)
    console.log(data)
    setEpisodesInfoHasFetched(true);
  };

  useEffect(() => {
    console.log(loadEpisodesInfo);
    console.log(episodesInfoHasFetched);
    loadEpisodesInfo && !episodesInfoHasFetched && fetchEpisodesInfo();
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
                infoLoaded={false}
                number=""
                cover={listAnimeData.media.bannerImage ?? ''}
                title={`Episode ${episode}`}
                description=""
                releaseDate=""
                duration=""
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodesSection;
