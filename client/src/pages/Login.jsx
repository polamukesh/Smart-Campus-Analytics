import { useState } from "react";

import { toast } from "react-toastify";

function Login() {

  const [isLogin, setIsLogin] =
    useState(true);

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

      role: "student",

    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const endpoint =
        isLogin
          ? "login"
          : "register";

      const res = await fetch(

        `http://localhost:5000/auth/${endpoint}`,

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),

        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(
          data.message
        );

        return;

      }

      // LOGIN
      if (isLogin) {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "role",
          data.role
        );

        localStorage.setItem(
          "name",
          data.name
        );

        toast.success(
          "Login Successful"
        );

        window.location.href =
          "/";

      } else {

        toast.success(
          "Registration Successful"
        );

        setIsLogin(true);

      }

    } catch (error) {

      toast.error(
        "Something went wrong"
      );

    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-900">

      <div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-8">

          {isLogin
            ? "Login"
            : "Register"}

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {!isLogin && (

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          {!isLogin && (

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >

              <option value="student">
                Student
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >

            {isLogin
              ? "Login"
              : "Register"}

          </button>

        </form>

        <p className="text-center mt-6">

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="text-blue-600 ml-2"
          >

            {isLogin
              ? "Register"
              : "Login"}

          </button>

        </p>

      </div>

    </div>

  );

}

export default Login;