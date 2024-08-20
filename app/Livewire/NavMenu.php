<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;

class NavMenu extends Component
{
    public function render()
    {
        return view('livewire.nav-menu');
    }
}