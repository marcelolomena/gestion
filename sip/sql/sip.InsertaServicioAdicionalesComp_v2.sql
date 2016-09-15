ALTER procedure sip.InsertaServiciosAdicionalesComp(@ejercicio INT, @idcui int, @idpresupuesto int, @totalsrv int)
as
BEGIN
    /* Revisa que se hayan creado todos los periodos y servicios del presupuesto base */
    declare @totalperiodos int
    declare @iter int
    declare @totalactual int
    select @iter=0
    select @totalperiodos = @totalsrv * 16
    SELECT @totalactual =0
    while (@iter  < 50 AND @totalactual < @totalperiodos)
    begin
        SELECT @totalactual=count(*) FROM sip.detalleplan WHERE iddetallepre IN (SELECT id FROM sip.detallepre WHERE idpresupuesto=@idpresupuesto)
        select @iter = @iter + 1
        WAITFOR DELAY '00:00:01'
    end

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
    declare @srvcreado as int
    select @currentsrv = 0
    declare @glosaserv as varchar(255)
    declare @currentglosaserv as varchar(255)
    select @currentglosaserv = ''
    declare @creaperiodos int
    
    
    DECLARE @periodoini INT
    DECLARE @periodofin INT
    SELECT @periodoini=convert(INT,concat(convert(VARCHAR(4), @ejercicioin-1),'09'))
    SELECT @periodofin=convert(INT,concat(convert(VARCHAR(4), @ejercicioin-1),'12'))
    /*Obtiene compromisos ejercicio anterior*/ 
    select @srvcreado = 0    
    DECLARE periodosanteriores CURSOR FOR SELECT b.idproveedor, a.idservicio, a.glosaservicio, a.idmoneda, c.periodo, c.montoorigen*d.valorconversion AS montopesos, c.costoorigen*d.valorconversion AS costopesos 
    FROM sip.detalleserviciocto a
    JOIN sip.contrato b ON a.idcontrato=b.id
    JOIN sip.detallecompromiso c ON c.iddetalleserviciocto=a.id
    JOIN sip.monedasconversion d ON d.idmoneda=a.idmoneda  AND d.periodo=c.periodo
    WHERE a.idcui=@idcui AND c.periodo >= @periodoini AND c.periodo <= @periodofin
    ORDER BY a.idservicio
    OPEN periodosanteriores
    FETCH NEXT FROM periodosanteriores INTO @idproveedor, @idservicio, @glosaserv, @idmoneda, @periodo, @montopesos, @costopesos
    WHILE @@fetch_status = 0   
    BEGIN    
        select @srvcreado = 0
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
                select @creaperiodos = 0
            end
            else 
            begin
                /*Crea servicio de presupuesto*/
                insert into sip.detallepre (idpresupuesto, idservicio, idproveedor, idmoneda, montoforecast, montoanual, borrado, glosaservicio)
                values (@idpresupuesto, @idservicio, @idproveedor, @idmoneda, 0, 0, 1, @glosaserv);
                select @iddetallepre = @@IDENTITY    
                select @currentsrv = @idservicio  
                select @currentglosaserv = @glosaserv
                select @creaperiodos = 1
            end
        end
        /*Crea periodos de servicio presupuesto*/
        if (@creaperiodos = 1) 
        begin
            insert into sip.detalleplan (iddetallepre, periodo, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto, disponible)
            values (@iddetallepre, @periodo, 0, 1, 0, 0, @montopesos, @costopesos, @montopesos, @costopesos, 0-@montopesos);        
        end
	    FETCH NEXT FROM periodosanteriores INTO @idproveedor, @idservicio, @glosaserv, @idmoneda, @periodo, @montopesos, @costopesos
    END
    CLOSE periodosanteriores
    DEALLOCATE periodosanteriores      
    
    /*Obtiene compromisos nuevo ejercicio*/   
    SELECT @periodoini=convert(INT,concat(convert(VARCHAR(4), @ejercicioin),'01'))
    SELECT @periodofin=convert(INT,concat(convert(VARCHAR(4), @ejercicioin),'12'))
    select @currentsrv = 0
    select @iddetallepre = 0
    select @srvcreado = 0
    select @currentglosaserv = ''

    DECLARE periodosnuevos CURSOR FOR SELECT b.idproveedor, a.idservicio, a.glosaservicio, a.idmoneda, c.periodo, c.montoorigen*d.valorconversion AS montopesos, c.costoorigen*d.valorconversion AS costopesos 
    FROM sip.detalleserviciocto a
    JOIN sip.contrato b ON a.idcontrato=b.id
    JOIN sip.detallecompromiso c ON c.iddetalleserviciocto=a.id
    JOIN sip.monedasconversion d ON d.idmoneda=a.idmoneda  AND d.periodo=c.periodo
    WHERE a.idcui=@idcui AND c.periodo >= @periodoini AND c.periodo <= @periodofin
    ORDER BY a.idservicio
    OPEN periodosnuevos
    FETCH NEXT FROM periodosnuevos INTO @idproveedor, @idservicio, @glosaserv, @idmoneda, @periodo, @montopesos, @costopesos
    WHILE @@fetch_status = 0   
    BEGIN
        select @srvcreado=0;
        select @creaperiodos=0;
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
                --select @creaperiodos = 0
                --EXECUTE sip.actualizadetallepre @iddetallepre                
            end
            else 
            begin
                insert into sip.detallepre (idpresupuesto, idservicio, idproveedor, idmoneda, montoforecast, montoanual, borrado, glosaservicio)
                values (@idpresupuesto, @idservicio, @idproveedor, @idmoneda, 0, 0, 1, @glosaserv);
                select @iddetallepre = @@IDENTITY    
                select @currentsrv = @idservicio   
                select @currentglosaserv = @glosaserv
                --select @creaperiodos = 1
                --EXECUTE sip.actualizadetallepre @iddetallepre                
            end
        end
        /*Crea periodos de servicio presupuesto*/
        select @creaperiodos=id from sip.detalleplan where iddetallepre=@iddetallepre and periodo=@periodo
        if (@creaperiodos=0)
        begin
            insert into sip.detalleplan (iddetallepre, periodo, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto, disponible)
            values (@iddetallepre, @periodo, 0, 1, 0, 0, @montopesos, @costopesos, @montopesos, @costopesos, 0-@montopesos);        
        end
	    FETCH NEXT FROM periodosnuevos INTO @idproveedor, @idservicio, @glosaserv, @idmoneda, @periodo, @montopesos, @costopesos
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

