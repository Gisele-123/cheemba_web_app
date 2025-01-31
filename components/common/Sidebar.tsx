'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import Logo from './Logo';
import { IoHomeSharp } from 'react-icons/io5';
import { IoStatsChart } from 'react-icons/io5';
import { RiDeleteBinFill } from 'react-icons/ri';
import { FaShop } from 'react-icons/fa6';
import { FaUserLarge } from 'react-icons/fa6';

const Sidebar = () => {
  const pathname = usePathname();

  const getActiveClass = (path: string) =>
    pathname === path
      ? 'bg-blue text-white'
      : 'text-muted-foreground hover:bg-blue/80 hover:text-white hover:transition-colors duration-200';

  return (
    <div className="hidden border-r bg-muted/40 md:block text-[#5D6679]">
      <div className="flex h-full max-h-screen flex-col gap-7 bg-white p-7 px-3">
        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-4">
          <Link href="/home" className="flex items-center gap-2 font-semibold">
            <Logo />
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid gap-3 items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/home"
              className={`flex items-center gap-3 rounded-[8px] px-3 py-[15px] ${getActiveClass(
                '/home'
              )}`}
            >
              <IoHomeSharp className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/statistics"
              className={`flex items-center gap-3 rounded-[8px] px-3 py-[15px] ${getActiveClass(
                '/statistics'
              )}`}
            >
              <IoStatsChart className="h-4 w-4" />
              Statistics
            </Link>
            <Link
              href="/bins"
              className={`flex items-center gap-3 rounded-[8px] px-3 py-[15px] ${getActiveClass(
                '/bins'
              )}`}
            >
              <RiDeleteBinFill className="h-4 w-4" />
              Bins
            </Link>
            <Link
              href="/market"
              className={`flex items-center gap-3 rounded-[8px] px-3 py-[15px] ${getActiveClass(
                '/market'
              )}`}
            >
              <FaShop className="h-4 w-4" />
              Market
            </Link>
          </nav>
        </div>
        <div className="mt-auto">
          <nav className="grid gap-3 items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/profile"
              className={`flex items-center gap-3 rounded-[8px] px-3 py-[15px] ${getActiveClass(
                '/profile'
              )}`}
            >
              <FaUserLarge className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-3 rounded-[8px] px-3 py-[15px] ${getActiveClass(
                '/settings'
              )}`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
