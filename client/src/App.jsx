import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { toast } from "react-toastify";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

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

import {
  FaUserGraduate,
  FaChartBar,
  FaMoon,
  FaSun,
  FaFilePdf,
  FaSignOutAlt,
} from "react-icons/fa";

function App() {

  const role =
    localStorage.getItem("role");

  const userName =
    localStorage.getItem("name");

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

    try {

      const res = await fetch(
        "http://localhost:5000/students"
      );

      const data = await res.json();

      setStudents(data);

    } catch (error) {

      toast.error(
        "Failed to fetch students"
      );

    }

  };

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      window.location.href =
        "/login";

    }

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

    try {

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

        toast.success(
          "Student Updated Successfully"
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

        toast.success(
          "Student Added Successfully"
        );

      }

      setFormData({
        name: "",
        rollNo: "",
        department: "",
        attendance: "",
      });

      fetchStudents();

    } catch (error) {

      toast.error(
        "Something went wrong"
      );

    }

  };

  // Delete Student
  const deleteStudent = async (id) => {

    try {

      await fetch(
        `http://localhost:5000/students/${id}`,
        {
          method: "DELETE",
        }
      );

      toast.error(
        "Student Deleted"
      );

      fetchStudents();

    } catch (error) {

      toast.error(
        "Delete failed"
      );

    }

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  // Export PDF
  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "Smart Campus Analytics Report",
      14,
      15
    );

    autoTable(doc, {

      startY: 25,

      head: [[
        "Name",
        "Roll No",
        "Department",
        "Attendance",
      ]],

      body: students.map(
        (student) => [

          student.name,

          student.rollNo,

          student.department,

          `${student.attendance}%`,
        ]
      ),

    });

    doc.save(
      "student-report.pdf"
    );

    toast.success(
      "PDF Downloaded Successfully"
    );

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

  // Top Performer
  const topPerformer =
    students.length > 0
      ? students.reduce((prev, current) =>
          Number(prev.attendance) >
          Number(current.attendance)
            ? prev
            : current
        )
      : null;

  // Low Attendance
  const lowAttendanceStudents =
    students.filter(
      (student) =>
        Number(student.attendance) < 60
    );

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
          ? "min-h-screen flex bg-gray-900 text-white"
          : "min-h-screen flex bg-gray-100 text-black"
      }
    >

      {/* Sidebar */}
      <motion.div
        initial={{
          x: -100,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="w-72 bg-black text-white p-6 flex flex-col justify-between"
      >

        <div>

          <h1 className="text-3xl font-bold mb-6 text-center">
            Smart Campus
          </h1>

          <div className="bg-gray-800 p-4 rounded-xl mb-10 text-center">

            <p className="text-lg font-semibold">
              Welcome
            </p>

            <p className="text-blue-400 font-bold">
              {userName}
            </p>

            <p className="text-sm mt-2 uppercase">
              {role}
            </p>

          </div>

          <div className="space-y-6">

            <div className="flex items-center gap-3 text-lg hover:text-blue-400 transition">
              <FaChartBar />
              Dashboard
            </div>

            <div className="flex items-center gap-3 text-lg hover:text-blue-400 transition">
              <FaUserGraduate />
              Students
            </div>

            <button
              onClick={exportPDF}
              className="flex items-center gap-3 text-lg hover:text-green-400 transition"
            >
              <FaFilePdf />
              Export PDF
            </button>

          </div>

        </div>

        <div className="space-y-4">

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg w-full hover:scale-105 transition"
          >

            {darkMode
              ? <FaSun />
              : <FaMoon />}

            {darkMode
              ? "Light Mode"
              : "Dark Mode"}

          </button>

          <button
            onClick={() => {

              localStorage.clear();

              window.location.href =
                "/login";

            }}
            className="flex items-center gap-3 bg-red-600 px-4 py-3 rounded-lg w-full hover:scale-105 transition"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">

        <motion.h1
          initial={{
            y: -50,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="text-4xl font-bold mb-8 text-red-600"
        >
          Dashboard Analytics
        </motion.h1>

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

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="bg-white text-black p-6 rounded-xl shadow-md"
          >

            <h2 className="text-xl font-semibold">
              Total Students
            </h2>

            <p className="text-3xl font-bold text-blue-600 mt-3">
              {totalStudents}
            </p>

          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="bg-white text-black p-6 rounded-xl shadow-md"
          >

            <h2 className="text-xl font-semibold">
              Average Attendance
            </h2>

            <p className="text-3xl font-bold text-green-600 mt-3">
              {averageAttendance}%
            </p>

          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="bg-white text-black p-6 rounded-xl shadow-md"
          >

            <h2 className="text-xl font-semibold">
              CSE Students
            </h2>

            <p className="text-3xl font-bold text-purple-600 mt-3">
              {cseStudents}
            </p>

          </motion.div>

        </div>

        {/* Smart Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Top Performer */}
          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg"
          >

            <h2 className="text-2xl font-bold mb-4">
              🏆 Top Performer
            </h2>

            {topPerformer ? (

              <div>

                <p>
                  <strong>Name:</strong>{" "}
                  {topPerformer.name}
                </p>

                <p>
                  <strong>Department:</strong>{" "}
                  {topPerformer.department}
                </p>

                <p>
                  <strong>Attendance:</strong>{" "}
                  {topPerformer.attendance}%
                </p>

              </div>

            ) : (

              <p>No students available</p>

            )}

          </motion.div>

          {/* Low Attendance */}
          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-xl shadow-lg"
          >

            <h2 className="text-2xl font-bold mb-4">
              ⚠ Low Attendance
            </h2>

            {lowAttendanceStudents.length > 0 ? (

              lowAttendanceStudents.map(
                (student) => (

                  <div
                    key={student._id}
                    className="mb-4 pb-3"
                  >

                    <p>
                      <strong>Name:</strong>{" "}
                      {student.name}
                    </p>

                    <p>
                      <strong>Department:</strong>{" "}
                      {student.department}
                    </p>

                    <p>
                      <strong>Attendance:</strong>{" "}
                      {student.attendance}%
                    </p>

                  </div>

                )
              )

            ) : (

              <p>
                No low attendance students
              </p>

            )}

          </motion.div>

        </div>

        {/* Admin Only Add Student */}
        {role === "admin" && (

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
                required
              />

              <input
                type="text"
                name="rollNo"
                placeholder="Roll No"
                value={formData.rollNo}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />

              <input
                type="number"
                name="attendance"
                placeholder="Attendance"
                value={formData.attendance}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >

                {editingId
                  ? "Update Student"
                  : "Add Student"}

              </button>

            </form>

          </div>

        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">

          <div className="bg-white text-black p-6 rounded-xl shadow-md">

            <h2 className="text-2xl font-semibold mb-6">
              Attendance Analytics
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

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

          <div className="bg-white text-black p-6 rounded-xl shadow-md">

            <h2 className="text-2xl font-semibold mb-6">
              Department Distribution
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >

                  {pieData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[index %
                            COLORS.length]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Student Records */}
        <div className="bg-white text-black p-6 rounded-xl shadow-md">

          <h2 className="text-2xl font-semibold mb-6">
            Student Records
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {filteredStudents.map(
              (student) => (

                <motion.div
                  whileHover={{
                    scale: 1.03,
                  }}
                  key={student._id}
                  className="border p-5 rounded-xl shadow-sm"
                >

                  <p>
                    <strong>Name:</strong>{" "}
                    {student.name}
                  </p>

                  <p>
                    <strong>Roll No:</strong>{" "}
                    {student.rollNo}
                  </p>

                  <p>
                    <strong>Department:</strong>{" "}
                    {student.department}
                  </p>

                  <p>
                    <strong>Attendance:</strong>{" "}
                    {student.attendance}%
                  </p>

                  {role === "admin" && (

                    <div className="flex gap-4 mt-4">

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
                          deleteStudent(
                            student._id
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  )}

                </motion.div>

              )
            )}

          </div>

        </div>

      </div>

    </div>

  );
}

export default App;