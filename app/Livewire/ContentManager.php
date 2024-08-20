<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\On;
use Illuminate\Support\Facades\Log;

class ContentManager extends Component
{    
    public $currentView = '';
    public $viewBefore = '';

    public function mount() {
        if( session()->has('viewBefore') && session()->get('viewBefore') != '' ) {
            $this->viewBefore = session()->get('viewBefore');
        }
        $this->currentView = request()->route()->getName();
        // Log::channel( 'discord' )->debug( 'ContentManager->mount(): viewBefore: |' . $this->viewBefore . '|, currentView: |' . $this->currentView . '|.' );
    }
    
    public function render() {
        return view('livewire.content-manager', ['currentView' => $this->currentView, 'viewBefore' => $this->viewBefore]);
    }
}