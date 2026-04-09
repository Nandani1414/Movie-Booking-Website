import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (data.token) {
        // Token save karna
        localStorage.setItem("token", data.token);

       localStorage.setItem("user", JSON.stringify(data.user)); // Smart Redirect Logic: Check if there is a saved path
        const redirectTo = sessionStorage.getItem("redirectTo") || "/";
        sessionStorage.removeItem("redirectTo"); // Memory clear karna

        alert("Login successful");
        
        // Seedha target page par bhejna
        window.location.href = redirectTo; 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong with the login!");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white font-sans">
      <div className="bg-gray-900 p-10 rounded-lg w-96 shadow-2xl">
        
        <h1 className="text-3xl font-bold mb-6 text-center italic uppercase tracking-tighter text-red-600">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter email"
            className="p-3 rounded bg-gray-800 border border-transparent focus:border-red-500 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            className="p-3 rounded bg-gray-800 border border-transparent focus:border-red-500 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-red-600 p-3 rounded font-bold hover:bg-red-700 transition uppercase italic"
          >
            Login
          </button>
        </form>
        {/* --- FORGOT PASSWORD LINK START --- */}
        <div className="text-center mt-4">
          <p 
            onClick={() => navigate("/forgot-password")} 
            className="text-[10px] text-gray-500 uppercase font-black tracking-widest cursor-pointer hover:text-red-500 transition-colors"
          >
            Forgot Password? Reset Here
          </p>
        </div>
        {/* --- FORGOT PASSWORD LINK END --- */}

        

        <p className="text-center mt-6 text-sm text-gray-400">
          New user?{" "}
          <a href="/register" className="text-red-500 hover:underline font-bold">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;