<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageChanger extends Component
{
    public $language;

    public function mount() {
        $this->language = app()->getLocale();
    }

    public function switchLang() {
        $lang = $this->language;
        if ( array_key_exists( $lang, config('app.languages') ) ) {
            Session::put( 'applocale', $lang );
            App::setLocale($lang);
        }
        return $this->redirect( url()->previous(), navigate: true);
    }

    public function render()
    {
        return view('livewire.language-changer');
    }
}
