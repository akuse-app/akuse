import { useEffect } from 'react';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeSection from '../components/AnimeSection';
import Heading from '../components/Heading';

interface Tab2Props {
  currentListAnime?: ListAnimeData[];
  planningListAnime?: ListAnimeData[];
  completedListAnime?: ListAnimeData[];
  clicked: () => void;
}

const Tab2: React.FC<Tab2Props> = ({ currentListAnime, planningListAnime, completedListAnime, clicked }) => {
  useEffect(() => {
    clicked();
  });

  const isEmpty = !(currentListAnime?.length || planningListAnime?.length || completedListAnime?.length);

  return (
    <div className="body-container show-tab">
      <div className="main-container">
        <main>
          <Heading text='Library' />
          <div className="section-container">
            {isEmpty ? (
              <p>Nothing to see here...</p>
            ) : (
              <>
                {(currentListAnime?.length ?? 0) > 0 && <AnimeSection title="Continue Watching" animeData={currentListAnime} />}
                {(planningListAnime?.length ?? 0) > 0 && <AnimeSection title="Your List" animeData={planningListAnime} />}
                {(completedListAnime?.length ?? 0) > 0 && <AnimeSection title="Completed" animeData={completedListAnime} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tab2;
