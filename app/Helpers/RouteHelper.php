<?php


function __NAV_BUTTON_LIVEWIRE( $buttonBefore, $buttonAfter, $routeName ) {
    if ( route( $routeName ) == url()->current() ) {
        return '<a class="nav-menu-link ' . $buttonAfter . '">' . __( 'base.' . $routeName ) . '</a>';
    }

    else {
        return '<a wire:navigate href="' . route( $routeName ) . '" class="nav-menu-link ' . $buttonAfter . '">' . __( 'base.' . $routeName ) . '</a>';
    }
}

function __NAV_BUTTON_REACT( $buttonBefore, $buttonAfter, $routeName ) {
    if ( route( $routeName ) == url()->current() ) {
        return '<a class="nav-menu-link ' . $buttonAfter . '">' . __( 'base.' . $routeName ) . '</a>';
    }

    else {
        return '<a wire:navigate href="' . route( $routeName ) . '" class="nav-menu-link ' . $buttonAfter . '">' . __( 'base.' . $routeName ) . '</a>';
    }
}