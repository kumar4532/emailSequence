import React from 'react'
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Logout() {
    const {setAuthUser} = useAuthContext();

    const handleLogout = () => {
        try {
            fetch("/api/auth/logout", {
                method:"POST"
            })

            localStorage.removeItem("user");
            setAuthUser(null);
            toast.success("User logged out safely");
        } catch (error) {
            console.log("Error while logging out", error);
        }
    }

  return (
    <div className='cursor-pointer flex flex-row'>
        <span onClick={handleLogout}>Logout</span>
    </div>
  )
}

export default Logout