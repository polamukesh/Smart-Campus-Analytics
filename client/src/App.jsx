import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    department: "",
    attendance: "",
  });

  // Fetch students
  const fetchStudents = () => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/students/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      name: "",
      rollNo: "",
      department: "",
      attendance: "",
    });

    fetchStudents();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Smart Campus Analytics</h1>

      <h2>Add Student</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="rollNo"
          placeholder="Roll No"
          value={formData.rollNo}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="attendance"
          placeholder="Attendance"
          value={formData.attendance}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Add Student</button>
      </form>

      <hr />

      <h2>Student List</h2>

      {students.map((student) => (
        <div
          key={student._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Roll No:</strong> {student.rollNo}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Attendance:</strong> {student.attendance}%</p>
        </div>
      ))}
    </div>
  );
}

export default App;