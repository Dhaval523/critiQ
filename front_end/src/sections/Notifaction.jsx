import React from 'react';
import Navbar from '../components/Navbar';
import Notifications from '../components/Notifactions';
const Noti = () => {
  return (
    <div className='bg-black min-h-screen w-full  py-16 text-white'>
      <Navbar />
      <Notifications /> 
    </div>
  );
};

export default Noti;
