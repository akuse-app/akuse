import {
  faDisplay,
  faFilter,
  faHeading,
  faLeaf,
  faMasksTheater,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Tab3 = () => {
  return (
    <div className="main-container">
      <main className='search'>
        <div className="filters-container">
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faHeading} />
              Title
            </h2>
            <input
              type="text"
              id="search-page-filter-title"
              placeholder="Search..."
            />
          </div>
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faMasksTheater} />
              Genre
            </h2>
            <select name="" id="search-page-filter-genre">
              <option value="" selected>
                Any
              </option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Ecchi">Ecchi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Mahou Shoujo">Mahou Shoujo</option>
              <option value="Mecha">Mecha</option>
              <option value="Music">Music</option>
              <option value="Mistery">Mistery</option>
              <option value="Psychological">Psychological</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Slice of Life">Slice of Life</option>
              <option value="Sports">Sports</option>
              <option value="Supernatural">Supernatural</option>
              <option value="Thriller">Thriller</option>
            </select>
          </div>
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faLeaf} />
              Season
            </h2>
            <div className="filter-divisor">
              <select name="" id="search-page-filter-season">
                <option value="" selected>
                  Any
                </option>
                <option value="WINTER">Winter</option>
                <option value="SPRING">Spring</option>
                <option value="SUMMER">Summer</option>
                <option value="FALL">Fall</option>
              </select>
              <input
                type="number"
                id="search-page-filter-year"
                placeholder="Year"
              />
            </div>
          </div>
          <div className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faDisplay} />
              Format
            </h2>
            <select name="" id="search-page-filter-format">
              <option value="" selected>
                Any
              </option>
              <option value="TV">TV Show</option>
              <option value="TV_SHORT">TV Short</option>
              <option value="MOVIE">Movie</option>
              <option value="SPECIAL">Special</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="MUSIC">Music</option>
            </select>
          </div>
          <div style={{ marginRight: 45 }} className="filter">
            <h2>
              <FontAwesomeIcon className="i" icon={faFilter} />
              Sort
            </h2>
            <select name="" id="search-page-filter-sort">
              <option value="" selected>
                Any
              </option>
              <option value="START_DATE_DESC">Release Date</option>
              <option value="SCORE_DESC">Score</option>
              <option value="POPULARITY_DESC">Popularity</option>
              <option value="TRENDING_DESC">Trending</option>
            </select>
          </div>
          <button id="search-clear">
            <FontAwesomeIcon className="i" icon={faTrashCan} />
          </button>
        </div>
        {/* <div className="search-buttons-container">
          <button id="search-submit">Search</button>
        </div> */}
        <div className="entries-container"></div>
      </main>
    </div>
  );
};

export default Tab3;
