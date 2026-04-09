

// import { Link } from "react-router-dom";

// function Navbar() {
//   const token = localStorage.getItem("token");
  
//   // LocalStorage se user nikalna aur check karna ki role kya hai
//   const user = JSON.parse(localStorage.getItem("user"));

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user"); // Dono clear karna zaroori hai
//     window.location.href = "/";
//   };

//   return (
//     <div className="bg-black text-white flex justify-between items-center px-10 py-4 border-b border-gray-800">

//       {/* Logo */}
//       <Link to="/" className="text-2xl font-bold text-red-500 italic uppercase tracking-tighter">
//         MovieBooking
//       </Link>

//       {/* Navigation */}
//       <div className="flex gap-8 text-sm font-bold items-center uppercase tracking-widest">

//         <Link to="/" className="hover:text-red-400 transition-colors">
//           Home
//         </Link>

//         <Link to="/my-bookings" className="hover:text-red-400 transition-colors">
//           My Bookings
//         </Link>

//         {/* --- DYNAMIC ADMIN BUTTON (Sirf Admin ko dikhega) --- */}
//         {token && user?.role === "admin" && (
//           <Link 
//             to="/admin" 
//             className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-black hover:bg-red-500 hover:text-white transition-all animate-pulse"
//           >
//             Admin Panel
//           </Link>
//         )}

//         {!token ? (
//           <Link to="/login" className="hover:text-red-400 transition-colors">
//             Login
//           </Link>
//         ) : (
//           <div className="flex items-center gap-4 border-l border-gray-800 pl-4">
//             <span className="text-[10px] text-gray-500 italic lowercase">{user?.name}</span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 px-4 py-1 rounded text-white text-xs hover:bg-red-600 transition-all font-bold"
//             >
//               Logout
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default Navbar;

import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  
  // LocalStorage se user nikalna aur check karna ki role kya hai
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Dono clear karna zaroori hai
    window.location.href = "/";
  };

  return (
    <div className="bg-black text-white flex justify-between items-center px-10 py-4 border-b border-gray-800">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-red-500 italic uppercase tracking-tighter">
        MovieBooking
      </Link>

      {/* Navigation */}
      <div className="flex gap-8 text-sm font-bold items-center uppercase tracking-widest">

        <Link to="/" className="hover:text-red-400 transition-colors">
          Home
        </Link>

        {/* --- STEP 4 FIX: Admin ko My Bookings nahi dikhega --- */}
        {user?.role !== "admin" && (
          <Link to="/my-bookings" className="hover:text-red-400 transition-colors">
            My Bookings
          </Link>
        )}

        {/* --- DYNAMIC ADMIN BUTTON (Sirf Admin ko dikhega) --- */}
        {token && user?.role === "admin" && (
          <Link 
            to="/admin" 
            className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-black hover:bg-red-500 hover:text-white transition-all animate-pulse"
          >
            Admin Panel
          </Link>
        )}

        {!token ? (
          <Link to="/login" className="hover:text-red-400 transition-colors">
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-4 border-l border-gray-800 pl-4">
            <span className="text-[10px] text-gray-500 italic lowercase">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded text-white text-xs hover:bg-red-600 transition-all font-bold"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Navbar;