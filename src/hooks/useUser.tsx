import { auth } from "@/firebase/firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";


export default function useUser() {

    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user as User);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    

    return {user, loading};
}