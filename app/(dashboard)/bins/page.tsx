/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import RobotSvg from '@/components/common/RobotSvg';
import React, { useState } from 'react';
import { RiApps2AiLine } from 'react-icons/ri';
import { FaTrashAlt } from 'react-icons/fa';
import { SlBell } from 'react-icons/sl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const binData = [
  {
    id: 1,
    name: 'ch_079845',
    location: 'Kigali-Masaka Street',
    status: 'Medium',
    percentage: '45%',
  },
  {
    id: 2,
    name: 'ch_079845',
    location: 'Kigali-Masaka Street',
    status: 'Medium',
    percentage: '45%',
  },
  {
    id: 3,
    name: 'ch_079845',
    location: 'Kigali-Masaka Street',
    status: 'Medium',
    percentage: '45%',
  },
  {
    id: 4,
    name: 'ch_079845',
    location: 'Kigali-Masaka Street',
    status: 'Medium',
    percentage: '45%',
  },
];

const Bins = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  // Handle input changes
  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    //@ts-ignore
    setImage(file);
  };

  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-6 max-md:p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl text-[#0E2040] font-medium">Bins</h3>
        <RiApps2AiLine size={28} color="#6B7280" />
      </div>
      <div className="flex flex-col gap-4">
        {binData.map((bin) => (
          <div
            onClick={() => router.push('/bins/1')}
            className="w-full p-7 rounded-xl cursor-pointer border shadow flex items-center justify-between bg-white"
            key={bin.id}
          >
            <div className="flex items-center gap-5">
              <RobotSvg />
              <div>
                <p className="font-semibold">{bin.name}</p>
                <p className="text-sm">{bin.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <p className="px-3 py-1 bg-[#EBF9F1] text-[#1F9254] rounded-2xl max-sm:hidden">
                {bin.status}
              </p>
              <p className="px-3 py-1 bg-[#EBF9F1] text-[#1F9254] rounded-2xl">
                {bin.percentage}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <button className="bg-[#A64B4B1C] px-3 py-2 flex items-center gap-2 rounded-3xl">
                <FaTrashAlt color="#A64B4B" />
                <span className="text-[#A64B4B] max-sm:hidden">Delete</span>
              </button>
              <button>
                <SlBell color="#0D99FF" size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-end justify-end mt-5">
            <button className="bg-[#4C4C4C] text-[#fff] w-[20%] py-2 rounded-xl max-lg:w-full">
              Add new bin
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="py-[10rem] w-[40%] flex flex-col gap-10 justify-between items-center">
          <DialogHeader>
            <DialogTitle className="text-[#171A1F] text-2xl">
              Add a new product
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <input
                id="productName"
                placeholder="Product name"
                value={productName}
                onChange={handleProductNameChange}
                className="w-full border-b border-b-[#A69999] placeholder-[#00000080] outline-none"
              />
            </div>
            <div className="flex flex-col gap-4">
              <input
                id="price"
                value={price}
                onChange={handlePriceChange}
                placeholder="Price"
                type="number"
                className="w-full border-b border-b-[#A69999] placeholder-[#00000080] outline-none"
              />
            </div>
            <div className="flex flex-col gap-4">
              <input
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Description"
                className="w-full border-b border-b-[#A69999] placeholder-[#00000080] outline-none"
              />
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <button
              type="submit"
              className="bg-[#4C4C4C] text-[#fff] py-2 rounded-xl px-5"
            >
              Add new product
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bins;
