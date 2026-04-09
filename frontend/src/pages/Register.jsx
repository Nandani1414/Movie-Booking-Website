
import { useState } from "react";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);


// const handleRegister = async (e) => {
//   e.preventDefault();

//   try {

//     const res = await fetch("http://localhost:5001/api/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         name,
//         email,
//         password
//       })
//     });

//     const data = await res.json();

//     alert(data.message);

//     window.location.href = "/login";

//   } catch (error) {
//     console.log(error);
//   }
// };
const handleRegister = async (e) => {
  e.preventDefault();

  try {

    const res = await fetch("http://localhost:5001/api/auth/send-register-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email
      })
    });

    const data = await res.json();

    alert("OTP sent to your email");

    setOtpSent(true);

  } catch (error) {
    console.log(error);
  }
};
const verifyOtp = async () => {

  const res = await fetch("http://localhost:5001/api/auth/verify-register-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password,
      otp
    })
  });

  const data = await res.json();

  alert(data.message);

  if (data.success) {
    window.location.href = "/login";
  }

};
  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white">

      <div className="bg-gray-900 p-10 rounded-lg w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <input
  type="text"
  placeholder="Enter name"
  className="p-3 rounded bg-gray-800"
  value={name}
  pattern="^[A-Za-z ]+$"
  title="Name should contain only letters"
  onChange={(e) => setName(e.target.value)}
  required
/>

         <input
         type="email"
        placeholder="Enter email"
         className="p-3 rounded bg-gray-800"
         value={email}
         pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
         title="Please enter a valid email address"
         onChange={(e) => setEmail(e.target.value)}
         required
/>
          <input
            type="password"
            placeholder="Create password"
            className="p-3 rounded bg-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {otpSent && (
  <input
    type="text"
    placeholder="Enter OTP"
    className="p-3 rounded bg-gray-800"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
  />
)}

          {otpSent ? (
  <button
    type="button"
    onClick={verifyOtp}
    className="bg-green-500 p-3 rounded"
  >
    Verify OTP
  </button>
) : (
  <button
    className="bg-red-500 p-3 rounded"
  >
    Send OTP
  </button>
)}

        </form>

      </div>

    </div>
  );
}

export default Register;