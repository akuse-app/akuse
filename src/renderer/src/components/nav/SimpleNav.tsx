import { Link } from "wouter"

export default function Nav() {
  return (
    <nav className="p-4 border-b border-gray-300 space-x-4">
      <Link href="/" className="hover:underline">Home</Link>
      <Link href="/library" className="hover:underline">Library</Link>
    </nav>
  )
}
