import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import { useEffect } from "react";

export default function isAuth(Component: React.FC) {
    return function AuthComponent(props: any) {
        const { user, loading } = useUser();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push('/');
            }
        }, [user, loading]);

        return loading ? null : <Component {...props} />;
    }
}