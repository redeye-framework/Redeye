		
		$(document).ready(function() {
			var $flowchart = $('#flowchartworkspace');
			var $container = $flowchart.parent();


			// Apply the plugin on a standard, empty div...
			$flowchart.flowchart({
				data: defaultFlowchartData,
				defaultSelectedLinkColor: '#000055',
				grid: 10,
				multipleLinksOnInput: true,
				multipleLinksOnOutput: true
			});


			function getOperatorData($element) {
				var nbInputs = parseInt($element.data('nb-inputs'), 10);
				var nbOutputs = parseInt($element.data('nb-outputs'), 10);
				var data = {
					properties: {
						title: $element.text(),
						inputs: {},
						outputs: {}
					}
				};

				var i = 0;
				for (i = 0; i < nbInputs; i++) {
					data.properties.inputs['input_' + i] = {
						label: 'Input ' + (i + 1)
					};
				}
				for (i = 0; i < nbOutputs; i++) {
					data.properties.outputs['output_' + i] = {
						label: 'Output ' + (i + 1)
					};
				}

				return data;
			}



			//-----------------------------------------
			//--- operator and link properties
			//--- start
			var $attackProperties = $('#attack_properties');
			$attackProperties.show();
			var $operatorProperties = $('#operator_properties');
			$operatorProperties.hide();
			var $linkProperties = $('#link_properties');
			$linkProperties.hide();
			var $operatorTitle = $('#operator_title');
			var $operatorInput0 = $('#operator_input0');
			var $operatorInput1 = $('#operator_input1');
			var $operatorOutput0 = $('#operator_output0');
			var $operatorOutput1 = $('#operator_output1');
			var $linkColor = $('#link_color');

			$flowchart.flowchart({
				onOperatorSelect: function(operatorId) {
					$operatorProperties.show();
					$attackProperties.hide();
					var value = "";
					$operatorTitle.val($flowchart.flowchart('getOperatorTitle', operatorId));
					value = $flowchart.flowchart('getOperatorInput0', operatorId)
					if (value != "undefined"){
						$operatorInput0.val(value);
						$operatorInput0.show();
					} else {
						$operatorInput0.hide();
					}
					value = $flowchart.flowchart('getOperatorOutput0', operatorId)
					if (value != "undefined"){
						$operatorOutput0.val(value);
						$operatorOutput0.show();
					} else {
						$operatorOutput0.hide();
					}
					value = $flowchart.flowchart('getOperatorInput1', operatorId)
					if (value != "undefined"){
						$operatorInput1.val(value);
						$operatorInput1.show();
					} else {
						$operatorInput1.hide();
					}
					value = $flowchart.flowchart('getOperatorOutput1', operatorId)
					if (value != "undefined"){
						$operatorOutput1.val(value);
						$operatorOutput1.show();
					} else {
						$operatorOutput1.hide();
					}
					return true;
				},
				onOperatorUnselect: function() {
					$operatorProperties.hide();
					$attackProperties.show();
					return true;
				},
				onLinkSelect: function(linkId) {
					$linkProperties.show();
					$attackProperties.hide();
					$linkColor.val($flowchart.flowchart('getLinkMainColor', linkId));
					return true;
				},
				onLinkUnselect: function() {
					$linkProperties.hide();
					$attackProperties.show();
					return true;
				}
			});

			$operatorTitle.keyup(function() {
				var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
				if (selectedOperatorId != null) {
					$flowchart.flowchart('setOperatorTitle', selectedOperatorId, $operatorTitle.val());
				}
			});

			$operatorInput0.keyup(function() {
				var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
				if (selectedOperatorId != null) {
					$flowchart.flowchart('setOperatorInput0', selectedOperatorId, $operatorInput0.val());
				}
			});

			$operatorInput1.keyup(function() {
				var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
				if (selectedOperatorId != null) {
					$flowchart.flowchart('setOperatorInput1', selectedOperatorId, $operatorInput1.val());
				}
			});

			$operatorOutput0.keyup(function() {
				var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
				if (selectedOperatorId != null) {
					$flowchart.flowchart('setOperatorOutput0', selectedOperatorId, $operatorOutput0.val());
				}
			});

			$operatorOutput1.keyup(function() {
				var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
				if (selectedOperatorId != null) {
					$flowchart.flowchart('setOperatorOutput1', selectedOperatorId, $operatorOutput1.val());
				}
			});

			$linkColor.change(function() {
				var selectedLinkId = $flowchart.flowchart('getSelectedLinkId');
				if (selectedLinkId != null) {
					$flowchart.flowchart('setLinkMainColor', selectedLinkId, $linkColor.val());
				}
			});
			//--- end
			//--- operator and link properties
			//-----------------------------------------

			//-----------------------------------------
			//--- delete operator / link button
			//--- start
			//$flowchart.parent().siblings('.delete_selected_button').click(function() {
			$('.delete_selected_button').click(function() {
				$flowchart.flowchart('deleteSelected');
			});
			//--- end
			//--- delete operator / link button
			//-----------------------------------------



			//-----------------------------------------
			//--- create operator button
			//--- start
			var operatorI = 0;
			$flowchart.parent().siblings('.create_operator').click(function() {
				var operatorId = 'created_operator_' + operatorI;
				var operatorData = {
					top: ($flowchart.height() / 2) - 30,
					left: ($flowchart.width() / 2) - 100 + (operatorI * 10),
					properties: {
						title: 'Operator ' + (operatorI + 3),
						inputs: {
							input_1: {
								label: 'Input 1',
							}
						},
						outputs: {
							output_1: {
								label: 'Output 1',
							}
						}
					}
				};

				operatorI++;

				$flowchart.flowchart('createOperator', operatorId, operatorData);

			});
			//--- end
			//--- create operator button
			//-----------------------------------------




			//-----------------------------------------
			//--- draggable operators
			//--- start
			//var operatorId = 0;
			var $draggableOperators = $('.draggable_operator');
			$draggableOperators.draggable({
				cursor: "move",
				opacity: 0.7,

				// helper: 'clone',
				appendTo: 'body',
				zIndex: 1000,

				helper: function(e) {
					var $this = $(this);
					var data = getOperatorData($this);
					return $flowchart.flowchart('getOperatorElement', data);
				},
				stop: function(e, ui) {
					var $this = $(this);
					var elOffset = ui.offset;
					var containerOffset = $container.offset();
					if (elOffset.left > containerOffset.left &&
						elOffset.top > containerOffset.top &&
						elOffset.left < containerOffset.left + $container.width() &&
						elOffset.top < containerOffset.top + $container.height()) {

						var flowchartOffset = $flowchart.offset();

						var relativeLeft = elOffset.left - flowchartOffset.left;
						var relativeTop = elOffset.top - flowchartOffset.top;

						var positionRatio = $flowchart.flowchart('getPositionRatio');
						relativeLeft /= positionRatio;
						relativeTop /= positionRatio;

						var data = getOperatorData($this);
						data["properties"]["title"] = "New Operator";
						data.left = relativeLeft;
						data.top = relativeTop;

						$flowchart.flowchart('addOperator', data);
					}
				}
			});
			//--- end
			//--- draggable operators
			//-----------------------------------------


			//-----------------------------------------
			//--- save and load
			//--- start
			
			function Flow2Text() {
				var data = $flowchart.flowchart('getData');
				$('#flowchart_data').val(JSON.stringify(data, null, 2));
			}
			function download_data(){
				var j = $flowchart.flowchart('getData');
				j["severity"] = $(".severity input").val();
				j["plausibility"] = $(".plausibility input").val();
				j["risk"] = $(".risk input").val();
				$("#json-input").val(JSON.stringify(j));
				$("#tab-input").val($("#attack-name-input").val() + ".json");
				$("#attack-form").submit();
				//download("attack.json",JSON.stringify(data, null, 2));
			}
			$('#get_data').click(Flow2Text);
			function Text2Flow() {
				var data = JSON.parse($('#flowchart_data').val());
				$flowchart.flowchart('setData', data);
			}
			$('#set_data').click(Text2Flow);

			/*global localStorage*/
			function SaveToLocalStorage() {
				download_data();
			}
			$('#save_local').click(SaveToLocalStorage);

			function LoadJson() {
				var data = JSON.parse(window.event.srcElement.value);
				$flowchart.flowchart('setData', data);
				
			}
			$(document.querySelectorAll('[id*="json"]')).click(LoadJson);

			function clear() {
				$flowchart.flowchart('setData', "");
			}
			$('#clear_screen').click(clear);
			//--- end
			//--- save and load
			//-----------------------------------------


		});

		var defaultFlowchartData = {
			operators: {
				operator1: {
					top: 80,
					left: 300,
					properties: {
						title: 'Our staion',
						outputs: {
							output_1: {
								label: 'tcp-22'
							},
						}
					}
				},
			},
		};
		if (false) console.log('remove lint unused warning', defaultFlowchartData);
		