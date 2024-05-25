import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { createContext, useContext, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { User } from "@/models/user.model";
import toast from "react-hot-toast";
import { uploadAndGetPhoto } from "@/utils/helper.util";
import { useRouter } from "next/router";

export const AuthContext = createContext<any>(null);

type ComponentProps = {
    children: React.ReactNode, 
}

const AuthContextProvider = (props: ComponentProps) => {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    function createAccount(user: User){
        setLoading(true);
        const toastId = toast.loading('Creating your account...', {
            position: 'top-right',
        });

            return new Promise<any>((resolve, reject)=>{
                createUserWithEmailAndPassword(auth, user.email, user.password)
                .then(async (userCredential) => {

                    uploadAndGetPhoto(user.email, user.photoURL).then((photoURL) => {
                        updateProfile(userCredential.user, {
                            displayName: user.displayName,
                            photoURL: photoURL
                        });
                    });

                    toast.success('Account created successfully', {
                        id: toastId,
                    });
                    resolve(userCredential)
                })
                .catch((error) => {
                    toast.error(error.message, {
                        id: toastId,
                    })
                    reject(error);
                })
                .finally(() => setLoading(false));
            });
    }

    function signInAccount(user: User){
        setLoading(true);

        return signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
            router.push('/dashboard')
        })
        .catch((error) => {
            toast.error(error.message, {
                position: 'top-right',
            })
        })
        .finally(() => setLoading(false));
    }

    function logout() {
        signOut(auth).then(() => {
            router.push('/');
        }).catch((error) => {
            toast.error(error.message, {
                position: 'top-right',
            })
        });
    }

    return (
        <AuthContext.Provider 
            value={{
                createAccount,
                signInAccount,
                logout,
                isLoading,
            }}
            {...props}
        />
    )
}

const useAuthContext = () => useContext(AuthContext);

export { AuthContextProvider, useAuthContext }