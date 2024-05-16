import 'react-activity/dist/Dots.css';

import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dots from 'react-activity/dist/Dots';

interface ButtonMainProps {
  text: string | number;
  icon?: IconDefinition;
  tint?: 'primary' | 'light' | 'dark';
  onPress?: () => void;
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
}) => {
  return (
    <button className={`bm primary ${tint}`} onClick={onPress}>
      {icon && (
        <FontAwesomeIcon className="i" icon={icon} style={{ marginRight: 8 }} />
      )}
      {text}
    </button>
  );
};

interface ButtonCircleProps {
  icon: IconDefinition;
  classes?: string;
  tint?: 'primary' | 'light' | 'dark';
  onPress?: () => void;
}

export const ButtonCircle: React.FC<ButtonCircleProps> = ({
  icon,
  tint = 'primary',
  onPress,
}) => {
  return (
    <button className={`bc ${tint}`} onClick={onPress}>
      <FontAwesomeIcon className="i" icon={icon} />
    </button>
  );
};
