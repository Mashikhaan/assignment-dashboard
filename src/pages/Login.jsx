import React from 'react'
import { useState } from 'react';
import { users } from '../data/seedData.js';
import { useAppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const[selectedUser, setSelectedUser] = useState("");

    const { login } = useAppContext();
    
    const navigate = useNavigate();

    //handle login form submission
    const handleLogin = (e) => {
        e.preventDefault();


        //find the selected user from the users array
        const userDetails = users.find(
            (user) => user.id === selectedUser
        )

        if(!userDetails){
            alert("Please select a user")
        }

        //call the login function from the context
        login(userDetails.id);

        //navigate to the dashboard page
        navigate(userDetails.role === "admin" ? "/admin-dashboard" : "/student-dashboard");
    }



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            Joineazy
          </h1>

          <p className="text-gray-500 mt-2">
            Assignment & Review Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select your account
          </label>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Choose an account</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition-colors font-medium"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login