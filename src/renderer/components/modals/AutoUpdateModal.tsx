import ReactDOM from 'react-dom';
import { ModalPage, ModalPageShadow } from './Modal';

const modalsRoot = document.getElementById('modals-root');

const AutoUpdateModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  return ReactDOM.createPortal(
    <>
      <ModalPageShadow show={show} />
      <ModalPage show={show}>
        <></>
      </ModalPage>
    </>,
    modalsRoot!,
  );
};

export default AutoUpdateModal;
