import './styles/MainNavbar.css';

import {
  faBookmark,
  faCompass,
  IconDefinition,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBookmark as faBookmarkFull,
  faBug,
  faCompass as faCompassFull,
  faGear,
  faHeart as faHeartFull,
  faMagnifyingGlass,
  faMagnifyingGlassPlus,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from './App';

const Li: React.FC<{
  text: string;
  icon: IconDefinition;
  to: string;
  active: boolean;
  onClick: () => void;
}> = ({ text, icon, to, active, onClick }) => {
  return (
    <Link to={to} className={active ? 'active' : ''} onClick={onClick}>
      <li className={active ? 'active' : ''} data-title={text}>
        <div className="i-wrapper">
          <FontAwesomeIcon className="i" icon={icon} />
        </div>
        <span>{text}</span>
      </li>
    </Link>
  );
};

const LiLink: React.FC<{
  text: string;
  icon: IconDefinition;
  onClick: () => void;
}> = ({ text, icon, onClick }) => {
  return (
    <li data-title={text} onClick={onClick}>
      <div className="i-wrapper">
        <FontAwesomeIcon className="i" icon={icon} />
      </div>
      <span>{text}</span>
    </li>
  );
};

const MainNavbar: React.FC<{ avatar?: string }> = ({ avatar }) => {
  const [activeTab, setActiveTab] = useState(1);
  const logged = useContext(AuthContext);

  return (
    <nav className="main">
      <ul>
        <Li
          text="Discover"
          icon={activeTab === 1 ? faCompassFull : faCompass}
          to="/"
          active={activeTab === 1}
          onClick={() => setActiveTab(1)}
        />
        {logged && (
          <Li
            text="Library"
            icon={activeTab === 2 ? faBookmarkFull : faBookmark}
            to="/tab2"
            active={activeTab === 2}
            onClick={() => setActiveTab(2)}
          />
        )}
        <Li
          text="Search"
          icon={activeTab === 3 ? faMagnifyingGlassPlus : faMagnifyingGlass}
          to="/tab3"
          active={activeTab === 3}
          onClick={() => setActiveTab(3)}
        />
        <Li
          text="Settings"
          icon={faGear}
          to="/tab4"
          active={activeTab === 4}
          onClick={() => setActiveTab(4)}
        />
        {logged ? (
          <div
            className="i-wrapper"
            onClick={() => {
              ipcRenderer.send('logout');
            }}
          >
            <img src={avatar}></img>
          </div>
        ) : (
          <LiLink
            text="Settings"
            icon={faRightToBracket}
            onClick={() => {
              ipcRenderer.send('open-login-url');
            }}
          />
        )}
      </ul>
    </nav>
  );
};

export default MainNavbar;
