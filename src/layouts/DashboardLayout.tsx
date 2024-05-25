import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from "next/link";
import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import { useAuthContext } from "@/context/AuthContext";

const navigation = [
  { name: 'HOME', href: '/dashboard' },
  { name: 'ABOUT US', href: '/about' },
  { name: 'CONTACT US', href: '/contact' },
  { name: 'BLOG', href: '/blog' },
];

const userNavigation = [
  { name: 'YOUR PROFILE', href: '/profile' },
  { name: 'MY BLOGS', href: '/myblogs'},
  { name: 'SIGN OUT', href: '/' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type ComponentProps = {
  children: React.ReactNode,
  title?: string
}

export default function DashboardLayout({ children, title = "" }: ComponentProps) {
  const router = useRouter();
  const { logout } = useAuthContext();
  const { user } = useUser();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('../../dashboardBG.png')" }}></div>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10">
        <Disclosure as="header" className="bg-transparent">
          {({ open }) => (
            <>
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                  {/* Left Drop Down List */}
                  <div className="flex items-center">
                    <Menu as="div" className="items-center">
                        <div>
                        <Menu.Button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </Menu.Button>
                        </div>
                        <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200 delay-100"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-150 delay-50"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                        >
                        <Menu.Items className="absolute rounded py-2 mt-2 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                            {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                                {({ active }) => (
                                <Link
                                    href={item.href}
                                    className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block w-full px-4 text-xs text-center font-inter',
                                    item.name === 'SIGN OUT' ? 'text-white' : 'text-black',
                                    )}
                                    onClick={item.name === 'SIGN OUT' ? logout : undefined}
                                >
                                    <div
                                        className={classNames(
                                            item.name === 'SIGN OUT' ? 'px-6 py-2 mt-4 bg-black rounded-full font-bold' : 'px-6 py-2 border rounded-full font-bold'
                                        )}
                                    >
                                     {item.name}
                                    </div>
                                </Link>
                                )}
                            </Menu.Item>
                            ))}
                        </Menu.Items>
                        </Transition>
                    </Menu>
                    <div className='ml-5 text-sm text-white'>
                      {user?.displayName}
                    </div>
                    </div>
                  {/* Center Navigation Links */}
                  <div className="flex w-1/2 justify-between mt-10">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`rounded-md py-3 text-sm font-inter text-white px-10 ${
                            router.pathname === '/dashboard' && item.href === '/dashboard' ? 'border' : ''
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                  </div>
                  {/* Right Website Title */}
                  <div className="flex items-center">
                        <p className="font-inter text-white text-sm">TRAVELBLOG</p>
                        <div className="h-4 w-4 bg-[#7FA4EE] rounded-full ml-2"></div>
                    </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>
        <main className='flex items-center justify-center'>
        <div className='items-center justify-center w-1/2'>
            <h2 className='text-white font-bold mt-12 text-center' style={{ fontSize: '3rem', marginTop: '120px' }}>
                EXPLORE THE BEAUTY OF THE PHILIPPINES
            </h2>
            <label className='flex text-white font-inter text-center mt-10 text-sm w-full'>
                Welcome to Explore the Beauty of the Philippines, your ultimate guide to discovering the breathtaking landscapes, vibrant culture, and hidden gems of this tropical paradise.
            </label>
        </div>
        </main>
      </div>
    </div>
  );
}