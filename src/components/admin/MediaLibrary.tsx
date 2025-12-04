
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useStorage, useCollection, useFirestore } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Image as ImageIcon, UploadCloud, X } from 'lucide-react';

export function MediaLibrary({ onSelect }: { onSelect: (url: string) => void }) {
  const storage = useStorage();
  const firestore = useFirestore();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);

        await addDoc(collection(firestore, 'media'), {
          url: downloadURL,
          name: file.name,
          createdAt: serverTimestamp(),
        });

        onSelect(downloadURL);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [storage, firestore, onSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? 'border-primary' : 'border-border'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div>Uploading...</div>
        ) : isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
