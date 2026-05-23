import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function App() {

  const [students, setStudents] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      rollNo: "",
      department: "",
      attendance: "",
    });

  // Fetch Students
  const fetchStudents = async () => {

    const res = await fetch(
      "http://localhost:5000/students"
    );

    const data = await res.json();

    setStudents(data);

  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Input
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Add / Update Student
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (editingId) {

      await fetch(
        `http://localhost:5000/students/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      setEditingId(null);

    } else {

      await fetch(
        "http://localhost:5000/students/add",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

    }

    setFormData({
      name: "",
      rollNo: "",
      department: "",
      attendance: "",
    });

    fetchStudents();

  };

  // Delete Student
  const deleteStudent = async (id) => {

    await fetch(
      `http://localhost:5000/students/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchStudents();

  };

  // Edit Student
  const editStudent = (student) => {

    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      department: student.department,
      attendance: student.attendance,
    });

    setEditingId(student._id);

  };

  // Filter Students
  const filteredStudents =
    students.filter((student) => {

      const matchesSearch =
        student.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDepartment =
        departmentFilter === ""
          ? true
          : student.department
              .toUpperCase() ===
            departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );

    });

  // Dashboard Values
  const totalStudents =
    filteredStudents.length;

  const averageAttendance =
    filteredStudents.length > 0
      ? (
          filteredStudents.reduce(
            (acc, student) =>
              acc +
              Number(student.attendance),
            0
          ) / filteredStudents.length
        ).toFixed(1)
      : 0;

  const cseStudents =
    filteredStudents.filter(
      (student) =>
        student.department
          .toUpperCase() === "CSE"
    ).length;

  // Pie Chart Data
  const pieData = [

    {
      name: "CSE",
      value: students.filter(
        (s) =>
          s.department.toUpperCase() ===
          "CSE"
      ).length,
    },

    {
      name: "ECE",
      value: students.filter(
        (s) =>
          s.department.toUpperCase() ===
          "ECE"
      ).length,
    },

    {
      name: "EEE",
      value: students.filter(
        (s) =>
          s.department.toUpperCase() ===
          "EEE"
      ).length,
    },

    {
      name: "MECH",
      value: students.filter(
        (s) =>
          s.department.toUpperCase() ===
          "MECH"
      ).length,
    },

  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#9333ea",
  ];

  return (

    <div
      className={
        darkMode
          ? "min-h-screen bg-gray-900 text-white p-6"
          : "min-h-screen bg-gray-100 p-6"
      }
    >

      <div className="max-w-7xl mx-auto">

        {/* Top Buttons */}
        <div className="flex justify-between mb-6">

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>

          <button
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              window.location.href =
                "/login";

            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-red-600 mb-8">
          Smart Campus Analytics
        </h1>

        {/* Search & Filter */}
        <div className="bg-white text-black p-6 rounded-xl shadow-md mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <select
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          >

            <option value="">
              All Departments
            </option>

            <option value="CSE">
              CSE
            </option>

            <option value="ECE">
              ECE
            </option>

            <option value="EEE">
              EEE
            </option>

            <option value="MECH">
              MECH
            </option>

          </select>

        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white text-black p-6 rounded-xl shadow-md">

            <h2 className="text-xl font-semibold mb-2">
              Total Students
            </h2>

            <p className="text-3xl font-bold text-blue-600">
              {totalStudents}
            </p>

          </div>

          <div className="bg-white text-black p-6 rounded-xl shadow-md">

            <h2 className="text-xl font-semibold mb-2">
              Average Attendance
            </h2>

            <p className="text-3xl font-bold text-green-600">
              {averageAttendance}%
            </p>

          </div>

          <div className="bg-white text-black p-6 rounded-xl shadow-md">

            <h2 className="text-xl font-semibold mb-2">
              CSE Students
            </h2>

            <p className="text-3xl font-bold text-purple-600">
              {cseStudents}
            </p>

          </div>

        </div>

        {/* Form */}
        <div className="bg-white text-black p-6 rounded-xl shadow-md mb-10">

          <h2 className="text-2xl font-semibold mb-6">

            {editingId
              ? "Update Student"
              : "Add Student"}

          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="rollNo"
              placeholder="Roll No"
              value={formData.rollNo}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="attendance"
              placeholder="Attendance"
              value={formData.attendance}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg"
            >

              {editingId
                ? "Update Student"
                : "Add Student"}

            </button>

          </form>

        </div>

        {/* Bar Chart */}
        <div className="bg-white text-black p-6 rounded-xl shadow-md mb-10">

          <h2 className="text-2xl font-semibold mb-6">
            Attendance Analytics
          </h2>

          <div style={{ width: "100%", height: 300 }}>

            <ResponsiveContainer>

              <BarChart
                data={filteredStudents}
              >

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="attendance"
                  fill="#2563eb"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Pie Chart */}
        <div className="bg-white text-black p-6 rounded-xl shadow-md mb-10">

          <h2 className="text-2xl font-semibold mb-6">
            Department Distribution
          </h2>

          <div style={{ width: "100%", height: 400 }}>

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={130}
                  label
                >

                  {pieData.map(
                    (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Student List */}
        <div>

          <h2 className="text-2xl font-semibold mb-6">
            Student List
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {filteredStudents.map(
              (student) => (

              <div
                key={student._id}
                className="bg-white text-black p-6 rounded-xl shadow-md"
              >

                <p className="mb-2">
                  <strong>Name:</strong>{" "}
                  {student.name}
                </p>

                <p className="mb-2">
                  <strong>Roll No:</strong>{" "}
                  {student.rollNo}
                </p>

                <p className="mb-2">
                  <strong>Department:</strong>{" "}
                  {student.department}
                </p>

                <p className="mb-4">
                  <strong>Attendance:</strong>{" "}
                  {student.attendance}%
                </p>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      editStudent(student)
                    }
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteStudent(student._id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );
}

export default App;