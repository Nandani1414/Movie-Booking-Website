


import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await API.get("/bookings/my-bookings", {
          headers: { Authorization: token }
        });
        setBookings(res.data);
      } catch (error) {
        console.log("Error fetching bookings", error);
      }
    };
    fetchMyBookings();
  }, [token]);

  // --- NEW FEATURE: DELETE BOOKING ---
  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this ticket from your history?")) {
      try {
        await API.delete(`/bookings/${bookingId}`, {
          headers: { Authorization: token }
        });
        setBookings(bookings.filter(b => b._id !== bookingId)); // Remove from UI
        alert("Ticket deleted.");
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const downloadPDF = (id) => {
    const input = document.getElementById(`ticket-${id}`);
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`MovieTicket_${id}.pdf`);
    });
  };

  return (
    <div className="bg-black min-h-screen text-white p-10 font-sans">
      <h1 className="text-4xl font-bold mb-10 text-red-600 italic uppercase tracking-tighter">My Tickets</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-xl text-center mt-20">No tickets booked yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              id={`ticket-${booking._id}`} 
              className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl transition-transform hover:scale-[1.02]"
            >
              {/* Left Side: Poster */}
              <div className="w-full md:w-1/3">
                <img src={booking.movie?.poster} className="h-full w-full object-cover" alt="poster" />
              </div>

              {/* Right Side: Real Data */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-br from-[#1a1a1a] to-[#111]">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-black uppercase italic text-red-500 tracking-tighter">
                      {booking.movie?.title}
                    </h2>
                    <span className="bg-green-600 text-[10px] px-2 py-1 rounded font-bold uppercase">Paid</span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Seats</p>
                      <p className="text-md font-bold text-white">{booking.seats.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Total Price</p>
                      <p className="text-md font-bold text-white">₹{booking.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Show Date</p>
                      <p className="text-sm font-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Show Time</p>
                      <p className="text-sm font-bold text-red-400">{booking.showTime || "Not Selected"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <div className="text-[9px] text-gray-600 uppercase font-mono">ID: {booking._id}</div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => downloadPDF(booking._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-2 px-4 rounded-full transition-colors uppercase"
                    >
                      Download PDF
                    </button>
                    
                    {/* NEW: DELETE BUTTON ADDED HERE */}
                    <button 
                      onClick={() => handleDelete(booking._id)} 
                      className="text-gray-500 hover:text-red-500 text-[10px] font-bold uppercase transition-colors"
                    >
                      Remove History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
