'use client';
import React from 'react';
// import { usePathname } from 'next/navigation';
import profile from '@/public/assets/profile.jpg';
import { HiOutlineUser } from 'react-icons/hi2';
import { MdOutlineCancel } from 'react-icons/md';
import { RiUserAddLine } from 'react-icons/ri';
import { MdOutlineMail } from 'react-icons/md';
import { FaImages } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import img1 from '@/public/assets/bag.jpg';
import img2 from '@/public/assets/img2.jpg';
import img3 from '@/public/assets/img4.jpg';
import Image from 'next/image';
import { RadialChart } from '@/components/charts/RadialChart';
import Link from 'next/link';






const productImage = [
  {
    id: 1,
    img: img1,
    name: 'Hand bag',
  },
  {
    id: 2,
    img: img2,
    name: 'Hand bag',
  },
  {
    id: 3,
    img: img3,
    name: 'Hand bag',
  },
  {
    id: 4,
    img: img3,
    name: 'Hand bag',
  },
  {
    id: 5,
    img: img1,
    name: 'Hand bag',
  },
  {
    id: 6,
    img: img2,
    name: 'Hand bag',
  },
  {
    id: 7,
    img: img3,
    name: 'Hand bag',
  },
  {
    id: 8,
    img: img3,
    name: 'Hand bag',
  },
];

const Profile = () => {
  // const pathname = usePathname();

  // const getActiveClass = (path: string) =>
  //   pathname === path
  //     ? 'bg-blue text-white'
  //     : 'text-muted-foreground hover:bg-blue/80 hover:text-white hover:transition-colors duration-200';
  return (

    <div className="flex max-xl:flex-col gap-6">
      <div className="bg-white rounded-xl p-4 px-6 flex flex-col gap-3 justify-center items-center h-fit">
        <Image
          src={profile}
          alt="img"
          className="p-1 rounded-full border-2 border-[#ED2590]"
          width={250}
          height={250}
        />
        <div className="w-full flex flex-col gap-3 justify-center items-center border-b border-b-[#D9E6F7] pb-3">
          <p className="text-[#4B4B4B] font-medium">Envirservo</p>
          <p>Kigali, Rwanda</p>
          <p>Rwanda</p>
        </div>
        <div className="w-full px-2 flex flex-col gap-3 border-b border-b-[#D9E6F7] py-3">
          <div className="flex items-center gap-2 text-[#4B4B4B]">
            <HiOutlineUser />
            <p>Waste collection company</p>
          </div>
          <div className="w-full flex items-center gap-2 text-[#4B4B4B]">
            <MdOutlineCancel />
            <p>on-work</p>
          </div>
        </div>
        <div className="w-full px-2 flex flex-col gap-3 pt-3">
          <div className="flex items-center gap-2 text-[#4B4B4B]">
            <RiUserAddLine />
            <p>+91 7048144030</p>
          </div>
          <div className="flex items-center gap-2 text-[#4B4B4B]">
            <MdOutlineMail />
            <p>envirservo@servo.com</p>
          </div>
          <div className="flex items-center gap-2 text-[#4B4B4B]">
            <FaImages />
            <p>PDT - I</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 flex flex-col gap-3">
        <p>
          <span className="text-[#ED2590]">Cheemba </span>
          <span className="text-[#4B4B4B]">- Profile</span>
        </p>
        <h2 className="text-[#4B4B4B] font-semibold text-3xl">
          Envirservo company
        </h2>
        <p className="px-4 py-2 rounded-lg text-[#4B4B4B] bg-[#EFF3F8]">
          Company dedicated to collect wastes on time and in efficient ways
        </p>
        <p className="text-[#4B4B4B] font-medium">Worked on</p>
        <Skeleton className="flex-1 w-full rounded-xl" />
        <div className="flex flex-col gap-4 items-center justify-center">
          <button className="w-[30%] rounded-xl bg-[#F3F3F3] text-[#4A4A4A] py-2 max-lg:w-full">
            Update Profile
          </button>
          <Link href='/login' className=" flex justify-center items-center bg-[#4C4C4C] text-[#fff] w-[30%] py-2 rounded-xl max-lg:w-full">
            Log Out
          </Link>

        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-medium text-xl">Products</h3>
            <p className="text-[#ED2590]">View all</p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {productImage.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-2 justify-center items-center flex-1 cursor-pointer"
              >
                <Image
                  src={product.img}
                  alt="img"
                  className="rounded-xl"
                  width={100}
                  height={90}
                />
                <p className="text-[#4B4B4B] text-sm">{product.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <h3>Total work done</h3>
            <p className="px-3 py-1 rounded border text-sm cursor-pointer">This week</p>
          </div>
          <RadialChart />
        </div>
      </div>
    </div>
  );
};

export default Profile;
