<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function switchLang(Request $request)
    {
        $lang = $request->input('language');

        if (array_key_exists($lang, config('app.languages'))) {
            Session::put('applocale', $lang);
            App::setLocale($lang);
        }

        return redirect()->back(); // Przekierowanie z powrotem na poprzednią stronę
    }
}