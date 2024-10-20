@section('header-css')
    
@endsection

@php $buttonAfter = 'block py-2 px-3 text-white text-[19px] rounded dark:text-white md:p-0 underline font-bold'; @endphp
@php $buttonBefore= 'block py-2 px-3 text-white text-[17px] rounded dark:text-white md:p-0 transition-all duration-300 hover:text-[19px] hover:underline'; @endphp

<div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 naw-menu-bar" id="menu-bar">
        @php $styleNavMenu = "bg-transparent border-b-2 border-transparent text-white hover:text-white hover:border-transparent hover:border-b-2 hover:border-blue-500" @endphp
        
        <li id="about-nav" class="about nav-menu-link">
            {{-- {!! __NAV_BUTTON_REACT( $buttonBefore, $buttonAfter, 'about' ) !!} --}}
            <button id="about-nav-button" class="{{ $styleNavMenu }}">
                {{ __( 'base.about' ) }}
              </button>
        </li>
        <li id="offer-nav" class="offer nav-menu-link">
            {{-- {!! __NAV_BUTTON_REACT( $buttonBefore, $buttonAfter, 'offer' ) !!} --}}
            <button id="offer-nav-button" class="{{ $styleNavMenu }}">
                {{ __( 'base.offer' ) }}
              </button>
        </li>
        <li id="partners-nav" class="partners nav-menu-link">
            {{-- {!! __NAV_BUTTON_REACT( $buttonBefore, $buttonAfter, 'partners' ) !!} --}}
            <button id="partners-nav-button" class="{{ $styleNavMenu }}">
                {{ __( 'base.partners' ) }}
              </button>
        </li>
        <li id="contact-nav" class="contact nav-menu-link">
            {{-- {!! __NAV_BUTTON_REACT( $buttonBefore, $buttonAfter, 'contact' ) !!} --}}
            <button id="contact-nav-button" class="{{ $styleNavMenu }}">
                {{ __( 'base.contact' ) }}
              </button>
        </li>
    </ul>
</div>

@section('footer-script')
    {{-- <script src="{{ asset('js/courier_announcement_main_script.js') }}"></script> --}}
@endsection