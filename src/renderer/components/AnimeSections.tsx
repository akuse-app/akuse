import './styles/AnimeSection.css';

import { faArrowLeftLong, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';

import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeEntry from './AnimeEntry';
import { ButtonCircle } from './Buttons';
import Select from './Select';

type Value = ListAnimeData[] | any | null;

interface Option {
  label: string;
  value: ListAnimeData[];
}

interface AnimeSectionsProps {
  options: Option[];
  selectedLabel: string;
  id: string;
}

const AnimeSections: React.FC<AnimeSectionsProps> = ({
  options,
  id,
  selectedLabel
}) => {
  const animeListWrapperRef = useRef<HTMLDivElement>(null);
  const animeListRef = useRef<HTMLDivElement>(null);
  const [enableButtons, setEnableButtons] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  // const [selectedSection, setSelectedAnime] = useState<ListAnimeData>();
  options = options.filter((value) => value.value.length > 0)
  const selected = options.find((value) => value.label === selectedLabel);
  const [animeData, setAnimeData] = useState<ListAnimeData[]>(
    selected && selected.value || options[0].value
  );

  const hideButtons = () => {
    if (animeListWrapperRef.current && animeListRef.current) {
      setEnableButtons(
        !(
          animeListWrapperRef.current.clientWidth >
          animeListRef.current.scrollWidth
        ),
      );
    }
  };

  const handleMouseEnter = () => {
    setShowButtons(true);
    hideButtons();
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

  const handleSectionSelect = (value: ListAnimeData[]) => {
    // console.log(value);
    setAnimeData(value);
    // selectedValue = value;
  }

  return (
    <section onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} id={`${id.toLowerCase().replace(' ', '-')}-section`}>
      <Select
        options={options}
        selectedValue={animeData}
        onChange={handleSectionSelect}
        className={`${id}-select`}
      />
      {/* <h1>{title}</h1> */}
      {enableButtons && (
        <div
          className={`scrollers ${
            showButtons ? 'show-opacity' : 'hide-opacity'
          }`}
        >
          <ButtonCircle
            icon={faArrowLeftLong}
            tint="dark"
            small
            onClick={scrollLeft}
          />
          <ButtonCircle
            icon={faArrowRightLong}
            tint="dark"
            small
            onClick={scrollRight}
          />
        </div>
      )}
      <div className="anime-list-wrapper" ref={animeListWrapperRef}>
        <div className="anime-list" ref={animeListRef}>
        {(animeData ?? Array(20).fill(undefined)).map(
            (listAnimeData, index) => (
              <AnimeEntry key={index} listAnimeData={listAnimeData} />
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default AnimeSections;
