
'use client';

import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { CheckCircle } from 'lucide-react';

interface ImageSelectorProps {
  selectedImageId: string | null;
  onImageSelect: (id: string) => void;
}

export default function ImageSelector({ selectedImageId, onImageSelect }: ImageSelectorProps) {
  return (
    <div>
        <p className="text-sm text-muted-foreground mb-2">Select a product image from the available options below.</p>
        <ScrollArea className="h-72 w-full rounded-md border">
            <div className="grid grid-cols-3 gap-4 p-4">
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
                    <p className="text-white text-xs truncate">{image.id}</p>
                </div>
                </div>
            ))}
            </div>
        </ScrollArea>
    </div>
  );
}

    