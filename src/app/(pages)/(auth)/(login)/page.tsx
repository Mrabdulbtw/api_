"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";


export type Fields = {
  email: string;
  password: string;
};


export default function Page() {

  const router = useRouter();

  const [msg, setMsg] = useState<string>("");
  const [fields, setFields] = useState<Fields>({
    email: "",
    password: ""
  });

  const [error, setError] = useState({
    email_err: "",
    password_err: "",
  });

  const [showPass, setShowPass] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async() => {
    console.log(fields);

    const isValid: boolean = validation();
    if (isValid) {
     
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: fields.email,
          password: fields.password
        }),
      });
    
      const { status, msg } = await res.json();
      setMsg(msg);
    
      if (status) {
        router.push('/notes');
      }
    }
  };


  const validation = (): boolean => {
    let isValid = true;
    let newErrors = {
      email_err: "",
      password_err: "",
    };
    if (!fields.email.trim()) {
      newErrors.email_err = "Email is required";
      isValid = false;
    } else {
      const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegEx.test(fields.email.trim())) {
        newErrors.email_err = "Email is not valid";
        isValid = false;
      }
    }

    if (!fields.password.trim()) {
      newErrors.password_err = "Password is required";
      isValid = false;
    }
    setError(newErrors);
    return isValid;
  };

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold text-gray-900 md:text-2xl">
              Login
            </h1>

            {
              msg.length > 0 && (
                <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
                  {msg}
                </div>
              )
            }

            <div className="space-y-4 md:space-y-6">
              <div>
                <label  htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  value={fields.email}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  placeholder="name@gamil.com"
                  required
                />
                <span className="text-red-700 text-sm">{error.email_err}</span>
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full  flex items-center">
                  <input
                    onChange={handleChange}
                    type={!showPass ? "password" : "text"}
                    name="password"
                    value={fields.password}
                    id="password"
                    placeholder="*****"
                    className="w-full bg-transparent text-gray-900 text-sm rounded-lg  h-full  pr-10 p-2.5"
                    required
                  />
                  <span onClick={() => setShowPass(!showPass)} className="absolute right-3">
                    <Image className="cursor-pointer" src={!showPass ? "./eye-close.svg" : "./eye-open.svg"} alt="Eye Open" width={20} height={20} />
                  </span>
                </div>
                <span className="text-red-700 text-sm">{error.password_err}</span>
              </div>


              <button onClick={handleSubmit} type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Login
              </button>

              <p className="text-sm font-light text-gray-500">
                If  you don't have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:underline">
                  Signup
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

