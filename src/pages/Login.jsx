import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Login({ setLoggedUser }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const submitFn = (data) => {
    if (!isValid) return;
    setLoggedUser(data.email);
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div
        className={`
        ${theme === "light" ? "bg-white" : "bg-black"}
        rounded-xl shadow-lg overflow-hidden transition-colors duration-300
      `}
      >
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Giriş Yap</h1>
          <p className="text-blue-100 text-center mt-2">
            Hesabınıza giriş yaparak alışverişe başlayın
          </p>
        </div>

        <form onSubmit={handleSubmit(submitFn)} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              E-posta Adresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="email"
                type="text"
                placeholder="E-posta adresinizi girin"
                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email", {
                  required: "E-posta boş bırakılamaz!",
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Geçerli bir e-posta giriniz!",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Şifrenizi girin"
                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password", {
                  required: "Şifre boş bırakılamaz!",
                  minLength: {
                    value: 6,
                    message: "Şifreniz en az 6 karakterli olmalı!",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/,
                    message: "Şifre en az bir harf ve bir sayı içermelidir",
                  },
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            GİRİŞ YAP
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
