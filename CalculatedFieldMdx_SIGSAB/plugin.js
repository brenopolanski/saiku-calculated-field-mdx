/**
 * Calculated Field MDX - v0.1.0
 * A jump-start for Saiku UI plugins development.
 *
 * Made by Breno Polanski <breno.polanski@gmail.com>
 * Under MIT License
 */
var CalculatedFieldMdx = Backbone.View.extend({
	initialize: function(args) {
		// Keep track of parent workspace
		this.workspace = args.workspace;

		// Create a class for use as the CSS selector
        this.class = 'calculatedfieldmdx';
        this.$el.attr({ id: this.id });

		// Base URL
        this.BASE_URL = 'js/saiku/plugins/CalculatedFieldMdx/';

		// Maintain `this` in callbacks
		_.bindAll(this, 'add_button', 'show', 'receive_data', 'process_data', 'set_localstorage_mdx');

		// Add button in workspace toolbar
		this.add_button();

		// Listen to result event
		this.workspace.bind('query:result', this.receive_data);
	},

	add_button: function() {
		var button =
			$('<a href="#calculatedFieldMdx" class="calculatedFieldMdx button disabled_toolbar i18n" title="Campo Calculado"></a>')
			.css({ 'background-image': 'url("' + this.BASE_URL + 'image/plugin.png")',
				   'background-repeat': 'no-repeat',
				   'background-position': '50% 50%',
				   'background-size': '16px'
				});

		var li = $('<li class="seperator"></li>').append(button);
		this.workspace.toolbar.$el.find('ul').append(li);
		this.workspace.toolbar.calculatedFieldMdx = this.show;
	},

	show: function() {		
		this.data.mdx = localStorage.getItem('filter_mdx');

		(new CalculatedFieldMdxDialog({ data: this.data, workspace: this.workspace })).render().open();
	},

    receive_data: function(args) {
        return _.delay(this.process_data, 1000, args);
    },

    type_validation: function(value)	{
    	if (typeof(value) !== 'number' && isNaN(value.replace(/[^a-zA-Z 0-9.]+/g,''))) {
    		return 'String';
    	}
    	else {
    		return 'Numeric';
    	}
    },

	process_data: function(args) {
        if (args.data.cellset && args.data.cellset.length > 0) {
        	var DIMENSION = ['Variavel', 'Variável'],
        		ROWS = args.data.cellset.length,
				COLUMNS = args.data.cellset[0].length;

			this.data = {
        		metadata: [],
        		swap_var: '',
				exp: '',
				mdx: '',
				tplmdx: '',
	        	width: 0,
	        	height: 0
	        };

	        var row,
        		column;

        	for (row = 0; row < ROWS; row += 1) {
        		for (column = 0; column < COLUMNS; column += 1) {
        			if (args.data.cellset[row][column].type === 'ROW_HEADER_HEADER' &&
        			    _.find(DIMENSION, function(dim) { 
    			    		return args.data.cellset[row][column].properties.dimension === dim 
        				})) {
        				this.data.swap_var = 'rows';
        			}
        			else if (args.data.cellset[row][column].type === 'ROW_HEADER' &&
        			    _.find(DIMENSION, function(dim) { 
    			    		return args.data.cellset[row][column].properties.dimension === dim 
        				})) {

        				this.data.metadata.push({
        					colIndex: column,
        					colName: args.data.cellset[row][column].value,
        					colType: this.type_validation(args.data.cellset[row][column].value),
        					properties: {
        						dimension: args.data.cellset[row][column].properties.dimension,
        						hierarchy: args.data.cellset[row][column].properties.hierarchy,
        						level: args.data.cellset[row][column].properties.level,
    							uniquename: args.data.cellset[row][column].properties.uniquename
        					}
        				});
        			}
        			else if (args.data.cellset[row][column].type === 'COLUMN_HEADER' &&
        					 _.find(DIMENSION, function(dim) { 
    							return args.data.cellset[row][column].properties.dimension === dim 
    						 })) {

        				this.data.swap_var = 'columns';

        				this.data.metadata.push({
        					colIndex: column,
        					colName: args.data.cellset[row][column].value,
        					colType: this.type_validation(args.data.cellset[row][column].value),
        					properties: {
        						dimension: args.data.cellset[row][column].properties.dimension,
        						hierarchy: args.data.cellset[row][column].properties.hierarchy,
        						level: args.data.cellset[row][column].properties.level,
    							uniquename: args.data.cellset[row][column].properties.uniquename
        					}
        				});
        			}
        		}
        	}

        	this.data.height = ROWS;
    		this.data.width = COLUMNS;
        	
        	this.set_localstorage_mdx();
        }
        else {
        	this.$el.text('No results');
        }
	},

	set_localstorage_mdx: function() {
		this.workspace.query.action.get('/mdx', {
            success: function(model, response) {
            	localStorage.setItem('filter_mdx', response.mdx);
            }
        });
	}
});

 /**
  * Load file CSS
  * @param {String} file - Path of file css.
  */
function loadCSS(file) {
	var headID    = document.querySelector('head');
	var cssNode   = document.createElement('link');
	cssNode.type  = 'text/css';
	cssNode.rel   = 'stylesheet';
	cssNode.href  = file;
	cssNode.media = 'screen';
	headID.appendChild(cssNode);
}

 /**
  * Load file JavaScript
  * @param {String} file - Path of file js.
  */
function loadJS(file) {
	var headID  = document.querySelector('head');
	var jsNode  = document.createElement('script');
	jsNode.type = 'text/javascript';
	jsNode.src  = file;
	headID.appendChild(jsNode);
}

 /**
  * Start Plugin
  */
Saiku.events.bind('session:new', function() {

	loadCSS('js/saiku/plugins/CalculatedFieldMdx/css/plugin.css');	
	loadJS('js/saiku/plugins/CalculatedFieldMdx/js/CalculatedFieldMdxDialog.js');

	function new_workspace(args) {
		if (typeof args.workspace.calculatedFieldMdx === 'undefined') {
			args.workspace.calculatedFieldMdx = new CalculatedFieldMdx({ workspace: args.workspace });
		}
	}

	// Add new tab content
	for (var i = 0, len = Saiku.tabs._tabs.length; i < len; i += 1) {
		var tab = Saiku.tabs._tabs[i];
		new_workspace({
			workspace: tab.content
		});
	}

	// New workspace
	Saiku.session.bind('workspace:new', new_workspace);
});
