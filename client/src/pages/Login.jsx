import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] =
    useState(true);

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

    const url = isLogin
      ? "http://localhost:5000/auth/login"
      : "http://localhost:5000/auth/register";

    const res = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (isLogin) {

      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

        alert("Login Successful");

        navigate("/");

      } else {

        alert(data.message);

      }

    } else {

      alert(data.message);

      setIsLogin(true);

    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">

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
            />

          )}

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
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >

            {isLogin
              ? "Login"
              : "Register"}

          </button>

        </form>

        <p className="text-center mt-4">

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