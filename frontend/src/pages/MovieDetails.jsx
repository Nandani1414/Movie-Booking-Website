



import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [allMovies, setAllMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await API.get(`/movies/${id}`);
        setMovie(movieRes.data);
        const allRes = await API.get("/movies");
        setAllMovies(allRes.data.filter(m => m._id !== id)); 
      } catch (err) { console.log(err); }
    };
    fetchData();
    // Screen ko top par scroll karne ke liye jab movie change ho
    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) return <div className="bg-black min-h-screen text-white p-20 text-center text-2xl font-black italic uppercase animate-pulse">Loading Movie Details...</div>;

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen font-sans">
      
      {/* 1. Cinematic Background Banner (Using Admin's backgroundImage) */}
      <div className="relative h-[65vh]">
        <img 
  src={movie.backgroundImage || movie.poster} 
  className="w-full h-[65vh] object-cover object-center opacity-40 transition-opacity duration-1000" 
  alt="bg" 
/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
        <div className="absolute bottom-10 left-12 flex gap-8 items-end">
          <img src={movie.poster} className="w-64 rounded-xl shadow-2xl border-2 border-gray-700 hidden md:block" alt="poster" />
          <div className="mb-4">
            <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase italic text-red-600">{movie.title}</h1>
            <p className="text-gray-300 max-w-xl mb-6 text-lg line-clamp-3 italic">{movie.description}</p>
            
            <Link to={`/book-seats/${movie._id}`} className="bg-red-600 px-10 py-4 rounded-full font-black text-xl hover:scale-110 transition-all inline-block text-center uppercase italic shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              BOOK TICKETS - ₹{movie.price}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Trailer & Cast Section */}
      <div className="px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-black mb-6 border-l-4 border-red-600 pl-4 uppercase tracking-widest text-red-500 italic">Official Trailer</h2>
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
            <iframe 
              width="100%" 
              height="100%" 
              src={movie.trailer} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen 
              title="Movie Trailer"
            ></iframe>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black mb-6 border-l-4 border-red-600 pl-4 uppercase tracking-widest text-red-500 italic">Star Cast</h2>
          <div className="flex gap-4 flex-wrap">
            {movie.cast && (typeof movie.cast === 'string' ? movie.cast.split(",") : movie.cast).map((c, i) => (
              <div key={i} className="bg-gray-900 px-6 py-3 rounded-full border border-gray-800 text-sm font-black uppercase italic text-gray-300 hover:border-red-600 transition-colors">
                {c.trim()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer Section (As it was) */}
      <div className="px-12 py-10 bg-[#111] mx-12 rounded-2xl border border-gray-800 mb-20 text-gray-400 text-sm italic">
        <h4 className="text-white font-black mb-3 uppercase tracking-widest text-red-600">Disclaimer & Safety</h4>
        <div className="space-y-2 text-gray-400 text-sm italic">
  {/* 1. Agar Admin ne Disclaimer dala hai, toh wo dikhao */}
  {movie.disclaimer ? (
    <p className="whitespace-pre-line leading-relaxed">
      {movie.disclaimer}
    </p>
  ) : (
    /* 2. Agar Disclaimer khali hai, toh ye default points dikhao */
    <>
      <p>• Please carry your ticket (E-mail or Printout) to the cinema counter.</p>
      <p>• Age criteria: Children below 12 years are not allowed for 'A' rated movies.</p>
      <p>• Items like cameras, laptops, or outside food are strictly prohibited.</p>
      <p>• Tickets once booked cannot be cancelled or refunded.</p>
    </>
  )}
</div>
      </div>

      {/* 3. Suggestions Section (More Like This) */}
      <div className="px-12 py-10 pb-20">
        <h2 className="text-2xl font-black mb-8 uppercase tracking-widest text-gray-600 italic">More Like This</h2>
        <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
          {allMovies.map(m => (
            <Link key={m._id} to={`/movie/${m._id}`} className="min-w-[220px] hover:scale-105 transition-transform duration-500 group">
              <div className="relative rounded-xl overflow-hidden border border-gray-800 group-hover:border-red-600 transition-all">
                <img src={m.poster} className="h-[320px] w-full object-cover" alt={m.title} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-red-600 text-white text-[10px] px-3 py-1 rounded font-black uppercase italic">Explore</span>
                </div>
              </div>
              <p className="mt-4 font-black uppercase italic text-sm group-hover:text-red-500 transition-colors">{m.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
// second edit from gemini

// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import API from "../services/api";

// function MovieDetails() {
//   const { id } = useParams();
//   const [movie, setMovie] = useState(null);
//   const [allMovies, setAllMovies] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const movieRes = await API.get(`/movies/${id}`);
//         setMovie(movieRes.data);
//         const allRes = await API.get("/movies");
//         setAllMovies(allRes.data.filter(m => m._id !== id)); 
//       } catch (err) { console.log(err); }
//     };
//     fetchData();
//   }, [id]);

//   if (!movie) return <div className="bg-black min-h-screen text-white p-20 text-center text-2xl">Loading Movie Details...</div>;

//   return (
//     <div className="bg-[#0f0f0f] text-white min-h-screen">
//       {/* 1. Cinematic Background Banner */}
//       <div className="relative h-[65vh]">
//         <img src={movie.backgroundImage || movie.poster} className="w-full h-full object-cover opacity-40" alt="bg" />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
//         <div className="absolute bottom-10 left-12 flex gap-8 items-end">
//           <img src={movie.poster} className="w-64 rounded-xl shadow-2xl border-2 border-gray-700 hidden md:block" alt="poster" />
//           <div className="mb-4">
//             <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase italic">{movie.title}</h1>
//             <p className="text-gray-300 max-w-xl mb-6 text-lg">{movie.description}</p>
//             {/* Navigates to the Seat Selection Page */}
//             <Link to={`/book-seats/${movie._id}`} className="bg-red-600 px-10 py-4 rounded-full font-black text-xl hover:scale-105 transition inline-block text-center uppercase italic">
//               BOOK TICKETS - ₹{movie.price}
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* 2. Trailer & Cast Section */}
//       <div className="px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
//         <div>
//           <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-4 uppercase tracking-widest text-red-500">Official Trailer</h2>
//           <div className="aspect-video">
//             <iframe width="100%" height="100%" src={movie.trailer} frameBorder="0" allowFullScreen className="rounded-xl shadow-2xl border border-gray-800"></iframe>
//           </div>
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-4 uppercase tracking-widest text-red-500">Star Cast</h2>
//           <div className="flex gap-4 flex-wrap">
//             {movie.cast.map((c, i) => (
//               <div key={i} className="bg-gray-800 px-6 py-3 rounded-full border border-gray-700 text-lg font-semibold">{c}</div>
//             ))}
//           </div>
//         </div>
//       </div>
//       {/* Disclaimer Section */}
// <div className="px-12 py-10 bg-[#111] mx-12 rounded-xl border border-gray-800 mb-20 text-gray-400 text-sm">
//   <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-red-500">Disclaimer & Safety</h4>
//   <p>• Please carry your ticket (E-mail or Printout) to the cinema counter.</p>
//   <p>• Age criteria: Children below 12 years are not allowed for 'A' rated movies.</p>
//   <p>• Items like cameras, laptops, or outside food are strictly prohibited inside the hall.</p>
//   <p>• Tickets once booked cannot be cancelled or refunded.</p>
// </div>

//       {/* 3. Suggestions Section (More Like This) */}
//       <div className="px-12 py-10 pb-20">
//         <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest text-gray-500">More Like This</h2>
//         <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
//           {allMovies.map(m => (
//             <Link key={m._id} to={`/movie/${m._id}`} className="min-w-[200px] hover:scale-110 transition group">
//               <img src={m.poster} className="rounded-lg h-[300px] w-full object-cover border border-gray-800 group-hover:border-red-600" />
//               <p className="mt-2 font-bold group-hover:text-red-500">{m.title}</p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MovieDetails;

