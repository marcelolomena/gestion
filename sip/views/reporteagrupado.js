extends base.jade
block titulo
  title SIP Banco de Chile - Sistema Integrado de Presupuesto - Reportes
block jsgrilla
  link(rel='stylesheet', href='/stylesheets/jquery-ui.css', type='text/css', media='screen', charset='utf-8')
  script(type='text/javascript', src='/javascripts/jquery-ui.min.js')  
  script(type='text/javascript', src='/javascripts/views/reporteagrupado.js')
  style.
    .pdfobject-container { height: 500px;}
    .pdfobject { border: 1px solid #666; } 
    #groups li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; height: 18px; }
    #groups li span { position: absolute; margin-left: -1.3em; } 
block titulogrilla
  //.header(style='height:50px; background-image:url(../images/dash_ch.jpg); background-repeat:no-repeat; background-position: left center; margin-top:5px; margin-bottom:5px')
    //h2(style="font-family:'Roboto', sans-serif; color: #002464; font-weight:300; text-align:left; font-size:18px; text-indent:65px; line-height:50px") REPORTE
block grilla
  //.gcontainer
  #outerDiv(style='margin:50px;height:100%')  
   table#grid
   #pager