import './styles/AutoUpdateModal.css';

import ReactDOM from 'react-dom';
import { ModalPage, ModalPageShadow, ModalPageSizeableContent } from './Modal';
import { useRef, useState } from 'react';
import { ButtonMain } from '../Buttons';
import {
  faCloudDownload,
} from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import { ipcRenderer } from 'electron';

const modalsRoot = document.getElementById('modals-root');

const AutoUpdateModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [version, setVersion] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [progressMB, setProgressMB] = useState<string>('');
  const [totalMB, setTotalMB] = useState<string>('');
  const [downloadedBarWidth, setDownloadedBarWidth] = useState<string>('0%');

  ipcRenderer.on('update-available-info', async (event, info) => {
    setVersion(info.version);
    setNotes(info.releaseNotes);
  });

  ipcRenderer.on('downloading', async (event, info) => {
    setProgressMB(((info.percent * info.total) / 100 / 1024 / 1024).toFixed(2));
    setTotalMB((info.total / 1024 / 1024).toFixed(2));
    setDownloadedBarWidth(`"${info.percent}%"`);
  });

  return ReactDOM.createPortal(
    <>
      <ModalPageShadow show={show} />
      <ModalPage show={show} modalRef={modalRef} closeModal={onClose}>
        <ModalPageSizeableContent
          width={350}
          closeModal={onClose}
          title="New update available"
        >
          <div className="auto-update-modal-content">
            <div className="heading">
              <span className="version">v{version}</span>
              {/* <span className="date">2024-6-20</span> */}
            </div>

            <p>
              A new version of akuse is available. Update and wait for it to
              finish to download the latest changes.
            </p>

            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(notes),
              }}
            />

            <div className="mb">
              <span>
                {progressMB} / {totalMB} MB
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="downloaded"
                style={{ width: downloadedBarWidth }}
              />
            </div>

            <div className="download-wrapper">
              <ButtonMain
                text={'Download'}
                tint="primary"
                icon={faCloudDownload}
                onClick={() => {
                  ipcRenderer.send('download-update');
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

export default AutoUpdateModal;
