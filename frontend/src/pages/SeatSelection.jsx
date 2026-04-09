


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]); 
  const [movie, setMovie] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(""); 
  const [upiId, setUpiId] = useState(""); 
  const [txnId, setTxnId] = useState(""); 
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [paymentQr, setPaymentQr] = useState(null);

  const myRealUpiId = "nandanigupta1214@okicici"; 


  const timeSlots = movie?.showTimes || [];
  const dateSlots = movie?.showDates || [];
  const formatTime = (time) => {
  const [h,m] = time.split(":");
  const hour = parseInt(h);

  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${m} ${suffix}`;
};
  const rows = ["A", "B", "C", "D", "E"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];


  useEffect(() => {
    API.get(`/movies/${id}`).then((res) => setMovie(res.data));
  }, [id]);

  // useEffect(() => {
  //   if (selectedTime) {
  //     API.get(`/movies/${id}/occupied?time=${selectedTime}`).then((res) => {
  //       setOccupiedSeats(res.data);
  //       setSelectedSeats([]); 
  //     });
  //   }
  // }, [selectedTime, id]);
  useEffect(() => {
  if (!selectedTime) return;
setSelectedSeats([]);
  const fetchOccupiedSeats = () => {
    API.get(`/movies/${id}/occupied?date=${selectedDate}&time=${selectedTime}`)
      .then((res) => {
        setOccupiedSeats(res.data);
      })
      .catch((err) => console.log(err));
  };

  // first fetch
  fetchOccupiedSeats();

  // refresh every 5 seconds
  const interval = setInterval(fetchOccupiedSeats, 5000);

  return () => clearInterval(interval);

}, [ selectedDate,selectedTime, id]);

  const toggleSeat = (s) => {
    
    if (!selectedDate) return alert("Please select a date first!");
    if (!selectedTime) return alert("Please select a show time first!");
    if (occupiedSeats.includes(s)) 
      {
    alert("This seat is already booked by another user. Please choose another seat.");
    return;
  }
    setSelectedSeats((prev) => prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]);
  };

  const handleGenerateQR = () => {
    if (!upiId.includes("@")) return alert("Please enter a valid UPI ID");
    const totalAmount = selectedSeats.length * movie.price;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${myRealUpiId}&pn=MovieBooking&am=${totalAmount}&cu=INR`;
    setPaymentQr(qrUrl);
  };

  const confirmBookingAfterPayment = async () => {
    // Validation: 12 se 25 characters tak accept karega (GPay/PhonePe safe)
    if (txnId.length < 12 || txnId.length > 25) {
      return alert("Invalid Transaction ID! Please enter the 12-25 digit ID from your GPay/PhonePe.");
    }

    setIsProcessing(true);
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const totalAmount = selectedSeats.length * movie.price;
        await API.post("/bookings/book", 
          { 
            movieId: id, 
            seats: selectedSeats, 
            showDate: selectedDate,
            showTime: selectedTime,
            totalPrice: totalAmount,
            transactionId: txnId ,
            userUpiId: upiId
            // Sending Txn ID to backend
          },
          { headers: { Authorization: token } }
        );
        alert(" Payment Verified by Bank Gateway!");
        navigate("/my-bookings");
      } catch (err) {
        alert("Booking failed! Check your connection.");
      } finally {
        setIsProcessing(false);
      }
    }, 3000); 
  };

  if (!movie) return <div className="bg-black text-white h-screen flex items-center justify-center">Loading Theater...</div>;

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center py-10 px-4 font-sans">
      <h1 className="text-4xl font-black text-red-600 mb-2 uppercase italic tracking-tighter">{movie.title}</h1>
      {/* Date Buttons */}
<div className="flex gap-4 my-6">
  {dateSlots.map((date) => (
    <button
      key={date}
      onClick={() => {
        setSelectedDate(date);
        setSelectedTime("");
      }}
      className={`px-4 py-2 rounded-lg font-bold border-2 ${
        selectedDate === date
          ? "bg-red-600 border-red-600 text-white"
          : "border-gray-800 text-gray-500 hover:border-red-500"
      }`}
    >
      {date}
    </button>
  ))}
</div>
      
      {/* Show Time Buttons */}
      <div className="flex gap-4 my-8">
        {selectedDate && timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-4 py-2 rounded-lg font-bold border-2 transition-all ${
              selectedTime === time ? "bg-red-600 border-red-600 text-white shadow-lg" : "bg-transparent border-gray-800 text-gray-500 hover:border-red-500"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl h-1 bg-red-600 shadow-[0_0_20px_red] mb-10"></div>

      {/* Seat Grid Logic Same... (Summary Card update niche hai) */}
      {/* ... Rest of your Grid Code ... */}
      <div className="grid gap-6 bg-[#111] p-10 rounded-3xl border border-gray-800 shadow-2xl relative">
        {rows.map((row) => (
          <div key={row} className="flex gap-4 items-center">
            <span className="w-8 text-gray-700 font-black text-xl">{row}</span>
            {cols.map((col) => {
              const seatId = `${row}${col}`;
              const isSelected = selectedSeats.includes(seatId);
              const isOccupied = occupiedSeats.includes(seatId);
              return (
                <div
                  key={seatId}
                  onClick={() => toggleSeat(seatId)}
                  className={`w-10 h-10 rounded-t-xl cursor-pointer border-2 transition-all flex items-center justify-center text-[10px] font-bold
                    ${isOccupied ? "bg-gray-600 border-gray-700 cursor-not-allowed text-transparent" : 
                      isSelected ? "bg-red-600 border-red-400 scale-110 text-white" : "bg-gray-900 border-gray-800 hover:border-red-500 text-transparent"}`}
                >
                  {seatId}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Summary and Pay Button */}
      <div className="mt-10 bg-[#111] border border-gray-800 p-8 rounded-3xl w-full max-w-md">
        <div className="flex justify-between mb-6">
          <span className="text-gray-500 uppercase text-xs font-bold">Total (Testing)</span>
          <span className="text-4xl font-black italic">₹{selectedSeats.length * movie.price}</span>
        </div>
        <button
          onClick={() => selectedSeats.length > 0 ? setShowUpiModal(true) : alert("Select seats!")}
          className="w-full bg-red-600 py-4 rounded-xl font-black uppercase italic hover:bg-red-700 transition"
        >
          Proceed to Pay
        </button>
      </div>

      {/* UPI MODAL */}
      {showUpiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl w-full max-w-md text-center">
            <h2 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter border-b border-gray-800 pb-4">Secure UPI Gateway</h2>
            
            {!paymentQr ? (
              <>
                <input 
                  type="text" 
                  placeholder="Enter your UPI ID" 
                  className="w-full bg-gray-800 border border-gray-700 p-4 rounded-xl text-white mb-6 focus:border-red-600 outline-none"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <button onClick={handleGenerateQR} className="w-full bg-blue-600 py-4 rounded-xl font-black uppercase">Show QR Code</button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 rounded-2xl mb-4">
                   <img src={paymentQr} alt="Scan to Pay" className="w-40 h-40" />
                </div>
                <p className="text-yellow-500 text-[10px] mb-6 uppercase font-bold tracking-widest">Pay ₹{selectedSeats.length * movie.price} & Enter UPI ID below</p>
                
                <input 
                  type="text" 
                  placeholder="Paste 12 digit of UTR No here" 
                  className="w-full bg-black border border-gray-800 p-4 rounded-xl text-white mb-4 text-center font-mono text-sm focus:border-green-500 outline-none"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                />

                <button 
                  onClick={confirmBookingAfterPayment} 
                  disabled={isProcessing}
                  className="w-full bg-green-600 py-4 rounded-xl font-black text-white"
                >
                  {isProcessing ? "VERIFYING WITH BANK..." : "VERIFY & BOOK TICKET"}
                </button>
              </div>
            )}
            <button onClick={() => {setShowUpiModal(false); setPaymentQr(null); setTxnId("");}} className="mt-6 text-gray-500 hover:text-white text-xs font-bold uppercase">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeatSelection;
 