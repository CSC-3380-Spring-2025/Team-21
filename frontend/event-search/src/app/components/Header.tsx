import Link from "next/link";

export default function Header() {
  return (
    <header className="py-6 px-4 shadow ">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Event Search
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link
            href={"/login"}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            href={"/about"}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
