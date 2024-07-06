import './styles/DonateModal.css';

import ReactDOM from 'react-dom';
import { ModalPage, ModalPageShadow, ModalPageSizeableContent } from './Modal';
import { useRef, useState } from 'react';
import { ButtonMain } from '../Buttons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import { ipcRenderer } from 'electron';

const modalsRoot = document.getElementById('modals-root');

const DonateModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  return ReactDOM.createPortal(
    <>
      <ModalPageShadow show={show} />
      <ModalPage show={show} modalRef={modalRef} closeModal={onClose}>
        <ModalPageSizeableContent
          width={350}
          closeModal={onClose}
          title="Support this app!"
        >
          <div className="donate-modal-content">
            <p>
              Every contribution is most welcome and supports the development
              and maintenance of this project.
            </p>
            <div className="donate-wrapper">
              <ButtonMain
                text={'Donate'}
                tint="primary"
                icon={faHeart}
                onClick={() => {
                  ipcRenderer.send('open-sponsor-url');
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

export default DonateModal;
