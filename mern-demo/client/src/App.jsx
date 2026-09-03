import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Lấy danh sách sinh viên
  const fetchStudents = () => {
    setLoading(true);
    setError("");

    fetch("/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể lấy danh sách sinh viên");
        }

        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  };

  // Chạy khi mở trang
  useEffect(() => {
    fetchStudents();
  }, []);

  // Thêm sinh viên
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/students", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        studentId: studentId,
        name: name,
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể thêm sinh viên");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Thêm sinh viên thành công:", data);

        // Xóa form
        setStudentId("");
        setName("");
        setEmail("");

        // Tải lại danh sách
        fetchStudents();

        alert("Thêm sinh viên thành công!");
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  return (
    <div>
      <h1>Danh sách sinh viên</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>

          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
            required
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <br />

        <div>
          <label>Email: </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>

        <br />

        <button type="submit">
          Thêm sinh viên
        </button>
      </form>

      <hr />

      {loading && <p>Đang tải dữ liệu...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;