import React, { useState, forwardRef, useImperativeHandle } from "react";

const PasswordInput = forwardRef(
  ({ id, label, placeholder, validateRegex = false, onChange }, ref) => {
    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
      const value = e.target.value;
      setPassword(value);

      if (validateRegex) {
        const regex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>?]).{10,255}$/;

        setIsPasswordValid(regex.test(value));
      }

      if (typeof onChange === "function") {
        onChange(value); // Llama a la función onChange si está definida
      }
    };

    useImperativeHandle(ref, () => ({
      getValue: () => password,
      isPasswordValid: () => isPasswordValid,
    }));

    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 font-bold mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            className={`w-full rounded-md p-2 pr-7 border ${
              !isPasswordValid && validateRegex
                ? "border-red-500"
                : "border-gray-400"
            } focus:outline-none focus:border-indigo-500`}
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            placeholder={placeholder}
            value={password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute top-1/2 transform -translate-y-1/2 right-0 p-1 rounded focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "🙉" : "🙈"}
          </button>
        </div>
        {!isPasswordValid && validateRegex && (
          <p className="text-red-500 text-sm mt-1">
            Password should contain at least one uppercase letter, one lowercase
            letter, one number, one special character, and be between 10 and 255
            characters long.
          </p>
        )}
      </div>
    );
  }
);

export default PasswordInput;
