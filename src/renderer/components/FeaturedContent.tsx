
import { useContext, useEffect, useState } from "react";
import { getTrendingAnime } from "../../modules/anilist/anilistApi";
import { AuthContext, ViewerIdContext } from "../App";
import { TrendingAnime } from "../../types/anilistAPITypes";
import { Media } from "../../types/anilistGraphQLTypes";

interface FeaturedItemProps {
  media: Media
}

const FeaturedItem: React.FC<FeaturedItemProps> = ({ media }) => {
  return (
    <h1>{media.title?.english}</h1>
  )
}

const FeaturedContent = () => {
  const viewerId = useContext(ViewerIdContext);
  const logged = useContext(AuthContext)

  const [trendingAnime, setTrendingAnime] = useState<TrendingAnime>()

  const fun = async () => {
    // setTrendingAnime(await getTrendingAnime(viewerId))
  }

  useEffect(() => {
    fun()
  }, [])

  return (
    <>
      <h1>Popular Now</h1>
      <div className="featured-scroller">
        <div className="featured-scroller-wrapper">
          {trendingAnime?.media?.map((media, index) => (
            <FeaturedItem key={index} media={media}/>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeaturedContent;
