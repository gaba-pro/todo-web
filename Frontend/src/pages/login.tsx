import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);

      Swal.fire({
        title: "Berhasil Login!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      router.push("/todos");
    } catch {
      Swal.fire({
        title: "Login Gagal",
        text: "Username atau password salah",
        icon: "error",
        confirmButtonText: "Coba Lagi",
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Kiri - Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-10">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Selamat Datang 👋</h2>
          <p className="text-gray-500">Silakan login untuk melanjutkan</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              className="w-full px-4 py-2 border  text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="w-full px-4 py-2 border  text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Kanan - Gambar */}
      <div className="hidden md:block w-1/2">
        <img
          src="/login.png"
          alt="Login Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
