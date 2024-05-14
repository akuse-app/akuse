import { faArrowLeftLong, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';

import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeEntry from './AnimeEntry';

interface AnimeSectionProps {
  title: string;
  animeData?: ListAnimeData[];
}

const AnimeSection: React.FC<AnimeSectionProps> = ({ title, animeData }) => {
  const animeListWrapperRef = useRef<HTMLDivElement>(null);
  const animeListRef = useRef<HTMLDivElement>(null);
  const [enableButtons, setEnableButtons] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const hideButtons = () => {
    if(animeListWrapperRef.current && animeListRef.current) {
      setEnableButtons(!(animeListWrapperRef.current.clientWidth > animeListRef.current.scrollWidth))
    }
  }

  const handleMouseEnter = () => {
    setShowButtons(true);
    hideButtons()
  };
  const handleMouseLeave = () => {
    setShowButtons(false);
  };

  const scrollLeft = () => {
    if (animeListWrapperRef.current) {
      animeListWrapperRef.current.scrollLeft -= 232 * 4;
    }
  };
  const scrollRight = () => {
    if (animeListWrapperRef.current) {
      animeListWrapperRef.current.scrollLeft += 232 * 4;
    }
  };

  return (
    <section>
      <h1>{title}</h1>
      {enableButtons && (
        <>
          <button
            className={`circle-button-0 left ${
              showButtons ? 'show-opacity' : 'hide-opacity'
            }`}
            onClick={scrollLeft}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <FontAwesomeIcon className="i" icon={faArrowLeftLong} />
          </button>
          <button
            className={`circle-button-0 right ${
              showButtons ? 'show-opacity' : 'hide-opacity'
            }`}
            onClick={scrollRight}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <FontAwesomeIcon className="i" icon={faArrowRightLong} />
          </button>
        </>
      )}
      <div
        className="anime-list-wrapper"
        ref={animeListWrapperRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="anime-list" ref={animeListRef}>
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
