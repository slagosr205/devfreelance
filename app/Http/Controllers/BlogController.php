<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $posts = BlogPost::published()
            ->when($request->category, fn ($q, $cat) => $q->where('category', $cat))
            ->orderByDesc('published_at')
            ->paginate(9);

        $categories = BlogPost::whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return inertia('Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
        ]);
    }

    public function show(BlogPost $post)
    {
        $post->load('user');

        $relatedPosts = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->where('category', $post->category)
            ->limit(3)
            ->get();

        return inertia('Blog/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
