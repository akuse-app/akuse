import { useEffect } from 'react';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeSection from '../components/AnimeSection';
import Heading from '../components/Heading';

interface Tab2Props {
  currentListAnime?: ListAnimeData[];
  planningListAnime?: ListAnimeData[];
  clicked: () => void;
}

const Tab2: React.FC<Tab2Props> = ({ currentListAnime, planningListAnime, clicked }) => {
  useEffect(() => {
    clicked();
  });

  return (
    <div className="body-container show-tab">
      <div className="main-container">
        <main>
        <Heading text='Library' />
          <div className="section-container">
            <AnimeSection title="Continue Watching" animeData={currentListAnime} />
            <AnimeSection title="Your List" animeData={planningListAnime} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tab2;
