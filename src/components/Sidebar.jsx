import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Sidebar() {
    const [currBtnId, setCurrBtnId] = useState(1);
    const adminMenu = [
        {
            id: 1,
            label: 'Dashboard',
            path: '/admin'
        },
        {
            id: 2,
            label: 'City',
            path: '/admin/city',
        }
    ];
    return (
        <div
  className="bg-gray-900  min-h-screen backdrop-blur-lg border-r border-white/20 shadow-lg"
>
  <div className="p-6">
    <h3 className="text-white text-center text-3xl font-extrabold tracking-wide">
      LOGO
    </h3>
    <ul className="mt-6 flex flex-col gap-2">
      {adminMenu.map((item, i) => (
        <li key={i}>
          <Link
            href={item.path}
            className={`flex items-center gap-3 px-4 py-2 text-white text-sm font-medium rounded-lg transition ${
              currBtnId === item.id
                ? "bg-white/20 shadow-md"
                : "hover:bg-white/10"
            }`}
            onClick={() => setCurrBtnId(item.id)}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
</div>


    )
}

export default Sidebar