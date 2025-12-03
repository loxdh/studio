'use client';

import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { CheckCircle, Upload, Loader2, Image as ImageIcon, X, Star } from 'lucide-react';
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
    galleryImages?: string[];
    onImageSelect: (mainImage: string, gallery: string[]) => void;
}

export default function ImageSelector({ selectedImageId, galleryImages = [], onImageSelect }: ImageSelectorProps) {
    const storage = useStorage();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // Combine main image and gallery for local state management
    // Ensure we don't have duplicates and filter out empty strings
    const allImages = Array.from(new Set(
        [selectedImageId, ...galleryImages].filter(Boolean) as string[]
    ));

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (!storage) {
            toast({
                title: "Error",
                description: "Firebase Storage is not initialized.",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                newUrls.push(downloadURL);
            }

            // Add new images to the list
            const updatedImages = [...allImages, ...newUrls];

            // If no main image was selected, make the first new one the main image
            const newMainImage = selectedImageId || newUrls[0];
            const newGallery = updatedImages.filter(img => img !== newMainImage);

            onImageSelect(newMainImage, newGallery);

            toast({
                title: "Success",
                description: `${newUrls.length} image(s) uploaded successfully.`
            });

        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Error",
                description: "Failed to upload image(s).",
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
        if (!allImages.includes(url)) {
            const updatedImages = [...allImages, url];
            const newMainImage = selectedImageId || url;
            const newGallery = updatedImages.filter(img => img !== newMainImage);
            onImageSelect(newMainImage, newGallery);
        }
        setIsLibraryOpen(false);
    };

    const setMainImage = (url: string) => {
        const newGallery = allImages.filter(img => img !== url);
        onImageSelect(url, newGallery);
    };

    const removeImage = (url: string) => {
        const updatedImages = allImages.filter(img => img !== url);
        if (updatedImages.length === 0) {
            onImageSelect('', []);
        } else if (url === selectedImageId) {
            // If we removed the main image, promote the first gallery image
            const newMain = updatedImages[0];
            const newGallery = updatedImages.slice(1);
            onImageSelect(newMain, newGallery);
        } else {
            onImageSelect(selectedImageId!, updatedImages.filter(img => img !== selectedImageId));
        }
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
                            Upload Photos
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
                    multiple
                    onChange={handleFileUpload}
                />
            </div>

            {allImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {allImages.map((url, index) => (
                        <div key={index} className={cn(
                            "relative aspect-square rounded-md overflow-hidden border-2 group",
                            url === selectedImageId ? "border-primary ring-2 ring-primary" : "border-border"
                        )}>
                            <Image
                                src={url}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    size="icon"
                                    variant={url === selectedImageId ? "default" : "secondary"}
                                    className="h-8 w-8"
                                    onClick={() => setMainImage(url)}
                                    title="Set as Main Image"
                                    type="button"
                                >
                                    <Star className={cn("h-4 w-4", url === selectedImageId && "fill-current")} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="h-8 w-8"
                                    onClick={() => removeImage(url)}
                                    title="Remove Image"
                                    type="button"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {url === selectedImageId && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                    Main
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-muted-foreground mt-2">
                Upload up to 10 photos. The "Main" image will be shown on the shop front.
            </p>
        </div>
    );
}