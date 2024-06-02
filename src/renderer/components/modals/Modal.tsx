import './styles/Modal.css'

import { useEffect, useState } from 'react';
import { Property } from 'csstype';
export const ModalPage: React.FC<{
  show: boolean;
  children: React.ReactNode;
}> = ({ show, children }) => {
  const [animation, setAnimation] = useState<boolean>(show);
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimation(true);
    } else {
      setAnimation(false);
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

export const ModalPageShadow: React.FC<{
  show: boolean;
}> = ({ show }) => {
  const [animation, setAnimation] = useState<boolean>(show);
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimation(true);
    } else {
      setAnimation(false);
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

export const ModalPageSizeableContent: React.FC<{
  width: Property.Width<string | number>;
  height: Property.Height<string | number>;
}> = ({ width, height }) => {
  return (
    <div
      className="sizeable-content"
      style={{ width: width, height: height }}
    ></div>
  );
};
