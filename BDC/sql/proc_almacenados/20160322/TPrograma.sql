USE [art_live]
GO
/****** Object:  UserDefinedTableType [dbo].[TPrograma]    Script Date: 22-03-2016 17:34:46 ******/
DROP TYPE [dbo].[TPrograma]
GO
/****** Object:  UserDefinedTableType [dbo].[TPrograma]    Script Date: 22-03-2016 17:34:46 ******/
CREATE TYPE [dbo].[TPrograma] AS TABLE(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[division] [varchar](255) NULL,
	[work_flow_status] [int] NULL,
	[estado] [varchar](255) NULL,
	[programa] [varchar](255) NULL,
	[program_id] [int] NULL,
	[pId] [int] NULL,
	[tId] [int] NULL,
	[sub_task_id] [int] NULL,
	[responsable] [varchar](255) NULL,
	[fecini] [date] NULL,
	[feccom] [date] NULL,
	[plan_start_date] [date] NULL,
	[plan_end_date] [date] NULL,
	[completion_percentage] [float] NULL,
	[estimated_time] [float] NULL,
	[estimated_percentage] [float] NULL,
	[real_start_date] [date] NULL,
	[real_end_date] [date] NULL,
	[hplan] [float] NULL,
	[hreal] [float] NULL,
	[valor_ganado_esperado] [float] NULL,
	[valor_ganado] [float] NULL,
	[pai] [float] NULL,
	[pae] [float] NULL,
	[spi] [float] NULL,
	[cpi] [float] NULL,
	[inversion] [float] NULL,
	[gasto] [float] NULL
)
GO
