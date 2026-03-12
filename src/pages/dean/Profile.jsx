import React, { useState } from 'react';

const Profile = () => {

  const [user, setUser] = useState({
    name: "Meggy Awuor",
    gender: "Female",
    phone: "+254...",
    email: "meggy@egerton.ac.ke",
    staffId: "EF123/2026",
    faculty: "Science"
  });

  // Get first letter of first name
  const firstInitial = user.name.split(" ")[0].charAt(0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-10">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Profile
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-3xl">

        {/* PROFILE HEADER */}
        <div className="flex items-center gap-6 mb-8">

          <div className="w-20 h-20 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center text-3xl font-bold shadow">
            {firstInitial}
          </div>

          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-400 text-sm">Faculty of {user.faculty}</p>
          </div>

        </div>


        {/* PROFILE INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

          <div>
            <p className="text-gray-400">Gender</p>
            <p className="font-medium">{user.gender}</p>
          </div>

          <div>
            <p className="text-gray-400">Phone No</p>
            <p className="font-medium">{user.phone}</p>
          </div>

          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-400">Staff ID</p>
            <p className="font-medium">{user.staffId}</p>
          </div>

          <div>
            <p className="text-gray-400">Faculty</p>
            <p className="font-medium">{user.faculty}</p>
          </div>

        </div>


        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mt-8">

          <button className="bg-[#2A9D8F] text-white px-5 py-2 rounded-lg hover:bg-teal-700">
            Edit Profile
          </button>

          <button className="bg-[#E6F4F1] text-[#2A9D8F] px-5 py-2 rounded-lg hover:bg-teal-100">
            Change Password
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;