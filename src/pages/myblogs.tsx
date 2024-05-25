import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { TrashIcon } from '@heroicons/react/24/outline';
import { db } from '@/firebase/firebaseConfig';
import { deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import useUser from '@/hooks/useUser';

type Post = {
  id: string;
  userName: string;
  text: string;
  imageUrl: string;
  createdAt: Timestamp;
  userId: string;
  upvotes: number;
  usersLiked: string[];
  comments: Comment[];
};

type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: Timestamp;
  userName: string;
};

export default function MyBlogs() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const fetchUserPosts = async () => {
    if (!user) return;
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
    const postsWithComments = await Promise.all(
      postsData.map(async (post) => {
        const commentsQuery = query(collection(db, 'comments'), where('postId', '==', post.id));
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Comment));

        return { ...post, comments: commentsData };
      })
    );
    setPosts(postsWithComments);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  fetchUserPosts();

  return (
    <div className="bg-cover min-h-screen flex items-center justify-center" style={{ backgroundImage: "url('../../frontPageBG.png')" }}>
      <div className="bg-gray-300 w-1/2 rounded-md shadow-md">
        <div className='w-full h-full bg-white border rounded-md'>
            <h1 className="text-2xl font-bold m-4 text-center">My Blogs</h1>
        </div>
        {posts.length === 0 ? (
          <p className='text-center text-xl font-bold my-20'>No current blogs</p>
        ) : (
          <div className="w-full overflow-y-auto p-5 max-h-[360px]">
            <ul className="space-y-4 grid sm:grid-cols-2 gap-4">
              {posts.map((post) => (
                post.userId === user?.uid && (
                  <li key={post.id} className="p-4 bg-white rounded shadow">
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="Post image" className="w-full mb-2 rounded" />
                    )}
                    <div className='flex justify-between'>
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
                        {/* Render comments */}
                        <ul className="mt-4 space-y-2">
                        </ul>
                      </div>
                        <button onClick={() => handleDeletePost(post.id)}>
                        <TrashIcon className='h-6 w-6'/>
                        </button>

                    </div>
                      <div>
                      <div className='font-bold p-2'>
                        COMMENTS
                      </div>
                      {post.comments.map(comment => (
                        <li key={comment.id} className="text-sm flex items-start space-x-2">
                          <div className="bg-gray-100 px-3 py-2 rounded-lg w-full mb-2">
                            <p className="font-medium">{comment.userName}</p>
                            <p className='ml-2'>{comment.text}</p>
                          </div>
                        </li>
                      ))}
                      </div>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
        <div className='border bg-white h-full w-full p-4 rounded'>
        <div className="bg-white p-5 rounded-xl">
            <p className="font-inter">
              YOUR TOTAL POSTS: {posts.filter(post => post.userId === user?.uid).length}
            </p>
            <div className='border my-5'></div>
            <p>
              YOUR TOTAL LIKES: {posts.filter(post => post.userId === user?.uid).reduce((acc, post) => acc + (post.usersLiked ? post.usersLiked.length : 0), 0)}
            </p>
          </div>
            <button className='bg-black rounded-full text-sm p-2'>
                <Link href="/blog">
                <p className="text-white cursor-pointer">Back to Blog</p>
                </Link>
            </button>
        </div>
      </div>
    </div>
  );
}
