/*
   miércoles, 25 de mayo de 201610:16:38
   User: biometria
   Server: 200.14.166.182
   Database: art_live
   Application: 
*/

/* To prevent any potential data loss issues, you should review this script in detail before running it outside the context of the database designer.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.art_division_master ADD
	idRRHH int NULL
GO
ALTER TABLE dbo.art_division_master SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
