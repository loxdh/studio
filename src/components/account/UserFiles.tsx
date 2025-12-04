'use client';

import { useState, useEffect, useRef } from 'react';
import { useStorage, useFirestore, useUser } from '@/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, query, where, orderBy, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Trash2, Download, FileText, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface UserFile {
    id: string;
    name: string;
    url: string;
    path: string;
    type: string;
    size: number;
    createdAt: any;
}

export default function UserFiles() {
    const { user } = useUser();
    const storage = useStorage();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [files, setFiles] = useState<UserFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user || !firestore) return;

        const q = query(
            collection(firestore, `users/${user.uid}/files`),
            orderBy('createdAt', 'desc')
        );

        let unsubscribe: () => void = () => { };

        try {
            unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedFiles = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as UserFile[];
                setFiles(fetchedFiles);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching files:", error);
                setIsLoading(false);
            });
        } catch (e) {
            console.error("Failed to subscribe to files query:", e);
            setIsLoading(false);
        }

        return () => {
            try {
                unsubscribe();
            } catch (e) {
                console.error("Failed to unsubscribe from files:", e);
            }
        };
    }, [user, firestore]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;
        if (!storage || !user || !firestore) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(fileList).map(async (file) => {
                const timestamp = Date.now();
                const storagePath = `users/${user.uid}/files/${timestamp}_${file.name}`;
                const storageRef = ref(storage, storagePath);

                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);

                // Save metadata to Firestore
                await addDoc(collection(firestore, `users/${user.uid}/files`), {
                    name: file.name,
                    url,
                    path: storagePath,
                    type: file.type,
                    size: file.size,
                    createdAt: serverTimestamp(),
                    userId: user.uid
                });
            });

            await Promise.all(uploadPromises);

            toast({
                title: "Success",
                description: `Successfully uploaded ${fileList.length} file(s).`
            });

        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Error",
                description: "Failed to upload files.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (file: UserFile) => {
        if (!storage || !firestore || !user) return;
        if (!confirm(`Are you sure you want to delete ${file.name}?`)) return;

        try {
            // Delete from Storage
            const storageRef = ref(storage, file.path);
            await deleteObject(storageRef);

            // Delete from Firestore
            await deleteDoc(doc(firestore, `users/${user.uid}/files`, file.id));

            toast({
                title: "Deleted",
                description: "File deleted successfully."
            });
        } catch (error) {
            console.error("Delete error:", error);
            toast({
                title: "Error",
                description: "Failed to delete file.",
                variant: "destructive"
            });
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-blue-500" />;
        if (type.includes('spreadsheet') || type.includes('csv') || type.includes('excel')) return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
        return <FileText className="h-8 w-8 text-gray-500" />;
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>My Files & Guest Lists</CardTitle>
                        <CardDescription>Upload your guest lists for addressing or inspiration images for your designs.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.open('/templates/guest_list_template.csv', '_blank')}>
                            <Download className="mr-2 h-4 w-4" />
                            Template
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Files
                                </>
                            )}
                        </Button>
                        <Input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            onChange={handleFileUpload}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : files.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium">No files uploaded yet</p>
                            <p className="text-sm">Upload your guest list or design assets here.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {files.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        {getFileIcon(file.type)}
                                        <div>
                                            <p className="font-medium">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatSize(file.size)} • {file.createdAt ? format(file.createdAt.toDate(), 'MMM d, yyyy') : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => window.open(file.url, '_blank')}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(file)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
