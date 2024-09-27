import { useEffect, useRef, useState } from "react";
import Heading from "../components/Heading";
import { ListAnimeData } from "../../types/anilistAPITypes";
import { getAiredAnime } from "../../modules/anilist/anilistApi";
import { airingDataToListAnimeData } from "../../modules/utils";
import { Dots } from "react-activity";
import AnimeEntry from "../components/AnimeEntry";
import Store from "electron-store";

interface Tab5Props {
  viewerId: number | null;
}

const store = new Store();

const Tab5: React.FC<Tab5Props> = ({ viewerId }) => {
  const pageRef = useRef<number>(1);

  // anime constants
  // const [weekAnime, setWeekAnime] = useState<Option[]>();
  const [airedAnime, setAiredAnime] = useState<ListAnimeData[]>([]);

  // search constants
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [searchTime, setSearchTime] = useState<number>(Date.now() / 1000);
  const [hasPopulated, setHasPopulated] = useState<boolean>(false);

  // time constants
  const timeOffset = 86400;

  //other
  const [adultContent, setAdultContent] = useState<boolean>(
    store.get('adult_content') as boolean
  );

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

  // const getDayName = (date: Date, locale: string) =>
  //   date.toLocaleDateString(locale, { weekday: 'long' });

  const fetchData = async () => {
    // if(weekAnime) return;
    // const weekSchedule: Option[] = [];

    // for(let i = 1; i < 8; i++) {
    //   const endOfDay = new Date();
    //   endOfDay.setHours(24 * i, 0, 0, -1);
    //   const dayName = getDayName(endOfDay, 'en-US');
    //   weekSchedule.push({
    //     label: dayName,
    //     value: airingDataToListAnimeData(
    //       (await getAiredAnime(viewerId, 60, 86400, Math.floor(endOfDay.getTime() / 1000))).airingSchedules
    //     )
    //   })
    // }
    // setWeekAnime(weekSchedule);
  };

  const handleScroll = async (event: any) => {
    const target: HTMLDivElement = event.target;
    const position = target.scrollTop;
    const height = target.scrollHeight - target.offsetHeight;
    const current = Date.now() / 1000;

    if(Math.floor(height - position) > 1 || current - lastUpdate < 1)
      return;

    setLastUpdate(current);
    populateAiredAnime();
  };

  const handleAdultContent = () => {
    store.set('adult_content', !adultContent);
    setAdultContent(!adultContent);
  };


  return (
    <div className="body-container show-tab" onScroll={handleScroll}>
      <div className="main-container lifted schedule-page">
        <main>
          {/* <Slideshow listAnimeData={todayAnime} maxAmount={todayAnime.length}/>
          <AnimeSection
            title="Today's Schedule"
            animeData={todayAnime}
          /> */}
          {/* <h1>Week Schedule</h1>
          {weekAnime && weekAnime.length > 0 && <AnimeSections
            id={'week'}
            selectedLabel={getDayName(new Date(), 'en-US')}
            options={weekAnime}
          />} */}
          <Heading text="Recently Aired"/>
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
