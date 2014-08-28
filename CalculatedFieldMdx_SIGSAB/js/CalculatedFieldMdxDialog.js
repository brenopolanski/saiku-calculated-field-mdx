var CalculatedFieldMdxDialog = Modal.extend({
    type: 'calculatedfieldmdx',

    events: {
        'click .add-to-exp': 'logical_expression',
        'click .dialog_footer a': 'call'
    },

    buttons: [
    	{ text: 'Criar Campo Calculado', method: 'create_exp' },
    	{ text: 'Cancelar', method: 'close' }
    ],
    
    initialize: function(args) {
        this.options.title = 'Campo Calculado';

        // Keep track of parent workspace
		this.workspace = args.workspace;

		console.log(args.data);
	
		if (args.data !== undefined) {

	        // set this.data with object of plugin.js
	    	this.data = args.data;

	    	// Reset objects MDX's
	    	this.data.exp = '';
	    	this.data.tplmdx = '';

	        this.message = _.template(
				'<div class="container_12">' +
					// #1
					'<div class="grid_5">' +
						'<div class="calculatedfieldmdx-form">' +
							'<label for="">Nome da variável de saída</label>' +
							'<input type="text" class="form-control" name="input-var-output" id="input-var-output">' +
						'</div>' +
					'</div>' +
					'<div class="grid_1" style="margin-top: 18px;">' +
						'<div class="calculatedfieldmdx-form">' +
							'<span>&nbsp;</span>' +
						'</div>' +
					'</div>' +
					// #2
					'<div class="grid_5">' +
						'<div class="calculatedfieldmdx-form">' +
							'<label for="">Tipo da variável de saída</label>' +
							'<select class="form-control" name="select-type-var" id="select-type-var">' +
								'<option value="">-- Selecione --</option>' +
								'<option value="string">String</option>' +
								'<option value="inteiro">Inteiro</option>' +
							'</select>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1" style="margin-top: 18px;">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="input-type-var" id="input-type-var">add</button>' +
						'</div>' +
					'</div>' +
					// #4
					'<div class="grid_5">' +
						'<div class="calculatedfieldmdx-form">' +
							'<label for="">Selecione variável para inserir na expressão</label>' +
							'<select class="form-control" name="select-var" id="select-var">' +
								'<option value="">-- Selecione --</option>' +
								'<% _.each(_.union(args.data.metadata), function(val) { %>' +
								'<option value="<%= val.properties.uniquename %>"><%= val.colName %></option>' +
								'<% }); %>' +
							'</select>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1" style="margin-top: 18px;">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-var" id="add-var">add</button>' +
						'</div>' +
					'</div>' +
					// #5
					'<div class="grid_5">' +
						'<div class="calculatedfieldmdx-form">' +
							'<label for="">Ano</label>' +
							'<select class="form-control" name="select-ano" id="select-ano">' +
								'<option value="">-- Selecione --</option>' +
								'<option value="Ano.[1970]">1970</option>' +
								'<option value="Ano.[1974]">1974</option>' +
								'<option value="Ano.[1975]">1975</option>' +
								'<option value="Ano.[1976]">1976</option>' +
								'<option value="Ano.[1977]">1977</option>' +
								'<option value="Ano.[1978]">1978</option>' +
								'<option value="Ano.[1979]">1979</option>' +
								'<option value="Ano.[1980]">1980</option>' +
								'<option value="Ano.[1981]">1981</option>' +
								'<option value="Ano.[1982]">1982</option>' +
								'<option value="Ano.[1983]">1983</option>' +
								'<option value="Ano.[1984]">1984</option>' +
								'<option value="Ano.[1985]">1985</option>' +
								'<option value="Ano.[1986]">1986</option>' +
								'<option value="Ano.[1987]">1987</option>' +
								'<option value="Ano.[1988]">1988</option>' +
								'<option value="Ano.[1989]">1989</option>' +
								'<option value="Ano.[1990]">1990</option>' +
								'<option value="Ano.[1991]">1991</option>' +
								'<option value="Ano.[1992]">1992</option>' +
								'<option value="Ano.[1993]">1993</option>' +
								'<option value="Ano.[1994]">1994</option>' +
								'<option value="Ano.[1995]">1995</option>' +
								'<option value="Ano.[1996]">1996</option>' +
								'<option value="Ano.[1997]">1997</option>' +
								'<option value="Ano.[1998]">1998</option>' +
								'<option value="Ano.[1999]">1999</option>' +
								'<option value="Ano.[2000]">2000</option>' +
								'<option value="Ano.[2001]">2001</option>' +
								'<option value="Ano.[2002]">2002</option>' +
								'<option value="Ano.[2003]">2003</option>' +
								'<option value="Ano.[2004]">2004</option>' +
								'<option value="Ano.[2005]">2005</option>' +
								'<option value="Ano.[2006]">2006</option>' +
								'<option value="Ano.[2007]">2007</option>' +
								'<option value="Ano.[2008]">2008</option>' +
								'<option value="Ano.[2009]">2009</option>' +
								'<option value="Ano.[2010]">2010</option>' +
								'<option value="Ano.[2011]">2011</option>' +
								'<option value="Ano.[2012]">2012</option>' +
							'</select>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1" style="margin-top: 18px;">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-ano" id="add-ano">add</button>' +
						'</div>' +
					'</div>' +
					// #3
					'<div class="grid_11">' +
						'<div class="calculatedfieldmdx-form">' +
							'<label for="">Lista de funções</label>' +
							'<select class="form-control" name="select-func" id="select-func">' +
								'<option value="">-- Selecione --</option>' +
								'<option value=" and ">AND</option>' +
								'<option value=" or ">OR</option>' +
								'<option value=" not ">NOT</option>' +
								// '<option value="/">Divisão (/)</option>' +
								// '<option value="*">Multiplicação (*)</option>' +
								// '<option value="+">Soma (+)</option>' +
								// '<option value="-">Subtração (-)</option>' +
								'<option value=" ^ ">Raiz (^)</option>' +
								'<option value="round">Arredonda</option>' +
								'<option value="avg">Média</option>' +
								'<option value="max">Máximo</option>' +
								'<option value="min">Mínimo</option>' +
								'<option value="median">Mediana</option>' +
								'<option value="stdev">Desvio Padrão</option>' +
								'<option value="var">Variância</option>' +
							'</select>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1" style="margin-top: 18px;">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-func" id="add-func">add</button>' +
						'</div>' +
					'</div>' +
					// #6
					'<div class="grid_3">' +
						'<div class="calculatedfieldmdx-form">' +
							'<span>&nbsp;</span>' +
						'</div>' +
					'</div>' +
					'<div class="grid_2">' +
						'<div class="calculatedfieldmdx-form">' +
							'<span class="form-control">Operadores:</span>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-open-par" id="add-open-par">(</button>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-close-par" id="add-close-par">)</button>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-equals" id="add-equals">=</button>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-sum" id="add-sum">+</button>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-subtraction" id="add-subtraction">-</button>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-division" id="add-division">/</button>' +
						'</div>' +
					'</div>' +
					'<div class="grid_1">' +
						'<div class="calculatedfieldmdx-form">' +
							'<button class="form-control add-to-exp" name="add-multiplication" id="add-multiplication">*</button>' +
						'</div>' +
					'</div>' +
					// #6
					'<div class="grid_12">' +
						'<div class="calculatedfieldmdx-form">' +
							'<div id="editor-mdx"></div>' +
						'</div>' +
					'</div>' +
					// #7
					'<div class="grid_12">' +
						// TODO: Implementar depois... depois...
						// Aqui seria para testar a expressão em tempo de execução e
						// mostrar ao usuário se a expressão está correta ou não.
						// '<p>Prévia de saída:</p>' +
						'<p>&nbsp;</p>' +
					'</div>' +
				'</div>'
			)({ args: args });

	        this.bind('open', function() {
	       		var self = this;

	       		// TODO: Centralizar modal

	       		$(self.el).dialog('option', 'position', 'center');
	        	$(self.el).parents('.ui-dialog').css({ width: '650px' });
	        });

	        // Maintain `this` in callbacks
			_.bindAll(this, 'start_editor', 'logical_expression', 'split_mdx', 'create_exp',
				      'run_exp');

			// start editor MDX
			_.delay(this.start_editor, 1000);

			// split expression MDX
			this.split_mdx();
		}
    },

    start_editor: function() {
		this.editor = ace.edit('editor-mdx');
		this.editor.getSession().setMode('ace/mode/text');
		this.editor.getSession().setUseWrapMode(true);
    },

    split_mdx: function() {
    	if (this.data.swap_var === 'rows') {
    		this.data.mdx = this.data.mdx.split('\n');
			this.data.tplmdx = this.data.mdx[2].split('NON EMPTY ');
			this.data.tplmdx = this.data.tplmdx[1].split('} ON ROWS');
			this.data.tplmdx = this.data.tplmdx[0];
		}
		else {
			this.data.mdx = this.data.mdx.split('\n');
			this.data.tplmdx = this.data.mdx[1].split('NON EMPTY ');
			this.data.tplmdx = this.data.tplmdx[1].split('} ON COLUMNS,');
			this.data.tplmdx = this.data.tplmdx[0];
		}
    },

  	logical_expression: function(event) {
       	switch (event.target.id) {
		case 'add-var':
			if (this.$el.find('#select-var option:selected').val() !== '') {
				if (_.isEmpty(this.data.exp)) {
					this.data.exp = this.editor.getValue();
					this.data.exp = this.$el.find('#select-var option:selected').val();
					this.editor.setValue(this.data.exp);
					this.data.exp = this.editor.getValue();
					$('#select-var').prop('selectedIndex', 0);
				}
				else {
					this.data.exp = this.editor.getValue();
					this.data.exp += this.$el.find('#select-var option:selected').val();	
					this.editor.setValue(this.data.exp);
					$('#select-var').prop('selectedIndex', 0);
				}
			}
			else {
				alert('Selecione uma variável!');
			}
			break;
		case 'add-ano':
			if (this.$el.find('#select-ano option:selected').val() !== '') {
				this.data.exp = this.editor.getValue();
				this.data.exp += ', ' + this.$el.find('#select-ano option:selected').val();	
				this.editor.setValue(this.data.exp);
				$('#select-ano').prop('selectedIndex', 0);
			}
			else {
				alert('Selecione um ano!');
			}
			break;
       	case 'add-open-par':
       		if (_.isEmpty(this.data.exp)) {
       			this.data.exp = this.editor.getValue();
	       		this.data.exp = '(';
	       		this.editor.setValue(this.data.exp);
       		}
       		else {
	       		this.data.exp = this.editor.getValue();
	       		this.data.exp += '(';
	       		this.editor.setValue(this.data.exp);
       		}
       		break;
       	case 'add-close-par':
       		this.data.exp = this.editor.getValue();
       		this.data.exp += ')';
       		this.editor.setValue(this.data.exp);
       		break;
       	case 'add-equals':
       		this.data.exp = this.editor.getValue();
       		this.data.exp += ' = ';
       		this.editor.setValue(this.data.exp);
       		break;
       	case 'add-sum':
       		this.data.exp = this.editor.getValue();
       		this.data.exp += ' + ';
       		this.editor.setValue(this.data.exp);
       		break;
       	case 'add-subtraction':
       		this.data.exp = this.editor.getValue();
       		this.data.exp += ' - ';
       		this.editor.setValue(this.data.exp);
       		break;
       	case 'add-division':
       		this.data.exp = this.editor.getValue();
       		this.data.exp += ' / ';
       		this.editor.setValue(this.data.exp);
       		break;
       	case 'add-multiplication':
       		this.data.exp = this.editor.getValue();
       		this.data.exp += ' * ';
       		this.editor.setValue(this.data.exp);
       		break;
		case 'add-func':
			if (this.$el.find('#select-func option:selected').val() !== '') {
				if (_.isEmpty(this.data.exp)) {
					this.data.exp = this.editor.getValue();
					this.data.exp = this.$el.find('#select-func option:selected').val();
					this.editor.setValue(this.data.exp);
					$('#select-func').prop('selectedIndex', 0);
				}
				else {
					this.data.exp = this.editor.getValue();
					this.data.exp += this.$el.find('#select-func option:selected').val();
					this.editor.setValue(this.data.exp);
					$('#select-func').prop('selectedIndex', 0);
				}
			}
			else {
				alert('Selecione uma função!');	
			}
			break;
    	}
    },

    create_exp: function() {
    	console.log(this.editor.selection.getCursor());

    	this.data.exp = this.editor.getValue();

    	var nameVarOutput = '[Variavel].[' + this.$el.find('#input-var-output').val() + ']';	
		var logExp = { logical_expression: this.data.exp };

		this.data.tplmember = 'WITH MEMBER ' + nameVarOutput + ' AS ' + '{logical_expression}';

	 	if (this.data.swap_var === 'rows') {
	    	this.data.tplmdx = 'NON EMPTY ' + this.data.tplmdx + ', ' + nameVarOutput + '} ON ROWS';
	    }
	    else {
	    	this.data.tplmdx = 'NON EMPTY ' + this.data.tplmdx + ', ' + nameVarOutput + '} ON COLUMNS,';
	    }

		this.data.tplmember = this.data.tplmember.replace(/{(\w+)}/g, function(m, p) {
			return logExp[p];
		});

    	if (this.data.swap_var === 'rows') {
    		this.data.mdx[2] = this.data.tplmdx;
    	}
    	else {
    		this.data.mdx[1] = this.data.tplmdx;
    	}

    	this.data.tplmdx = '';

    	for (var i in this.data.mdx) {
    		if (this.data.mdx.hasOwnProperty(i)) {
				this.data.tplmdx += this.data.mdx[i].concat(' ');	
    		}
    	}

    	this.data.tplmdx = this.data.tplmember + '\n' + this.data.tplmdx;

		_.delay(this.run_exp, 500);

		console.log(this.data);
    },

    run_exp: function() {
    	this.workspace.query.set({ type: 'MDX', formatter: 'flat' });

    	this.workspace.query.run(true, this.data.tplmdx);

    	$(this.workspace.el).find('.workspace_fields').addClass('hide');
        $(this.workspace.el).find('.auto, .query_scenario, .buckets, .non_empty, .swap_axis, .mdx, .switch_to_mdx, .zoom_mode, .drillacross').parent().hide();

		this.$el.dialog('destroy').remove();
        this.$el.remove();
        return false;
    }
});
