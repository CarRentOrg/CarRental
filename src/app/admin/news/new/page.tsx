"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, FileText, User, Plus } from 'lucide-react';
import Link from 'next/link';

import { createNewsPost } from '@/lib/car-api';
import { useLanguage } from '@/contexts/LanguageContext';

const newsSchema = z.object({
    titleEn: z.string().min(5, 'English title must be at least 5 characters'),
    titleMn: z.string().min(5, 'Mongolian title must be at least 5 characters'),
    contentEn: z.string().min(20, 'English content must be at least 20 characters'),
    contentMn: z.string().min(20, 'Mongolian content must be at least 20 characters'),
    author: z.string().min(2, 'Author name is required'),
    imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export default function NewNewsPostPage() {
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
                title_en: data.titleEn,
                title_mn: data.titleMn,
                content_en: data.contentEn,
                content_mn: data.contentMn,
                author: data.author,
                image_url: data.imageUrl || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80',
            };

            const result = await createNewsPost(formattedData);
            if (result) {
                router.push('/admin/news');
                router.refresh();
            } else {
                alert('Failed to create news post. Please check your Supabase connection.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred while saving the post.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10 flex items-center justify-between">
                <Link
                    href="/admin"
                    className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </Link>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create News Post</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Content Section */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center space-x-3 border-b border-gray-50 pb-6">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Post Content</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Title (English)</label>
                                <input
                                    {...register('titleEn')}
                                    className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                    placeholder="The future of car rental..."
                                />
                                {errors.titleEn && <p className="text-xs text-red-500 font-bold">{errors.titleEn.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Title (Mongolian)</label>
                                <input
                                    {...register('titleMn')}
                                    className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                    placeholder="Машин түрээсийн ирээдүй..."
                                />
                                {errors.titleMn && <p className="text-xs text-red-500 font-bold">{errors.titleMn.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Content (English)</label>
                            <textarea
                                {...register('contentEn')}
                                rows={6}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="Write the post content in English..."
                            />
                            {errors.contentEn && <p className="text-xs text-red-500 font-bold">{errors.contentEn.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Content (Mongolian)</label>
                            <textarea
                                {...register('contentMn')}
                                rows={6}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="Монгол хэл дээрх агуулгыг бичнэ үү..."
                            />
                            {errors.contentMn && <p className="text-xs text-red-500 font-bold">{errors.contentMn.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center space-x-3 border-b border-gray-50 pb-6">
                        <User className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Metadata & Media</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Author</label>
                            <input
                                {...register('author')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Cover Image URL</label>
                            <input
                                {...register('imageUrl')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="https://images.unsplash.com/..."
                            />
                            {errors.imageUrl && <p className="text-xs text-red-500 font-bold">{errors.imageUrl.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4 pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-grow flex items-center justify-center space-x-3 bg-blue-600 text-white rounded-[2rem] py-6 font-black uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-1 disabled:opacity-50"
                    >
                        <Save className="h-6 w-6" />
                        <span>{isSubmitting ? 'Publishing...' : 'Publish Post'}</span>
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
