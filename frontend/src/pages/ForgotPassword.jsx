import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const handleSendOTP = async () => {
  try {
    await API.post("/auth/send-otp", { email });
    alert("OTP sent to your email");
    setOtpSent(true);
  } catch (err) {
    alert(err.response?.data?.message || "Error sending OTP");
  }
};

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/forgot-password", { email, otp , newPassword });
      alert(" Password Reset Successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed!");
    }
  };

  return (
    <div className="bg-black h-screen flex items-center justify-center text-white p-6">
      <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black italic uppercase text-red-600 mb-6 border-b border-gray-800 pb-2">Reset Password</h2>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input 
            type="email" placeholder="Registered Email ID" 
            className="bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-red-600"
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <button
  type="button"
  onClick={handleSendOTP}
  className="bg-blue-600 py-3 rounded-xl font-bold"
>
  Send OTP
</button>
{otpSent && (
  <input
    type="text"
    placeholder="Enter OTP"
    className="bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-red-600"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    required
  />
)}
          <input 
            type="password" placeholder="Set New Password" 
            className="bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-red-600"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required 
          />

          <button type="submit" className="bg-red-600 py-4 rounded-xl font-black uppercase italic mt-4">Update Password</button>
        </form>
      </div>
    </div>
  );
}
export default ForgotPassword;