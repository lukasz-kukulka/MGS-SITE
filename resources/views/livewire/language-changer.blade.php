<form wire:submit="switchLang" method="POST" class="md:mt-0" style="display: flex; align-items: center; gap: 1rem;">
    @csrf
    <select wire:model="language" name="language" id="language" class="bg-gray-200 rounded text-sm">
        @foreach (config('app.languages') as $lang => $language)
            <option value="{{ $lang }}" {{ app()->getLocale() == $lang ? 'selected' : '' }}>
                {{ $language }}
            </option>
        @endforeach
    </select>
    <button type="submit" class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
        {{ __( 'base.language_message' ) }}
    </button>
</form>
