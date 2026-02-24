import React, { useState } from "react";
import Lgp from "../assets/Lgp.png";
import Input from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const Handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        {
          email,
          password,
        }
      );
      setLoading(false);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Login Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" min-h-screen grid lg:grid-cols-2 ">
      <div className="hidden lg:flex bg-gradient-to-br from-purple-700 to-blue-800 items-center justify-center">
        <img src={Lgp} alt="" />
      </div>
      <div className="flex flex-col items-center justify-center  ">
        <div className="border border-gray-500 border-3 p-8 rounded  shadow-2xl">
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-br from-orange-600 to-purple-500 bg-clip-text">
              Welcome Back!!
            </h1>
            <p className=" mt-5 flex items-center justify-center">
              Please Sign in to continue to your Dashboard
            </p>
          </div>

          <div className=" flex flex-col items-center justify-center mt-10">
            <Input
              type="email"
              placeholder="eg: abc@xyz.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className=" relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className=" mt-2"
                value={password}
                onKeyDown={(e)=> e.key === 'Enter' && Handlesubmit}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-4 top-5"
                onClick={(e) => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff /> : <FaEye />}
              </button>
            </div>
            {error && <div className="text-red-700">{error}</div>}
            <button
              type="button"
              className="mt-2 w-28 rounded border border-gray-400 p-2 cursor-pointer bg-blue-500 text-white hover:bg-blue-700 hover:text-white transition ease-linear "
              onClick={Handlesubmit}
              
              disabled={loading}
            >
              {loading ? "Logging In" : "Login"}
            </button>
            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-orange-600 font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
