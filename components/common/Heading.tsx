'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaUserLarge } from "react-icons/fa6";
import { GoBell } from 'react-icons/go';
import profile from '@/public/assets/profile.jpg';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import AdminSearch from '@/components/common/admin-search';
import Logo from './Logo';
import { GoDotFill } from 'react-icons/go';
import { FaShop } from 'react-icons/fa6';
import { IoHomeSharp, IoStatsChart } from 'react-icons/io5';
import { RiDeleteBinFill } from 'react-icons/ri';
import Image from 'next/image';

const Heading = () => {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  const getActiveClass = (path: string) =>
    pathname === path
      ? 'bg-blue text-white'
      : 'text-muted-foreground hover:bg-blue/80 hover:text-white hover:transition-colors duration-200';

  const handleLinkClick = () => {
    setSheetOpen(false);
  };

  return (
    <header className="flex h-16 items-center gap-4 bg-white bg-muted/40 px-4 lg:h-[80px] lg:px-6 border-b border-b-[#E1E1E1] shadow-sm">
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5 text-black" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-white">
          <SheetTitle>
            <Link
              href="/home"
              className="flex items-center gap-3 text-lg font-semibold mb-5"
              onClick={handleLinkClick}
            >
              <Logo />
            </Link>
          </SheetTitle>
          <nav className="grid text-base font-medium text-white p-4 gap-3">
            <Link
              href="/home"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 ${getActiveClass(
                '/home'
              )}`}
              onClick={handleLinkClick}
            >
              <IoHomeSharp className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/statistics"
              className={`mx-[-0.65rem] flex justify-between items-center gap-4 rounded-xl px-3 py-3 ${getActiveClass(
                '/statistics'
              )}`}
              onClick={handleLinkClick}
            >
              <IoStatsChart className="h-4 w-4" />
              Statistics
            </Link>
            <Link
              href="/bins"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 ${getActiveClass(
                '/bins'
              )}`}
              onClick={handleLinkClick}
            >
              <RiDeleteBinFill className="h-4 w-4" />
              Bins
            </Link>
            <Link
              href="/market"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 ${getActiveClass(
                '/market'
              )}`}
              onClick={handleLinkClick}
            >
              <FaShop className="h-4 w-4" />
              Market
            </Link>
          </nav>
          <div className="mt-auto">
            <nav className="grid gap-3 items-start text-base px-2 font-medium lg:px-4 text-white">
              <Link
                href="/profile"
                className={`flex items-center gap-3 rounded-lg px-3 py-3 ${getActiveClass(
                  '/profile'
                )}`}
                onClick={handleLinkClick}
              >
                <FaUserLarge className="h-5 w-5" />
                Profile
              </Link>
              <Link
                href="/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-3 ${getActiveClass(
                  '/settings'
                )}`}
                onClick={handleLinkClick}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <AdminSearch />
      </div>

      <div className="relative cursor-pointer mr-5">
        <GoBell size={28} />
        <GoDotFill color="red" className="absolute -top-1 -right-1" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex flex-col text-sm max-md:hidden">
              <p className="text-[#0D062D] font-medium text-right">
                EnviroServe
              </p>
              <p className="text-[#787486] text-right">Kigali, Rwanda</p>
            </div>
            <Image
              src={profile}
              alt="img"
              className="h-full w-10 rounded-full"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={'/profile'}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={'/settings'}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Heading;
