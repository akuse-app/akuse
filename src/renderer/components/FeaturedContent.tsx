import {
  faArrowLeftLong,
  faArrowRightLong,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useState } from 'react';
import {
  capitalizeFirstLetter,
  getParsedSeasonYear,
  getTitle,
  parseDescription,
} from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import { Media } from '../../types/anilistGraphQLTypes';
import { Button1, CircleButton1 } from './Buttons';

interface FeaturedContentProps {
  animeData: ListAnimeData[]
}

interface FeaturedItemProps {
  media: Media;
}

const FeaturedItem: React.FC<FeaturedItemProps> = ({ media }) => {
  const onPress = () => {};

  return (
    <div className="featured">
      <div className="featured-container">
        <div className="content show">
          <div className="anime-info">
            <div className="anime-format">{media.format}</div>•
            <div className="anime-year">
              {capitalizeFirstLetter(media.season ?? '?')} {getParsedSeasonYear(media)}
            </div>
            •<div className="anime-episodes">{media.episodes} Episodes</div>
          </div>
          <div className="anime-title">{getTitle(media)}</div>
          <div className="anime-description">
            {parseDescription(media.description ?? '')}
          </div>
          <Button1 text="Watch now" icon={faPlay} onPress={onPress} />
        </div>
      </div>
      <div className="featured-img">
        <img src={media.bannerImage} alt="anime banner" />
      </div>
    </div>
  );
};

const FeaturedContent: React.FC<FeaturedContentProps> = ({ animeData }) => {
  const [showButtons, setShowButtons] = useState(false);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  const onLeftPress = () => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollLeft -= 1000;
    }
  };

  const onRightPress = () => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollLeft += 1000;
    }
  };

  return (
    <>
      <div
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <CircleButton1
          icon={faArrowLeftLong}
          classes={`left ${showButtons ? 'show-opacity' : 'hide-opacity'}`}
          onPress={onLeftPress}
        />
        <CircleButton1
          icon={faArrowRightLong}
          classes={`right ${showButtons ? 'show-opacity' : 'hide-opacity'}`}
          onPress={onRightPress}
        />
      </div>
      <h1>Popular Now</h1>
      <div
        className="featured-scroller"
        ref={scrollWrapperRef}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <div
          className="featured-scroller-wrapper"
          style={{
            width: `${
              // trendingAnime?.media?.length! * 100
              (animeData?.filter((listAnimeData) => listAnimeData?.media.bannerImage)?.length ?? 0) * 100
            }%`,
          }}
        >
          {animeData
            ?.filter((animeData) => animeData.media.bannerImage)
            .map((animeData, index) => <FeaturedItem key={index} media={animeData.media} />)}
        </div>
      </div>
    </>
  );
};

export default FeaturedContent;
