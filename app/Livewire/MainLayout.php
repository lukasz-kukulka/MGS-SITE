<?php

namespace App\Livewire;

use Livewire\Component;

class MainLayout extends Component
{
    // protected $listeners = ['switchView'];
    // public $currentView = 'welcome';
    // public $viewBefore = 'null';

    // public function switchView( $view, $viewBefore ) {
    //     $this->currentView = $view;
    //     $this->viewBefore = $viewBefore;
    // }

    public function render()
    {
        return view('livewire.main-layout');
    }
}
