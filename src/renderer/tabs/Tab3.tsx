import {
  faDisplay,
  faFilter,
  faHeading,
  faLeaf,
  faMasksTheater,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';

import { FORMATS, GENRES, SEASONS, SORTS } from '../../constants/anilist';
import { searchFilteredAnime } from '../../modules/anilist/anilistApi';
import { animeDataToListAnimeData } from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import { ViewerIdContext } from '../App';
import AnimeEntry from '../components/AnimeEntry';

import Dots from 'react-activity/dist/Dots';
import 'react-activity/dist/Dots.css';

const Tab3 = () => {
  const viewerId = useContext(ViewerIdContext);

  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  const [searchedAnime, setSearchedAnime] = useState<
    ListAnimeData[] | undefined
  >([]);

  const handleTitleChange = (event: any) => {
    setSelectedTitle(event.target.value);
  };

  const handleGenreChange = (event: any) => {
    setSelectedGenre(event.target.value);
  };

  const handleSeasonChange = (event: any) => {
    setSelectedSeason(event.target.value);
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value);
  };

  const handleFormatChange = (event: any) => {
    setSelectedFormat(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSelectedSort(event.target.value);
  };

  const handleClearClick = () => {
    setSelectedTitle('');
    setSelectedGenre('');
    setSelectedSeason('');
    setSelectedYear('');
    setSelectedFormat('');
    setSelectedSort('');
  };

  const handleSearchClick = async () => {
    setSearchedAnime(undefined);

    let title = '';
    let genre = '';
    let season = '';
    let year = '';
    let format = '';
    let sort = '';

    let args = [
      selectedTitle !== ''
        ? (title = `search: "${selectedTitle}"`)
        : (title = ''),
      selectedGenre !== ''
        ? (genre = `genre: "${selectedGenre}"`)
        : (genre = ''),
      selectedSeason !== ''
        ? (season = `season: ${selectedSeason}`)
        : (season = ''),
      selectedYear !== ''
        ? (year = `seasonYear: ${selectedYear}`)
        : (year = ''),
      selectedFormat !== ''
        ? (format = `format: ${selectedFormat}`)
        : (format = ''),
      selectedSort !== '' ? (sort = `sort: ${selectedSort}`) : (sort = ''),
    ].filter((item) => !(item == ''));

    const parsedArgs = args.concat('type: ANIME').join(', ');
    console.table(parsedArgs);
    const diocan = await searchFilteredAnime(parsedArgs, viewerId);
    console.log(diocan);
    setSearchedAnime(animeDataToListAnimeData(diocan));
  };

  return (
    <div className="main-container">
      <h1>Search</h1>
      <main className="search">
        <div className="filters-container">
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faHeading} /> Title
            </h2>
            <input
              type="text"
              id="search-page-filter-title"
              placeholder="Search..."
              value={selectedTitle}
              onChange={handleTitleChange}
            />
          </div>
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faMasksTheater} /> Genre
            </h2>
            <select
              id="search-page-filter-genre"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              {GENRES.map((genre) => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faLeaf} /> Season
            </h2>
            <div className="filter-divisor">
              <select
                id="search-page-filter-season"
                value={selectedSeason}
                onChange={handleSeasonChange}
              >
                {SEASONS.map((season) => (
                  <option key={season.value} value={season.value}>
                    {season.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                id="search-page-filter-year"
                placeholder="Year"
                value={selectedYear}
                onChange={handleYearChange}
              />
            </div>
          </div>
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faDisplay} /> Format
            </h2>
            <select
              id="search-page-filter-format"
              value={selectedFormat}
              onChange={handleFormatChange}
            >
              {FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faFilter} /> Sort
            </h2>
            <select
              id="search-page-filter-sort"
              value={selectedSort}
              onChange={handleSortChange}
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <button id="search-clear" onClick={handleClearClick}>
              Clear
            </button>
          </div>
          <div className="filter">
            <button id="search-submit" onClick={handleSearchClick}>
              Search
            </button>
          </div>
        </div>
        <div className="entries-container">
          {!searchedAnime ? (
            <div className="activity-indicator">
              <Dots />
            </div>
          ) : (
            searchedAnime?.map((value, index) => (
              <AnimeEntry key={index} listAnimeData={value} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Tab3;
