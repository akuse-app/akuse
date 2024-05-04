import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface ModalPageProps {
  show: boolean;
  children: React.ReactNode;
}

export const ModalPage: React.FC<ModalPageProps> = ({ show, children }) => {
  const [animation, setAnimation] = useState<boolean>(show)
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimation(true)
    } else {
      setAnimation(false)
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [show]);

  return (
    <div
      className={`modal-page-wrapper fade-in ${animation ? 'show-page' : 'hide-page'}`}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      {children}
    </div>
  );
};

interface ModalPageShadowProps {
  show: boolean;
}

export const ModalPageShadow: React.FC<ModalPageShadowProps> = ({ show }) => {
  const [animation, setAnimation] = useState<boolean>(show)
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimation(true)
    } else {
      setAnimation(false)
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [show]);

  return (
    <div
      className={`modal-page-shadow-background ${animation ? 'show-page' : 'hide-page'}-shadow-background`}
      style={{ display: isVisible ? 'flex' : 'none' }}
    />
  );
};
