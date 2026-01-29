"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, Info, Edit3 } from 'lucide-react';
import Link from 'next/link';

import { api } from '@/lib/api';

const newsSchema = z.object({
    title_en: z.string().min(1, 'English Title is required'),
    title_mn: z.string().min(1, 'Mongolian Title is required'),
    content_en: z.string().min(10, 'English Content must be longer'),
    content_mn: z.string().min(10, 'Mongolian Content must be longer'),
    author: z.string().min(1, 'Author is required'),
    imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export default function NewNewsPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            author: 'Admin',
        }
    });

    const onSubmit = async (data: NewsFormValues) => {
        try {
            const formattedData = {
                title_en: data.title_en,
                title_mn: data.title_mn,
                content_en: data.content_en,
                content_mn: data.content_mn,
                author: data.author,
                image_url: data.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80',
            };

            const result = await api.news.create(formattedData);
            if (result) {
                router.push('/admin/news');
                router.refresh();
            } else {
                alert('Failed to create news.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred while saving the news.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10 flex items-center justify-between">
                <Link
                    href="/admin/news"
                    className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to News</span>
                </Link>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Add New Article</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center space-x-3 border-b border-gray-50 pb-6">
                        <Info className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Article Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Title (English)</label>
                            <input
                                {...register('title_en')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="Article Headline"
                            />
                            {errors.title_en && <p className="text-xs text-red-500 font-bold">{errors.title_en.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Title (Mongolian)</label>
                            <input
                                {...register('title_mn')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="Мэдээний гарчиг"
                            />
                            {errors.title_mn && <p className="text-xs text-red-500 font-bold">{errors.title_mn.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Author</label>
                        <input
                            {...register('author')}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            placeholder="Author Name"
                        />
                        {errors.author && <p className="text-xs text-red-500 font-bold">{errors.author.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Content (English)</label>
                        <textarea
                            {...register('content_en')}
                            rows={6}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            placeholder="Write your article here..."
                        />
                        {errors.content_en && <p className="text-xs text-red-500 font-bold">{errors.content_en.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Content (Mongolian)</label>
                        <textarea
                            {...register('content_mn')}
                            rows={6}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            placeholder="Мэдээгээ энд бичнэ үү..."
                        />
                        {errors.content_mn && <p className="text-xs text-red-500 font-bold">{errors.content_mn.message}</p>}
                    </div>
                </div>

                {/* Image Upload Placeholder */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center space-x-3 border-b border-gray-50 pb-6">
                        <ImageIcon className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Cover Image</h2>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Image URL</label>
                        <input
                            {...register('imageUrl')}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            placeholder="https://..."
                        />
                        {errors.imageUrl && <p className="text-xs text-red-500 font-bold">{errors.imageUrl.message}</p>}
                    </div>
                </div>

                <div className="flex space-x-4 pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-grow flex items-center justify-center space-x-3 bg-blue-600 text-white rounded-[2rem] py-6 font-black uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-1 disabled:opacity-50"
                    >
                        <Save className="h-6 w-6" />
                        <span>{isSubmitting ? 'Publish Article' : 'Publish Article'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-10 py-6 rounded-[2rem] bg-white border border-gray-100 font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
