<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>
  
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    @livewireStyles
    @viteReactRefresh
    @if (app()->environment('local'))
        @vite('resources/css/app.css')
    @endif
    @vite( [ 'resources/sass/app.scss', 'resources/js/app.js' ] )
    @yield( 'header-css' )
    
</head>
<body class="flex flex-col min-h-screen">
    @inject('backgroundSentenceController', 'App\Http\Controllers\BackgroundSentenceController')

    @php
        $sentencesData = $backgroundSentenceController->getSentence();
    @endphp
    <div id="background_sentence" data-backgroundSentence='@json( $sentencesData->getData() )'></div>
    <div id="background"></div>
    
    <div id="main-content" class="flex flex-col min-h-screen">
        
        @livewire( 'main-layout' )
        {{-- @yield( 'footer-script' ) --}}
        @livewireScripts
    </div>
     
    
    <div id="sentences-data" data-sentences='{!! json_encode( $sentencesData ) !!}'></div>
    <footer id="myFooter" class="bg-gray-800 text-white p-4 text-center">
        &copy; 2024 MGS Solutions. Wszelkie prawa zastrzeżone.
    </footer>
</body>
</html>
