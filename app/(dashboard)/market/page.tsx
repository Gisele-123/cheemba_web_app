import React from 'react';
import { RiApps2AiLine } from 'react-icons/ri';
import img1 from '@/public/assets/bag.jpg';
import img2 from '@/public/assets/img2.jpg';
import img3 from '@/public/assets/img4.jpg';
import Image from 'next/image';
import { IoFolderOpenOutline } from 'react-icons/io5';

const marketData = [
  {
    id: 1,
    name: 'Hand bags',
    desc: 'They’re designed from recycled plastics bags and plastic bottles. You can keep your phone and some items in this bag and prevent any kind of loss or any accident. MADE IN RWANDA.',
    component: ' Platics',
    residue: 'clothes',
    price: '14,000 Frw',
    img: img1,
  },
  {
    id: 2,
    name: 'Hand bags',
    desc: 'They’re designed from recycled plastics bags and plastic bottles. You can keep your phone and some items in this bag and prevent any kind of loss or any accident. MADE IN RWANDA.',
    component: ' Platics',
    residue: 'clothes',
    price: '14,000 Frw',
    img: img2,
  },
  {
    id: 3,
    name: 'Hand bags',
    desc: 'They’re designed from recycled plastics bags and plastic bottles. You can keep your phone and some items in this bag and prevent any kind of loss or any accident. MADE IN RWANDA.',
    component: ' Platics',
    residue: 'clothes',
    price: '14,000 Frw',
    img: img3,
  },
  {
    id: 4,
    name: 'Hand bags',
    desc: 'They’re designed from recycled plastics bags and plastic bottles. You can keep your phone and some items in this bag and prevent any kind of loss or any accident. MADE IN RWANDA.',
    component: ' Platics',
    residue: 'clothes',
    price: '14,000 Frw',
    img: img2,
  },
  {
    id: 5,
    name: 'Hand bags',
    desc: 'They’re designed from recycled plastics bags and plastic bottles. You can keep your phone and some items in this bag and prevent any kind of loss or any accident. MADE IN RWANDA.',
    component: ' Platics',
    residue: 'clothes',
    price: '14,000 Frw',
    img: img1,
  },
];

const Market = () => {
  return (
    <div className="flex flex-col gap-4 p-6 max-md:p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl text-[#0E2040] font-medium">Market</h3>
        <RiApps2AiLine size={28} color="#6B7280" />
      </div>
      <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
        {marketData.map((data) => (
          <div
            key={data.id}
            className="p-5 rounded-xl border shadow flex flex-col gap-4 bg-white"
          >
            <div className="w-full flex justify-between">
              <h3 className="text-2xl font-semibold">{data.name}</h3>
              <button className="bg-[#83C29D33] text-[#21BD1E] px-4 rounded-lg py-2">
                Sell
              </button>
            </div>
            <div className="w-full text-[#424242] pb-4 text-sm">
              {data.desc}
            </div>
            <div className="flex gap-4 max-lg:flex-col">
              <Image
                src={data.img}
                alt="img"
                width={150}
                height={100}
                className="rounded-lg"
              />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    <IoFolderOpenOutline size={19} color="#787486" />
                    <p className="text-[#424242]">{data.component}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <IoFolderOpenOutline size={19} color="#787486" />
                    <p className="text-[#424242]">{data.residue}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <IoFolderOpenOutline size={19} color="#787486" />
                    <p className="text-[#424242]">{data.price}</p>
                  </div>
                </div>
                <button className="bg-[#83C29D33] text-[#21BD1E] px-4 rounded-lg py-2">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;
