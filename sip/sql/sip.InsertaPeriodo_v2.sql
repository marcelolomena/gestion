


ALTER procedure sip.InsertaPeriodo(@iddetalleprebase int, @ejercicio INT, @idcui int, @idpresupuesto int, @idservicio int, @glosaservicio varchar(255), @idproveedor int,@idmoneda int, 
@montoforecast float, @montoanual float, @cuota float, @numerocuota int, @desde int, @masiva int, @mesesentrecuotas int, @gastodiferido int)
as
BEGIN
	DECLARE @ejerciciobase AS int
	SELECT @ejerciciobase=c.ejercicio
	FROM sip.presupuesto a JOIN sip.detallepre b ON a.id=b.idpresupuesto JOIN sip.ejercicios c ON a.idejercicio=c.id
	WHERE b.id=@iddetalleprebase 

	DECLARE @ejercicioin AS int
	SELECT @ejercicioin=ejercicio
	FROM sip.ejercicios
	WHERE id=@ejercicio	
		
    DECLARE @iddetallepre AS int
    insert into sip.detallepre (idpresupuesto, idservicio, glosaservicio, idproveedor, idmoneda, montoforecast, montoanual, borrado, cuota, numerocuota, desde, masiva, mesesentrecuotas, gastodiferido)
    values (@idpresupuesto, @idservicio, @glosaservicio, @idproveedor, @idmoneda, @montoforecast, @montoanual, 1 , @cuota, @numerocuota, @desde, @masiva, @mesesentrecuotas, @gastodiferido);
    select @iddetallepre = @@IDENTITY
    
    DECLARE @Description AS nvarchar(400) 
    DECLARE @periodo AS int
    DECLARE @presupuestopesos AS FLOAT
    DECLARE @presupuestobasepesos AS FLOAT
    DECLARE @cajabase AS FLOAT
    DECLARE @costobase AS FLOAT
    DECLARE @totalcajabase AS FLOAT
    DECLARE @totalcostobase AS FLOAT
    DECLARE @cajacontrato AS FLOAT
    DECLARE @costocontrato AS FLOAT
    DECLARE @presupuestobasecaja AS FLOAT
    DECLARE @presupuestobasecosto AS FLOAT
    DECLARE @presupuestoorigen AS FLOAT
    declare @pptoorigen as float
    declare @pptopesos as float
    declare @cajafinal as float
    declare @montoorigencto as float
    declare @valorconversion as float
    declare @disponible as float
    declare @impuesto as float
    	        
    IF (@ejercicioin=@ejerciciobase)
    BEGIN
        /*Crea a partir de versión anterior de presupuesto, pero dentro del mismo ejercicio */
	    DECLARE periodosbase CURSOR FOR 
            SELECT a.periodo, a.presupuestoorigen, a.presupuestopesos, a.caja, a.costo, a.totalcaja, a.totalcosto, d.valorconversion, b.masiva
            FROM sip.detalleplan a
            JOIN sip.detallepre b ON a.iddetallepre=b.id
            JOIN sip.monedasconversion d ON d.idmoneda=b.idmoneda  AND d.periodo=a.periodo  	    
            where iddetallepre=@iddetalleprebase        
	    OPEN periodosbase
	    FETCH NEXT FROM periodosbase INTO @periodo, @presupuestoorigen, @presupuestopesos, @cajabase, @costobase, @totalcajabase, @totalcostobase, @valorconversion, @impuesto
	    WHILE @@fetch_status = 0   
	    BEGIN
            /* Busca montos contrato */
            SELECT @montoorigencto=sum(a.montoorigen), @cajacontrato=sum(isnull(montoorigen*d.valorconversion,0)), @costocontrato=sum(isnull(costoorigen*d.valorconversion,0))
            FROM sip.detallecompromiso a
             JOIN sip.detalleserviciocto b ON a.iddetalleserviciocto=b.id
             JOIN sip.contrato c ON b.idcontrato=c.id
             JOIN sip.monedasconversion d ON d.idmoneda=b.idmoneda  AND d.periodo=a.periodo             
            WHERE b.idservicio=@idservicio AND idcui=@idcui AND c.idproveedor=@idproveedor AND a.periodo=@periodo and b.glosaservicio=@glosaservicio
            /* Crea detalle de periodo presupuestoorigen, presupuestobasecaja, presupuestobasecosto */
            --select @disponible=(isnull(@presupuestoorigen,0)-@montoorigencto)*@valorconversion*1.19
            select @disponible=(isnull(@presupuestoorigen,0)*(1+(0.19*isnull(@impuesto,0)))-isnull(@montoorigencto,0))*isnull(@valorconversion,0)
            if (isnull(@disponible,0) < 0)
            begin              
                select @cajafinal=@cajacontrato
            end            
            else 
            begin
                select @cajafinal=isnull(@cajacontrato,0)+isnull(@disponible,0)
            END
	        insert into sip.detalleplan (iddetallepre, periodo, presupuestoorigen, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto, presupuestobasecaja, presupuestobasecosto, disponible)
	        values (@iddetallepre, @periodo, @presupuestoorigen, @presupuestopesos, 1, @cajabase, @costobase, @cajacontrato, @costocontrato, @cajabase,@costobase, @totalcajabase,@totalcostobase, @disponible);        
	        FETCH NEXT FROM periodosbase INTO @periodo, @presupuestoorigen, @presupuestopesos, @cajabase, @costobase, @totalcajabase, @totalcostobase,  @valorconversion, @impuesto
	    END
	    CLOSE periodosbase
	    DEALLOCATE periodosbase    
	END
	ELSE
	BEGIN
        /*Crea a partir de versión anterior de presupuesto, pero de ejercicio anterior*/
        /*Primero crea periodos forecast*/
	    DECLARE @periodoini INT
	    DECLARE @periodo2 AS int
	    SELECT @periodoini=convert(INT,concat(convert(VARCHAR(4), @ejerciciobase),'08'))
	    DECLARE periodosbase CURSOR FOR 
            SELECT a.periodo, a.presupuestoorigen, a.presupuestopesos, a.caja, a.costo, a.totalcaja, a.totalcosto, d.valorconversion, b.masiva
            FROM sip.detalleplan a
            JOIN sip.detallepre b ON a.iddetallepre=b.id
            JOIN sip.monedasconversion d ON d.idmoneda=b.idmoneda  AND d.periodo=a.periodo 
            where iddetallepre=@iddetalleprebase AND a.periodo > @periodoini        
	    OPEN periodosbase
	    FETCH NEXT FROM periodosbase INTO @periodo, @presupuestoorigen, @presupuestopesos, @cajabase, @costobase, @totalcajabase, @totalcostobase, @valorconversion, @impuesto
	    WHILE @@fetch_status = 0   
	    BEGIN
            /* Busca montos contrato */
            SELECT @impuesto=sum(b.impuesto), @montoorigencto=sum(a.montoorigen), @cajacontrato=sum(isnull(montoorigen*d.valorconversion,0)), @costocontrato=sum(isnull(costoorigen*d.valorconversion,0))
            FROM sip.detallecompromiso a
             JOIN sip.detalleserviciocto b ON a.iddetalleserviciocto=b.id
             JOIN sip.contrato c ON b.idcontrato=c.id
             JOIN sip.monedasconversion d ON d.idmoneda=b.idmoneda  AND d.periodo=a.periodo
            WHERE b.idservicio=@idservicio AND idcui=@idcui AND c.idproveedor=@idproveedor AND a.periodo=@periodo and b.glosaservicio=@glosaservicio
            /* Crea detalle de periodo */
            --select @disponible=(isnull(@presupuestoorigen,0)*1.19-@montoorigencto)*@valorconversion*1.19
            select @disponible=(isnull(@presupuestoorigen,0)*(1+(0.19*isnull(@impuesto,0)))-isnull(@montoorigencto,0))*isnull(@valorconversion,0)
            if (isnull(@disponible,0) < 0)
            begin              
                select @cajafinal=@cajacontrato
            end            
            else 
            begin
                select @cajafinal=isnull(@cajacontrato,0)+isnull(@disponible,0)
            END
	    	SELECT @periodo2=convert(INT ,concat(convert(VARCHAR(4),@ejerciciobase),substring(convert(VARCHAR(6),@periodo),5,2)))
	        insert into sip.detalleplan (iddetallepre, periodo, presupuestoorigen, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto, presupuestobasecaja, presupuestobasecosto, disponible)
	        values (@iddetallepre, @periodo2, @presupuestoorigen, @presupuestopesos, 1, @cajabase, isnull(@costobase,0), @cajacontrato, @costocontrato, @cajabase, isnull(@costobase,0),@totalcajabase, @totalcostobase, @disponible);        
            FETCH NEXT FROM periodosbase INTO @periodo, @presupuestoorigen, @presupuestopesos, @cajabase, @costobase, @totalcajabase, @totalcostobase, @valorconversion, @impuesto
	    END
	    CLOSE periodosbase
	    DEALLOCATE periodosbase  
	    /*Crea periodos del nuevo ejercicio */
	    DECLARE @count INT 
	    DECLARE @periodo3 INT 	
	    SELECT @count=1
	    WHILE @count<13
	    BEGIN
	        IF (@count<10)
	        BEGIN
	    		SELECT @periodo3=convert(INT,concat(convert(VARCHAR(4), @ejercicioin),concat('0',convert(VARCHAR(1),@count))))
	    	END 
	        ELSE
	        BEGIN  
	        	SELECT @periodo3=concat(convert(VARCHAR(4), @ejercicioin),convert(VARCHAR(2),@count))
	        END 
            /* Busca montos contrato */
            SELECT @cajacontrato=sum(isnull(montoorigen*d.valorconversion,0)), @costocontrato=sum(isnull(costoorigen*d.valorconversion,0))
            FROM sip.detallecompromiso a
             JOIN sip.detalleserviciocto b ON a.iddetalleserviciocto=b.id
             JOIN sip.contrato c ON b.idcontrato=c.id
             JOIN sip.monedasconversion d ON d.idmoneda=b.idmoneda  AND d.periodo=a.periodo
            WHERE b.idservicio=@idservicio AND idcui=@idcui AND c.idproveedor=@idproveedor AND a.periodo=@periodo3 and b.glosaservicio=@glosaservicio
            /* Crea detalle de periodo */        
	        insert into sip.detalleplan (iddetallepre, periodo, presupuestopesos, borrado, caja, costo, cajacomprometido, costocomprometido, totalcaja, totalcosto, disponible)
	        values (@iddetallepre, @periodo3, 0, 1 , 0, 0, isnull(@cajacontrato,0), isnull(@costocontrato,0), isnull(@cajacontrato,0), isnull(@costocontrato,0), 0-isnull(@cajacontrato,0));
	        
	        SELECT @count=@count + 1;  
	    END   
  	    
	END
	
	--EXECUTE sip.actualizadetallepre @iddetallepre
	
end
GO

