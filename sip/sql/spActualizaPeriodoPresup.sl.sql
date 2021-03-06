USE [art_live]
GO
/****** Object:  StoredProcedure [sip].[spActualizaPeriodoPresup]    Script Date: 09/12/2016 15:53:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [sip].[spActualizaPeriodoPresup](@idperiodo int, @montomoneda float, @periodo int, @idx int)
as
begin
    DECLARE @conversion float
    declare @moneda int
    select @moneda=b.idmoneda from sip.detalleplan a join sip.detallepre b on a.iddetallepre=b.id
    where a.id=@idperiodo
    select @conversion = valorconversion from sip.monedasconversion where periodo=@periodo and idmoneda=@moneda
    declare @coniva int
    declare @iddetallepre int
    declare @mesesentre int
    declare @mescuota1 int
    declare @mesiniserv int
    declare @actualmoneda int
    declare @esdiferido int
    
    --Obtiene ejercicio
    declare @idservicio int
    declare @ejercicio int
    SELECT @idservicio=iddetallepre FROM sip.detalleplan WHERE id=@idperiodo 
    SELECT @ejercicio=c.ejercicio FROM sip.detallepre a JOIN sip.presupuesto b ON a.idpresupuesto=b.id join sip.ejercicios c on b.idejercicio=c.id
    WHERE a.id=@idservicio 
        
    
    -- Obtiene valores configurados en detallepre
    select @coniva=isnull(a.masiva,0), @iddetallepre=iddetallepre, @mesesentre=mesesentrecuotas,
    @mescuota1= desde, @mesiniserv=desdediferido, @esdiferido=gastodiferido
    from sip.detallepre a join sip.detalleplan b on a.id=b.iddetallepre where b.id=@idperiodo
    
    declare @costoactual float
    declare @actualpesos float
    declare @monedacosto float
    select @costoactual = costo, @actualpesos=caja, @actualmoneda=presupuestoorigen from sip.detalleplan where id=@idperiodo
    if (@actualmoneda>0)
    begin
        select @monedacosto=@montomoneda-@actualmoneda
    end
    else 
    begin
        select @monedacosto=@montomoneda
    end
    declare @valorpesos float
    declare @pesoscosto float
    declare @caja float
    declare @costo float
    declare @montoiva float
    declare @recuperacion float
    declare @total float
    select @valorpesos = @conversion*@montomoneda;
    select @pesoscosto = @conversion*@monedacosto;
    if (@coniva=1) 
    begin
        select @caja=@valorpesos*1.19
        select @montoiva=@pesoscosto*0.19
    end
    else
    begin
        select @caja=@valorpesos
        select @montoiva=0
    end
    --Graba monto moneda, pesos, caja y despues revisa el disponible. Costo se actualiza despues
    update sip.detalleplan set 
    presupuestoorigen=@montomoneda, presupuestopesos=@valorpesos, caja=@caja, totalcaja=@caja, disponible=@caja-isnull(cajacomprometido,0)
    where id=@idperiodo 
    
    --Comienza a calcular el diferimiento del costo desde inicio de servicio y actualiza sumando o restando al costo actual de cada periodo
    select @recuperacion=@montoiva*0.77
    select @total=@pesoscosto+@recuperacion
    
    declare @deltaini int
    declare @perini int
    declare @valorcosto int
    declare @periododif int
    select @deltaini=@mescuota1-@mesiniserv
    select @perini=@idx-@deltaini
    if (@esdiferido=1)
    begin
        select @valorcosto=@total/@mesesentre
        declare @k int
        select @k=@perini
        while (@k <= @perini+@mesesentre-1 AND @k < 17)
        begin
            if (@k > 0) 
            begin
                select @periododif = sip.obtieneperiodo(@ejercicio, @k)
                update sip.detalleplan
                set costo=isnull(costo,0)+@valorcosto, totalcosto=isnull(costo,0)+@valorcosto
                where iddetallepre=@idservicio and periodo=@periododif
                -- Elimina los valores negativos y valores menores a 2 generados por redondeo
                update sip.detalleplan
                set costo=0, totalcosto=0
                where iddetallepre=@idservicio and periodo=@periododif and costo<2          
            end
            select @k=@k+1
        end
    end
    else
    begin
        if (@perini > 0) 
        begin
            select @periododif = sip.obtieneperiodo(@ejercicio, @perini)
            update sip.detalleplan  
            set costo=isnull(costo,0)+@valorcosto, totalcosto=isnull(costo,0)+@valorcosto
            where iddetallepre=@idservicio and periodo=@periododif    
            -- Elimina los valores negativos y valores menores a 2 generados por redondeo
            update sip.detalleplan
            set costo=0, totalcosto=0
            where iddetallepre=@idservicio and periodo=@periododif and costo<2              
        end
    end
    
    
    EXECUTE sip.actualizadetallepre @iddetallepre                
            
end     
