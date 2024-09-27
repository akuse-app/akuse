import './styles/Heading.css'

interface HeadingProps {
  text: string;
  children?: React.ReactNode;
}

const Heading:React.FC<HeadingProps> = ({ text, children }) => {
  return (
    <h1 className='heading'>{text}{children}</h1>
  )
}

export default Heading
