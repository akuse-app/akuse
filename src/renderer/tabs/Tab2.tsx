import { useEffect } from 'react';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeSection from '../components/AnimeSection';

interface Tab2Props {
  planningListAnime?: ListAnimeData[];
  clicked: () => void;
}

const Tab2: React.FC<Tab2Props> = ({
  planningListAnime,
  clicked,
}) => {
  useEffect(() => {
    clicked();
  });

  return (
    <div className="main-container">
      <main>
        <div className="section-container">
          <AnimeSection title="Your List" animeData={planningListAnime} />
        </div>
      </main>
    </div>
  );
};

export default Tab2;
