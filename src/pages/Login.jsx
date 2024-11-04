import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
function Login({ setLoggedUser }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const submitFn = (data) => {
    if (!isValid) return;

    setLoggedUser(data.email);
    navigate("/");
  };

  const [clicked, setClicked] = useState(false);
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } flex flex-col justify-center items-center `}
    >
      <h1 className="font-bold text-2xl border-b-2 border-black">LOGIN</h1>
      <form
        action="submit"
        onClick={handleSubmit(submitFn)}
        className="flex flex-col items-center p-4 gap-4"
      >
        <div className="flex flex-col gap-2 font-barlow font-semibold w-full">
          <label htmlFor="email" className="text-sm">
            Email :
          </label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            className="border w-full text-black p-2 rounded-2xl text-sm sm:text-base"
            {...register("email", {
              required: "Email boş bırakılamaz!",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Geçerli bir email giriniz !",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 font-barlow font-semibold">
          <label htmlFor="password" className="text-sm">
            Şifre :
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              type={clicked ? "text" : "password"}
              placeholder="Parola"
              className="border p-2  w-full text-black  rounded-2xl text-sm sm:text-base"
              {...register("password", {
                required: "Şifre boş bırakılamaz !",
                minLength: {
                  value: 6,
                  message: "Şifreniz en az 6 karakterli olmalı !",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/,
                  message: "Şifre en az bir harf ve bir sayı içermelidir",
                },
              })}
            />

            <button
              type="button"
              className="absolute right-2"
              onClick={() => setClicked(!clicked)}
            >
              {clicked ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <button className="bg-blue-500 py-2 px-4 rounded-full text-white hover:bg-blue-400">
            GİRİŞ YAP
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
