'use client';

import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { CheckCircle, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MediaLibrary from './MediaLibrary';

interface ImageSelectorProps {
    selectedImageId: string | null;
    onImageSelect: (id: string) => void;
}

export default function ImageSelector({ selectedImageId, onImageSelect }: ImageSelectorProps) {
    const storage = useStorage();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedImages, setUploadedImages] = useState<{ id: string, url: string }[]>([]);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!storage) {
            toast({
                title: "Error",
                description: "Firebase Storage is not initialized.",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const newImage = { id: downloadURL, url: downloadURL };
            setUploadedImages(prev => [newImage, ...prev]);
            onImageSelect(downloadURL);

            toast({
                title: "Success",
                description: "Image uploaded successfully."
            });

        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Error",
                description: "Failed to upload image.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleLibrarySelect = (url: string) => {
        onImageSelect(url);
        setIsLibraryOpen(false);
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <Button
                    type="button"
                    variant="outline"
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
                            Upload New
                        </>
                    )}
                </Button>

                <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Select from Library
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>Media Library</DialogTitle>
                        </DialogHeader>
                        <MediaLibrary
                            embedded
                            onSelect={handleLibrarySelect}
                            selectedUrl={selectedImageId}
                        />
                    </DialogContent>
                </Dialog>

                <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                />
            </div>

            <ScrollArea className="h-72 w-full rounded-md border">
                <div className="grid grid-cols-3 gap-4 p-4">
                    {/* Currently Selected Image (if not in uploaded/placeholders list) */}
                    {selectedImageId && !uploadedImages.find(img => img.id === selectedImageId) && !PlaceHolderImages.find(img => img.id === selectedImageId) && (
                        <div
                            className={cn(
                                'relative aspect-square cursor-pointer rounded-md overflow-hidden border-2 border-primary ring-2 ring-primary'
                            )}
                        >
                            <Image
                                src={selectedImageId}
                                alt="Selected product image"
                                fill
                                sizes="150px"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    )}

                    {/* Uploaded Images (Local Session) */}
                    {uploadedImages.map((image) => (
                        <div
                            key={image.id}
                            className={cn(
                                'relative aspect-square cursor-pointer rounded-md overflow-hidden border-2',
                                selectedImageId === image.id ? 'border-primary ring-2 ring-primary' : 'border-transparent'
                            )}
                            onClick={() => onImageSelect(image.id)}
                        >
                            <Image
                                src={image.url}
                                alt="Uploaded product image"
                                fill
                                sizes="150px"
                                className="object-cover transition-transform hover:scale-105"
                            />
                            {selectedImageId === image.id && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Placeholder Images */}
                    {PlaceHolderImages.map((image: ImagePlaceholder) => (
                        <div
                            key={image.id}
                            className={cn(
                                'relative aspect-square cursor-pointer rounded-md overflow-hidden border-2',
                                selectedImageId === image.id ? 'border-primary ring-2 ring-primary' : 'border-transparent'
                            )}
                            onClick={() => onImageSelect(image.id)}
                        >
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                sizes="150px"
                                className="object-cover transition-transform hover:scale-105"
                                data-ai-hint={image.imageHint}
                            />
                            {selectedImageId === image.id && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                                <p className="text-white text-xs truncate">Placeholder</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}