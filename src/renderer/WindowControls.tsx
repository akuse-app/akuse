import { IconDefinition, faSquare } from '@fortawesome/free-regular-svg-icons';
import './styles/WindowControls.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron';
import { faExpand, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';

const Element: React.FC<{
  icon: IconDefinition;
  ipcChannel: string;
  warning?: boolean;
  size?: `${string}rem`;
}> = ({ icon, ipcChannel, warning, size }) => {
  const handleElementClick = () => {
    ipcRenderer.send(ipcChannel);
  };

  return (
    <div
      className={`element${warning ? ' warning' : ''}`}
      style={{ fontSize: size ? size : '0.9rem' }}
      onClick={handleElementClick}
    >
      <FontAwesomeIcon className="i" icon={icon} />
    </div>
  );
};

const WindowControls = () => {
  return (
    <div className="controls">
      <div className="drag" />
      <div className="elements">
        <Element icon={faMinus} ipcChannel="minimize-window" />
        <Element icon={faSquare} ipcChannel="toggle-maximize-window" />
        <Element icon={faTimes} ipcChannel="close-window" warning size="1.1rem" />
      </div>
    </div>
  );
};

export default WindowControls;
