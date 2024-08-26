import { useEffect, useState } from 'react';

import { getAvailableEpisodes, parseAirdate } from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';
import Select from '../Select';
import EpisodeEntry from './EpisodeEntry';

const EPISODES_PER_PAGE = 30;

interface EpisodesSectionProps {
  episodesInfo?: EpisodeInfo[];
  episodesInfoHasFetched: boolean;
  listAnimeData: ListAnimeData;
  loading?: boolean;
  onPlay: (episode: number) => void;
}

const EpisodesSection: React.FC<EpisodesSectionProps> = ({
  episodesInfo,
  episodesInfoHasFetched,
  listAnimeData,
  loading,
  onPlay,
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [widenInput, setWidenInput] = useState<boolean>(false);

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

  const handleChange = (value: any) => {
    setActiveSection(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  return (
    <div className="episodes-section">
      <div className="episodes-scroller">
        {pages.length !== 0 && (
          <>
            <div className="episodes-options">
              <h2>Episodes</h2>
              <div className="right">
                {episodes > EPISODES_PER_PAGE && (
                  <Select
                    zIndex={1}
                    options={[
                      ...pages.map((page, index) => ({
                        label: `${page[0]} - ${page.slice(-1)}`,
                        value: index,
                      })),
                    ]}
                    selectedValue={activeSection}
                    onChange={handleChange}
                    width={140}
                  />
                )}
              </div>
            </div>
            <div className="episodes">
              {pages[activeSection].map((episode, index) => (
                <EpisodeEntry
                  onPress={() => {
                    onPlay(episode);
                  }}
                  key={index}
                  hasInfoLoaded={episodesInfoHasFetched}
                  number={episodesInfo ? `Ep: ${episode} - ` : ''}
                  cover={
                    episodesInfo
                      ? (episodesInfo[episode]?.image ??
                        listAnimeData.media.bannerImage ??
                        '')
                      : (listAnimeData.media.bannerImage ?? '')
                  }
                  title={
                    episodesInfo && episodesInfo[episode]?.title
                      ? (episodesInfo[episode]?.title?.en ??
                        `Episode ${episode}`)
                      : `Episode ${episode}`
                  }
                  description={
                    episodesInfo
                      ? (episodesInfo[episode]?.summary ??
                        'No description available.')
                      : 'No description available.'
                  }
                  releaseDate={
                    episodesInfo
                      ? (parseAirdate(episodesInfo[episode]?.airdate || '') ??
                        '')
                      : ''
                  }
                  duration={
                    episodesInfo ? `${episodesInfo[episode]?.length}min` : ''
                  }
                  loading={loading}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EpisodesSection;

{
  /* <div className="search-bar">
<div className="wrapper">
  <div className="i-wrapper" onClick={() => {setSearchValue('')}}>
    <FontAwesomeIcon
      icon={faSearch}
      // icon={searchValue !== '' ? faXmark : faSearch}
      className="i"
      style={{ marginRight: 7 }}
    />
  </div>
  <input
    onFocus={() => {
      setWidenInput(true);
    }}
    onBlur={() => {
      setWidenInput(false);
      setSearchValue('');
    }}
    placeholder='Search...'
    style={{ width: widenInput ? 300 : 75 }}
    type="text"
    value={searchValue}
    onChange={handleSearchChange}
  />
</div>
</div> */
}
