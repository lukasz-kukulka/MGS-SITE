<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SavePreviousUrl
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ( $request->hasHeader( 'referer' ) ) {
            session( ['viewBefore' => session( 'currentView' ) ] );
        } else {
            session()->forget('viewBefore');
        }

        session( [ 'currentView' => request()->route()->getName() ] );

        return $next($request);
    }
}
