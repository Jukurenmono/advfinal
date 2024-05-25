import { storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export function fileToBase64(file: File) {
  if (file) {
    return new Promise<string>((resolve, reject)=>{
        const reader = new FileReader();

        reader.onload = (res)=>{
            resolve(res.target?.result as string);
        }

        reader.onerror = (err)=> reject(err);
        reader.readAsDataURL(file);
    })
  }

  return null;
}



export function uploadAndGetPhoto(email: string, photoURL: any) {
  if(photoURL.startsWith('https://')) return Promise.resolve(null);

  return new Promise<string>((resolve, reject)=>{
    const profileImageRef = ref(storage, `profile_images/${email}`);

    uploadString(profileImageRef, photoURL, 'data_url').then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        resolve(url);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}