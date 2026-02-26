<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    public function index(Request $request)
    {
        $works = PortfolioItem::published()
            ->when($request->category, fn ($q, $cat) => $q->where('category', $cat))
            ->orderBy('sort_order')
            ->get();

        $categories = PortfolioItem::whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return inertia('Works/Index', [
            'works' => $works,
            'categories' => $categories,
        ]);
    }

    public function show(PortfolioItem $work)
    {
        return inertia('Works/Show', [
            'work' => $work,
        ]);
    }
}
