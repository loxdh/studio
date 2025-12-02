'use client';

import { useState, useEffect, useRef } from 'react';
import { useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject, StorageReference } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Trash2, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    selectedUrl?: string | null;
    embedded?: boolean;
}

export default function MediaLibrary({ onSelect, selectedUrl, embedded = false }: MediaLibraryProps) {
    const storage = useStorage();
    const { toast } = useToast();
    const [images, setImages] = useState<{ url: string; path: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, [storage]);

    const fetchImages = async () => {
        if (!storage) return;
        setIsLoading(true);
        try {
            const listRef = ref(storage, 'media/');
            const res = await listAll(listRef);

            const imagePromises = res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                    url,
                    path: itemRef.fullPath,
                    name: itemRef.name
                };
            });

            const fetchedImages = await Promise.all(imagePromises);
            // Sort by name (which usually includes timestamp if we name them right) or just reverse to show newest if we push
            // Since listAll doesn't guarantee order, client side sort is good.
            // Let's assume we want newest first, but we don't have metadata here easily without another call.
            // For now, just display them.
            setImages(fetchedImages);
        } catch (error) {
            console.error("Error fetching images:", error);
            toast({
                title: "Error",
                description: "Failed to load media library.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if (!storage) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                return getDownloadURL(storageRef);
            });

            await Promise.all(uploadPromises);

            toast({
                title: "Success",
                description: `Successfully uploaded ${files.length} images.`
            });

            fetchImages(); // Refresh list

        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Error",
                description: "Failed to upload images.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (path: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent selection when clicking delete
        if (!storage) return;
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            const imageRef = ref(storage, path);
            await deleteObject(imageRef);
            setImages(prev => prev.filter(img => img.path !== path));
            toast({
                title: "Deleted",
                description: "Image deleted successfully."
            });
        } catch (error) {
            console.error("Delete error:", error);
            toast({
                title: "Error",
                description: "Failed to delete image.",
                variant: "destructive"
            });
        }
    };

    const copyToClipboard = (url: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
        toast({
            title: "Copied",
            description: "Image URL copied to clipboard."
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                {!embedded && <h2 className="text-2xl font-bold">Media Library</h2>}
                <div className="flex gap-2">
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
                                Upload Images
                            </>
                        )}
                    </Button>
                    <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            <ScrollArea className={cn("w-full rounded-md border p-4", embedded ? "h-[400px]" : "h-[calc(100vh-200px)]")}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No images found. Upload some to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {images.map((image) => (
                            <div
                                key={image.path}
                                className={cn(
                                    "group relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all hover:shadow-md",
                                    selectedUrl === image.url ? "border-primary ring-2 ring-primary" : "border-transparent"
                                )}
                                onClick={() => onSelect && onSelect(image.url)}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => copyToClipboard(image.url, e)}
                                        title="Copy URL"
                                    >
                                        {copiedUrl === image.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => handleDelete(image.path, e)}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {selectedUrl === image.url && (
                                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                        <Check className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
