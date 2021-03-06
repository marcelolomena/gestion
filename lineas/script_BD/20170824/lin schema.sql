USE [controldelimites]
GO
/****** Object:  Table [lin].[art_user]    Script Date: 24-08-2017 19:01:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[art_user](
	[uid] [int] IDENTITY(356,1) NOT NULL,
	[uname] [nvarchar](50) NOT NULL,
	[password] [nvarchar](200) NOT NULL,
	[profile_image] [nvarchar](200) NULL,
	[first_name] [nvarchar](50) NOT NULL,
	[last_name] [nvarchar](50) NOT NULL,
	[division] [int] NULL,
	[gerencia] [int] NULL,
	[department] [int] NULL,
	[email] [nvarchar](100) NOT NULL,
	[birth_date] [date] NOT NULL,
	[office_number] [nvarchar](max) NOT NULL,
	[joining_date] [date] NOT NULL,
	[isadmin] [int] NOT NULL,
	[isverify] [int] NOT NULL,
	[verify_code] [nvarchar](100) NOT NULL,
	[verify_date] [datetime2](0) NOT NULL,
	[status] [int] NOT NULL,
	[added_date] [datetime2](0) NOT NULL,
	[rut_number] [nvarchar](max) NOT NULL,
	[rate_hour] [int] NOT NULL,
	[contact_number] [nvarchar](15) NOT NULL,
	[user_type] [int] NOT NULL,
	[work_hours] [decimal](10, 2) NOT NULL,
	[bonus_app] [int] NOT NULL,
	[designation] [int] NULL,
	[user_profile] [text] NULL,
 CONSTRAINT [PK_art_user_uid] PRIMARY KEY CLUSTERED 
(
	[uid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [lin].[contenido]    Script Date: 24-08-2017 19:01:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[contenido](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[plantilla] [varchar](128) NULL,
	[borrado] [int] NULL,
 CONSTRAINT [pk.contenido] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[menu]    Script Date: 24-08-2017 19:01:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[menu](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](255) NULL,
	[url] [varchar](255) NULL,
	[pid] [int] NULL,
	[nivel] [tinyint] NULL,
	[borrado] [tinyint] NULL,
	[idsistema] [int] NULL,
	[secuencia] [int] NULL,
 CONSTRAINT [pk_menu] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[pagina]    Script Date: 24-08-2017 19:01:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[pagina](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[idcontenido] [int] NOT NULL,
	[title] [varchar](256) NULL,
	[idsistema] [int] NOT NULL,
	[script] [text] NULL,
	[borrado] [int] NULL,
 CONSTRAINT [pk.pagina] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [lin].[rol]    Script Date: 24-08-2017 19:01:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[rol](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[glosarol] [varchar](60) NULL,
	[borrado] [tinyint] NULL,
 CONSTRAINT [pk_rol] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[rol_func]    Script Date: 24-08-2017 19:01:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[rol_func](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[rid] [int] NULL,
	[fid] [int] NULL,
	[mid] [int] NULL,
	[borrado] [tinyint] NULL,
 CONSTRAINT [pk_rol_func] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[sistema]    Script Date: 24-08-2017 19:01:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[sistema](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sistema] [varchar](3) NULL,
	[glosasistema] [varchar](255) NULL,
	[borrado] [tinyint] NULL,
	[pagina] [varchar](32) NULL,
 CONSTRAINT [pk_sistema] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[usr_rol]    Script Date: 24-08-2017 19:01:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[usr_rol](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[uid] [int] NULL,
	[rid] [int] NULL,
	[borrado] [tinyint] NULL,
	[idsistema] [int] NULL,
 CONSTRAINT [pk_usr_rol] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [profile_image]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [division]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [gerencia]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [department]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT ((1)) FOR [status]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [designation]
GO
ALTER TABLE [lin].[menu]  WITH CHECK ADD  CONSTRAINT [fk_menu_reference_sistema] FOREIGN KEY([idsistema])
REFERENCES [lin].[sistema] ([id])
GO
ALTER TABLE [lin].[menu] CHECK CONSTRAINT [fk_menu_reference_sistema]
GO
ALTER TABLE [lin].[pagina]  WITH CHECK ADD  CONSTRAINT [FK_pagina_contenido] FOREIGN KEY([idcontenido])
REFERENCES [lin].[contenido] ([id])
GO
ALTER TABLE [lin].[pagina] CHECK CONSTRAINT [FK_pagina_contenido]
GO
ALTER TABLE [lin].[pagina]  WITH CHECK ADD  CONSTRAINT [FK_pagina_sistema] FOREIGN KEY([idsistema])
REFERENCES [lin].[sistema] ([id])
GO
ALTER TABLE [lin].[pagina] CHECK CONSTRAINT [FK_pagina_sistema]
GO
ALTER TABLE [lin].[rol_func]  WITH CHECK ADD  CONSTRAINT [fk_rol_func_reference_menu] FOREIGN KEY([mid])
REFERENCES [lin].[menu] ([id])
GO
ALTER TABLE [lin].[rol_func] CHECK CONSTRAINT [fk_rol_func_reference_menu]
GO
ALTER TABLE [lin].[rol_func]  WITH CHECK ADD  CONSTRAINT [fk_rol_func_reference_rol] FOREIGN KEY([rid])
REFERENCES [lin].[rol] ([id])
GO
ALTER TABLE [lin].[rol_func] CHECK CONSTRAINT [fk_rol_func_reference_rol]
GO
ALTER TABLE [lin].[usr_rol]  WITH CHECK ADD  CONSTRAINT [fk_usr_rol_reference_art_user] FOREIGN KEY([uid])
REFERENCES [lin].[art_user] ([uid])
GO
ALTER TABLE [lin].[usr_rol] CHECK CONSTRAINT [fk_usr_rol_reference_art_user]
GO
ALTER TABLE [lin].[usr_rol]  WITH CHECK ADD  CONSTRAINT [fk_usr_rol_reference_rol] FOREIGN KEY([rid])
REFERENCES [lin].[rol] ([id])
GO
ALTER TABLE [lin].[usr_rol] CHECK CONSTRAINT [fk_usr_rol_reference_rol]
GO
ALTER TABLE [lin].[usr_rol]  WITH CHECK ADD  CONSTRAINT [fk_usr_rol_reference_sistema] FOREIGN KEY([idsistema])
REFERENCES [lin].[sistema] ([id])
GO
ALTER TABLE [lin].[usr_rol] CHECK CONSTRAINT [fk_usr_rol_reference_sistema]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_SSMA_SOURCE', @value=N'art_bdc_dev.art_user' , @level0type=N'SCHEMA',@level0name=N'lin', @level1type=N'TABLE',@level1name=N'art_user'
GO
