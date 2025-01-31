import RobotSvg from '@/components/common/RobotSvg';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { FcFullTrash } from 'react-icons/fc';
import { SlBell } from 'react-icons/sl';
import { IoTime } from 'react-icons/io5';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { RadialChart } from '@/components/charts/RadialChart';

const importantLinks = [
  {
    id: 1,
    icon: <IoTime />,
    bg: '#4BA6651C',
    color: '#4BA665',
    text: 'History',
  },
  {
    id: 2,
    icon: <IoTime />,
    bg: '#4BA6651C',
    color: '#4BA665',
    text: 'History',
  },
  {
    id: 3,
    icon: <IoTime />,
    bg: '#4BA6651C',
    color: '#4BA665',
    text: 'History',
  },
  {
    id: 4,
    icon: <IoTime />,
    bg: '#4BA6651C',
    color: '#4BA665',
    text: 'History',
  },
  {
    id: 5,
    icon: <IoTime />,
    bg: '#4BA6651C',
    color: '#4BA665',
    text: 'History',
  },
  {
    id: 6,
    icon: <IoTime />,
    bg: '#4BA6651C',
    color: '#4BA665',
    text: 'History',
  },
];

const notifications = [
  { id: 1, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
  { id: 2, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
  { id: 3, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
  { id: 4, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
  { id: 5, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
  { id: 6, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
  { id: 7, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
  { id: 8, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
  { id: 9, name: 'ch_005786 is half-full', date: '04 April, 2021 | 04:00 PM' },
];

const page = () => {
  return (
    <div className="flex flex-row gap-6 overflow-y-hidden">
      {/* Non-scrollable section */}
      <div className="bg-white rounded-2xl p-10 h-full w-[70%] max-lg:w-full">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-5">
            <RobotSvg />
            <div>
              <p className="font-semibold">ch_079845</p>
              <p className="text-sm">Kigali-Masaka Street</p>
            </div>
          </div>
          <button>
            <SlBell color="#0D99FF" size={22} />
          </button>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex items-center gap-4 flex-col w-[40%]">
            <FcFullTrash className="flex-1 w-full" />
            <div className="flex items-center gap-2">
              <FaCircleExclamation size={25} color={'#FF0000'} />
              <span className="text-sm">Dustbin might be full</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="w-full h-[470px] rounded-xl" />
            <h2 className="font-semibold text-xl">
              Location:{' '}
              <span className="font-normal">Kigali-Kagugu, Rwanda</span>
            </h2>
            <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3">
              {importantLinks.map((link) => (
                <button
                  key={link.id}
                  style={{ background: link.bg, color: link.color }}
                  className="px-4 py-2 rounded-md flex items-center gap-2"
                >
                  {link.icon}
                  {link.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
        <div className="example flex flex-col gap-6 h-full w-[30%] overflow-y-scroll max-lg:hidden">
          <div className="bg-white rounded-2xl p-10 h-full w-full flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-[#1F384C]">Segregation</h3>
              <BiDotsHorizontalRounded className="cursor-pointer" />
            </div>
            <RadialChart/>
          </div>

          <div className="bg-white rounded-2xl p-10 h-full w-full flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-[#1F384C]">Notifications</h3>
              <BiDotsHorizontalRounded className="cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center gap-3 w-full hover:bg-slate-50 rounded-2xl cursor-pointer p-2">
                  <RobotSvg />
                  <div>
                    <p className="text-[#23262F] text-sm font-medium">
                      {notification.name}
                    </p>
                    <p className="text-[#708099] text-xs">
                      {notification.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default page;
