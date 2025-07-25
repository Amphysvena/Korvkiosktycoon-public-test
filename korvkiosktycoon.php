<?php
/**
 * Plugin Name: Korvkiosk Tycoon
 * Description: A sausage-slinging idle game inside WordPress!
 * Version: 0.1
 */

defined('ABSPATH') || exit;

function korvkiosk_enqueue_scripts() {
    wp_enqueue_script(
        'korvkiosk-game',
        plugin_dir_url(__FILE__) . 'build/index.js',
        [],
        null,
        true // Load in footer
    );
}
add_action('wp_enqueue_scripts', 'korvkiosk_enqueue_scripts');