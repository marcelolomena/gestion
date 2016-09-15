IF OBJECT_ID ('sip.ActCostoDetallePresup') IS NOT NULL
    DROP PROCEDURE sip.ActCostoDetallePresup
GO
CREATE PROCEDURE [sip].[ActCostoDetallePresup] (@iddetalleplan int, @costo float)
AS  
    --actualiza costo
    update sip.detalleplan set costo=@costo, totalcosto=@costo
    where id=@iddetalleplan
    --Actualiza totales
    declare @iddetallepre int
    select @iddetallepre=iddetallepre from sip.detalleplan where id=@iddetalleplan
    EXECUTE sip.actualizadetallepre @iddetallepre 

GO

IF OBJECT_ID('sip.ActCostoDetallePresup') IS NOT NULL
     PRINT '<<< CREATED PROC sip.ActCostoDetallePresup >>>'
ELSE
     PRINT '<<< FAILED CREATING PROC sip.ActCostoDetallePresup >>>'
GO