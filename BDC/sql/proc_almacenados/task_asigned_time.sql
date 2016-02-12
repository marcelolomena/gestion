SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE art.task_asigned_time
@pid int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
SELECT 
            W.[tId] tId
                  ,[pId]
                  ,[task_title]
                  ,[task_code]
                  ,[plan_start_date]
                  ,[plan_end_date]
                  ,[task_description]
                  --,[plan_time]
            	  ,ISNULL(sum_estimated_time,0) plan_time
                  ,[creation_date]
                  ,[task_status]
                  ,[status]
                  ,[owner]
                  ,[task_discipline]
                  ,[completion_percentage]
                  ,[remark]
                  ,[task_depend]
                  ,[dependencies_type]
                  ,[stage]
                  ,[user_role]
                  ,[deliverable]
                  ,[task_type]
                  ,[is_active]
             FROM art_task W
            JOIN
            (
            SELECT 
            x.tId,
            SUM(x.estimated_time) sum_estimated_time  FROM
            (
            select a.*,b.estimated_time from art_task a
            LEFT OUTER JOIN art_sub_task_allocation b
            ON a.tId=b.task_id
            ) x
            WHERE x.pId=@pid
            GROUP BY x.tId
            ) Z
            ON W.tId=Z.tId
            order by plan_start_date asc
END
GO
