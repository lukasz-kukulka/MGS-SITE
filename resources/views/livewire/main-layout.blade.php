<div>
    <div id="app" class="flex-grow flex flex-col">
        <nav id="full_nav_menu" class="bg-blue-950 bg-opacity-35">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
                <a class="brand-logo" href="{{ url('/') }}"></a>
                <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    @livewire('language-changer')
                    <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-1 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                </div>
                @livewire( 'nav-menu' )
            </div>
        </nav>
        
        <main class="flex-grow flex justify-center py-4">
            <div class="background-menu" id="background-menu"></div>
            <div id="home-content">
                <div id="home-text">Check | Choice | Enjoy</div>
                <div id="home-button-container">
                    <div id="home-button">
                        <button class="bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-white hover:border-transparent py-4 px-8 rounded">
                          {{ __( 'base.check_our_offer' ) }}
                            </button>
                    </div>
                    
                </div>
            </div>

            <div id="background-small-tile-text" style="display: none"></div>
            <div id="partners-content" class="flex items-center justify-center h-screen mt-8">
              <div class="flex items-center">
                <a href="https://mecztrenera.pl">
                  <img src="{{ asset('images/mt.jpg') }}" alt="mecztrenera.pl" class="mr-8">
                </a>
                <a href="https://kurierportal.cfolks.pl">
                  <img src="{{  asset('images/dce.jpg') }}" alt="kurierportal.cfolks.pl" class="mr-8">
                </a>
                <a href="http://apblogistics.eu">
                  <img src="{{ asset('images/apb.png') }}" alt="http://apblogistics.eu" class="mr-8">
                </a>
              </div>
          </div>
            <div id="contact-content" class="flex justify-center">
                <div class="w-full max-w-md"> <!-- Formularz na 1/3 szerokości okna -->
                    <div class="bg-transparent rounded-lg shadow-md text-center">
                        <div class="p-6">
                            <form method="POST" action="{{ route('sendMail') }}">
                                @csrf
                                <!-- Pole Temat -->
                                <div class="mb-4">
                                    <label for="subject" class="block text-left mb-1 text-white">{{ __('base.contact_subject_label') }}<span class="text-red-500">*</span></label>
                                    <input type="text" class="border @error('subject') border-red-500 @enderror rounded w-full p-2" id="subject" value="{{ old('subject') }}" name="subject" required>
                                    @error('subject')
                                        <span class="text-red-500 text-sm" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
            
                                <!-- Pole Imię -->
                                <div class="mb-4">
                                    <label for="first_name" class="block text-left mb-1 text-white">{{ __('base.contact_name_label') }}<span class="text-red-500">*</span></label>
                                    <input type="text" class="border @error('first_name') border-red-500 @enderror rounded w-full p-2" id="first_name" value="{{ old('first_name', Auth::user()->name ?? '') }}" name="first_name" required>
                                    @error('first_name')
                                        <span class="text-red-500 text-sm" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
            
                                <!-- Pole Nazwisko (opcjonalne) -->
                                <div class="mb-4">
                                    <label for="last_name" class="block text-left mb-1 text-white">{{ __('base.contact_surname_label') }}</label>
                                    <input type="text" class="border rounded w-full p-2" id="last_name" value="{{ old('last_name', Auth::user()->surname ?? '') }}" name="last_name">
                                </div>
            
                                <!-- Pole E-mail -->
                                <div class="mb-4">
                                    <label for="email" class="block text-left mb-1 text-white">{{ __('base.contact_mail_label') }}<span class="text-red-500">*</span></label>
                                    <input type="email" class="border @error('email') border-red-500 @enderror rounded w-full p-2" id="email" value="{{ old('email', Auth::user()->email ?? '') }}" name="email" required>
                                    @error('email')
                                        <span class="text-red-500 text-sm" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
            
                                <!-- Pole Numer Telefonu (opcjonalne) -->
                                <div class="mb-4">
                                    <label for="phone" class="block text-left mb-1 text-white">{{ __('base.contact_tel_label') }}</label>
                                    <input type="tel" class="border rounded w-full p-2" id="phone" value="{{ old('phone', Auth::user()->phone_number ?? '') }}" name="phone">
                                </div>
            
                                <!-- Pole Treść Wiadomości -->
                                <div class="mb-4">
                                    <label for="message" class="block text-left mb-1 text-white">{{ __('base.contact_message_label') }}<span class="text-red-500">*</span></label>
                                    <textarea class="border @error('message') border-red-500 @enderror rounded w-full p-2" id="message" name="message" rows="4" required>{{ old('message') }}</textarea>
                                    @error('message')
                                        <span class="text-red-500 text-sm" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
            
                                <!-- Przycisk wysyłania z lekkim odstępem -->
                                <button type="submit" class="bg-blue-500 text-white rounded px-4 py-2 mt-3">{{ __('base.send') }}</button>
                                <!-- Tekst pola obowiązkowe -->
                                <p class="text-red-500 mt-2">{{ __('base.contact_field_required_label') }}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            
            <div id="html-content" class="bg-white text-gray-800 p-6 mx-auto rounded-lg shadow-md">
                <h1 class="text-2xl font-bold mb-4">O nas</h1>
                <p class="mb-4">Jesteśmy dynamicznie rozwijającą się firmą IT, która z pasją tworzy nowoczesne rozwiązania technologiczne. Oferujemy kompleksowe usługi – od projektowania profesjonalnych stron internetowych i sklepów online, po tworzenie zaawansowanych systemów informatycznych.</p>
                <p class="mb-4">Nasze rozwiązania są zawsze dopasowane do potrzeb klienta, co pozwala nam zapewnić efektywność i pełne wsparcie w każdym etapie realizacji. Wybierając nas, inwestujesz w innowacyjność, elastyczność i pełną personalizację. Pozwól nam pomóc Twojemu biznesowi rosnąć w cyfrowym świecie!</p>
                <p class="text-lg font-semibold">Zapraszamy do współpracy firmy jak i osoby prywatne!</p>
            </div>
            <div id="offer-content" class="text-gray-800 p-6 mx-auto rounded-lg shadow-md">
                <!-- Powtórz dla 10 wierszy -->
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 1</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>2zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 2</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>5zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 3</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>10zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 4</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>3zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 5</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>7zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 6</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>15zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 6</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>15zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 6</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>15zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 6</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>15zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 6</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>15zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 6</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>15zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 6</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>15zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 6</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>15zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 7</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>12zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 8</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>8zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 9</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>6zł</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-300">
                  <span>Example 10</span>
                  <span class="flex-grow mx-4 border-dotted border-t border-gray-400"></span>
                  <span>20zł</span>
                </div>
              </div>
        
    </div>
</div>