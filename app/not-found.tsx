'use client';

import Link from 'next/link';
import { BiSolidFileFind } from 'react-icons/bi';
import { ImSearch } from 'react-icons/im';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function NotFound() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <div className="flex flex-col gap-7 items-center justify-center bg-sky-300 h-screen relative">
      <BiSolidFileFind
        className="size-[10rem] absolute top-10 left-10 max-lg:size-[5rem] max-md:size-[3rem] animate-up-down"
        style={{
          animation: 'up-down 2s infinite',
          animationDelay: '0s',
          rotate: '-25deg',
        }}
      />
      <h2
        className="text-brown text-[16rem] max-md:text-7xl font-bold"
        data-aos="fade-up"
      >
        Oops!
      </h2>
      <p className="text-3xl font-bold" data-aos="fade-up">
        Page Not Found
      </p>
      <p
        className="text-slate-700 text-xl text-center max-md:text-lg"
        data-aos="fade-up"
      >
        The page you are looking for might have been removed;{' '}
        <br className="max-lg:hidden" /> had its name changed or is temporarily
        unavailable.
      </p>
      <Link
        href="/"
        data-aos="fade-right"
        className="btn border-2 border-white px-4 text-white"
      >
        Return Home
      </Link>
      <ImSearch
        className="size-[10rem] absolute bottom-10 right-10 text-brown max-lg:size-[5rem] max-md:size-[3rem] animate-up-down"
        style={{ animation: 'up-down 2s infinite', animationDelay: '0.5s' }}
      />
    </div>
  );
}
