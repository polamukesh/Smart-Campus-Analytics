import { useState } from "react";

function Register() {

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost:5000/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    alert(data.message);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg"
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;