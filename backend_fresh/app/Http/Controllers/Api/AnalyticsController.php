<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function track(Request $request)
    {
        $ua = $request->userAgent() ?? '';

        // Skip bots and crawlers
        if (preg_match('/bot|crawl|spider|scraper|headless|preview|slack|telegram|whatsapp/i', $ua)) {
            return response()->json(['ok' => true]);
        }

        PageView::create([
            'page'       => substr($request->input('page', '/'), 0, 255),
            'ip_hash'    => hash('sha256', $request->ip() ?? ''),
            'session_id' => substr($request->input('session_id', ''), 0, 64),
            'visited_at' => now(),
        ]);

        return response()->json(['ok' => true]);
    }

    public function analytics()
    {
        $now = Carbon::now();

        $today     = PageView::whereDate('visited_at', $now->toDateString())->count();
        $thisWeek  = PageView::where('visited_at', '>=', $now->copy()->startOfWeek())->count();
        $thisMonth = PageView::where('visited_at', '>=', $now->copy()->startOfMonth())->count();
        $thisYear  = PageView::where('visited_at', '>=', $now->copy()->startOfYear())->count();
        $total     = PageView::count();

        // Last 30 days – grouped by day
        $raw = PageView::where('visited_at', '>=', $now->copy()->subDays(29)->startOfDay())
            ->get(['visited_at'])
            ->groupBy(fn ($v) => Carbon::parse($v->visited_at)->format('Y-m-d'));

        $daily = [];
        for ($i = 29; $i >= 0; $i--) {
            $d = $now->copy()->subDays($i)->format('Y-m-d');
            $daily[] = ['date' => $d, 'views' => $raw->get($d, collect())->count()];
        }

        // Last 12 weeks – grouped by week start
        $raw = PageView::where('visited_at', '>=', $now->copy()->subWeeks(11)->startOfWeek())
            ->get(['visited_at'])
            ->groupBy(fn ($v) => Carbon::parse($v->visited_at)->startOfWeek()->format('Y-m-d'));

        $weekly = [];
        for ($i = 11; $i >= 0; $i--) {
            $w = $now->copy()->subWeeks($i)->startOfWeek()->format('Y-m-d');
            $weekly[] = ['date' => $w, 'views' => $raw->get($w, collect())->count()];
        }

        // Last 12 months – grouped by month
        $raw = PageView::where('visited_at', '>=', $now->copy()->subMonths(11)->startOfMonth())
            ->get(['visited_at'])
            ->groupBy(fn ($v) => Carbon::parse($v->visited_at)->format('Y-m'));

        $monthly = [];
        for ($i = 11; $i >= 0; $i--) {
            $m = $now->copy()->subMonths($i)->format('Y-m');
            $monthly[] = ['date' => $m, 'views' => $raw->get($m, collect())->count()];
        }

        // Last 5 years – grouped by year
        $raw = PageView::where('visited_at', '>=', $now->copy()->subYears(4)->startOfYear())
            ->get(['visited_at'])
            ->groupBy(fn ($v) => Carbon::parse($v->visited_at)->format('Y'));

        $yearly = [];
        for ($i = 4; $i >= 0; $i--) {
            $y = $now->copy()->subYears($i)->format('Y');
            $yearly[] = ['date' => $y, 'views' => $raw->get($y, collect())->count()];
        }

        return response()->json([
            'data' => [
                'today'      => $today,
                'this_week'  => $thisWeek,
                'this_month' => $thisMonth,
                'this_year'  => $thisYear,
                'total'      => $total,
                'daily'      => $daily,
                'weekly'     => $weekly,
                'monthly'    => $monthly,
                'yearly'     => $yearly,
            ],
        ]);
    }
}
