import './styles/UserModal.css';

import ReactDOM from 'react-dom';
import { ModalPage, ModalPageShadow, ModalPageSizeableContent } from './Modal';
import { ButtonMain } from '../Buttons';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { ipcRenderer } from 'electron';
import { useEffect, useRef, useState } from 'react';
import SocketService from '../../../constants/socketserver';

const modalsRoot = document.getElementById('modals-root');

const WatchPartyModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [socketService, setSocketService] = useState<SocketService | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [createDisabled, setCreateDisabled] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>(""); // Initialize with an empty string
  const [joinStatus, setJoinStatus] = useState<string | null>(null); // Track join status
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null); // Track join error message

  useEffect(() => {
    setSocketService(SocketService.getInstance("http://localhost:3000"));
  }, []);

  const handleCreateParty = () => {
    if(socketService){
      socketService.emit("generateRoomCode");
      socketService.on("roomCodeGenerated", (roomCode: string) => {
        setCode(roomCode);
        navigator.clipboard.writeText(roomCode);
        setCreateDisabled(true);
      });
    }
  };

  const handleJoinParty = () => {
    if(socketService){
      socketService.emit("joinRoom", joinCode);
      socketService.on("roomJoined", () => {
        setJoinStatus("Room joined successfully.");
        setJoinErrorMessage(null); // Clear any previous error message
        console.log("Room joined");
      });
      socketService.on("roomJoinFailed", () => {
        setJoinStatus(null); // Clear previous join status
        setJoinErrorMessage("Room join failed or room does not exist.");
        console.log("Room join failed or room does not exist.");
      });
    }
  };

  return ReactDOM.createPortal(
    <>
      <ModalPageShadow show={show} />
      <ModalPage show={show} modalRef={modalRef} closeModal={onClose}>
        <ModalPageSizeableContent
          width={300}
          closeModal={onClose}
          title="Watch Party"
        >
          Press "Create" to create a party.
          <div className="user-modal-content">
            <div className="watch-party-wrapper">
                <div className="watch-party-create">
                    <input 
                        type="text"
                        className="watch-party-input-disabled"
                        value={code != null ? `${code} (copied to clipboard)` : "No party created."}
                        disabled={true}
                        />
                    <button onClick={handleCreateParty} disabled={createDisabled}>Create</button>
                </div>
                Input a code and press "Join".
                <div className="watch-party-join">
                    <input 
                        type="text"
                        className="watch-party-input"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        />
                    <button onClick={handleJoinParty}>Join</button>
                    {joinStatus && <p className="join-status">{joinStatus}</p>}
                    {joinErrorMessage && <p className="join-error">{joinErrorMessage}</p>}
                </div>
            </div>
          </div>
        </ModalPageSizeableContent>
      </ModalPage>
    </>,
    modalsRoot!,
  );
};

export default WatchPartyModal;
