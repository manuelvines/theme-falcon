var tablaempleados = null;

	$(document).ready(function() {
		

		try {
			tablaempleados = $('#tablaempleados').DataTable( {
				paging      : true,
				retrieve: true,
				pageLength  : 15,
				lengthChange: false,
				dom: "<'row mx-0'<'col-md-12'B><'col-md-6'l><'col-md-6'f>>" + "<'table-responsive scrollbar'tr>" + "<'row g-0 align-items-center justify-content-center justify-content-sm-between'<'col-auto mb-2 mb-sm-0 px-0'i><'col-auto px-0'p>>",
				ordering    : true,
				serverSide	: false,
				fixedHeader : true,
				orderCellsTop: true,
				info		: true,
				select      : false,
				stateSave	: false, 
				order       : [ [ 0, 'asc' ] ],	
				buttons: [
					{ 	text: '<span class="fas fa-plus" data-fa-transform="shrink-3 down-2"></span><span class="d-none d-sm-inline-block ms-1">Nuevo</span>',
					className: 'btn btn-primary me-1 mb-1 btn-sm btnPanel',
					action: function ( e, dt, node, config ) {
						abreModal('nuevo', 0);
					},
				},

				{ 	text: '<span class="fas fa-cloud-upload-alt" data-fa-transform="shrink-3 down-2"></span><span class="d-none d-sm-inline-block ms-1">Importar</span>',
					className: 'btn btn-primary me-1 mb-1 btn-sm btnPanel',
					action: function ( e, dt, node, config ) {
						abreModal('importarEmp', 0);
					},
				},

				{ 	text: '<span class="fas fa-cloud-upload-alt" data-fa-transform="shrink-3 down-2"></span><span class="d-none d-sm-inline-block ms-1">Importar Fotos</span>',
					className: 'btn btn-primary me-1 mb-1 btn-sm btnPanel',
					action: function ( e, dt, node, config ) {
						abreModal('importarFoto', 0);
					},
				},

			      	{ 	extend: "collection",
				    	autoClose : true,  
				    	text:'<span class="fas fa-external-link-alt" data-fa-transform="shrink-3 down-2"></span><span class="d-none d-sm-inline-block ms-1">Export</span>',
				    	className: 'btn btn-outline-secondary me-1 mb-1 btn-sm btnClr',
				    	buttons: [
				    		{ extend: "excel", text:'Exportar Excel',  title: 'Detalle Etiquetas', exportOptions: {modifier: {selected: null, page: 'all'}}, filename: 'CatalogoEtiquetas'},
				    		{ extend: "pdf", text:'Exportar PDF', orientation: "landscape", pageSize: "LEGAL", title: "Detalle Etiquetas", filename: 'CatalogoEtiquetas', exportOptions: { modifier: { page: "all", }, }, }, 
				        ], 
			      	}
				],
				language : {
					processing:     "Procesando...",
					zeroRecords:    "No se encontraron resultados",
					emptyTable:     "Ningún dato disponible en esta tabla",
					info:           "Mostrando _START_ al _END_ de _TOTAL_ registros",
					infoEmpty:      "No hay registros disponibles",
					infoFiltered:   "(filtrado de un total de _MAX_ registros)",
					infoPostFix:    "",
					search:         "Buscar:",
					url:            "",
					infoThousands:  ",",
					loadingRecords: "Cargando...",
					oPaginate: {
				           sFirst : "Primero",
				           sLast  : "Último",
				           sNext  : "<span class='fa fa-chevron-right fa-w-10'></span>",
				           sPrevious : "<span class='fa fa-chevron-left fa-w-10'></span>"
				   	}
				},
				ajax : {
					url: '../cafe247/catalogos/json/empleados.json',
					type: 'POST'
				},
				aoColumns : [
					{ mData: "idRegistro", "sClass": "dt-body-left"},
					{ mData: "idEmpleado", "sClass": "dt-body-left"},
					{ mData: "nombreCompleto", "sClass": "dt-body-left"},
					{ mData: "tipoEmpleado", "sClass": "dt-body-left"},
					{ mData: "desEmpresa", "sClass": "dt-body-left"},
					{ mData: "desTurno", "sClass": "dt-body-left"},
					{ mData: "badge", "sClass": "dt-body-left"},
					{ mData: "correo", "sClass": "dt-body-left"},
					{ mData: "puesto", "sClass": "dt-body-left"},
					{ mData: null, "sClass": "text-center"}
				],
				columnDefs: [

					  {
				        targets: 9,
				        render: function (data, type, row) {
				            rowElement = '<div class="dropdown font-sans-serif d-inline-block mb-2" style="margin: 0px !important;">';
				            rowElement += '<button class="btn btn-falcon-default dropdown-toggle" id="dropdownMenuButton" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">...</button>';
				            rowElement += '<div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuButton">';
				            rowElement += '<a class="dropdown-item" href="javascript:abreModal(\'editar\', \'' + row.idReg + '\');">Editar</a>';
							rowElement += '<a class="dropdown-item text-danger" href="javascript:eliminaCatalogo(\'' + row.idReg + '\', \'' + row.idReg + '\', \'' + row.nombreCompleto + '\');">Eliminar</a>'; 
				            rowElement += '</div>';
				            rowElement += '</div>';
				                return rowElement;
				          }
				      }


				  ],
		          initComplete: function () {
		        	  var btns = $('.dt-button');
		              btns.removeClass('dt-button');
		              
		              var btnsSubMenu = $('.dtb-b2');
		              btnsSubMenu.addClass('dropdown-menu dropdown-menu-end py-0 show');
		              
		           },
				  drawCallback: function () {
					  
				  }
			});
			
		} catch(e) {
			alert('usuarios()_'+e);
		};
		
		tablaempleados.on( 'draw', function () {
			 $('[data-bs-toggle="tooltip"]').tooltip();
		} );
			
	}); 
	
	// Aqui se agrega los filtros del encabezado
	$('#tablaempleados thead tr:eq(1) th').each( function (i) {
		 var title = $(this).text();
		 if (i == 9){
		 } else {
			 $(this).html( '<input type="text" class="form-control form-control-sm" placeholder="'+title+'" style="width: 100%;" />' );	 
		 }
	});
	
	$('#tablaempleados thead tr:eq(1) th').on('keyup', "input",function () {
		filtraDatos($(this).parent().index(), this.value);
	});
		
	function filtraDatos(columna, texto) {
		tablaempleados
			.column(columna)
	        .search(texto)
	        .draw();
	}
		
	function abreModal(opcion, id) 
	{
		switch(opcion) {
		case "nuevo" : 
			iniciaForm();  
			document.getElementById("modal-title-abc").innerHTML = "Agregar Empleado";
			$('#myModalempleado').modal('show');
			break;

			case "editar" :
			iniciaForm();  
			document.getElementById("modal-title-abc").innerHTML = "Editar Empleado";
			$('#myModalempleado').modal('show');
			break;		


			case "importarEmp" :
			iniciaForm();  
			$('#myModalimportarempleado').modal('show');
			break;		

			case "importarFoto" :
			iniciaForm();  
			$('#myModalimportarfoto').modal('show');
			break;		


		default :
		}
		
	}
	
	function iniciaForm() {


		$('#CbmEmpresa').select2({
			dropdownParent: $('#myModalempleado .modal-body'),
			theme: 'bootstrap-5'
		});
	

		$('#CbmTurno').select2({
			dropdownParent: $('#myModalempleado .modal-body'),
			theme: 'bootstrap-5'
		});
	

		$("#form-Empleado").find('.has-success').removeClass("has-success");
		$("#form-Empleado").find('.has-error').removeClass("has-error");
		$('#form-Empleado')[0].reset();
		$('#form-Empleado').removeClass("was-validated");


		$("#form-Importarempleado").find('.has-success').removeClass("has-success");
		$("#form-Importarempleado").find('.has-error').removeClass("has-error");
		$('#form-Importarempleado')[0].reset();
		$('#form-Importarempleado').removeClass("was-validated");


		$("#form-Importarfoto").find('.has-success').removeClass("has-success");
		$("#form-Importarfoto").find('.has-error').removeClass("has-error");
		$('#form-Importarfoto')[0].reset();
		$('#form-Importarfoto').removeClass("was-validated");
	}

	