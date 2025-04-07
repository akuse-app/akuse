export const GENRES = [
  { value: "", label: "Any" },
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Comedy", label: "Comedy" },
  { value: "Drama", label: "Drama" },
  { value: "Ecchi", label: "Ecchi" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Horror", label: "Horror" },
  { value: "Mahou Shoujo", label: "Mahou Shoujo" },
  { value: "Mecha", label: "Mecha" },
  { value: "Music", label: "Music" },
  { value: "Mystery", label: "Mystery" },
  { value: "Psychological", label: "Psychological" },
  { value: "Romance", label: "Romance" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Slice of Life", label: "Slice of Life" },
  { value: "Sports", label: "Sports" },
  { value: "Supernatural", label: "Supernatural" },
  { value: "Thriller", label: "Thriller" },
];

export const SEASONS = [
  { value: "", label: "Any" },
  { value: "WINTER", label: "Winter" },
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
];

export const FORMATS = [
  { value: "", label: "Any" },
  { value: "TV", label: "TV Show" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "MOVIE", label: "Movie" },
  { value: "SPECIAL", label: "Special" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "MUSIC", label: "Music" },
];

export const SORTS = [
  { value: "", label: "Any" },
  { value: "START_DATE_DESC", label: "Release Date" },
  { value: "SCORE_DESC", label: "Score" },
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "TRENDING_DESC", label: "Trending" },
];

export const MediaTypes = {
  Anime: 'ANIME',
  Manga: 'MANGA',
};

export const RelationTypes = {
  Source: 'SOURCE',
  Alternative: 'ALTERNATIVE',
  Other: 'OTHER',
  Prequel: 'PREQUEL',
  Sequel: 'SEQUEL',
  Character: 'CHARACTER',
  SideStory: 'SIDE_STORY',
  Parent: 'PARENT',
  Adaptation: 'ADAPTATION',
  SpinOff: 'SPIN_OFF',
  Compilation: 'COMPILATION',
  Contains: 'CONTAINS',
};

export const PAGES: number = 100;
export const METHOD: string = "POST";
export const GRAPH_QL_URL: string = "https://graphql.anilist.co";
export const RECOMMEND_DATA: string = `
        recommendations(sort:RATING_DESC) {
          nodes {
            id
            rating
            mediaRecommendation {
              id
              idMal
              type
              title {
                  romaji
                  english
                  native
                  userPreferred
              }
              format
              status
              description
              startDate {
                  year
                  month
                  day
              }
              endDate {
                  year
                  month
                  day
              }
              season
              seasonYear
              episodes
              duration
              coverImage {
                  large
                  extraLarge
                  color
              }
              bannerImage
              genres
              synonyms
              averageScore
              meanScore
              popularity
              favourites
              isAdult
              nextAiringEpisode {
                  id
                  timeUntilAiring
                  episode
                  airingAt
              }
              mediaListEntry {
                  id
                  mediaId
                  status
                  score(format:POINT_10)
                  progress
              }
              siteUrl
              trailer {
                  id
                  site
                  thumbnail
              }
            }
          }
        }`;

export const MEDIA_DATA: string = `
        id
        idMal
        type
        title {
            romaji
            english
            native
            userPreferred
        }
        format
        status
        description
        startDate {
            year
            month
            day
        }
        endDate {
            year
            month
            day
        }
        season
        seasonYear
        episodes
        duration
        coverImage {
            large
            extraLarge
            color
        }
        bannerImage
        genres
        synonyms
        averageScore
        meanScore
        popularity
        favourites
        isAdult
        nextAiringEpisode {
            id
            timeUntilAiring
            episode
            airingAt
        }
        airingSchedule {
          edges {
            node {
              episode
            }
          }
        }
        mediaListEntry {
            id
            mediaId
            status
            score(format:POINT_10)
            progress
        }
        siteUrl
        trailer {
            id
            site
            thumbnail
        }
        relations {
          edges {
            id
            relationType(version: 2)
            node {
              id
              idMal
              type
              title {
                  romaji
                  english
                  native
                  userPreferred
              }
              format
              status
              description
              startDate {
                  year
                  month
                  day
              }
              endDate {
                  year
                  month
                  day
              }
              season
              seasonYear
              episodes
              duration
              coverImage {
                  large
                  extraLarge
                  color
              }
              bannerImage
              genres
              synonyms
              averageScore
              meanScore
              popularity
              favourites
              isAdult
              nextAiringEpisode {
                  id
                  timeUntilAiring
                  episode
              }
              airingSchedule {
                edges {
                  node {
                    episode
                  }
                }
              }
              mediaListEntry {
                  id
                  mediaId
                  status
                  score(format:POINT_10)
                  progress
              }
              siteUrl
              trailer {
                  id
                  site
                  thumbnail
              }
            }
          }
        }
        ${RECOMMEND_DATA}
    `;