<?php

namespace App\Http\Middleware;

use App\Models\PageVisit;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Stevebauman\Location\Facades\Location;

class TrackPageVisit
{
    public function handle(Request $request, Closure $next): Response
    {
        $this->trackVisit($request);
        
        return $next($request);
    }

    private function trackVisit(Request $request): void
    {
        try {
            $ip = $request->ip();
            $userAgent = $request->userAgent();
            
            $position = null;
            try {
                $position = Location::get($ip);
            } catch (\Exception $e) {
            }

            $deviceType = $this->getDeviceType($userAgent);
            $browser = $this->getBrowser($userAgent);

            PageVisit::create([
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'page_url' => $request->fullUrl(),
                'country' => $position?->countryName ?? null,
                'city' => $position?->cityName ?? null,
                'device_type' => $deviceType,
                'browser' => $browser,
                'visited_at' => now(),
            ]);
        } catch (\Exception $e) {
        }
    }

    private function getDeviceType(?string $userAgent): string
    {
        if (empty($userAgent)) {
            return 'Unknown';
        }

        if (preg_match('/mobile/i', $userAgent)) {
            return 'Mobile';
        }
        if (preg_match('/tablet/i', $userAgent)) {
            return 'Tablet';
        }
        return 'Desktop';
    }

    private function getBrowser(?string $userAgent): string
    {
        if (empty($userAgent)) {
            return 'Unknown';
        }

        if (preg_match('/chrome/i', $userAgent)) {
            return 'Chrome';
        }
        if (preg_match('/firefox/i', $userAgent)) {
            return 'Firefox';
        }
        if (preg_match('/safari/i', $userAgent)) {
            return 'Safari';
        }
        if (preg_match('/edge/i', $userAgent)) {
            return 'Edge';
        }
        if (preg_match('/opera/i', $userAgent)) {
            return 'Opera';
        }

        return 'Other';
    }
}
