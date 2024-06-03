/* 
    Some anime are difficult to pull automatically, so the 
    correct titles for those (I hope rare) exceptions are written here.

    "AnimeId": { title: '`AnimeCustomTitle`', index: 0 } // problem faced

    where title is the anime title and index the element to take
*/

type AnimeCustomTitles = {
  [languageCode: string]: {
    [animeId: string]: {
      title: string;
      index: number;
    };
  };
};

export const animeCustomTitles: AnimeCustomTitles = {
  US: {
    '113415': { title: `Jujutsu Kaisen Tv`, index: 0 },
    '150672': { title: 'Oshi No Ko', index: 0 },
    '11061': { title: `Hunter X Hunter 2011`, index: 0 },
    '43': { title: `Ghost in the Shell`, index: 0 },
    '235': { title: `Detective Conan Remastered`, index: 0 },
    '1482': { title: `D.Gray-man (2006)`, index: 0 },
    '132052': { title: 'Kakkou no Iinazuke', index: 1 },
  },
  IT: {
    '11061': { title: `Hunter X Hunter (2011)`, index: 1 },
    '16498': {
      title: ` Shingeki no Kyojin
    `,
      index: 1,
    },
  },
};
