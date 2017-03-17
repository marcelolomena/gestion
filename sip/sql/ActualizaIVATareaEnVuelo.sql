CREATE procedure [sip].[ActualizaIVATareaEnVuelo]
as
BEGIN
DECLARE @iva AS FLOAT;
DECLARE @idproveedor AS INT;
DECLARE @sap AS INT;
DECLARE @tarea AS VARCHAR(32);
DECLARE @idproyecto AS INT;

DECLARE contratos CURSOR FOR 
	SELECT b.impuesto, a.idproveedor, b.sap, b.tarea
	FROM sip.contrato a JOIN sip.detalleserviciocto b ON a.id=b.idcontrato
	WHERE concat(convert(VARCHAR(4),a.idproveedor), concat(convert(VARCHAR(4),b.sap), b.tarea)) IN 
	(SELECT concat(convert(VARCHAR(4),d.idproveedor), concat(convert(VARCHAR(4),c.sap), d.tarea)) 
	FROM sip.presupuestoenvuelo c join sip.tareaenvuelo d ON c.id=d.idpresupuestoenvuelo)     
OPEN contratos
FETCH NEXT FROM contratos INTO @iva, @idproveedor, @sap, @tarea
WHILE @@fetch_status = 0   
BEGIN
	
	SELECT @idproyecto = a.id
	FROM sip.presupuestoenvuelo a JOIN sip.tareaenvuelo b ON a.id=b.idpresupuestoenvuelo
	WHERE b.idproveedor=@idproveedor AND a.sap=@sap AND b.tarea=@tarea
	
	--Actualiza dato de iva en tareaenvuelo
	UPDATE sip.tareaenvuelo SET coniva = IIF(@iva > 0, 1, 0)
	WHERE idpresupuestoenvuelo=@idproyecto AND tarea=@tarea AND idproveedor=@idproveedor

    FETCH NEXT FROM contratos INTO @iva, @idproveedor, @sap, @tarea
END
CLOSE contratos
DEALLOCATE contratos   

END
GO