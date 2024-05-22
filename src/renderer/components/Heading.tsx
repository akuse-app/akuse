import './styles/Heading.css'

interface HeadingProps {
  text: string
}

const Heading:React.FC<HeadingProps> = ({ text }) => {
  return (
    <h1 className='heading'>{text}</h1>
  )
}

export default Heading
