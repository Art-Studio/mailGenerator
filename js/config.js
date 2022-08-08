// JavaScript Document
/*eslint-disable no-console*/

// ----------------------------------------------------------
// Global object for linking variables, plugins and functions

var app;

$(function(){
	app = {
		$tr: null,
		$obj: $('#helper'),
		util: {},
		control: {},
		editor: {},
		sortable: function(){},
		ready: function(){
			$('#mainBox').addClass('ready');
			console.log('App ready:', app);
		},
		
		// fontpicker options
		fontpickerCfg: {
			variants: true,
			showClear: true,
			nrRecents: 0,
			localFonts: {}
		},
		
		// cache your selections
		el: {
			$helper: $('#helper'),
			$import: $('input[type=file]'),
			$previewBox: $('#previewBox'),
			$toolsBox: $('#toolsBox'),
			$itemsBox: $('#items'),
			$propBox: $('#properties'),
			$controlsBox: $('#controls'),
			$controls: $('#controls input'),
			$sourceBox: $('#source'),
			$outputBox: $('#output')
		}
	}
});