import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { User } from "@/models/user.model";
import { fileToBase64 } from "@/utils/helper.util";

export default function Register() {

  const { createAccount, isLoading } = useAuthContext();

  const [state, setState] = useState<User>({ email: '', password: '', displayName: '', photoURL: '' });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  function onSubmit() {
    if (!state.photoURL || !state.displayName || !state.email || !state.password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (state.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    createAccount({ ...state }).then(() => {
      setState({ 
        email: '', 
        password: '',
        displayName: '',
        photoURL: ''
      });
      setConfirmPassword('');
      setError(null);
    }).catch(() => {});
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    fileToBase64(event.target.files[0])?.then((res) => {
      setState({ ...state, photoURL: res });
    });
  }

  return (
    <>
      <div className="relative min-h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('../../loginBG.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative bg-white shadow-lg p-8 max-w-2x1 w-3/6 mx-4">
          <div className="absolute top-6 left-6 flex items-center">
            <p className="font-inter text-sm font-bold text-gray-900">TRAVELBLOG</p>
            <div className="h-4 w-4 bg-[#7FA4EE] rounded-full ml-2"></div>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            <h2 className="mt-12 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
              SIGN UP
            </h2>
            <label className="font-inter px-10 text-sm mt-5 flex text-center">
              Unlock a world of exclusive content, special offers, and personalized experiences by signing up to our platform.
            </label>
            <div className="border-t border-gray-300 m-5 mb-0 w-full mx-auto"></div>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
            <form className="space-y-4">
              <div className="w-full flex items-center justify-center">
                <label className="flex items-center justify-center w-40 h-40 border border-gray-300 text-gray-500 rounded-full">
                  <input 
                    onChange={handleFileChange}
                    type="file" 
                    className="hidden"/>
                  {state.photoURL ? (
                    <img 
                      className="w-full h-full rounded-full object-cover" 
                      src={state.photoURL} 
                      alt="" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <i className="ph ph-image text-3xl"></i>
                      <div className="text-sm pt-2">Select Photo</div>
                    </div>
                  )}
                </label>
              </div>

              {error && (
                <div className="text-red-500 text-center">
                  {error}
                </div>
              )}
              
              <div>
                <div className="mt-2">
                  <input
                    name="displayName"
                    placeholder="Name"
                    required
                    value={state.displayName}
                    onChange={handleChange}
                    className="px-3 block w-full rounded-full h-12 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-[#CDE2DF]"
                  />
                </div>
              </div>
              <div>
                <div className="border-t border-gray-300 m-5 w-full mx-auto"></div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    required
                    value={state.email}
                    onChange={handleChange}
                    className="px-3 block w-full rounded-full h-12 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-[#CDE2DF]"/>
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={state.password}
                    onChange={handleChange}
                    className="px-3 block w-full rounded-full h-12 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-[#CDE2DF]"
                  />
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="px-3 block w-full rounded-full h-12 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-[#CDE2DF]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onSubmit}
                  className="flex w-1/2 justify-center rounded-full bg-[#234F91] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#234F91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Sign Up
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Already have an account? &nbsp;
              <Link 
                href="/login"
                className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
