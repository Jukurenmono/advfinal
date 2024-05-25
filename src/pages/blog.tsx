import React, { useState, useEffect, Fragment } from 'react';
import { collection, addDoc, getDocs, getDoc, setDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthContext } from "@/context/AuthContext";
import { HeartIcon } from '@heroicons/react/24/solid';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Link from 'next/link';
import useUser from '@/hooks/useUser';

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

const regions = ['Luzon', 'Visayas', 'Mindanao'];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type Post = {
  id: string;
  userName: string;
  text: string;
  imageUrl: string;
  createdAt: Timestamp;
  userId: string;
  upvotes: number;
  userProfilePhoto: string;
  usersLiked: string[];
  comments: {
    text: string;
    userId: string;
    createdAt: Timestamp;
  }[];
};

type ComponentProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Blog({ children, title = "" }: ComponentProps) {
  const router = useRouter();
  const { logout } = useAuthContext();
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [postText, setPostText] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  const updateTagCollection = async (postId: string) => {
    if (!selectedRegion) return;

    // Check if the selected region exists in the tags collection
    const tagRef = doc(db, 'tags', selectedRegion);
    const tagSnap = await getDoc(tagRef);

    if (tagSnap.exists()) {
      // Update the document with the postId
      await updateDoc(tagRef, {
        postId: [...tagSnap.data().postId, postId]
      });
    } else {
      // Create a new document for the region and add the postId
      await setDoc(tagRef, {
        postId: [postId]
      });
    }
  };



  const fetchPosts = async () => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
    setPosts(postsData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(post => post.id === postId);
    if (!post) {
      console.error(`Post with ID ${postId} not found.`);
      return;
    }

    const isLiked = post.usersLiked.includes(user?.uid || '');
    const postRef = doc(db, 'posts', postId);
  
    if (!isLiked) {
      await updateDoc(postRef, {
        upvotes: post.upvotes + 1,
        usersLiked: [...post.usersLiked, user?.uid || '']
      });
      setLikedPosts([...likedPosts, postId]);
    } else {
      const updatedLikedPosts = likedPosts.filter(id => id !== postId);
      await updateDoc(postRef, {
        upvotes: post.upvotes - 1,
        usersLiked: post.usersLiked.filter(userId => userId !== user?.uid)
      });
      setLikedPosts(updatedLikedPosts);
    }
  
    fetchPosts();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText || !image || !selectedRegion) return;
  
    let imageUrl = '';
    if (image) {
      const storage = getStorage();
      const imageRef = ref(storage, 'images/' + image.name);
      await uploadBytes(imageRef, image);
  
      imageUrl = await getDownloadURL(imageRef);
    }

    const postDocRef = await addDoc(collection(db, 'posts'), {
      text: postText,
      userName: user?.displayName,
      userProfilePhoto: user?.photoURL,
      imageUrl,
      createdAt: Timestamp.now(),
      userId: user?.uid,
      upvotes: 0,
      usersLiked: [],
      comments: [],
    });

    await updateTagCollection(postDocRef.id);

    setPostText('');
    setImage(null);
    fetchPosts();
  };

  const handleAddTag = async (tagName: string) => {
    await addDoc(collection(db, 'tags'), {
      name: tagName,
    });
  };

  const handleAddComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
  
    // Get the textarea value containing the comment
    const commentTextArea = e.currentTarget.querySelector('textarea');
    if (!commentTextArea) return;
  
    const commentText = commentTextArea.value.trim();
    if (!commentText) return; // Don't add empty comments
  
    // Get the user's display name
    const commenterName = user?.displayName || 'Anonymous';
  
    // Add the comment to the database
    const commentDocRef = await addDoc(collection(db, 'comments'), {
      postId,
      userId: user?.uid,
      userName: commenterName, // Include the commenter's name
      text: commentText,
      createdAt: Timestamp.now(),
    });
  
    // Clear the textarea after submitting the comment
    commentTextArea.value = '';
  
    // Update the UI by adding the new comment to the post
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: commentDocRef.id,
                  userId: user?.uid || '',
                  userName: commenterName, // Include the commenter's name
                  text: commentText,
                  createdAt: Timestamp.now(),
                },
              ],
            }
          : post
      )
    );
  };
  
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('../../dashboardBG.png')" }}></div>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10">
        <Disclosure as="header" className="bg-transparent">
          {({ open }) => (
            <>
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 w-full justify-between items-center">
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
                                    active ? '' : '',
                                    'block w-full px-4 mt-2 text-xs text-center font-inter',
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
                          router.pathname === '/blog' && item.href === '/blog' ? 'border' : ''
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
        <main className="flex flex-row justify-center items-start p-6">
        {/* Input Section */}
        <div className="w-full bg-white p-5 rounded-xl max-w-md mr-6">
          <h1 className='text-center font-bold font-inter p-2'>
            WRITE YOUR BLOG
          </h1>
          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Write your post..."
              className="w-full p-2 mb-4 border-2 rounded resize-none"
              maxLength={50}
            />
            <input type="file" onChange={handleImageChange} className="w-full mb-4" />
            <div className="mb-4">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                id="region"
                name="region"
                className="mt-1 border block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-black sm:text-sm rounded-md"
                value={selectedRegion}
                onChange={handleRegionChange}
              >
                <option value="">Select a region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full p-2 bg-[#234F91] text-white rounded-full">
              Post
            </button>
          </form>
        </div>
        {/* Posts Section */}
        <div>
          <div className="bg-gray-300 h-full">
            <div className='border bg-white p-4 items-center'>
              <h1 className="font-inter font-bold">COMMUNITY BLOGS</h1>
            </div>
            <div className="w-[690px] overflow-y-auto h-[350px]">
              <div className="p-10">
                {posts.length === 0 ? (
                  <p>No current blogs</p>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="bg-white rounded mb-5 border shadow">
                      <div className='flex items-center font-inter w-full border p-4'>
                        <Image
                          src={post.userProfilePhoto ?? '/default-profile-image.jpg'}
                          width={48}
                          height={48}
                          className="rounded-full h-12 w-12 object-cover border border-black-2"
                          alt="Profile Picture"
                        />
                        <p className='ml-5 font-bold'>
                          {post.userName}
                        </p>
                      </div>
                        {post.imageUrl && (
                          <img src={post.imageUrl} alt="Post image" className="w-full p-4 rounded" />
                        )}
                      <div className='flex justify-between items-center p-4 border'>
                      <div>
                        <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {expanded || post.text.length <= 20
                            ? post.text
                            : `${post.text.slice(0, 20)}...`}
                        </p>
                        {post.text.length > 20 && (
                          <button onClick={toggleExpanded} className="text-blue-500">
                            {expanded ? "See Less" : "See More..."}
                          </button>
                        )}
                        <p className="text-xs text-gray-500">
                          {post.createdAt.toDate().toLocaleString()}
                        </p>
                      </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={classNames(
                              'text-sm rounded-full p-2 bg-transparent',
                              post.usersLiked.includes(user?.uid || '') ? 'text-red-500' : 'text-gray-500'
                            )}
                          >
                            <HeartIcon className="h-8 w-8" />
                          </button>
                          <span className="ml-1">{post.upvotes}</span>
                        </div>
                      </div>
                      {/* Add Comment Section */}
                      <form onSubmit={(e) => handleAddComment(e, post.id)} className="px-4 pb-4 border-t">
                        <textarea
                          placeholder="Add a comment..."
                          className="w-full p-2 mt-2 border-2 rounded resize-none"
                        />
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-full">
                          Comment
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className='text-white items-center'>
            <p>
              Let's keep our blogs respectful, supportive, and uplifting. Thank you and safe travels!
            </p>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
