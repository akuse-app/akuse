import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import '../../styles/components.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Button1Props {
  text: string,
  icon?: IconDefinition
  onPress: () => void
}

export const Button1: React.FC<Button1Props> = ({ text, icon = null, onPress }) => {
  return (
    <button className="b1" onClick={onPress}>
      {icon && <FontAwesomeIcon className="i" icon={icon} style={{ marginRight: 8 }}/>}
      {text}
    </button>
  )
}
