import './styles/AuthCodeModal.css';

import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { ipcRenderer } from 'electron';
import { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { ButtonMain } from '../Buttons';
import { ModalPage, ModalPageShadow, ModalPageSizeableContent } from './Modal';

const modalsRoot = document.getElementById('modals-root');

const AuthCodeModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = useState('');

  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  return ReactDOM.createPortal(
    <>
      <ModalPageShadow show={show} />
      <ModalPage show={show} modalRef={modalRef} closeModal={onClose}>
        <ModalPageSizeableContent
          width={400}
          closeModal={onClose}
          title="Insert authentication code"
        >
          <div className="auth-code-modal-content">
            Whether you're using an AppImage or you're in a Development
            environment, paste here your authentication code to log-in.
            <input
              type="text"
              id="search-page-filter-title"
              placeholder="Authorization Code.."
              value={code}
              onChange={handleCodeChange}
            />
          </div>
          <div className="log-in-wrapper">
            <ButtonMain
              text={'Log-in'}
              tint="light"
              icon={faRightToBracket}
              onClick={() => {
                ipcRenderer.send('handle-login', code);
              }}
            />
          </div>
        </ModalPageSizeableContent>
      </ModalPage>
    </>,
    modalsRoot!,
  );
};

export default AuthCodeModal;
