ALTER procedure [sip].[generaprefacturasproy](@periodo INT)
as
BEGIN

	DECLARE @idcontrato int;
	DECLARE @idcui int;
	DECLARE @idmoneda int;
	DECLARE @impuesto float;
    DECLARE @idproveedor int;
    DECLARE @idsolicitud int;
    DECLARE @sap int;
    DECLARE @tarea varchar(32);
    DECLARE @idcuenta int;
    DECLARE @idcontratoreal int;
    DECLARE @idcuisponsor int;

	DECLARE @idprefacturaingresada int

	--DECLARE @idcui int
	--SET @idcui = 60
	--DECLARE @periodo int
	--SET @periodo = 201610

	-- EXEC sip.generaprefacturas 201610


	DECLARE CursorSolicitudes CURSOR FOR 
        SELECT a.id, a.sap, a.tarea, a.idcontrato, c.idcui, c.idmoneda, c.coniva, c.idproveedor   
        FROM sip.solicitudaprobacion a
        join sip.flujopagoenvuelo b on  a.iddetallecompromiso=b.id
        join sip.tareaenvuelo c on b.idtareaenvuelo=c.id
        JOIN sip.presupuestoenvuelo d ON d.id=a.idcontrato
        where a.periodo=@periodo and a.idprefactura is null and a.aprobado=1 AND a.iddetallecompromiso IS NOT NULL
		--group by a.idcontrato, a.idcui, c.idmoneda, c.coniva, c.idproveedor
		OPEN CursorSolicitudes
			FETCH NEXT FROM CursorSolicitudes INTO @idsolicitud, @sap, @tarea, @idcontrato, @idcui, @idmoneda, @impuesto, @idproveedor
			WHILE @@fetch_status = 0
			BEGIN
				--select @sap=a.sap, @tarea=b.tarea from sip.presupuestoenvuelo a join sip.tareaenvuelo b on b.idpresupuestoenvuelo=a.id
                --where a.id=@idcontrato

                SELECT @idcontratoreal=a.id
                FROM sip.contrato a JOIN sip.detalleserviciocto b ON a.id=b.idcontrato 
                WHERE a.idproveedor=@idproveedor AND b.sap=@sap AND b.tarea=@tarea;
                                
				INSERT INTO sip.prefactura (periodo,idproveedor,idcui,idcontrato,factura,idmoneda,fecha,estado,borrado,sap,tarea)
                values (@periodo, @idproveedor, @idcui, @idcontratoreal, NULL, @idmoneda, CURRENT_TIMESTAMP, 'CREADA', 1, @sap, @tarea);

				SELECT @idprefacturaingresada = scope_identity() FROM sip.prefactura
				--print @idprefacturaingresada
                
                UPDATE sip.solicitudaprobacion set idprefactura=@idprefacturaingresada where id=@idsolicitud
				--UPDATE a set a.idprefactura=@idprefacturaingresada from sip.solicitudaprobacion a join sip.flujopagoenvuelo b on  a.iddetallecompromiso=b.id
				--join sip.tareaenvuelo c on b.idtareaenvuelo=c.id
				--where a.[idcui]=@idcui and a.[periodo]=@periodo and a.idprefactura is null and c.idproveedor=@idproveedor and a.aprobado=1 and c.idmoneda=@idmoneda

				UPDATE sip.prefactura set 
				[subtotalsinmulta] = 
				(	select sum(montoaprobadopesos)
					from sip.solicitudaprobacion
					where idprefactura=@idprefacturaingresada ),
				[subtotal] = 
				(	select sum(montoaprobadopesos) + sum(montoabonopesos) -sum(montomultapesos) 
					from sip.solicitudaprobacion
					where idprefactura=@idprefacturaingresada ),
				[totalmulta] = 
				(	select sum(montomultapesos) 
					from sip.solicitudaprobacion
					where idprefactura=@idprefacturaingresada ),
				[totalabono] = 
				(	select sum(montoabonopesos) 
					from sip.solicitudaprobacion
					where idprefactura=@idprefacturaingresada ),
				[impuesto] = IIF(@impuesto!=0,0.19,0)
				where id=@idprefacturaingresada

				--print @idprefacturaingresada

				UPDATE sip.prefactura set 
				[totalimpuesto] = [subtotal]*[impuesto]
				where id=@idprefacturaingresada
				
				--print @idprefacturaingresada

				UPDATE sip.prefactura set 
				[totalprefactura] = [subtotal]+[totalimpuesto]
				where id=@idprefacturaingresada

				--print @idprefacturaingresada
                
                --Busca cuenta contable
                SELECT @idcuenta=c.idcuenta FROM sip.presupuestoenvuelo a 
                JOIN sip.tareaenvuelo b ON a.id=b.idpresupuestoenvuelo
                JOIN sip.servicio c on c.id=b.idservicio AND c.tarea=substring(b.tarea, 1, 3)
                WHERE a.id=@idcontrato AND b.tarea=@tarea               
                
                --SELECT @idcuisponsor=id FROM sip.estructuracui WHERE cui='6944'
                SELECT @idcuisponsor=id FROM sip.estructuracui WHERE cui IN (
                 SELECT cuifinanciamiento1 FROM sip.presupuestoenvuelo WHERE id=@idcontrato);
                
                PRINT @idcuisponsor;
                PRINT @idcuenta;
                PRINT @idsolicitud;
                
				INSERT INTO sip.desglosecontable 
				(	[idsolicitud]
					,[idcui]
					,[idcuentacontable]
					,[porcentaje]
					,[borrado] )
					VALUES (@idsolicitud, @idcuisponsor, @idcuenta, 100,1)
					--VALUES (44738, 2055, 37, 100,1)
                --select a.id, @idcuisponsor, @idcuenta, 100,1
                --from sip.solicitudaprobacion a 
                --join sip.presupuestoenvuelo b ON a.idcontrato=b.id
                --where a.id=@idsolicitud;

			FETCH NEXT FROM CursorSolicitudes INTO @idsolicitud, @sap, @tarea, @idcontrato, @idcui, @idmoneda, @impuesto, @idproveedor
			END
		CLOSE CursorSolicitudes
		DEALLOCATE CursorSolicitudes


END
GO

