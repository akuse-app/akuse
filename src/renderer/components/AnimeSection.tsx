import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeEntry from './AnimeEntry';

interface AnimeSectionProps {
  title: string;
  animeData?: ListAnimeData[];
}

const AnimeSection: React.FC<AnimeSectionProps> = ({ title, animeData }) => {
  return (
    <section>
      <h1>{title}</h1>
      <div className="anime-list-wrapper">
        <div className="anime-list">
          {(animeData ? animeData : Array(20).fill(undefined)).map(
            (listAnimeData, index) => (
              <AnimeEntry key={index} listAnimeData={listAnimeData} />
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default AnimeSection;
