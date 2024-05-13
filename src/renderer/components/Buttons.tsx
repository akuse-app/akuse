import 'react-activity/dist/Dots.css';

import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dots from 'react-activity/dist/Dots';

interface ButtonProps {
  text: string;
  icon?: IconDefinition;
  onPress: () => void;
}

export const ButtonLoading = () => {
  return (
    <button className="b1 light disabled">
      <Dots />
    </button>
  );
};

export const Button1: React.FC<ButtonProps> = ({
  text,
  icon = null,
  onPress,
}) => {
  return (
    <button className="b1 primary" onClick={onPress}>
      {icon && (
        <FontAwesomeIcon className="i" icon={icon} style={{ marginRight: 8 }} />
      )}
      {text}
    </button>
  );
};

export const Button2: React.FC<ButtonProps> = ({
  text,
  icon = null,
  onPress,
}) => {
  return (
    <button className="b1 light" onClick={onPress}>
      {icon && (
        <FontAwesomeIcon className="i" icon={icon} style={{ marginRight: 8 }} />
      )}
      {text}
    </button>
  );
};

interface CircleButtonProps {
  icon: IconDefinition;
  classes?: string;
  onPress: () => void;
}

export const CircleButton1: React.FC<CircleButtonProps> = ({
  icon,
  classes = '',
  onPress,
}) => {
  return (
    <button className={`circle-button-0 ${classes}`} onClick={onPress}>
      <FontAwesomeIcon className="i" icon={icon} />
    </button>
  );
};
