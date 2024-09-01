import { UIEventHandler, useEffect, useRef, useState } from "react";
import Heading from "../components/Heading";
import { ListAnimeData } from "../../types/anilistAPITypes";
import { getAiredAnime } from "../../modules/anilist/anilistApi";
import { airingDataToListAnimeData } from "../../modules/utils";
import { Dots } from "react-activity";
import AnimeEntry from "../components/AnimeEntry";
import AnimeSection from "../components/AnimeSection";
import Slideshow from "../components/Slideshow";

interface Tab5Props {
  viewerId: number | null;
}

const Tab5: React.FC<Tab5Props> = ({ viewerId }) => {
  const pageRef = useRef<number>(1);

  const [todayAnime, setTodayAnime] = useState<ListAnimeData[]>([])
  const [airedAnime, setAiredAnime] = useState<ListAnimeData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [searchTime, setSearchTime] = useState<number>(Date.now() / 1000);
  const [hasPopulated, setHasPopulated] = useState<boolean>(false);

  // Time constants
  const timeOffset = 86400;


  useEffect(() => {
    const current = Date.now() / 1000;

    if(!hasPopulated)
      populateAiredAnime(true);

    if(current - lastUpdate < 5) return;

    setLastUpdate(current);
    fetchData();
  }, [lastUpdate, hasPopulated]);

  const populateAiredAnime = async (addOn: boolean = false) => {
    setHasPopulated(true);

    const airingData = await getAiredAnime(viewerId, 100, timeOffset, searchTime, pageRef.current);

    if(airingData.pageInfo.hasNextPage)
      ++pageRef.current;
    else {
      pageRef.current = 1;
      setSearchTime(searchTime - timeOffset);
    }

    var listAnimeData = airingDataToListAnimeData(airingData.airingSchedules);

    if(!addOn)
      setAiredAnime(airedAnime.concat(listAnimeData));
    else
      setAiredAnime(listAnimeData.concat(airedAnime));
  };

  const fetchData = async () => {
    const endOfDay = new Date();
    endOfDay.setHours(24, 0, 0, -1);

    const todaySchedule = await getAiredAnime(viewerId, 60, 86400, Math.floor(endOfDay.getTime() / 1000));

    setTodayAnime(airingDataToListAnimeData(todaySchedule.airingSchedules));
  };

  const handleScroll = async (event: any) => {
    const target: HTMLDivElement = event.target;
    const position = target.scrollTop;
    const height = target.scrollHeight - target.offsetHeight;
    const current = Date.now() / 1000;

    if(height - position > 1 || current - lastUpdate < 1)
      return;

    setLastUpdate(current);
    populateAiredAnime();
  };

  return (
    <div className="body-container show-tab" onScroll={handleScroll}>
      <div className="main-container">
        <main>
          {/* <Slideshow listAnimeData={todayAnime} maxAmount={todayAnime.length}/>
          <AnimeSection
            title="Today's Schedule"
            animeData={todayAnime}
          /> */}
          <Heading text="Recently Aired" />
          <div className="entries-container">
            {!airedAnime ? (
              <div className="activity-indicator">
                <Dots />
              </div>
            ) : (
              airedAnime.map((value, index) => (
                <AnimeEntry key={index} listAnimeData={value} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}


export default Tab5;
