import './styles/UserModal.css';

import ReactDOM from 'react-dom';
import { ModalPage, ModalPageShadow, ModalPageSizeableContent } from './Modal';
import { ButtonMain } from '../Buttons';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { ipcRenderer } from 'electron';
import { useRef } from 'react';

const modalsRoot = document.getElementById('modals-root');

const UserModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  return ReactDOM.createPortal(
    <>
      <ModalPageShadow show={show} />
      <ModalPage show={show} modalRef={modalRef} closeModal={onClose}>
        <ModalPageSizeableContent
          width={300}
          closeModal={onClose}
          title="Log Out"
        >
          Are you sure you want to log out?
          <div className="user-modal-content">
            <div className="log-out-wrapper">
              <ButtonMain
                text={'Log out'}
                tint="primary"
                icon={faRightToBracket}
                onClick={() => {
                  ipcRenderer.send('logout');
                }}
              />
            </div>
          </div>
        </ModalPageSizeableContent>
      </ModalPage>
    </>,
    modalsRoot!,
  );
};

export default UserModal;
