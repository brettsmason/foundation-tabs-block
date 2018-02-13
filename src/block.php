<?php
defined( 'ABSPATH' ) || exit;

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 */
function tnc_tabs_block_assets() {
	wp_enqueue_style(
		'tnc-tabs-block-style-css',
		plugins_url( 'dist/block.style.css', dirname( __FILE__ ) ),
		array( 'wp-blocks' )
	);

	wp_enqueue_script(
		'tnc-tabs-block-fdn-js',
		'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.4.3/js/foundation.min.js',
		array('jquery'),
		null,
		true
	);

	wp_enqueue_script(
		'tnc-fdn-js',
		plugins_url( '/src/fdn.js', dirname( __FILE__ ) ),
		array('jquery'),
		null,
		true
	);

	// wp_enqueue_script(
	// 	'tnc-tabs-block-frontend-js',
	// 	plugins_url( '/dist/block.frontend.js', dirname( __FILE__ ) ),
	// 	array()
	// );
}
add_action( 'enqueue_block_assets', 'tnc_tabs_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 */
function tnc_tabs_block_editor_assets() {
	wp_enqueue_script(
		'tnc-tabs-block-js',
		plugins_url( '/dist/block.editor.js', dirname( __FILE__ ) ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'jquery' )
	);

	wp_enqueue_style(
		'tnc-tabs-block-editor-css',
		plugins_url( 'dist/block.editor.css', dirname( __FILE__ ) ),
		array( 'wp-edit-blocks' )
	);
}
add_action( 'enqueue_block_editor_assets', 'tnc_tabs_block_editor_assets' );

