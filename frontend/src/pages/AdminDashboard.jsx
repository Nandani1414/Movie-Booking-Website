


import { useState, useEffect } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("bookings"); 
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  // Updated Form State with Disclaimer
  const [movieData, setMovieData] = useState({
    title: "", description: "", poster: "", backgroundImage: "", 
    trailer: "", cast: "", price: "", totalSeats: 40, disclaimer: "", showTimes: [],
  showDates: []
  });
  const [editMode, setEditMode] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [bookRes, movieRes, userRes] = await Promise.all([
        API.get("/bookings/all", { headers: { Authorization: token } }),
        API.get("/movies"),
        API.get("/auth/all-users", { headers: { Authorization: token } })
      ]);
      setBookings(bookRes.data);
      setMovies(movieRes.data);
      setUsers(userRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data");
      setLoading(false);
    }
  };

  const handleAddOrUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const finalData = { 
  ...movieData, 
  cast: typeof movieData.cast === 'string' ? movieData.cast.split(",") : movieData.cast,

  showTimes: typeof movieData.showTimes === "string"
    ? movieData.showTimes.split(",")
    : movieData.showTimes,
    showDates: typeof movieData.showDates === "string"
? movieData.showDates.split(",")
: movieData.showDates,

  availableSeats: movieData.totalSeats 
};
      
      if (editMode) {
        await API.put(`/movies/${currentMovieId}`, finalData, { headers: { Authorization: token } });
        alert(" Movie Updated!");
      } else {
        await API.post("/movies/add", finalData, { headers: { Authorization: token } });
        alert(" Movie Added!");
      }
      
      resetForm();
      fetchData();
      setActiveTab("manage-movies");
    } catch (err) {
      alert("Action failed. Check Admin rights.");
    }
  };

  const resetForm = () => {
    setMovieData({ title: "", description: "", poster: "", backgroundImage: "", trailer: "", cast: "", price: "", totalSeats: 40, disclaimer: "" ,showTimes: [] , showDates: []});
    setEditMode(false);
    setCurrentMovieId(null);
  };

  const deleteMovie = async (id) => {
    if (window.confirm("Delete this movie?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/movies/${id}`, { headers: { Authorization: token } });
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Remove this user permanently?")) {
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/auth/delete-user/${id}`, { headers: { Authorization: token } });
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };
// const downloadReport = () => {

//   const rows = bookings
//     .filter((b) => b.user !== null && b.user?.role !== "admin")
//     .map((b) => ({
//       Customer: b.user?.name,
//       Email: b.user?.email,
//       Movie: b.movie?.title,
//       Seats: b.seats.join(" "),
//       Time: b.showTime,
//       Amount: b.totalPrice,
//       Date: new Date(b.bookingDate).toLocaleString()
//     }));

//   let csv = "Customer,Email,Movie,Seats,Time,Amount,Date\n";

//   rows.forEach(r=>{
//     csv += `${r.Customer},${r.Email},${r.Movie},${r.Seats},${r.Time},${r.Amount},${r.Date}\n`;
//   });

//   const blob = new Blob([csv], { type: "text/csv" });
//   const url = window.URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "movie_booking_report.csv";
//   a.click();
// };
  
const downloadReport = () => {

  const doc = new jsPDF();

  const rows = bookings
    .filter((b) => b.user !== null && b.user?.role !== "admin")
    .map((b) => [
      b.user?.name,
      b.user?.email,
      b.movie?.title,
      b.seats.join(" "),
      b.showTime,
      "₹" + b.totalPrice,
      new Date(b.bookingDate).toLocaleString()
    ]);

  autoTable(doc, {
    head: [["Customer", "Email", "Movie", "Seats", "Time", "Amount", "Date"]],
    body: rows
  });

  doc.save("movie_booking_report.pdf");
};
// const startEdit = (movie) => {
//     setMovieData({ ...movie, cast: movie.cast.join(","), disclaimer: movie.disclaimer || "" });
//     setCurrentMovieId(movie._id);
//     setEditMode(true);
//     setActiveTab("add-movie");
//   };
const startEdit = (movie) => {
  setMovieData({
    ...movie,
    cast: movie.cast.join(","),
    showTimes: movie.showTimes ||[] ,
    showDates: movie.showDates || [] ,
    disclaimer: movie.disclaimer || ""
  });

  setCurrentMovieId(movie._id);
  setEditMode(true);
  setActiveTab("add-movie");
};

  if (loading) return <div className="text-white bg-black h-screen flex items-center justify-center font-bold italic uppercase tracking-widest text-red-600">Loading Control Center...</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white p-8 font-sans">
      
      {/* 🧭 Professional Navigation Tabs */}
      <div className="flex gap-8 mb-10 border-b border-gray-800 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab("bookings")} className={`text-xs font-black italic uppercase tracking-widest transition-all ${activeTab === "bookings" ? "text-red-600 border-b-2 border-red-600 pb-2" : "text-gray-500 hover:text-white"}`}>Bookings</button>
        <button onClick={() => setActiveTab("manage-movies")} className={`text-xs font-black italic uppercase tracking-widest transition-all ${activeTab === "manage-movies" ? "text-red-600 border-b-2 border-red-600 pb-2" : "text-gray-500 hover:text-white"}`}>Movies</button>
        <button onClick={() => setActiveTab("users")} className={`text-xs font-black italic uppercase tracking-widest transition-all ${activeTab === "users" ? "text-red-600 border-b-2 border-red-600 pb-2" : "text-gray-500 hover:text-white"}`}>Users</button>
        <button onClick={() => {resetForm(); setActiveTab("add-movie");}} className={`text-xs font-black italic uppercase tracking-widest transition-all ${activeTab === "add-movie" && !editMode ? "text-red-600 border-b-2 border-red-600 pb-2" : "text-gray-500 hover:text-white"}`}>Add New</button>
        {editMode && <button className="text-xs font-black italic uppercase tracking-widest text-blue-500 border-b-2 border-blue-500 pb-2">Editing...</button>}
      </div>

      {/* --- TAB 1: BOOKINGS --- */}
      {activeTab === "bookings" && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-red-600 italic uppercase tracking-tighter">Control Center</h1>
            <button
    onClick={downloadReport}
    className="bg-green-600 px-4 py-2 rounded-lg font-bold text-xs uppercase"
  >
    Download Report
  </button>
            <div className="text-right">
              <p className="text-gray-600 text-[10px] uppercase font-bold">Revenue</p>
              <p className="text-3xl font-black text-green-500 italic">₹{bookings
              .filter((booking) => booking.user !== null && booking.user?.role !== "admin").reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0)}</p>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="p-4 border-b border-gray-800">Customer</th>
                  <th className="p-4 border-b border-gray-800">Movie</th>
                  <th className="p-4 border-b border-gray-800">Seats</th>
                  <th className="p-4 border-b border-gray-800">UTR / Transaction</th>
                  <th className="p-4 border-b border-gray-800">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {bookings 
                .filter((booking) => booking.user !== null && booking.user?.role !== "admin")
                .map((b) => (
                  <tr key={b._id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white uppercase text-xs">{b.user?.name}</p>
                      <p className="text-gray-500 text-[10px] lowercase">{b.user?.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-red-500 font-black italic uppercase text-[10px]">{b.movie?.title}</p>
                      <p className="text-gray-500 text-[9px] uppercase font-bold">{b.showTime || "10:00 AM"}</p>
                      
                    </td>
                    <td className="p-4 font-mono text-white text-xs">{b.seats.join(", ")}</td>
                    <td className="p-4">
                      <span className="bg-black border border-gray-700 px-2 py-1 rounded text-green-400 font-mono text-[10px]">
                        {b.transactionId || "NO-UTR"}
                      </span>
                      <p className="text-gray-500 text-[9px] italic font-bold">UPI: {b.userUpiId || "N/A"}</p>
                    </td>
                    <td className="p-4 font-black text-white italic">₹{b.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- TAB 2: MANAGE MOVIES --- */}
      {activeTab === "manage-movies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map(m => (
            <div key={m._id} className="bg-[#111] border border-gray-800 p-5 rounded-2xl flex flex-col hover:border-red-600 transition-all">
              <div className="flex gap-4 mb-4">
               <img
  src={m.poster}
  className="w-full h-60 object-contain rounded-lg bg-black"
  alt="poster"
/>
                <div>
                   <h3 className="font-black uppercase text-red-600 italic text-sm">{m.title}</h3>
                   <p className="text-green-500 font-bold text-xs">₹{m.price}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-900">
                <button onClick={() => startEdit(m)} className="flex-1 bg-white text-black py-2 rounded-lg font-black text-[10px] uppercase">Edit</button>
                <button onClick={() => deleteMovie(m._id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-black text-[10px] uppercase">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- TAB 3: MANAGE USERS --- */}
      {activeTab === "users" && (
        <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody className="text-sm">
              {users.map(u => (
                <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                  <td className="p-4"><p className="font-bold uppercase text-xs">{u.name}</p><p className="text-gray-500 text-[10px] lowercase">{u.email}</p></td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-[9px] font-black ${u.role === 'admin' ? 'bg-red-600' : 'bg-gray-700'}`}>{u.role}</span></td>
                  <td className="p-4">
                    {u.role !== 'admin' && <button onClick={() => deleteUser(u._id)} className="text-red-500 border border-red-500 px-3 py-1 rounded-full text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition">Remove</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB 4: ADD/EDIT FORM --- */}
      {activeTab === "add-movie" && (
        <div className="max-w-4xl mx-auto bg-[#111] border border-gray-800 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-black italic uppercase text-red-600 mb-6 border-b border-gray-800 pb-2">{editMode ? "Update Movie" : "Add New Movie"}</h2>
          <form onSubmit={handleAddOrUpdateMovie} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-gray-500">Title</label>
              <input type="text" className="bg-black border border-gray-800 p-3 rounded-xl focus:border-red-600 outline-none text-sm" value={movieData.title} onChange={(e)=>setMovieData({...movieData, title:e.target.value})} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-gray-500">Price (₹)</label>
              <input type="number" 
              min= "1"
                className="bg-black border border-gray-800 p-3 rounded-xl focus:border-red-600 outline-none text-green-500 font-bold text-sm"
  value={movieData.price}
  onChange={(e) => {
    const value = Number(e.target.value);

    if (value < 0) {
      alert("Price cannot be negative");
      return;
    }

    setMovieData({ ...movieData, price: value });
  }}
  required
/>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-500">Description</label>
              <textarea className="bg-black border border-gray-800 p-3 rounded-xl focus:border-red-600 outline-none h-20 text-sm" value={movieData.description} onChange={(e)=>setMovieData({...movieData, description:e.target.value})} required />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-red-500">Disclaimer & Safety</label>
              <textarea placeholder="Ex: • Carry your ticket..." className="bg-black border border-gray-800 p-3 rounded-xl focus:border-red-600 outline-none h-20 text-sm" value={movieData.disclaimer} onChange={(e)=>setMovieData({...movieData, disclaimer:e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-gray-500">Poster URL</label>

<input
  type="url"
  placeholder="https://image-link..."
  className="bg-black border border-gray-800 p-3 rounded-xl text-sm"
  value={movieData.poster}
  onChange={(e)=>setMovieData({...movieData, poster:e.target.value})}
  required
/>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-gray-500">Slider URL</label>

<input
  type="url"
  placeholder="https://banner-link..."
  className="bg-black border border-gray-800 p-3 rounded-xl text-sm"
  value={movieData.backgroundImage}
  onChange={(e)=>setMovieData({...movieData, backgroundImage:e.target.value})}
  required
/>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-red-500">YouTube Embed Link</label>
              <input
  type="url"
  placeholder="https://www.youtube.com/embed/..."
  className="bg-black border border-gray-800 p-3 rounded-xl focus:border-red-600 text-sm"
  value={movieData.trailer}
  onChange={(e)=>setMovieData({...movieData, trailer:e.target.value})}
  required
/>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-gray-500">Cast (SRK, Deepika...)</label>

<input
  type="text"
  className="bg-black border border-gray-800 p-3 rounded-xl text-sm"
  value={movieData.cast}
  onChange={(e) => {
    const value = e.target.value;

    if (!/^[A-Za-z,\s]*$/.test(value)) {
      alert("Cast should contain only letters");
      return;
    }

    setMovieData({ ...movieData, cast: value });
  }}
  required
/>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">

<label className="text-[10px] uppercase font-bold text-gray-500">
Show Dates (comma separated)
</label>

{/* <input
type="date"
placeholder="2026-04-10,2026-04-11,2026-04-12"
className="bg-black border border-gray-800 p-3 rounded-xl text-sm"
value={movieData.showDates}
onChange={(e)=>
setMovieData({
...movieData,
showDates:e.target.value
})
}
/> */}
<input
  type="date"
  min={new Date().toISOString().split("T")[0]}
  className="bg-black border border-gray-800 p-3 rounded-xl text-sm"
  value={selectedDate}
  onChange={(e)=>setSelectedDate(e.target.value)}
/>
<button
type="button"
className="bg-red-600 px-3 py-2 rounded text-xs mt-2"
onClick={()=>{
  if(!selectedDate) return;

  if(movieData.showDates.includes(selectedDate)) return;

  setMovieData({
    ...movieData,
    showDates: [...movieData.showDates, selectedDate]
  });

  setSelectedDate("");
}}
>
Add Date
</button>
<div className="flex flex-wrap gap-2 mt-3">
{movieData.showDates.map((d,i)=>(
  <span
    key={i}
    className="bg-green-600 px-2 py-1 rounded text-xs"
  >
    {d}
  </span>
))}
</div>

<label className="text-[10px] uppercase font-bold text-gray-500 mt-3">
Show Timings (comma separated)
</label>

{/* <input
type="time"
placeholder="10:00 AM,01:30 PM,05:00 PM,09:00 PM"
className="bg-black border border-gray-800 p-3 rounded-xl text-sm"
value={movieData.showTimes}
onChange={(e)=>
setMovieData({
...movieData,
showTimes:e.target.value
})
}
/> */}
<input
type="time"
className="bg-black border border-gray-800 p-3 rounded-xl text-sm"
onChange={(e)=>{
  const time = e.target.value;

  if(movieData.showTimes.includes(time)) return;

  setMovieData({
    ...movieData,
    showTimes:[...movieData.showTimes,time]
  });
}}
/>
<div className="flex flex-wrap gap-2 mt-3">
{movieData.showTimes.map((t,i)=>(
  <span
    key={i}
    className="bg-red-600 px-2 py-1 rounded text-xs flex items-center gap-2"
  >
    {t}

    <button
      type="button"
      onClick={()=>{
        setMovieData({
          ...movieData,
          showTimes: movieData.showTimes.filter((_,index)=>index!==i)
        })
      }}
    >
      ✕
    </button>

  </span>
))}
</div>

</div>
            <button type="submit" className="md:col-span-2 bg-red-600 py-4 rounded-xl font-black text-lg uppercase italic mt-4 hover:bg-red-700 transition shadow-lg">
              {editMode ? "Confirm Update" : "Publish Movie"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;