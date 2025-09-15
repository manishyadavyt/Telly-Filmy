
// src/app/admin/create/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addPost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  excerpt: z.string().min(10, {
    message: 'Excerpt must be at least 10 characters.',
  }),
  content: z.string().min(20, {
    message: 'Content must be at least 20 characters.',
  }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  tags: z.string().min(1, { message: 'Please enter at least one tag.' }),
  imageUrl: z.string().url({ message: 'Please upload a valid image.' }),
  isTopStory: z.boolean().default(false),
  isTrending: z.boolean().default(false),
});

export default function CreatePostPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      imageUrl: '',
      isTopStory: false,
      isTrending: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        form.setValue('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addPost({ ...values, imageHint: 'custom image', tags: values.tags.split(',').map(tag => tag.trim()) });

    if (result.success) {
      toast({
        title: 'Post Created',
        description: 'Your new post is now live!',
      });
      router.push('/');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error creating the post.',
      });
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a short summary of the post"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your post content here"
                        className="h-48"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Technology, Lifestyle" {...field} />
                    </FormControl>
                     <FormDescription>
                      Enter a new or existing category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AI, Tech, Innovation" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter comma-separated tags.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                       <Input type="file" accept="image/*" onChange={handleImageChange} className="pt-2 text-sm" />
                    </FormControl>
                     {previewImage && (
                      <div className="mt-4 w-full aspect-video relative">
                        <Image src={previewImage} alt="Image preview" fill className="rounded-md object-cover" />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="isTopStory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Top Story
                        </FormLabel>
                        <FormDescription>
                          Feature this post in the hero slider.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isTrending"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Trending
                        </FormLabel>
                        <FormDescription>
                          Mark this post as currently trending.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
