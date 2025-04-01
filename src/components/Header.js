'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg w-full sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-white">
          AI Blog Generator
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/generate" className="text-white hover:text-gray-200 transition">Generate</Link>
          <Link href="/about" className="text-white hover:text-gray-200 transition">About</Link>
          <Link href="/contact" className="text-white hover:text-gray-200 transition">Contact</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 shadow-lg">
          <Link href="/generate" className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition">Generate</Link>
          <Link href="/about" className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition">About</Link>
          <Link href="/contact" className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition">Contact</Link>
        </div>
      )}
    </header>
  );
}
