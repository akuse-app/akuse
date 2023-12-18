/* 
    Some anime are difficult to pull automatically, so the 
    correct titles for those (I hope rare) exceptions are written here.

    "AnimeId": `AnimeCustomTitle` // problem faced
*/

module.exports = {
    "US": {
        "113415": `Jujutsu Kaisen Tv`, // pulled Jujutsu Kaisen 0 movie
        "150672": `"Oshi No Ko"`, // pulled a total different show
        "11061": `Hunter X Hunter 2011`, // pulled dubbed version
        "43": `Ghost in the Shell` // anilist romaji title is wrong
    },
    "IT": {
        "162670": `Dr. Stone 3 Part 2`, 
        "21778": `Così parlò Kishibe Rohan`, // italian title does not exist in anilist
        "104578": `L'attacco dei Giganti 3 Parte 2` // in anilist the italian title is mispelled (L'Attaco...)
    }
}