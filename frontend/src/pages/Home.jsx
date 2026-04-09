

import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if user is logged in

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get("/movies");
        setMovies(res.data);
      } catch (error) {
        console.log("Error fetching movies", error);
      }
    };
    fetchMovies();
  }, []);

  // Auto Slider Logic (Har 5 second mein banner change hoga)
  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [movies]);

  const handleMovieClick = (e, id) => {
    e.preventDefault(); // Stop default Link behavior
    if (!token) {
      // Agar token nahi hai, toh pehle login pe bhejo
      sessionStorage.setItem("redirectTo", `/movie/${id}`);
      navigate("/login");
    } else {
      // Agar logged in hai, toh details dikhao
      navigate(`/movie/${id}`);
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen font-sans">
      
      {/* 1. Hero Movie Slider (Now with Auto-Change & Admin Backgrounds) */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {movies.length > 0 ? (
          <img 
  src={movies[currentSlide].backgroundImage || movies[currentSlide].poster} 
  className="w-full h-[70vh] object-cover object-center opacity-50 transition-all duration-1000 ease-in-out" 
  alt="Banner" 
/>
        ) : (
          <img 
            src="https://wallpapercave.com/wp/wp4056410.jpg" 
            className="w-full h-full object-cover opacity-50" 
            alt="Default Banner" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
        <div className="absolute bottom-20 left-12 max-w-2xl">
          <h1 className="text-6xl font-black italic mb-4 uppercase tracking-tighter text-red-600">
            {movies.length > 0 ? movies[currentSlide].title : "Featured Movie"}
          </h1>
          <p className="text-gray-300 text-lg mb-6 line-clamp-2">
            {movies.length > 0 ? movies[currentSlide].description : "Experience the magic of cinema. Book your tickets for the latest blockbusters now."}
          </p>
          <button 
            onClick={(e) => movies.length > 0 ? handleMovieClick(e, movies[currentSlide]._id) : navigate('/login')} 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold transition uppercase italic"
          >
            Details
          </button>
        </div>
      </div>

      {/* 2. Movie Categories & Grid */}
      <div className="px-12 py-10">
        <h2 className="text-2xl font-bold mb-8 border-l-4 border-red-600 pl-4 uppercase italic">Now Showing</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {movies.map((movie) => (
            <div 
              key={movie._id} 
              onClick={(e) => handleMovieClick(e, movie._id)} 
              className="group relative cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                <img
                  src={movie.poster}
                  className="w-full h-[350px] object-cover"
                  alt={movie.title}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="w-full bg-red-600 text-white py-2 rounded text-sm font-bold uppercase italic">View Details</button>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-bold group-hover:text-red-500 uppercase italic tracking-tighter transition-colors">{movie.title}</h3>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="font-bold uppercase tracking-widest text-[10px]">{movie.cast?.[0] || "Actor"}</span>
                {/* Price Home page se bilkul hata diya gaya hai as per your request */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Footer Section (Wahi original jo tumne diya tha) */}
      <footer className="bg-[#1a1a1a] py-12 px-12 mt-20 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-400">
          <div>
            <h3 className="text-red-600 font-bold text-xl mb-4 italic uppercase tracking-tighter">MovieBooking</h3>
            <p className="text-sm">Your one-stop destination for the latest movies and hassle-free ticket booking.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-red-500 cursor-pointer">About Us</li>
              <li className="hover:text-red-500 cursor-pointer">Contact Us: +91 9876543210</li>
              <li className="hover:text-red-500 cursor-pointer">Terms & Conditions</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-red-500 cursor-pointer">FAQ</li>
              <li className="hover:text-red-500 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-red-500 cursor-pointer">Help Center</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Newsletter</h4>
            <input type="email" placeholder="Email" className="bg-gray-800 p-2 w-full rounded mb-2 border border-gray-700 outline-none focus:border-red-600" />
            <button className="bg-red-600 text-white w-full py-2 rounded font-bold uppercase italic text-xs tracking-widest">Subscribe</button>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-gray-800 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
          &copy; 2026 MovieBooking App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;

// second version from gemini 
// import { useEffect, useState } from "react";
// import API from "../services/api";
// import { Link, useNavigate } from "react-router-dom";

// function Home() {
//   const [movies, setMovies] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token"); // Check if user is logged in

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const res = await API.get("/movies");
//         setMovies(res.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchMovies();
//   }, []);
//    //Auto Slider Logic (Har 5 second mein banner change hoga)
//   useEffect(() => {
//     if (movies.length > 0) {
//       const timer = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % movies.length);
//       }, 5000);
//       return () => clearInterval(timer);
//     }
//   }, [movies]);

//  const handleMovieClick = (id) => {
//     if (!token) {
//       // Yahan hum 'redirectTo' save kar rahe hain taaki login ke baad wapas aa sakein
//       sessionStorage.setItem("redirectTo", `/movie/${id}`);
//       navigate("/login");
//     } else {
//       navigate(`/movie/${id}`);
//     }
//   };

//  return (
//     <div className="bg-[#0f0f0f] text-white min-h-screen font-sans">
      
//       {/* 1. Hero Movie Slider (Now with Auto-Change) */}
//       <div className="relative h-[70vh] w-full overflow-hidden">
//         {movies.length > 0 ? (
//           <img 
//             src={movies[currentSlide].backgroundImage || movies[currentSlide].poster} 
//             className="w-full h-full object-cover opacity-50 transition-all duration-1000 ease-in-out" 
//             alt="Banner" 
//           />
//         ) : (
//           <img 
//             src="https://wallpapercave.com/wp/wp4056410.jpg" 
//             className="w-full h-full object-cover opacity-50" 
//             alt="Default Banner" 
//           />
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
//         <div className="absolute bottom-20 left-12 max-w-2xl">
//           <h1 className="text-6xl font-black italic mb-4 uppercase tracking-tighter text-red-600">
//             {movies.length > 0 ? movies[currentSlide].title : "Featured Movie"}
//           </h1>
//           <p className="text-gray-300 text-lg mb-6">
//             {movies.length > 0 ? movies[currentSlide].description : "Experience the magic of cinema. Book your tickets for the latest blockbusters now."}
//           </p>
//           <button 
//             onClick={() => movies.length > 0 ? navigate(`/movie/${movies[currentSlide]._id}`) : navigate('/login')} 
//             className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold transition"
//           >
//             Book Now
//           </button>
//         </div>
//       </div>

//       {/* 2. Movie Categories & Grid */}
//       <div className="px-12 py-10">
//         <h2 className="text-2xl font-bold mb-8 border-l-4 border-red-600 pl-4 uppercase">Now Showing</h2>
        
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
//           {movies.map((movie) => (
//             <Link 
//               key={movie._id} 
//               to={`/movie/${movie._id}`} 
//               onClick={(e) => handleMovieClick(e, movie._id)} 
//               className="group relative"
//             >
//               <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]">
//                 <img
//                   src={movie.poster}
//                   className="w-full h-[350px] object-cover"
//                   alt={movie.title}
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//                    <button className="w-full bg-red-600 text-white py-2 rounded text-sm font-bold">Details</button>
//                 </div>
//               </div>
//               <h3 className="mt-3 text-lg font-bold group-hover:text-red-500">{movie.title}</h3>
//               <div className="flex justify-between items-center text-sm text-gray-400">
//                 <span>{movie.cast[0]}</span>
//                 {/* Price removed as per your request */}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* 3. Footer Section */}
//       <footer className="bg-[#1a1a1a] py-12 px-12 mt-20 border-t border-gray-800">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-400">
//           <div>
//             <h3 className="text-red-600 font-bold text-xl mb-4 italic uppercase">MovieBooking</h3>
//             <p>Your one-stop destination for the latest movies and hassle-free ticket booking.</p>
//           </div>
//           <div>
//             <h4 className="text-white font-bold mb-4 uppercase">Company</h4>
//             <ul className="space-y-2">
//               <li className="hover:text-red-500 cursor-pointer">About Us</li>
//               <li className="hover:text-red-500 cursor-pointer text-sm">Contact Us: +91 9876543210</li>
//               <li className="hover:text-red-500 cursor-pointer">Terms & Conditions</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-white font-bold mb-4 uppercase">Support</h4>
//             <ul className="space-y-2">
//               <li className="hover:text-red-500 cursor-pointer">FAQ</li>
//               <li className="hover:text-red-500 cursor-pointer">Privacy Policy</li>
//               <li className="hover:text-red-500 cursor-pointer">Help Center</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-white font-bold mb-4 uppercase">Newsletter</h4>
//             <input type="email" placeholder="Email" className="bg-gray-800 p-2 w-full rounded mb-2" />
//             <button className="bg-red-600 text-white w-full py-2 rounded font-bold">Subscribe</button>
//           </div>
//         </div>
//         <div className="text-center mt-12 pt-8 border-t border-gray-800 text-sm">
//           &copy; 2026 MovieBooking App. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;


