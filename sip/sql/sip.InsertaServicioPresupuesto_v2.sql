ALTER procedure sip.InsertaServiciosPresupuesto(@ejercicio INT, @idcui int, @idpresupuesto int)
as
BEGIN

	DECLARE @ejercicioin AS int
	SELECT @ejercicioin=ejercicio
	FROM sip.ejercicios
	WHERE id=@ejercicio	

    DECLARE @idproveedor AS INT
    DECLARE @idservicio AS INT
    DECLARE @idmoneda AS INT
    DECLARE @periodo AS INT
    DECLARE @montopesos AS FLOAT
    DECLARE @costopesos AS FLOAT
    DECLARE @currentsrv AS INT
    DECLARE @iddetallepre AS int
    declare @factorconv as float
    declare @cuota as float
    declare @coniva as float
    declare @micaja as float
    declare @micosto as float
    declare @costocto as float
    
    select @currentsrv = 0
    declare @glosaserv as varchar(255)
    declare @currentglosaserv as varchar(255)
    select @currentglosaserv = ''
    
    DECLARE @periodoini INT
    DECLARE @periodofin INT
    SELECT @periodoini=convert(INT,concat(convert(VARCHAR(4), @ejercicioin-1),'09'))
    SELECT @periodofin=convert(INT,concat(convert(VARCHAR(4), @ejercicioin-1),'12'))
    /*Obtiene compromisos ejercicio anterior*/    
    DECLARE periodosanteriores CURSOR FOR SELECT b.idproveedor, a.idservicio, a.glosaservicio, a.idmoneda, c.periodo, c.montoorigen AS montopesos, c.costoorigen as costocto,
    d.valorconversion, a.valorcuota, a.impuesto
    FROM sip.detalleserviciocto a
    JOIN sip.contrato b ON a.idcontrato=b.id
    JOIN sip.detallecompromiso c ON c.iddetalleserviciocto=a.id
    JOIN sip.monedasconversion d ON d.idmoneda=a.idmoneda  AND d.periodo=c.periodo
    WHERE a.idcui=@idcui AND c.periodo >= @periodoini AND c.periodo <= @periodofin
    ORDER BY a.idservicio
    OPEN periodosanteriores
    FETCH NEXT FROM periodosanteriores INTO @idproveedor, @idservicio, @glosaserv, @idmoneda, @periodo, @montopesos, @costocto,@factorconv, @cuota, @coniva
    WHILE @@fetch_status = 0   
    BEGIN    
        if (@coniva > 0)
        begin
            select @coniva=1
        end
        if (@currentsrv != @idservicio or @currentglosaserv != @glosaserv)
        begin
        /*Crea servicio de presupuesto*/
            insert into sip.detallepre (idpresupuesto, idservicio, idproveedor, idmoneda, montoforecast, montoanual, borrado, glosaservicio, cuota, masiva)
            values (@idpresupuesto, @idservicio, @idproveedor, @idmoneda, 0, 0, 1, @glosaserv, @cuota, @coniva);
            select @iddetallepre = @@IDENTITY    
            select @currentsrv = @idservicio  
            select @currentglosaserv = @glosaserv
        end
        /*Crea periodos de servicio presupuesto*/
        if (@coniva = 1)
        begin
            select @micaja = @montopesos * @factorconv
            select @micosto = @costocto * @factorconv 
        end 
        else 
        begin
            select @micaja = @montopesos * @factorconv
            select @micosto = @costocto * @factorconv 
        end
        insert into sip.detalleplan (iddetallepre, periodo, presupuestoorigen, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto)
        values (@iddetallepre, @periodo, @montopesos, @montopesos*@factorconv, 1, @micaja, @micosto, @micaja, @micosto, @micaja, @micosto);        
	    FETCH NEXT FROM periodosanteriores INTO @idproveedor, @idservicio, @glosaserv, @idmoneda, @periodo, @montopesos, @costocto, @factorconv, @cuota, @coniva
    END
    CLOSE periodosanteriores
    DEALLOCATE periodosanteriores      
    
    /*Obtiene compromisos nuevo ejercicio*/   
    SELECT @periodoini=convert(INT,concat(convert(VARCHAR(4), @ejercicioin),'01'))
    SELECT @periodofin=convert(INT,concat(convert(VARCHAR(4), @ejercicioin),'12'))
    select @currentsrv = 0
    select @iddetallepre = 0
    declare @srvcreado as int
    select @srvcreado = 0
    select @currentglosaserv = ''

    DECLARE periodosnuevos CURSOR FOR SELECT b.idproveedor, a.idservicio, a.glosaservicio, a.idmoneda, c.periodo, c.montoorigen AS montopesos, c.costoorigen as costocto,
    d.valorconversion, a.valorcuota, a.impuesto
    FROM sip.detalleserviciocto a
    JOIN sip.contrato b ON a.idcontrato=b.id
    JOIN sip.detallecompromiso c ON c.iddetalleserviciocto=a.id
    JOIN sip.monedasconversion d ON d.idmoneda=a.idmoneda  AND d.periodo=c.periodo
    WHERE a.idcui=@idcui AND c.periodo >= @periodoini AND c.periodo <= @periodofin
    ORDER BY a.idservicio
    OPEN periodosnuevos
    FETCH NEXT FROM periodosnuevos INTO @idproveedor, @idservicio, @glosaserv, @idmoneda, @periodo, @montopesos, @costocto, @factorconv, @cuota, @coniva
    WHILE @@fetch_status = 0   
    BEGIN
        if (@coniva > 0)
        begin
            select @coniva=1
        end    
        select @srvcreado=0;
        if (@currentsrv != @idservicio or @currentglosaserv != @glosaserv)
        begin
            /* consulta si ya creo servicio, sino lo crea */
            select @srvcreado=id from sip.detallepre where idpresupuesto=@idpresupuesto and idservicio=@idservicio
            and idproveedor=@idproveedor and idmoneda=@idmoneda and glosaservicio=@glosaserv
            if (@srvcreado > 0) 
            begin 
                select @iddetallepre = @srvcreado        
                select @currentsrv = @idservicio 
                select @currentglosaserv = @glosaserv
                --EXECUTE sip.actualizadetallepre @iddetallepre                
            end
            else 
            begin
                insert into sip.detallepre (idpresupuesto, idservicio, idproveedor, idmoneda, montoforecast, montoanual, borrado, glosaservicio, cuota, masiva)
                values (@idpresupuesto, @idservicio, @idproveedor, @idmoneda, 0, 0, 1, @glosaserv, @cuota, @coniva);
                select @iddetallepre = @@IDENTITY    
                select @currentsrv = @idservicio  
                select @currentglosaserv = @glosaserv
                --EXECUTE sip.actualizadetallepre @iddetallepre                
            end
        end
        /*Crea periodos de servicio presupuesto*/
        if (@coniva = 1)
        begin
            select @micaja = @montopesos * @factorconv
            select @micosto = @costocto * @factorconv 
        end 
        else 
        begin
            select @micaja = @montopesos * @factorconv
            select @micosto = @costocto * @factorconv 
        end        
        insert into sip.detalleplan (iddetallepre, periodo, presupuestoorigen, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto)
        values (@iddetallepre, @periodo, @montopesos, @montopesos*@factorconv, 1, @micaja, @micosto, @micaja, @micosto, @micaja, @micosto);       
	    FETCH NEXT FROM periodosnuevos INTO @idproveedor, @idservicio, @glosaserv, @idmoneda, @periodo, @montopesos, @costocto, @factorconv, @cuota, @coniva
    END
    CLOSE periodosnuevos
    DEALLOCATE periodosnuevos      
    
    /*Corrige periodos faltantes */
    declare @numpercreado as int  
    select @numpercreado = 0    
    declare @percreado as int
    select @percreado = 0        
    DECLARE servicioscreados CURSOR FOR select id from sip.detallepre where idpresupuesto=@idpresupuesto
    OPEN servicioscreados
    FETCH NEXT FROM servicioscreados INTO @iddetallepre
    WHILE @@fetch_status = 0   
    BEGIN    
        /*cuenta cuantos periodos tiene cada servicio, si hay menos de 16 corrige */
        select @numpercreado=count(*) from sip.detalleplan where iddetallepre=@iddetallepre

        if (@numpercreado <16) 
        begin
            /* Revisa los 4 primeros */
            DECLARE @count INT 		
            SELECT @count=9

            WHILE @count<13   
            begin   
			    select @percreado = 0    
                IF (@count<10)
                BEGIN
                    SELECT @periodoini=convert(INT,concat(convert(VARCHAR(4), @ejercicioin-1),concat('0',convert(VARCHAR(1),@count))))
                END 
                ELSE
                BEGIN  
                    SELECT @periodoini=concat(convert(VARCHAR(4), @ejercicioin-1),convert(VARCHAR(2),@count))
                END                     
                select @percreado=id from sip.detalleplan where iddetallepre=@iddetallepre and periodo=@periodoini
                if (@percreado = 0)
                begin
                    insert into sip.detalleplan (iddetallepre, periodo, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto)
                    values (@iddetallepre, @periodoini, 0, 1 , 0, 0, 0, 0, 0, 0);                    
                end
                SELECT @count=@count+1
            end
                    
            SELECT @count=1
            WHILE @count<13   
            begin   
			    select @percreado = 0    
                IF (@count<10)
                BEGIN
                    SELECT @periodoini=convert(INT,concat(convert(VARCHAR(4), @ejercicioin),concat('0',convert(VARCHAR(1),@count))))
                END 
                ELSE
                BEGIN  
                    SELECT @periodoini=concat(convert(VARCHAR(4), @ejercicioin),convert(VARCHAR(2),@count))
                END                     
                select @percreado=id from sip.detalleplan where iddetallepre=@iddetallepre and periodo=@periodoini
                if (@percreado = 0)
                begin
                    insert into sip.detalleplan (iddetallepre, periodo, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto)
                    values (@iddetallepre, @periodoini, 0, 1 , 0, 0, 0, 0, 0, 0);                    
                end
                SELECT @count=@count+1
            end                    
          
        end
        FETCH NEXT FROM servicioscreados INTO @iddetallepre
    end
    CLOSE servicioscreados
    DEALLOCATE servicioscreados        
    EXECUTE sip.ActualizaTotalesPresupuesto @idpresupuesto                
end
GO    