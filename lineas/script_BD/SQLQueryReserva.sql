USE [controldelimites]
GO
/****** Object:  StoredProcedure [scl].[nuevareserva]    Script Date: 14/09/2017 10:38:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [scl].[nuevareserva](@Id INT,@Producto1 VARCHAR(255), @Monto1 VARCHAR(255), @Moneda1 VARCHAR(255), @Plazo1 VARCHAR(255), @FechaReserva1 VARCHAR(255), @FechaDesembolso1 VARCHAR(255),@FechaVencimiento1 VARCHAR(255), @RutEmpresa1 VARCHAR(255) )
as
BEGIN
	-- exec scl.nuevareserva 1,'hola'
	-- procedimiento es de select el sp se llama scl.se
	-- para insert el sp se llama scl.ins

	DECLARE @ultimoid INT

	INSERT INTO scl.Operacion(Producto, MontoInicial, Moneda, Plazo, FechaReserva, FechaDesembolso ,FechaVencimiento,RutEmpresa) 
	VALUES (@Producto1, @Monto1, @Moneda1, @Plazo1, @FechaReserva1, @FechaDesembolso1,@FechaVencimiento1,@RutEmpresa1);
	
	SELECT @ultimoid = scope_identity() FROM scl.Operacion
	
	INSERT INTO scl.LineaOperacion (Linea_Id,Operacion_Id) values (@Id,@ultimoid)
	--INSERT INTO scl.LineaOperacion (Linea_Id,Operacion_Id) values (1,2)

END
