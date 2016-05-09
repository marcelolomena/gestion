select tId,pId,creation_date, plan_time,floor(plan_time), plan_time-floor(plan_time) from art_task where plan_time-floor(plan_time)!=0

-- primer cambio restar 18
select tId,pId,creation_date, plan_time,floor(plan_time), plan_time-floor(plan_time) from art_task where plan_time-floor(plan_time)!=0 and tid<=25919 and plan_time>=18
--update art_task set plan_time = plan_time-18 where plan_time-floor(plan_time)!=0 and tid<=25919 and plan_time>=18
--9931

-- segundo cambio restar 20
select tId,pId,creation_date, plan_time,floor(plan_time), plan_time-floor(plan_time) from art_task where plan_time-floor(plan_time)!=0 and tid<=25879 and plan_time>=20
--update art_task set plan_time = plan_time-20 where plan_time-floor(plan_time)!=0 and tid<=25879 and plan_time>=20
--9891

-- tercer cambio restar 3
select tId,pId,creation_date, plan_time,floor(plan_time), plan_time-floor(plan_time) from art_task where plan_time-floor(plan_time)!=0 and tid<=25480 and plan_time>=3
--update art_task set plan_time = plan_time-3 where plan_time-floor(plan_time)!=0 and tid<=25480 and plan_time>=3
--9497

-- ultimo cambio restar 0.2
select tId,pId,creation_date, plan_time,floor(plan_time), plan_time-floor(plan_time) from art_task where plan_time-floor(plan_time)!=0 and plan_time>=0.2
--update art_task set plan_time = plan_time-0.20 where plan_time-floor(plan_time)!=0 and plan_time>=0.20
--10507

-- <=25919 restar 18
-- <=25879 restar 20
-- <=25480 restar 3

select * from art_task where plan_time=0 and tid<=20885