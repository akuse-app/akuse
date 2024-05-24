/* 
    Some anime are difficult to pull automatically, so the 
    correct titles for those (I hope rare) exceptions are written here.

    "AnimeId": `AnimeCustomTitle` // problem faced
*/

type AnimeCustomTitles = {
  [languageCode: string]: {
    [animeId: string]: string;
  };
};

export const animeCustomTitles: AnimeCustomTitles = {
  US: {
    '113415': `Jujutsu Kaisen Tv`, // pulled Jujutsu Kaisen 0 movie
    '150672': `"Oshi No Ko"`, // pulled a total different show
    '11061': `Hunter X Hunter 2011`, // pulled dubbed version
    '43': `Ghost in the Shell`, // anilist romaji title is wrong
    '235': `Detective Conan Remastered`, // with this the remastered version is pulled before the default one
  },
  IT: {
  },
};
