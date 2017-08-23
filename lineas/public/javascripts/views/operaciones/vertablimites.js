var gridvertablimites = {

    renderGrid: function (loadurl, targ) {
        var $gridTab2 = $(targ + "_t")
        /*
        $gridTab2.prepend(`
            <div class='form-row'>
                <div class="panel-body">
                    <button type="button" class="btn btn-primary btn-md">Medium</button>
                </div>
            </div>
        `);
        */
        var tmpl = "<div id='responsive-form' class='clearfix'>";
        tmpl += "<div class='form-row'>";
        tmpl += `<div id="operacionmac" class='column-full'>Garantías Disponibles: <br />
        <br />   
        <input type="checkbox" name="chk_group" value="1" />  Terreno<br />
        <input type="checkbox" name="chk_group" value="2" />  Máquina <br />
        <input type="checkbox" name="chk_group" value="3" />  Propiedad <br />`
        tmpl += "</div>";
        tmpl += "<hr style='width:100%;'/>";
        tmpl += "<div> {sData} {cData}  </div>";
        tmpl += "</div>";





        $gridTab2.jqGrid({
            url: loadurl,
            datatype: "json",
            mtype: "GET",
            //colNames: ['Id', 'Nombre', 'Rut', 'ActividadEconomica','RatingGrupal', 'NivelAtribucion','RatingIndividual', 'Clasificacion', 'Vigilancia','FechaInformacionFinanciera', 'PromedioSaldoVista', 'DeudaSbif', 'AprobadoVinculado','EquipoCobertura','Oficina','FechaCreacion','FechaVencimiento','FechaVencimientoMacAnterior','Empresa_Id'],
            colModel: [
                {
                    label: 'Id', name: 'Id', index: 'Id', key: true, hidden: true, width: 10,
                    editable: true, hidedlg: true, sortable: false, editrules: { edithidden: false },
                },
                { label: 'Mac Individual', name: 'MacIndividual_Id', hidden: true, editable: true, align: 'right' },
                { label: 'N°', name: 'Numero', width: 6, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                { label: 'Riesgo', name: 'Riesgo', width: 20, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                //{ label: 'TipoLimite', name: 'Tipolimite', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                {
                    label: 'Descripcion', name: 'Descripcion', width: 40, hidden: false, search: true, editable: true, align: 'left', editrules: { required: true },
                    formatter: function (cellvalue, options, rowObject) {
                        var idlimite = rowObject.Id;
                        var dato = cellvalue;
                        //var dato = '<a class="muestraop" href="#' + idlimite + '">' + cellvalue + '</a>';
                        return dato;
                    }
                },
                //{ label: '', name: 'PlazoResudual', width: 30, hidden: false, search: true, editable: true, editrules: { required: true } },
                { label: 'Moneda', name: 'Moneda', width: 25, hidden: false, search: true, editable: true, align: 'center', editrules: { required: true } },
                { label: 'Aprobado (Miles)', name: 'Aprobado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Utilizado (Miles)', name: 'Utilizado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                { label: 'Reservado (Miles)', name: 'Reservado', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true } },
                {
                    label: 'Disponible', name: 'Disponible2', width: 30, hidden: false, search: true, editable: true, align: 'right', formatter: 'number', formatoptions: { decimalPlaces: 0 }, editrules: { required: true },
                    formatter: function (cellvalue, options, rowObject) {
                        var bloq = 0;
                        var disp = 0;
                        $.ajax({
                            type: "GET",
                            url: '/verdetalleslim/' + rowObject.Id,
                            async: false,
                            success: function (data) {
                                if (data.length > 0) {
                                    bloq = data[0].Bloqueado;
                                    disp = data[0].Disponible;
                                    //console.log("valor de bloqueo " + bloq);
                                }
                            }
                        })
                        return (disp - bloq);
                    }
                },


                {
                    label: 'Condicion', name: 'ColorCondicion', width: 20, hidden: false, search: true, editable: true, align: 'right', align: 'center',
                    formatter: function (cellvalue, options, rowObject) {

                        var condi = "";
                        $.ajax({
                            type: "GET",
                            url: '/verdetalleslim/' + rowObject.Id,
                            async: false,
                            success: function (data) {
                                if (data.length > 0) {
                                    $("#Condicion2").html(data[0].ColorCondicion);
                                    $("#Condiciones2").html(data[0].BORRARCOND);
                                    condi = data[0].BORRARCOND;
                                    //console.log(condi);
                                }
                                else {
                                    alert("No existe cliente en Base de Datos");
                                }
                            }
                        });
                        rojo = '<span role="button" data-toggle="tooltip"  title="'+condi+'" class="muestracond" href="#' + rowObject.Id + '" aria-hidden="true" ><img src="../../../../images/redcircle.png" width="19px"/></span>';
                        //console.log(rowObject.Id);

                        amarillo = '<span role="button" data-toggle="tooltip" title="'+condi+'" class="muestracond" href="#' + rowObject.Id + '" aria-hidden="true" ><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
                        verde = '<span role="button" data-toggle="tooltip" title="'+condi+'" class="muestracond" href="#' + rowObject.Id + '" aria-hidden="true" ><img src="../../../../images/greencircle.png" width="25px"/></span>';

    
                        if (cellvalue === 'Rojo') {
                            return rojo
                        }
                        else {
                            if (cellvalue === 'Verde') {
                                return verde
                            }
                            else {
                                return amarillo
                            }
                        }
                    }
                },
                {
                    label: 'Bloqueo', name: 'Bloqueo_N', width: 15, hidden: false, search: true, editable: true, align: 'right', align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        dato = '<span role="button" class="fa fa-unlock-alt abrirbloqueo" aria-hidden="true" href="#' + rowObject.Id + '" style= "font-size: 19px;"></span>';
                        //dato2 = '<span role="button" class="fa fa-lock" aria-hidden="true abrirdesbloqueo" href="#' + rowObject.Id + '" style= "font-size: 19px;"></span>';
                        var bloq

                        $.ajax({
                            type: "GET",
                            url: '/verdetalleslim/' + rowObject.Id,
                            async: false,
                            success: function (data) {
                                if (data.length > 0) {
                                    bloq = data[0].Bloqueado;
                                    //console.log("valor de bloqueo " + bloq);
                                }
                            }
                        })

                        if (parseInt(bloq) > 0) {
                            dato = '<span role="button" class="fa fa-lock abrirbloqueo" aria-hidden="true" href="#' + rowObject.Id + '" style= "font-size: 19px;"></span>';
                            return dato; //bloqueado
                        }
                        else {
                            dato = '<span role="button" class="fa fa-unlock-alt abrirbloqueo" aria-hidden="true" href="#' + rowObject.Id + '" style= "font-size: 19px;"></span>';
                            return dato; //desbloqueado
                        }
                    }
                },
                {
                    label: 'Detalle', name: 'Detalle_N', width: 15, hidden: false, search: true, editable: true, align: 'right', align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '<span role="button" class="glyphicon glyphicon-folder-open muestradet" aria-hidden="true" href="#' + rowObject.Id + '"></span>';
                        //dato = `<span role="button" class="glyphicon glyphicon-th-list" aria-hidden="true onclick="yourFunction()"></span>`
                        return dato;
                    }
                },
                {
                    label: 'Reservar', name: 'Reservar', width: 15, hidden: false, search: true, editable: true, align: 'right', align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        var dato = '<span role="button" class="glyphicon glyphicon-import" aria-hidden="true"></span>';
                        return dato;
                    }
                },

            ],

            rowNum: 20,
            pager: '#navGridtabverlimites2',
            styleUI: "Bootstrap",
            //sortname: 'fecha',
            //sortorder: "desc",
            height: "auto",
            shrinkToFit: true,
            //autowidth: true,
            width: 1350,
            subGrid: true,
            subGridRowExpanded: subGridsublimite2, //se llama la funcion de abajo
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            rownumbers: false,
            onSelectRow: function (id) {
                var getID = $(this).jqGrid('getCell', id, 'id');
            },
            viewrecords: true,
            caption: "Detalle Limites",
            footerrow: true,
            gridComplete: function () {
                $gridTab2.jqGrid('navButtonAdd', '#navGridtabverlimites', {
                    caption: "IMPRIMIR",
                    buttonicon: "",
                    title: "Imprimir",
                    position: "last",
                    onClickButton: function () {
                        var grid = $gridTab2
                        var rowKey = grid.getGridParam("selrow");
                        var url = '#';
                        $gridTab2.jqGrid('excelExport', { "url": url });
                    }
                });
            },
            loadComplete: function () {

                var recs = $gridTab2.getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {
                    //$("#" + childGridID).addRowData("blankRow", { "id": 0, "Descripcion": " ", "Aprobado": "0" });
                    $gridTab2.parent().parent().remove();
                    $gridTab2PagerID.hide();

                }

                var rows = $gridTab2.getDataIDs();
                for (var i = 0; i < rows.length; i++) {
                    var eldisponible = $gridTab2.getRowData(rows[i]).Disponible;
                    if (parseInt(eldisponible) < 0) {
                        $gridTab2.jqGrid('setCell', rows[i], "Disponible", "", { color: 'red' });
                    }
                }



                $gridTab2.append(`
                    <div class="modal fade" id="myModal2" role="dialog">
                        <div class="modal-dialog modal-lg" style="width:90%;">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title"><b>Linea <span id="idlinea">1</span></b>: <span id="nombrelinea">Linea Capital de Trabajo</span> - <b>Plazo: </b><span id="plazolinea">12 meses</span> meses - <b>F. Venc: </b><span id="fechavenclinea">15-11-2018</span></h4>
                                </div>
                                <div class="modal-body">
                                    <div id="cuerpo1">
                                        <div style="width:32%;display: inline-block;margin-right: 1%; vertical-align:top">                  
                                            <div class="panel panel-primary">
                                                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>Límites</span></div>
                                                <div class="panel-body" style="max-height: 130px;overflow-y: auto;">
                                                    <div class="table-responsive clear">
                                                        <div style="margin-left: 50px;">
                                                            <div class="row">
                                                                <div class="col-lg-1">
                                                                    <b>Aprobado:</b>
                                                                </div>
                                                                <div class="col-lg-7 col-md-6 col-sm-6 col-xs-6 text-right ">
                                                                    $ <span id="aprobadolinea">3.000</span>
                                                                </div>
                                                            </div> 
                                                            <div class="row">
                                                                <div class="col-lg-1">
                                                                    <b>Utilizado:</b>
                                                                </div>
                                                                <div class="col-lg-7 col-md-6 col-sm-6 col-xs-6 text-right ">
                                                                    $ <span id="utilizadolinea">3.000</span>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-lg-1">
                                                                    <b>Reservado:</b>
                                                                </div>
                                                                <div class="col-lg-7 col-md-6 col-sm-6 col-xs-6 text-right ">
                                                                    $ <span id="reservadolinea">3.000</span>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-lg-1">
                                                                    <b>Bloqueado:</b>
                                                                </div>
                                                                <div class="col-lg-7 col-md-6 col-sm-6 col-xs-6 text-right ">
                                                                    $ <span id="bloqueadolinea">0</span>
                                                                </div>
                                                            </div>
                                                            <div class="row" style="border: 1px solid; border-color: #0B2161;background-color: #0B2161;color: white;">
                                                                <div class="col-lg-1">
                                                                    <b>Disponible:</b>
                                                                </div>
                                                                <div class="col-lg-7 col-md-6 col-sm-6 col-xs-6 text-right ">
                                                                    $ <span id="disponiblelinea">0</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="width:32%;display: inline-block;margin-right: 1%;vertical-align:top;">
                                            
                                            <div class="panel panel-primary" >
                                                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>Productos</div>
                                                <div id="productoslinea" class="panel-body" style="max-height: 130px;overflow-y: auto;">
                                                    <div class="table-responsive clear">
                                                        <table class="table">
                                                            <thead>
                                                                <tr>
                                                                    <th width="20%" ng-click="predicate = 'dato1'; reverse=!reverse">
                                                                        Tipo
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato1', 'ion-ios-arrow-up': predicate == 'dato1'}"></i>
                                                                    </th>
                                                                    <th width="80%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        Nombre
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div> 
                                        <div style="width:32%;display: inline-block;vertical-align:top;">
                                            <div class="panel panel-primary" >
                                                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>Clientes</div>
                                                <div id="clienteslinea" class="panel-body" style="max-height: 130px;overflow-y: auto;">
                                                    <div class="table-responsive clear">
                                                        <table class="table">
                                                            <thead>
                                                                <tr>
                                                                    <th width="20%" ng-click="predicate = 'dato1'; reverse=!reverse">
                                                                        RUT
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato1', 'ion-ios-arrow-up': predicate == 'dato1'}"></i>
                                                                    </th>
                                                                    <th width="80%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        Nombre
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div> 
                                    </div>
                                    <div id="cuerpo2">
                                        <div style="width:48%;display: inline-block;margin-right: 2%; vertical-align:top">                  
                                            <div class="panel panel-primary" >
                                                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>Condiciones</div>
                                                <div id="condicioneslinea" class="panel-body" style="max-height: 200px;overflow-y: auto;">
                                                    <div class="table-responsive clear">
                                                        <table class="table">
                                                            <thead>
                                                                <tr>
                                                                    <th width="40%" ng-click="predicate = 'dato1'; reverse=!reverse">
                                                                        Tipo Condición
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato1', 'ion-ios-arrow-up': predicate == 'dato1'}"></i>
                                                                    </th>
                                                                    <th width="20%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        RUT
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                    <th width="40%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        Nombre
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                             
                                        </div>
                                        <div style="width:48%;display: inline-block;vertical-align:top;"> 
                                            <div class="panel panel-primary" >
                                                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>Garantías</div>
                                                <div class="panel-body" style="max-height: 200px;overflow-y: auto;">
                                                    <div class="table-responsive clear">
                                                        <b>Reales</b>
                                                        <table id="garantiasrealeslinea" class="table">
                                                            <thead>
                                                                <tr>
                                                                    <th width="5%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        Folio
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                    <th width="15%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        Tipo
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                    <th width="30%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        Descripción
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                    <th width="20%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        Estado
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                    <th width="15%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        V.Comercial
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                    <th width="15%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                                        V.Liquidación
                                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr ng-repeat='dato in manual.demoListado | orderBy:predicate:reverse'>
                                                                    <td>01</td>
                                                                    <td>Leasing</td>
                                                                    <td>50% sobre vehículo</td>
                                                                    <td>Constituida</td>
                                                                    <td align="right">8.599</td>
                                                                    <td align="right">4.299</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <b>Acciones</b>
                                                        <table class="table">
                                                        </table>
                                                        <b>Estatales</b>
                                                        <table class="table">
                                                        </table>
                                                        <b>Covenants</b>
                                                        <table class="table">
                                                            
                                                        </table>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div> 
                                        
                                    </div>
                                    <div id="cuerpo3">
                                        <div style="width:98.5%;display: inline-block;margin-right: 10px; vertical-align:top">                  
                                            <div class="panel panel-primary" >
                                                <div class="panel-heading" style='background-color: #0B2161; border-color: #0B2161;'>Comentarios</div>
                                                <div class="panel-body">
                                                    <div class="table-responsive clear">
                                                        <div id="comentarioslinea" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <div class="row">
                                                                <div class="col-lg-12">
                                                                   
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                         
                                         
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="myModalbloqueo" role="dialog">
                        <div class="modal-dialog modal-sm" >
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div class="panel panel-default" >
                                        <div class="panel-heading" style="background-color: #002464;color: #fff;">Bloquear Linea</div>
                                            <div class="panel-body">
                                            
                                                <form id="miprimerform2">
                                                    <div class="btn-group">
                                                    <div class="form-group">
                                                           
                                                            <input type="text" class="form-control" id="idlineabloqueo2" style="display: none" >
                                                            <input type="text" class="form-control" id="disponible" name="disponible" style="display: none">
                                                    
                                                            <div>
                                                                <input id="btotal" type="radio" name="radio-choice" required>Total</input> 
                                                                <input id="bparcial" type="radio" name="radio-choice" required >Parcial</input>
                                                            </div>
                                                    </div>
                                                    </div>

                                                    <div class="form-group">
                                                        <label for="monto" id="labelmonto">Monto:</label>
                                                        <input type="text" class="form-control" name ="monto" id="monto">
                                                        <label for="comentario" id="labelcomentario">Comentario:</label>
                                                        <input type="text" class="form-control" name="comentario" id="comentario">
                                                    </div>
                                            
                                                    <div class="wrapper" style="text-align: center">
                                                        <button id="botonpost2" type="submit" class="btn btn-default" data-dismiss="modal">Bloquear</button>
                                                    </div>
                                                    
                                                </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="ModalDesbloqueo" role="dialog" >
                        <div class="modal-dialog modal-sm" >
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div class="panel panel-default" >
                                        <div class="panel-heading" style="background-color: #002464;color: #fff;">Desbloquear Linea</div>
                                            <div class="panel-body">
                                                <form id="miprimerform">

                                                    <div> 
                                                        Monto Bloqueado M$ : <span id="MontoBloqueado"></span><p></p>
                                                        <label for="comentario">Bloqueado por: Ejecutivo 1</label><p></p>
                                                        <div> Comentario:<span id="Comentario"></span></div>
                                                    </div>
                                                    <p></p>


                                                    <div class="form-group">
                                                        <div class="btn-group">    
                                                            <input type="text" class="form-control" id="idlineabloqueo" style="background-color: #002464;display: none">
                                                            <input type="text" class="form-control" id="Bloqueado" style="display: none">
                                                                <div>
                                                                    <input id="dtotal" type="radio" name="radio-choice" required>Total</input>     
                                                                    <input id="dparcial" type="radio" name="radio-choice" required style="background-color: #002464;">Parcial</input>  
                                                                </div> 
                                                        </div>
                                                    </div>

                                                    <p></p>
                                                    <div class="form-group">
                                                        <label for="monto" id="labelmontodesbloqueo">Monto:</label>
                                                        <input type="text" class="form-control" name ="montod" id="montodes">
                                                        <input type="text" class="form-control" name ="monto" id="nuevovalorbloqueo"; style="display: none">
                                                        
                                                    </div>

                                                    <label for="comentariodes" id="labelcomentariodesbloqueo">Comentario:</label>
                                                    <input type="text" class="form-control" name="comentariodes" id="comentariodesbloqueo">
                                                    <p></p>

                                                    <div class="wrapper" style="text-align: center">
                                                        <button id="botonpost" type="submit" class="btn btn-default" data-dismiss="modal">Desbloquear</button>
                                                    </div>
                                                </form>
                                            </div>                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>   
                    <div class="modal fade" id="myModalCondicionL" role="dialog">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">

                                <div class="panel-heading" style="background-color: #002464;color: #fff;">Detalles Linea</div>
                                <div class="modal-body">
                                    <div>Condicion: <label for="Condicion" id="Condicion2"> </label>  </div>
                                    <div>Comentario: <label for="Comentario" id="Condiciones2"> </label>  </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Aceptar</button>
                                </div>

                            </div>
                        </div>
                    </div> 
                
        `);

                $('.muestradet').click(function () {
                    var idlimite = $(this).attr('href');
                    $('#idlinea').html(idlimite.substring(1))
                    $.ajax({
                        type: "GET",
                        url: '/verdetalleslim/' + idlimite.substring(1),
                        async: false,
                        success: function (data) {
                            if (data.length > 0) {
                                $("#nombrelinea").html(data[0].Descripcion)
                                $("#aprobadolinea").html(data[0].Aprobado)
                                $("#utilizadolinea").html(data[0].Utilizado)
                                $("#reservadolinea").html(data[0].Reservado)
                                $("#disponiblelinea").html(data[0].Disponible)
                                $("#bloqueadolinea").html(0)
                                $("#plazolinea").html(data[0].Plazo)
                                var fechavenclinea = data[0].FechaVencimiento.split('-').reverse().join('-');
                                $("#fechavenclinea").html(data[0].FechaVencimiento)
                                var productos = `
                                    <div class="table-responsive clear">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th width="20%" ng-click="predicate = 'dato1'; reverse=!reverse">
                                                        Tipo
                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato1', 'ion-ios-arrow-up': predicate == 'dato1'}"></i>
                                                    </th>
                                                    <th width="80%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                        Nombre
                                                        <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>`
                                var tipolinea = data[0].Riesgo;
                                $.ajax({
                                    type: "GET",
                                    url: '/verproductoslinea/' + tipolinea,
                                    async: false,
                                    success: function (data2) {
                                        for (var i = 0; i < data2.length; i++) {
                                            productos += "<tr ng-repeat='dato in manual.demoListado | orderBy:predicate:reverse'>"
                                            productos += "<td>" + data2[i].Codigo + "</td>"
                                            productos += "<td>" + data2[i].Nombre + "</td>"
                                            productos += "</tr>"
                                        }
                                        productos += "</tbody>"
                                        productos += "</table>"
                                        productos += "</div>"
                                        $("#productoslinea").html(productos)
                                    }
                                });


                                var clientes = `
                                <div class="table-responsive clear">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th width="20%" ng-click="predicate = 'dato1'; reverse=!reverse">
                                                    RUT
                                                    <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato1', 'ion-ios-arrow-up': predicate == 'dato1'}"></i>
                                                </th>
                                                <th width="80%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                    Nombre
                                                    <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat='dato in manual.demoListado | orderBy:predicate:reverse'>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                `
                                $("#clienteslinea").html(clientes)

                                var condiciones = `
                                <div class="table-responsive clear">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th width="40%" ng-click="predicate = 'dato1'; reverse=!reverse">
                                                    Tipo Condición
                                                    <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato1', 'ion-ios-arrow-up': predicate == 'dato1'}"></i>
                                                </th>
                                                <th width="20%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                    RUT
                                                    <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                </th>
                                                <th width="40%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                                    Nombre
                                                    <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                `
                                $.ajax({
                                    type: "GET",
                                    url: '/vercondicioneslinea/' + idlimite.substring(1),
                                    async: false,
                                    success: function (data3) {
                                        for (var i = 0; i < data3.length; i++) {
                                            condiciones += "<tr ng-repeat='dato in manual.demoListado | orderBy:predicate:reverse'>"
                                            condiciones += "<td>" + data3[i].TipoCondicion + "</td>"
                                            condiciones += "<td>" + data3[i].Rut + "-" + data3[i].DV + "</td>"
                                            condiciones += "<td>" + data3[i].Nombre + "</td>"
                                            condiciones += "</tr>"
                                        }
                                        condiciones += "</tbody>"
                                        condiciones += "</table>"
                                        condiciones += "</div>"
                                        console.log(condiciones)
                                        $("#condicioneslinea").html(condiciones)
                                    }
                                });
                                var garantiasreales = `
                                <thead>
                                    <tr>
                                        <th width="5%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                            Folio
                                            <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                        </th>
                                        <th width="15%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                            Tipo
                                            <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                        </th>
                                        <th width="30%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                            Descripción
                                            <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                        </th>
                                        <th width="20%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                            Estado
                                            <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                        </th>
                                        <th width="15%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                            V.Comercial
                                            <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                        </th>
                                        <th width="15%" ng-click="predicate = 'dato2'; reverse=!reverse">
                                            V.Liquidación
                                            <i class="pull-right" ng-class="{'ion-ios-arrow-down': predicate != 'dato2', 'ion-ios-arrow-up': predicate == 'dato2'}"></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                `
                                $.ajax({
                                    type: "GET",
                                    url: '/vergarantiaslinea/' + idlimite.substring(1),
                                    async: false,
                                    success: function (data4) {
                                        for (var i = 0; i < data4.length; i++) {
                                            garantiasreales += "<tr ng-repeat='dato in manual.demoListado | orderBy:predicate:reverse'>"
                                            garantiasreales += "<td>" + data4[i].Folio + "</td>"
                                            garantiasreales += "<td>" + data4[i].Tipo + "</td>"
                                            garantiasreales += "<td>" + data4[i].Descripcion + "</td>"
                                            garantiasreales += "<td>" + data4[i].Estado + "</td>"
                                            garantiasreales += "<td>" + data4[i].ValorComercial + "</td>"
                                            garantiasreales += "<td>" + data4[i].ValorLiquidacion + "</td>"
                                            garantiasreales += "</tr>"
                                        }
                                        garantiasreales += "</tbody>"
                                        garantiasreales += "</table>"
                                        garantiasreales += "</div>"
                                        $("#garantiasrealeslinea").html(garantiasreales)
                                    }
                                });
                                var comentarios = "";

                                $.ajax({
                                    type: "GET",
                                    url: '/vercomentarioslinea/' + idlimite.substring(1),
                                    async: false,
                                    success: function (data5) {
                                        for (var i = 0; i < data5.length; i++) {
                                            comentarios += "<div class='row'>";
                                            comentarios += "<div class='col-lg-12'>"
                                            comentarios += data5[i].Comentario
                                            comentarios += "</div>";
                                            comentarios += "</div>";
                                        }

                                        $("#comentarioslinea").html(comentarios)
                                    }
                                });

                            }
                            else {
                                alert("No existe cliente en Base de Datos");
                            }
                        }
                    });
                    $("#myModal2").modal();
                });

                $('.muestracond').click(function () {
                    var idlimite = $(this).attr('href');
                    $('#ellimite3').html(idlimite.substring(1))
                    $.ajax({
                        type: "GET",
                        url: '/verdetalleslim/' + idlimite.substring(1),
                        async: false,
                        success: function (data) {
                            if (data.length > 0) {
                                $("#Condicion2").html(data[0].ColorCondicion);
                                $("#Condiciones2").html(data[0].BORRARCOND);
                                var condi = $("#Condiciones2").val(data[0].BORRARCOND);
                                console.log("comentario " + data[0].BORRARCOMEN);
                            }
                            else {
                                alert("No existe cliente en Base de Datos");
                            }
                        }
                    });
                    $("#myModalCondicionL").modal();
                });

                $('.bloqueo').click(function () {
                    var idlimite = $(this).attr('href');

                    $("#myModalbloqueo").modal();

                });

                $('#botonpost').click(function () {
                    console.log("holapo"); //desbloqueo
                    var idlineabloqueo = $('#idlineabloqueo').val();
                    
                    var des=$("#montodes").val();
                    var bloq=$("#Bloqueado").val();
                    var nuevovalorbloq=bloq-des;
                    $("#nuevovalorbloqueo").val(nuevovalorbloq);
                    //console.log("el valor enviado es: "+nuevovalorbloq);


                    $.ajax({
                        type: "POST",
                        url: "/cargarbloqueo/" + idlineabloqueo,
                        data: $('#miprimerform').serialize(),
                        success: function (msg) {
                            console.log("tremendo exito " + msg)
                            $gridTab2.trigger('reloadGrid');
                        }
                    });

                });

                $('#botonpost2').click(function () {
                    console.log("holapo"); //BLOQUEO
                    var idlineabloqueo = $('#idlineabloqueo2').val();


                    $.ajax({
                        type: "POST",
                        url: "/cargarbloqueo/" + idlineabloqueo,
                        data: $('#miprimerform2').serialize(),
                        success: function (msg) {
                            console.log("tremendo exito " + msg)
                            $gridTab2.trigger('reloadGrid');

                        }
                    });

                });

                $('.desbloqueo').click(function () {
                    var idlimite = $(this).attr('href');

                    $("#ModalDesbloqueo").modal();

                });

                $('.abrirbloqueo').click(function () {
                    var id = $(this).attr('href').substring(1);
                    $.ajax({
                        type: "GET",
                        url: '/verdetalleslim/' + id,
                        async: false,
                        success: function (data) {
                            if (data.length > 0) {
                                var bloq = data[0].Bloqueado;
                                //console.log("valor de bloqueo " + bloq);
                            }

                            if (bloq > 0) {
                                $("#MontoBloqueado").html(data[0].Bloqueado) //desbloqueo
                                $("#Bloqueado").val(data[0].Bloqueado)
                                $("#idlineabloqueo").val(data[0].Id)
                                $("#ModalDesbloqueo").modal();
                                $("#Comentario").html(data[0].BORRARCOMEN)
                                $("#botonpost").hide();
                                $("#labelmontodesbloqueo").hide();
                                $("#montodes").hide();
                                $("#labelcomentariodesbloqueo").hide();
                                $("#comentariodesbloqueo").hide();
                           
                             
                            }
                            else {
                                //Bloqueo
                                $("#idlineabloqueo2").val(data[0].Id)
                                $("#disponible").val(data[0].Disponible)
                                $("#myModalbloqueo").modal();
                                $("#monto").hide();
                                $("#labelmonto").hide();
                                $("#montodes").hide();
                                $("#labelmontodesbloqueo").hide();
                                $("#labelcomentario").hide();
                                $("#comentario").hide();
                                $("#botonpost2").hide();

                            }

                        }
                    })
                });

                $('#bparcial').click(function () {
                    //console.log("bloqueo parcial");
                    //var idlineabloqueo = $('#idlineabloqueo2').val();
                    $("#monto").show();
                    $("#labelmonto").show();
                    $("#labelcomentario").show();
                    $("#comentario").show();
                    $("#botonpost2").show();
                });

                $('#btotal').click(function () {
                    $("#monto").hide();
                    $("#labelmonto").hide();
                    $("#labelcomentario").show();
                    $("#comentario").show();
                    $("#botonpost2").show();
                    $("#monto").val($("#disponible").val());
                    //console.log($("#monto").val);
                    //var idlineabloqueo = $('#idlineabloqueo2').val();
                });

                $('#dparcial').click(function () {
                    //$("#montodes").hide();
                    //$("#labelmontodesbloqueo").hide();
                    $("#montodes").show();
                    $("#labelmontodesbloqueo").show();
                    $("#botonpost").show();
                    $("#labelcomentariodesbloqueo").show();
                    $("#comentariodesbloqueo").show();
                   
                    //var idlineabloqueo = $('#idlineabloqueo2').val();
                });

                $('#dtotal').click(function () {
                    $("#montodes").hide();
                    $("#labelmontodesbloqueo").hide();
                    $("#montodes").val($("#Bloqueado").val());
                    $("#botonpost").show();
                    $("#labelcomentariodesbloqueo").show();
                    $("#comentariodesbloqueo").show();
                    //console.log($("#monto").val);
                    //var idlineabloqueo = $('#idlineabloqueo2').val();
                });

                var thisId = $.jgrid.jqID(this.id);

                var sum1 = $gridTab2.jqGrid('getCol', 'Aprobado', false, 'sum');
                var sum2 = $gridTab2.jqGrid('getCol', 'Utilizado', false, 'sum');
                var sum3 = $gridTab2.jqGrid('getCol', 'Reservado', false, 'sum');
                var sum4 = $gridTab2.jqGrid('getCol', 'Disponible', false, 'sum');
                /*var sum5 = $("#" + childGridID).jqGrid('getCol', 'Total', false, 'sum');
                var sum6 = $("#" + childGridID).jqGrid('getCol', 'VarAprobacion', false, 'sum');
                var sum7 = $("#" + childGridID).jqGrid('getCol', 'DeudaBanco', false, 'sum');
                var sum8 = $("#" + childGridID).jqGrid('getCol', 'GarantiaReal', false, 'sum');
                var sum9 = $("#" + childGridID).jqGrid('getCol', 'SBIFACHEL', false, 'sum');
                var sum10 = $("#" + childGridID).jqGrid('getCol', 'Penetracion', false, 'avg');
                */

                $gridTab2.jqGrid('footerData', 'set',
                    {
                        Moneda: 'Total (CLP) :',
                        Aprobado: sum1,
                        Utilizado: sum2,
                        Reservado: sum3,
                        Disponible: sum4,
                        Bloqueo_N: 'CANDADO'
                        /*Total : sum5,
                        VarAprobacion : sum6,
                        DeudaBanco: sum7,
                        GarantiaReal: sum8,
                        SBIFACHEL: sum9,
                        Penetracion: sum10
                        */
                    });
            },


        });
        $gridTab2.jqGrid('setLabel', 'Numero', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Riesgo', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Descripcion', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Moneda', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Aprobado', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Utilizado', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Disponible', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'ColorCondicion', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Bloqueo_N', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Detalle_N', '', { 'text-align': 'center' });
        $gridTab2.jqGrid('setLabel', 'Reservar', '', { 'text-align': 'center' });

        $gridTab2.jqGrid('navGrid', '#navGridtabverlimites', { edit: false, add: false, del: false, search: false },
            {
                editCaption: "Modificar Límite",
                closeAfterEdit: true,
                recreateForm: true,
                template: tmpl,
                mtype: 'POST',
                url: '/vertablimites/1',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    var rowKey = $gridTab2.getGridParam("selrow");
                    var rowData = $gridTab2.getRowData(rowKey);
                    var thissid = rowData.fecha;
                    $('#mensajefecha').html("<div class='column-full'>Estado con fecha: " + thissid + "</div>");
                },
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {
                    if (parseInt(postdata.idcolor) == 0) {
                        return [false, "Color: Debe escoger un valor", ""];
                    } if (postdata.comentario.trim().length == 0) {
                        return [false, "Comentario: Debe ingresar un comentario", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                addCaption: "Agregar Límite",
                closeAfterAdd: true,
                recreateForm: true,
                //template: tmpl,
                mtype: 'POST',
                url: '/limite',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                beforeShowForm: function (form) {
                    var lafechaactual = new Date();
                    var elanoactual = lafechaactual.getFullYear();
                    var elmesactual = (lafechaactual.getMonth() + 1);
                    if (elmesactual < 10) {
                        elmesactual = "0" + elmesactual
                    }
                    var eldiaactual = lafechaactual.getDate();
                    if (eldiaactual < 10) {
                        eldiaactual = "0" + eldiaactual
                    }

                    var lafechastring = eldiaactual + "-" + elmesactual + "-" + elanoactual
                    $('input#fecha').html(lafechastring);
                    $('input#fecha').attr('value', lafechastring);
                    $('#mensajefecha').html("<div class='column-full'>El estado se guardará con fecha: " + lafechastring + "</div>");

                },
                onclickSubmit: function (rowid) {
                    var lafechaactual = new Date();
                    var elanoactual = lafechaactual.getFullYear();
                    var elmesactual = (lafechaactual.getMonth() + 1);
                    if (elmesactual < 10) {
                        elmesactual = "0" + elmesactual
                    }
                    var eldiaactual = lafechaactual.getDate();
                    if (eldiaactual < 10) {
                        eldiaactual = "0" + eldiaactual
                    }

                    var lafechastring = eldiaactual + "-" + elmesactual + "-" + elanoactual
                    return { parent_id: parentRowKey };
                }, beforeSubmit: function (postdata, formid) {



                    if (parseInt(postdata.fechavencimiento) == 0) {
                        return [false, "Color: Debe escoger un valor", ""];
                    } if (postdata.comentario.trim().length == 0) {
                        return [false, "Comentario: Debe ingresar un comentario", ""];
                    } else {
                        return [true, "", ""]
                    }
                }
            }, {
                mtype: 'POST',
                url: '/limite',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                onclickSubmit: function (rowid) {
                    return { idsolicitudcotizacion: parentRowKey };
                },
                beforeShowForm: function (form) {
                    ret = $gridTab2.getRowData($gridTab2.jqGrid('getGridParam', 'selrow'));
                    $("td.delmsg", form).html("<b>Usted borrará el limite:</b><br><b>" + ret.tipolimite + "</b> ?");

                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (!result.success)
                        return [false, result.message, ""];
                    else
                        return [true, "", ""]
                }
            });




    }
}

function subGridsublimite2(subgrid_id, row_id) {//cambiar el nombre a la funcion si se copia la plantilla!!!!
    //console.log('hola');
    gridvertabsublimites(subgrid_id, row_id, 'sublimite'); //sublimite es el nombre con el que quedaran los divs en la subgrilla (/verlimite.js)
}
