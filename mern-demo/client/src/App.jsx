import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingId, setEditingId] = useState(null);

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

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = (e) => {
    e.preventDefault();

    // =========================
    // CẬP NHẬT SINH VIÊN
    // =========================
    if (editingId) {
      fetch("/api/students/" + editingId, {
        method: "PUT",
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
            throw new Error("Không thể cập nhật sinh viên");
          }

          return response.json();
        })
        .then((data) => {
          console.log("Cập nhật thành công:", data);

          setStudentId("");
          setName("");
          setEmail("");
          setEditingId(null);

          fetchStudents();

          alert("Cập nhật sinh viên thành công!");
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });

      return;
    }

    // =========================
    // THÊM SINH VIÊN
    // =========================
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
        console.log("Thêm thành công:", data);

        setStudentId("");
        setName("");
        setEmail("");

        fetchStudents();

        alert("Thêm sinh viên thành công!");
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  // =========================
  // CHỌN SINH VIÊN ĐỂ SỬA
  // =========================
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // =========================
  // HỦY SỬA
  // =========================
  const handleCancelEdit = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // =========================
  // XÓA SINH VIÊN
  // =========================
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?",
    );

    if (!confirmDelete) {
      return;
    }

    fetch("/api/students/" + id, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể xóa sinh viên");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Xóa sinh viên thành công:", data);

        fetchStudents();

        alert("Xóa sinh viên thành công!");
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  return (
    <div>
      <h1>Danh sách sinh viên</h1>

      {/* FORM THÊM / CẬP NHẬT */}
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
          {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <>
            {" "}
            <button type="button" onClick={handleCancelEdit}>
              Hủy sửa
            </button>
          </>
        )}
      </form>

      <hr />

      {/* TRẠNG THÁI */}
      {loading && <p>Đang tải dữ liệu...</p>}

      {error && <p>{error}</p>}

      {/* DANH SÁCH SINH VIÊN */}
      {!loading && !error && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>

                <td>{student.name}</td>

                <td>{student.email}</td>

                <td>
                  {/* NÚT SỬA */}
                  <button onClick={() => handleEdit(student)}>Sửa</button>{" "}
                  {/* NÚT XÓA */}
                  <button onClick={() => handleDelete(student._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
