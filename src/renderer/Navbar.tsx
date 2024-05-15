import '../styles/style.css';

import { faBookmark, faCompass, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faBookmark as faBookmarkFull,
  faBug,
  faCompass as faCompassFull,
  faGear,
  faHeart as faHeartFull,
  faMagnifyingGlass,
  faMagnifyingGlassPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from './App';

interface NavUpperItemProps {
  text: string;
  icon: IconDefinition;
  to: string;
  active: boolean;
  onClick: () => void;
}

const NavUpperItem: React.FC<NavUpperItemProps> = ({
  text,
  icon,
  to,
  active,
  onClick,
}) => {
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

interface NavLowerItemProps {
  text: string;
  icon: IconDefinition;
  onClick: () => void;
  link?: boolean;
}

const NavLowerItem: React.FC<NavLowerItemProps> = ({
  text,
  icon,
  onClick,
  link = false,
}) => {
  return (
    <li
      data-title={text}
      onClick={onClick}
      style={{ cursor: link ? 'default' : 'pointer' }}
    >
      <div className="i-wrapper">
        <FontAwesomeIcon className="i" icon={icon} />
      </div>
      <span>{text}</span>
    </li>
  );
};

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(1);
  const logged = useContext(AuthContext);

  return (
    <aside id="nav-main">
      <ul className="upper">
        <NavUpperItem
          text="Discover"
          icon={activeTab === 1 ? faCompassFull : faCompass}
          to="/"
          active={activeTab === 1}
          onClick={() => setActiveTab(1)}
        />
        {logged && (
          <NavUpperItem
            text="Library"
            icon={activeTab === 2 ? faBookmarkFull : faBookmark}
            to="/tab2"
            active={activeTab === 2}
            onClick={() => setActiveTab(2)}
          />
        )}
        <NavUpperItem
          text="Search"
          icon={activeTab === 3 ? faMagnifyingGlassPlus : faMagnifyingGlass}
          to="/tab3"
          active={activeTab === 3}
          onClick={() => setActiveTab(3)}
        />
      </ul>
      <ul className="mid">
        <div className="separe"></div>
        <NavUpperItem
          text="Settings"
          icon={faGear}
          to="/tab4"
          active={activeTab === 4}
          onClick={() => setActiveTab(4)}
        />
      </ul>
      <ul className="lower">
        <NavLowerItem
          text="Sponsor"
          icon={faHeartFull}
          onClick={() => {ipcRenderer.send('open-sponsor-url')}}
          link
        />
        <NavLowerItem
          text="Report a bug"
          icon={faBug}
          onClick={() => {ipcRenderer.send('open-issues-url')}}
          link
        />
      </ul>
      {/* <ul className="lower">
      <li id="user-dropdown-bug-report" data-title="Report a bug">
        <div className="i-wrapper ">
          <i className="fa-solid fa-bug"></i>
        </div>
        <span>Report a bug</span>
      </li>
      <li id="user-dropdown-settings" data-title="Settings">
        <div className="i-wrapper">
          <i className="fa-solid fa-gear"></i>
        </div>
        <span>Settings</span>
      </li>
      <li id="nav-login" data-title="Log-In">
        <div className="i-wrapper">
          <i id="login-icon" className="fa-solid fa-right-to-bracket"></i>
        </div>
        <span>Log-In</span>
      </li>
      <li id="nav-user" data-title="Log-Out">
        <div className="i-wrapper nav-user">
          <img id="user-icon" src="" alt="user-icon" />
        </div>
        <span>Log-Out</span>
      </li>
    </ul> */}
    </aside>
  );
};

export default Navbar;
