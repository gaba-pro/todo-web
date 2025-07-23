import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, LogOut, PlusCircle } from "lucide-react";

interface Todo {
  id: number;
  task: string;
  assign: string;
  deskripsi: string;
  dateline: string;
  status: boolean;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decodeJwt = (token: string) => {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    };

    const user = decodeJwt(token);
    setRole(user.role);
    setUsername(user.username);

    axios
      .get("http://localhost:8080/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTodos(res.data);
        } else {
          setErrorMsg("Kamu tidak memiliki Task yang harus dikerjakan");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          Swal.fire("Token tidak valid", "Silakan login ulang", "error");
          router.push("/login");
        } else {
          setErrorMsg("Gagal mengambil data todo.");
        }
      });
  }, []);

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(res.data);
  };
  

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan keluar dari sesi saat ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, logout!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logging out...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        setTimeout(() => {
          localStorage.removeItem("token");
          Swal.close();
          router.push("/login");
        }, 1000);
      }
    });
  };

  const handleCreateTodo = async () => {
    const token = localStorage.getItem("token");

    // Fetch daftar user dari API
    let users: string[] = [];
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter username "assigner"
      users = res.data
  .map((user: { username: string }) => user.username)
  .filter((name: string) => name !== "assigner");
    } catch (err) {
      Swal.fire("Gagal", "Gagal mengambil daftar user", "error");
      return;
    }

    const userOptions = users
      .map(
        (username) =>
          `<option value="${username}" style="color: #333; padding: 8px;">👤 ${username}</option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Tambah Todo",
      html: `
  <input id="task" class="swal2-input" placeholder="Judul Task">
  <input id="deskripsi" class="swal2-input" placeholder="Deskripsi">
  <input id="dateline" type="date" class="swal2-input">
  <select id="assign" class="swal2-input" style="padding: 10px; border-radius: 5px;">
    <option value="">👥 Pilih User</option>
    ${userOptions}
  </select>
`,
      preConfirm: () => {
        const task = (document.getElementById("task") as HTMLInputElement)
          ?.value;
        const deskripsi = (
          document.getElementById("deskripsi") as HTMLInputElement
        )?.value;
        const dateline = (
          document.getElementById("dateline") as HTMLInputElement
        )?.value;
        const assign = (document.getElementById("assign") as HTMLSelectElement)
          ?.value;

        if (!task || !assign || !deskripsi || !dateline) {
          Swal.showValidationMessage("Semua field harus diisi!");
          return;
        }
        return { task, deskripsi, dateline, assign };
      },
    });

    if (formValues) {
      try {
        await axios.post(
          "http://localhost:8080/api/todos",
          {
            task: formValues.task,
            deskripsi: formValues.deskripsi,
            dateline: formValues.dateline,
            assign: formValues.assign,
            status: false,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Berhasil!", "Todo berhasil ditambahkan", "success");
        await fetchTodos();
      } catch (err) {
        Swal.fire("Gagal!", "Gagal menambahkan todo", "error");
      }
    }
  };

  const handleEdit = async (todo: Todo) => {
    const token = localStorage.getItem("token");

    let users: string[] = [];
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      users = res.data.map((user: { username: string }) => user.username)
      .filter((username: string) => username !== "assigner");
    } catch (err) {
      Swal.fire("Gagal", "Gagal mengambil daftar user", "error");
      return;
    }

    const userOptions = users
      .map((username) => {
        const selected = username === todo.assign ? "selected" : "";
        return `<option value="${username}" ${selected}>👤 ${username}</option>`;
      })
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Edit Todo",
      html: `
  <input id="task" class="swal2-input" value="${
    todo.task
  }" placeholder="Judul Task">
  <input id="deskripsi" class="swal2-input" value="${
    todo.deskripsi
  }" placeholder="Deskripsi">
  <input id="dateline" type="date" class="swal2-input" value="${todo.dateline.slice(
    0,
    10
  )}">
  <select id="assign" class="swal2-input" style="padding: 10px; border-radius: 5px;">
    <option value="">👥 Pilih User</option>
    ${userOptions}
  </select>
`,
      preConfirm: () => {
        const task = (document.getElementById("task") as HTMLInputElement)
          ?.value;
        const deskripsi = (
          document.getElementById("deskripsi") as HTMLInputElement
        )?.value;
        const dateline = (
          document.getElementById("dateline") as HTMLInputElement
        )?.value;
        const assign = (document.getElementById("assign") as HTMLSelectElement)
          ?.value;

        if (!task || !assign || !deskripsi || !dateline) {
          Swal.showValidationMessage("Semua field harus diisi!");
          return;
        }
        return { task, deskripsi, dateline, assign };
      },
    });

    if (formValues) {
      try {
        await axios.put(
          `http://localhost:8080/api/todos/${todo.id}`,
          {
            task: formValues.task,
            deskripsi: formValues.deskripsi,
            dateline: formValues.dateline,
            assign: formValues.assign,
            status: todo.status,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Berhasil!", "Todo berhasil diubah", "success");
        await fetchTodos();
      } catch (err) {
        Swal.fire("Gagal!", "Gagal mengubah todo", "error");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/todos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Terhapus!", "Todo berhasil dihapus.", "success");
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } catch (err) {
        Swal.fire("Gagal!", "Gagal menghapus todo", "error");
      }
    }
  };

  const handleConfirmComplete = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:8080/api/todos/${id}/status`,
        { status: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Berhasil!", "Tugas telah dikonfirmasi selesai", "success");
      await fetchTodos();
    } catch (err) {
      Swal.fire("Gagal!", "Gagal mengkonfirmasi tugas", "error");
    }
  };

  const handleStatusChange = async (id: number, newStatus: boolean) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:8080/api/todos/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchTodos();

      Swal.fire("Berhasil!", "Status todo berhasil diperbarui", "success");
    } catch (err) {
      Swal.fire("Gagal!", "Gagal memperbarui status", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">📝 Todo App</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">👤 {username}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">
            Daftar Tugas
          </h2>
          {role === "assigner" && (
            <button
              onClick={handleCreateTodo}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition"
            >
              <PlusCircle size={20} /> Tambah
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : errorMsg ? (
          <p className="text-center text-red-500">{errorMsg}</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-500">
            Tidak ada tugas yang tersedia.
          </p>
        ) : (
          <ul className="space-y-4">
            {todos
  .filter((todo) => role === "assigner" || todo.assign === username)
  .map((todo: Todo) => (
              <div
                key={todo.id}
                className="border p-4 mb-2 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-black">{todo.task}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    Deskripsi: {todo.deskripsi}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Deadline: {new Date(todo.dateline).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Assign: {todo.assign}
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                  {role === "assigner" ? (
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-lg border ${
                        todo.status
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {todo.status ? "✅ Selesai" : "🕒 Belum Selesai"}
                    </span>
                  ) : (
                    <select
                      value={todo.status ? "selesai" : "belum"}
                      onChange={(e) =>
                        handleStatusChange(
                          todo.id,
                          e.target.value === "selesai"
                        )
                      }
                      disabled={todo.assign !== username}
                      className={`text-sm font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                        todo.status
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      <option value="belum">🕒 Belum Selesai</option>
                      <option value="selesai">✅ Selesai</option>
                    </select>
                  )}

                  {role === "assigner" && (
                    <>
                      <button
                        onClick={() => handleEdit(todo)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {role === "assigner" && todo.status && !todo.confirmed && (
                    <button
                      onClick={() => handleConfirmComplete(todo.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Konfirmasi Selesai
                    </button>
                  )}

                  {role !== "assigner" && todo.status && todo.confirmed && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium">
                      ✅ Telah Dikonfirmasi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
