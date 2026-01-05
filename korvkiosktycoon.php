<?php
/**
 * Plugin Name: Korvkiosk Tycoon
 * Description: A sausage-slinging idle game inside WordPress!
 * Version: 0.1
 */

function korvkiosk_enqueue_scripts() {
    $plugin_url = plugin_dir_url(__FILE__);

    wp_enqueue_script(
        'korvkiosk-game',
        $plugin_url . 'build/index.js',
        [],
        null,
        true
    );

    // Pass plugin URL to JS
    wp_localize_script('korvkiosk-game', 'KorvkioskData', [
        'pluginUrl' => $plugin_url
    ]);
}
add_action('wp_enqueue_scripts', 'korvkiosk_enqueue_scripts');
