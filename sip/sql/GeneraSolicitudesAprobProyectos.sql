ALTER procedure [sip].[GeneraSolicitudesAprobProyectos] (@periodoproceso INT)
as
BEGIN
	DECLARE @tienecto INT;
	DECLARE @tieneIva INT;
	DECLARE @CtoIva INT;
	DECLARE @FactorRec FLOAT;
	DECLARE @idsolicitud INT;
	--cursor
	DECLARE @id INT;
	DECLARE @periodo INT;
	DECLARE @iddetallecompromiso INT;
	DECLARE @idprefactura INT;
	DECLARE @idcui INT;
	DECLARE @sap INT;
	DECLARE @tarea VARCHAR(32);
	DECLARE @idproveedor INT;
	DECLARE @idservicio INT;
	DECLARE @glosa VARCHAR(255);
	DECLARE @idcontrato INT;
	DECLARE @montoneto FLOAT;
	DECLARE @montoimpuesto FLOAT;
	DECLARE @montoapagar FLOAT;
	DECLARE @valorconversion FLOAT;
	DECLARE @montoapagarpesos INT;
	DECLARE @coniva INT;
	DECLARE @factorimpuesto FLOAT;
	
	--Actualiza en dato del IVA en compromisos por SAP desde contratos
	EXECUTE sip.ActualizaIVATareaEnVuelo;
	
	DECLARE compromisos CURSOR FOR 
	    SELECT
	    C.id, 
	    C.periodo,
	    C.id iddetallecompromiso,
	    NULL idprefactura,
	    D.id idcui,
	    A.sap,
	    B.tarea,                
	    B.idproveedor,
	    B.idservicio, 
	    B.glosa,
	    A.id idcontrato,
	    IIF(B.coniva!=0,C.montoorigen/1.19, C.montoorigen) montoneto,
		IIF(B.coniva!=0, C.montoorigen - (C.montoorigen/1.19), 0) montoimpuesto,
		C.montoorigen montoapagar,
		F.valorconversion,
		0 montoapagarpesos,
		B.coniva,
		IIF(B.coniva!=0, 0.77, 0) factorimpuesto                
	    FROM sip.presupuestoenvuelo A 
	    JOIN sip.tareaenvuelo B ON A.id = B.idpresupuestoenvuelo
	    JOIN sip.flujopagoenvuelo C ON B.id = C.idtareaenvuelo
	    JOIN sip.estructuracui D ON B.idcui = D.id
		JOIN sip.proveedor E ON B.idproveedor = E.id
		JOIN sip.monedasconversion F ON F.idmoneda = B.idmoneda 
	    WHERE
		 C.estadopago IS NULL AND 
		 C.periodo = @periodoproceso AND
		 F.periodo = @periodoproceso AND
		C.montoorigen != 0 AND
		E.numrut != 1
	UNION               
		SELECT
	    C.id, 
	    C.periodo,
	    C.id iddetallecompromiso,
	    NULL idprefactura,
	    D.id idcui,
	    A.sap,
	    B.tarea,                
	    B.idproveedor,
	    B.idservicio, 
	    B.glosa,
	    A.id idcontrato,
	    IIF(B.coniva!=0,C.montoorigen/1.19, C.montoorigen) montoneto,
		IIF(B.coniva!=0, C.montoorigen - (C.montoorigen/1.19), 0) montoimpuesto,
		C.montoorigen montoapagar,
		F.valorconversion,
		0 montoapagarpesos,
		B.coniva,
		IIF(B.coniva!=0, 0.77, 0) factorimpuesto                
	    FROM sip.presupuestoenvuelo A 
	    JOIN sip.tareaenvuelo B ON A.id = B.idpresupuestoenvuelo
	    JOIN sip.flujopagoenvuelo C ON B.id = C.idtareaenvuelo
	    JOIN sip.estructuracui D ON B.idcui = D.id
		JOIN sip.proveedor E ON B.idproveedor = E.id
		JOIN sip.monedasconversion F ON F.idmoneda = B.idmoneda 
	    WHERE
		 C.periodo < @periodoproceso AND
		 F.periodo = @periodoproceso AND
		C.montoorigen != 0 AND
		E.numrut != 1 AND
		(C.estadopago = 'ABONADO' OR C.estadopago = 'GENERADO' OR C.estadopago IS NULL) and
	    C.id NOT IN (SELECT a.iddetallecompromiso FROM sip.solicitudaprobacion a
		JOIN sip.flujopagoenvuelo b ON a.iddetallecompromiso=b.id WHERE a.periodo=@periodoproceso 
		AND b.periodo < @periodoproceso ) 
	OPEN compromisos
	FETCH NEXT FROM compromisos INTO 
	@id, @periodo, @iddetallecompromiso, @idprefactura, @idcui, @sap, @tarea, @idproveedor, @idservicio, @glosa, 
	@idcontrato, @montoneto, @montoimpuesto, @montoapagar, @valorconversion, @montoapagarpesos, @coniva, @factorimpuesto
	WHILE @@fetch_status = 0   
	BEGIN	                             
	    SELECT @tienecto = -1;
	    SELECT @tieneIva = -1;
		SELECT @tienecto=a.id, @tieneIva=b.impuesto
	    FROM sip.contrato a JOIN sip.detalleserviciocto b ON a.id=b.idcontrato 
	    WHERE a.idproveedor=@idproveedor AND b.sap=@sap AND b.tarea=@tarea;
	    IF (@tienecto > 0) 
	    BEGIN
	        IF (@tieneIva > 0)
	        BEGIN
	    		SELECT @CtoIva = 1;
	    		SELECT @FactorRec = 0.77;
	    	END
	    	ELSE
	        BEGIN
	    		SELECT @CtoIva = 0;
	    		SELECT @FactorRec = 0;
	    	END    	
	        
	        --Crea solicitud
	        --id, periodo, iddetallecompromiso, idprefactura, idcui, sap, tarea, idproveedor, idservicio, 
	        --glosa, idcontrato, montoneto, montoimpuesto, montoapagar, valorconversion, montoapagarpesos, 
	        --coniva, factorimpuesto
			INSERT INTO sip.solicitudaprobacion (periodo, iddetallecompromiso, idcui, idproveedor, idservicio, glosaservicio, 
			idfacturacion,idcontrato, montoneto, montoaprobado, montomulta, montoimpuesto, idcausalmulta, 
			glosamulta, aprobado, glosaaprobacion, idcalificacion, montoaprobadopesos, montomultapesos, 
			montoapagarpesos,  factorconversion, borrado, impuesto, factorimpuesto, 
			sap, tarea)
			VALUES (@periodoproceso, @iddetallecompromiso, @idcui, @idproveedor, @idservicio, @glosa, 
			@iddetallecompromiso,@idcontrato, @montoneto, 0, 0, @montoimpuesto, 0, 
			NULL, 0, NULL, 0, 0, 0, 
			@montoapagarpesos,  @valorconversion, 1, @CtoIva, @FactorRec,
			@sap, @tarea);
			
			--Actualiza idfacturacion y estado generado de flujopagoenvuelo
			select @idsolicitud = @@IDENTITY
			UPDATE sip.solicitudaprobacion SET idfacturacion=@idsolicitud where id=@idsolicitud
			UPDATE sip.flujopagoenvuelo SET estadopago='GENERADO' WHERE id=@iddetallecompromiso
	    
	    END --si tiene contrato
	    
		FETCH NEXT FROM compromisos INTO 
		@id, @periodo, @iddetallecompromiso, @idprefactura, @idcui, @sap, @tarea, @idproveedor, @idservicio, @glosa, 
		@idcontrato, @montoneto, @montoimpuesto, @montoapagar, @valorconversion, @montoapagarpesos, @coniva, @factorimpuesto
	END
	CLOSE compromisos
	DEALLOCATE compromisos   

	
END
GO

