import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { User } from "@/models/user.model";

export default function Home() {
  const { signInAccount, isLoading } = useAuthContext();
  const [state, setState] = useState<User>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  function onSubmit() {
    signInAccount({ ...state });
  }

  return (
    <>
      <div className="flex min-h-screen">
    <div className="w-4/5 flex flex-col justify-center items-center bg-white px-6 py-12 relative">
      <div className="absolute top-6 left-6 flex items-center">
        <Link href={'/'}>
          <p className="font-inter font-bold text-gray-900">TRAVELBLOG</p>
        </Link>
        <div className="h-4 w-4 bg-[#7FA4EE] rounded-full ml-2"></div>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-3x1 text-center">
        <h2 className="mt-10 mb-5 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900 w-full">
          LOGIN TO YOUR ACCOUNT
        </h2>
        <label style={{ fontFamily: 'Inter, sans-serif' }}>Login using your email</label>
        <div className="border-t border-gray-300 mt-12 mb-0 w-2/3 mx-auto"></div>
      </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <div className="mt-0">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    required
                    value={state.email}
                    onChange={handleChange}
                    className="px-3 h-12 block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#CDE2DF]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between"></div>
                <div className="mt-0">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    required
                    value={state.password}
                    onChange={handleChange}
                    className="px-3 block w-full h-12 rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#CDE2DF]"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={onSubmit}
                  type="button"
                  className="flex w-1/2 justify-center rounded-full bg-[#234F91] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#234F91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('../../loginBG.png')" }}>
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50">
            <h2 className="text-white text-4xl font-bold mb-6">NEW HERE?</h2>
            <label style={{color: "#FFF"}}> Don't miss out! Sign up now and let the adventure begin!</label>
            <Link href="/register">
              <button className="mt-10 w-full rounded-full bg-[#234F91] px-14 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#234F91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}