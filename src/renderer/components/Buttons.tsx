import './styles/Buttons.css';
import 'react-activity/dist/Dots.css';

import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dots from 'react-activity/dist/Dots';

interface ButtonProps {
  tint?: 'primary' | 'light' | 'dark';
  onPress?: () => void;
  shadow?: boolean;
}

interface ButtonMainProps extends ButtonProps {
  text: string | number;
  icon?: IconDefinition;
}

export const ButtonLoading = () => {
  return (
    <button className="bm light disabled">
      <Dots />
    </button>
  );
};

export const ButtonMain: React.FC<ButtonMainProps> = ({
  text,
  icon = null,
  tint = 'primary',
  onPress,
  shadow = false,
}) => {
  return (
    <button className={`bm primary ${tint} ${shadow ? 'shadow' : ''}`} onClick={onPress}>
      {icon && (
        <FontAwesomeIcon className="i" icon={icon} style={{ marginRight: 8 }} />
      )}
      {text}
    </button>
  );
};

interface ButtonCircleProps extends ButtonProps {
  icon: IconDefinition;
}

export const ButtonCircle: React.FC<ButtonCircleProps> = ({
  icon,
  tint = 'primary',
  onPress,
  shadow = false,
}) => {
  return (
    <button className={`bc ${tint} ${shadow ? 'shadow' : ''}`} onClick={onPress}>
      <FontAwesomeIcon className="i" icon={icon} />
    </button>
  );
};
