import Link from "next/link";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { User, updateProfile } from "firebase/auth";
import { fileToBase64, uploadAndGetPhoto } from "@/utils/helper.util";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import isAuth from "@/hoc/isAuth";

function myProfile() {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    setUserDetails(user);
  }, [user]);

  function handleDisplayChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserDetails({
      ...(userDetails as User),
      displayName: e.target.value,
    });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    fileToBase64(event.target.files[0])?.then((res) => {
      setUserDetails({
        ...(userDetails as User),
        photoURL: res,
      });
    });
  }

  function onSubmit() {
    const toastId = toast.loading("Updating Profile...", {
      position: "top-right",
    });
    uploadAndGetPhoto(userDetails?.email as string, userDetails?.photoURL).then(
      (photoURL) => {
        let updatedDetails: any = {
          displayName: userDetails?.displayName,
        };

        if (photoURL) {
          updatedDetails["photoURL"] = photoURL;
        }

        updateProfile(user as User, updatedDetails)
          .then(() => {
            toast.success("Profile updated successfully", {
              id: toastId,
            });
          })
          .catch((error) => {
            toast.error(error.message, {
              id: toastId,
            });
          });
      }
    );
  }

  return (
    <div className="flex justify-center m-auto items-center p-10 bg-cover" style={{ backgroundImage: "url('../../frontPageBG.png')" }}>
        <div className="bg-white w-1/2 p-10 rounded-xl">
            <Link
                href=''
                onClick={() => router.back()}
                className="flex gap-2 items-center text-red-600 mb-10"
            >
                <ArrowUturnLeftIcon className="text-red-600 h-6 w-6" aria-hidden="true" />
                Back
            </Link>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        This information will be displayed publicly so be careful what you share.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <label className="col-span-full">
                            <div className="block text-sm font-medium leading-6 text-gray-900">
                                Photo
                            </div>
                            <div className="mt-2 flex items-center gap-x-3">
                                <Image
                                    src={userDetails?.photoURL ?? "/default-profile-image.jpg"}
                                    width={48}
                                    height={48}
                                    className="rounded-full h-12 w-12 object-cover border border-b-2"
                                    alt="Profile Picture"
                                />
                                <label
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    <input
                                        onChange={handleFileChange}
                                        type="file"
                                        className="hidden"
                                    />
                                    Change
                                </label>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Display Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    value={userDetails?.displayName ?? ""}
                                    onChange={handleDisplayChange}
                                    autoComplete="given-name"
                                    className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    disabled={true}
                                    defaultValue={userDetails?.email ?? ""}
                                    className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-x-6">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Save
                </button>
            </div>
        </div>
    </div>
);
}

export default isAuth(myProfile);
