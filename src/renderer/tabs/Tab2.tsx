import { useEffect } from 'react';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeSection from '../components/AnimeSection';

interface Tab2Props {
  planningListAnime?: ListAnimeData[];
  completedListAnime?: ListAnimeData[];
  droppedListAnime?: ListAnimeData[];
  pausedListAnime?: ListAnimeData[];
  repeatingListAnime?: ListAnimeData[];
  clicked: () => void;
}

const Tab2: React.FC<Tab2Props> = ({
  planningListAnime,
  completedListAnime,
  droppedListAnime,
  pausedListAnime,
  repeatingListAnime,
  clicked,
}) => {
  useEffect(() => {
    clicked();
  });

  return (
    <div className="main-container">
      <main>
        <div className="section-container">
          <AnimeSection title="Planning" animeData={planningListAnime} />
          <AnimeSection title="Completed" animeData={completedListAnime} />
          <AnimeSection title="Dropped" animeData={droppedListAnime} />
          <AnimeSection title="Paused" animeData={pausedListAnime} />
          <AnimeSection title="Repeating" animeData={repeatingListAnime} />
        </div>
      </main>
    </div>
  );
};

export default Tab2;
