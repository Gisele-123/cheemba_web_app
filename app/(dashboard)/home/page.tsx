import React from 'react';
import { FcFullTrash } from 'react-icons/fc';
import { RiApps2AiLine } from 'react-icons/ri';
import { IoFolderOpenOutline } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa'; // Import green and red icons
import { FaCircleExclamation } from 'react-icons/fa6';
import { PieChartHome } from '@/components/charts/PieChartHome';
import { Donut } from '@/components/charts/Donut';
import { LineChartHome } from '@/components/charts/LineChartHome';

const binsData = [
  {
    id: 'fdsaf',
    info: 'Full',
  },
  {
    id: 'fdsad',
    info: 'not full',
  },
];

const HomeDashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-6 max-md:p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl text-[#0E2040] font-medium">Dashboard</h3>
        <RiApps2AiLine size={28} color="#6B7280" />
      </div>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 max-lg:col-span-5 bg-white border shadow rounded-xl p-4 max-lg:h-fit">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-xl">Bins</h3>
            <div className="flex items-center gap-3">
              <IoFolderOpenOutline size={23} color="#787486" />
              <p className="text-[#787486]">10+</p>
              <button className="bg-blue px-2 py-2 rounded-sm text-xs text-white">
                View more
              </button>
            </div>
          </div>
          <div className="flex-1 h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              {binsData.map((bin) => (
                <div
                  className="flex-1 flex flex-col gap-3 justify-center items-center"
                  key={bin.id}
                >
                  <FcFullTrash className="flex-1 w-full" />
                  <div className="flex items-center gap-2 max-md:flex-col">
                    {bin.info === 'Full' ? (
                      <>
                        <FaCircleExclamation size={25} color={'#FF0000'} />
                        <span className="text-sm">Dustbin might be full</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="" color="#008000" size={25} />
                        <span className="text-sm">Dustbin is empty</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3 max-lg:col-span-5 bg-white border shadow rounded-xl p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-xl">Streets</h3>
            <div className="flex items-center gap-3">
              <IoFolderOpenOutline size={23} color="#787486" />
              <p className="text-[#787486]">10+</p>
              <button className="bg-blue px-2 py-2 rounded-sm text-xs text-white">
                View more
              </button>
            </div>
          </div>
          <div>
            <PieChartHome />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 max-lg:col-span-5 bg-white border shadow rounded-xl p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-xl">Wastes</h3>
            <div className="flex items-center gap-3">
              <IoFolderOpenOutline size={23} color="#787486" />
              <p className="text-[#787486]">10+</p>
              <button className="bg-blue px-2 py-2 rounded-sm text-xs text-white">
                View more
              </button>
            </div>
          </div>
          <div>
            <Donut />
          </div>
        </div>

        <div className="col-span-3 max-lg:col-span-5 bg-white border shadow rounded-xl p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-xl">Recycled</h3>
            <div className="flex items-center gap-3">
              <IoFolderOpenOutline size={23} color="#787486" />
              <p className="text-[#787486]">10+</p>
              <button className="bg-blue px-2 py-2 rounded-sm text-xs text-white">
                View more
              </button>
            </div>
          </div>
          <div>
            <LineChartHome />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
