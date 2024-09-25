import { useContext, useState } from 'react';

import { ListAnimeData, UserInfo } from '../../types/anilistAPITypes';
import { AuthContext } from '../App';
import AnimeSection from '../components/AnimeSection';
import Heading from '../components/Heading';
import Slideshow from '../components/Slideshow';
import UserNavbar from '../components/UserNavbar';
import Store from 'electron-store';
import { getTitle } from '../../modules/utils';

const store = new Store();
interface Tab1Props {
  userInfo?: UserInfo
  currentListAnime?: ListAnimeData[];
  trendingAnime?: ListAnimeData[];
  mostPopularAnime?: ListAnimeData[];
  nextReleasesAnime?: ListAnimeData[];
  recommendedAnime?: ListAnimeData[];
}

const Tab1: React.FC<Tab1Props> = ({
  userInfo,
  currentListAnime,
  trendingAnime,
  mostPopularAnime,
  nextReleasesAnime,
  recommendedAnime
}) => {
  // const [fetchedRecommended, setFetchedRecommended] = useState<boolean>(false);
  const hasHistory = useContext(AuthContext);
  const recommendedFrom = hasHistory &&
                          recommendedAnime &&
                          recommendedAnime.length > 0 &&
                          recommendedAnime[recommendedAnime.length - 1] || undefined;
  let recommendedTitle = recommendedFrom &&
                           getTitle(recommendedFrom.media);

  // const logged = store.get('logged') as boolean;

  return (
    <div className="body-container  show-tab">
      <div className="main-container lifted">
        <main>
          {/* {logged ? <Heading text={`Welcome back, ${userInfo?.name}`} /> : <Heading text={`Welcome back`} />} */}

          {/* <UserNavbar avatar={userInfo?.avatar?.medium} /> */}

          <Slideshow listAnimeData={trendingAnime} />

          <div className="section-container">
            {hasHistory && (
              <AnimeSection
                title="Continue Watching"
                animeData={currentListAnime}
              />
            )}
            <AnimeSection title="Trending Now" animeData={trendingAnime} />
            {hasHistory && recommendedFrom && (
              <AnimeSection
                title={`Recommendations From "${
                  (recommendedTitle &&
                  recommendedTitle.length > 58) ?
                  recommendedTitle.substring(0, 58) + '...' :
                  recommendedTitle
                }"`}
                animeData={recommendedAnime}
              />
            )}
            <AnimeSection title="Most Popular" animeData={mostPopularAnime} />
            <AnimeSection title="Next Releases" animeData={nextReleasesAnime} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tab1;
