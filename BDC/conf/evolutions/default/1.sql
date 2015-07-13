# --- !Ups


CREATE TABLE IF NOT EXISTS `art_baseline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `change_set` varchar(1000) NOT NULL,
  `user_id` int(11) NOT NULL,
  `changed_at` datetime NOT NULL,
  `object_type` text NOT NULL,
  `ref_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_project_type_master`(
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `project_type` int(5) NOT NULL ,
  `creation_date` datetime DEFAULT NULL,
  `updation_date` datetime DEFAULT NULL,
  `states` int(5) NOT NULL,
  `responsible` int(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_forgot_password_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` text NOT NULL,
  `user_name` text NOT NULL,
  `verification_code` varchar(200) NOT NULL COMMENT '''This code is encripted go with verification mail''',
  `added_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `isverify` int(5) NOT NULL COMMENT '''0-if email is not verify'',''1-if enail is verify''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  ;

CREATE TABLE IF NOT EXISTS `art_department_master` (
  `dId` int(11) NOT NULL AUTO_INCREMENT,
  `department` text NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'user id',
  `report_type` int(11) DEFAULT NULL COMMENT '0-genrencia 1-department',
  `report_to` int(11) DEFAULT NULL,
  `organization_depth` int(11) DEFAULT '0',
  PRIMARY KEY (`dId`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_division_master` (
  `dId` int(11) NOT NULL AUTO_INCREMENT,
  `division` text NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'user id',
  PRIMARY KEY (`dId`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_genrencia_master` (
  `dId` int(11) NOT NULL AUTO_INCREMENT,
  `genrencia` text NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'user id',
  `report_type` int(11) DEFAULT NULL COMMENT '0-division 1-genrencia',
  `report_to` int(11) DEFAULT NULL,
  `organization_depth` int(11) DEFAULT '0',
  PRIMARY KEY (`dId`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_non_project_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS `art_program` (
  `program_id` int(11) NOT NULL AUTO_INCREMENT,
  `program_type` int(11) DEFAULT NULL,
  `program_sub_type` int(11) DEFAULT NULL,
  `program_name` text NOT NULL,
  `program_code` int(25) NOT NULL,
  `projects_numbers` int(11) DEFAULT NULL,
  `system_code` double(10,2) DEFAULT '0.00',
  `internal_number` int(11) DEFAULT NULL,
  `pLevel` varchar(30) DEFAULT NULL,
  `program_description` text,
  `work_flow_status` int(11) DEFAULT NULL,
  `internal_state` varchar(30) DEFAULT NULL,
  `demand_management_status` varchar(30) DEFAULT NULL,
  `demand_manager` int(11) DEFAULT NULL,
  `program_manager` int(11) DEFAULT NULL,
  `devison` int(11) DEFAULT NULL,
  `management` int(11) DEFAULT NULL,
  `department` int(11) DEFAULT NULL,
  `impact_type` int(11) DEFAULT NULL,
  `business_line` varchar(100) DEFAULT NULL,
  `sap_code` int(11) DEFAULT NULL,
  `total_sap` int(11) DEFAULT NULL,
  `completion_percentage` double(10,2) DEFAULT '0.00',
  `state_gantt` varchar(30) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `initiation_planned_date` datetime DEFAULT NULL,
  `end_planned_date` datetime DEFAULT NULL,
  `baseline_date` datetime DEFAULT NULL,
  `clossing_date_gantt` datetime DEFAULT NULL,
  `actual_release_date` datetime DEFAULT NULL,
  `closure_date` datetime DEFAULT NULL,
  `last_action_date` datetime DEFAULT NULL,
  PRIMARY KEY (`program_id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `art_project_master` (
  `pId` int(15) NOT NULL AUTO_INCREMENT,
  `project_mode` int(11) NOT NULL Default 0,
  `project_id` varchar(30) NOT NULL,
  `program` int(11) DEFAULT NULL,
  `project_name` varchar(500) NOT NULL,
  `description` text,
  `project_manager` int(11) DEFAULT NULL,
  `start_date` date NOT NULL,
  `final_release_date` date NOT NULL,
  `budget_approved` int(11) DEFAULT NULL,
  `sap_code` varchar(100) DEFAULT NULL,
  `total_sap` decimal(12,2) DEFAULT NULL,
  `budget_approved_staff` decimal(12,2) DEFAULT NULL,
  `budget_approved_contractor` decimal(12,2) DEFAULT NULL,
  `budget_approved_hardware` decimal(12,2) DEFAULT NULL,
  `budget_approved_software` decimal(12,2) DEFAULT NULL,
  `ppm_number` double DEFAULT NULL,
  `work_flow_status` int(11) DEFAULT NULL,
  `baseline` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL
  PRIMARY KEY (`pId`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_generic_project_master` (
  `pId` int(15) NOT NULL AUTO_INCREMENT,
  `project_mode` int(11) NOT NULL,
  `project_id` varchar(30) NOT NULL,
  `project_name` varchar(500) NOT NULL,
  `description` text,
  `project_manager` int(11) DEFAULT NULL,
  `start_date` date NOT NULL,
  `final_release_date` date NOT NULL,
  `budget_approved` int(11) DEFAULT NULL,
  `sap_code` varchar(100) DEFAULT NULL,
  `total_sap` decimal(12,2) DEFAULT NULL,
  `budget_approved_staff` decimal(12,2) DEFAULT NULL,
  `budget_approved_contractor` decimal(12,2) DEFAULT NULL,
  `budget_approved_hardware` decimal(12,2) DEFAULT NULL,
  `budget_approved_software` decimal(12,2) DEFAULT NULL,
  `ppm_number` double DEFAULT NULL,
  `work_flow_status` int(11) DEFAULT NULL,
  `baseline` tinyint(1) NOT NULL,
  PRIMARY KEY (`pId`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `art_program_impact_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `impact_type` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_program_sub_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sub_type` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_program_workflow_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workflow_status` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `art_sub_task` (
  `sub_task_id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `plan_start_date` date NOT NULL,
  `plan_end_date` date NOT NULL,
  `actual_start_date` date NOT NULL,
  `actual_end_date` date NOT NULL,
  `priority` int(11) NOT NULL,
  `added_date` date NOT NULL,
  `note` text NOT NULL,
  `status` int(11) NOT NULL,
  `completion_percentage` double(10,2) DEFAULT '0.00',
  `task_complete` int(11) DEFAULT '0',
  `sub_task_depend` varchar(500) DEFAULT NULL,
  `dependencies_type` int(11) DEFAULT NULL,
   `is_deleted`  tinyint(1) NOT NULL,
  PRIMARY KEY (`sub_task_id`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `art_sub_task_allocation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sub_task_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `pId` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `estimated_time` double DEFAULT NULL,
  `status` int(5) DEFAULT '0',
   `is_deleted`  tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_task` (
  `tId` int(11) NOT NULL AUTO_INCREMENT,
  `pId` int(11) NOT NULL,
  `task_title` text NOT NULL COMMENT 'task title',
  `task_code` text NOT NULL COMMENT 'task code',
  `plan_start_date` datetime NOT NULL,
  `plan_end_date` datetime NOT NULL,
  `actual_start_date` datetime NOT NULL,
  `actual_end_date` datetime NOT NULL,
  `task_description` varchar(2000) NOT NULL,
  `plan_time` decimal(10,2) DEFAULT '0.00',
  `creation_date` datetime NOT NULL,
  `task_status` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `owner` int(11) DEFAULT '0',
  `task_discipline` int(11) DEFAULT NULL,
  `completion_percentage` double(10,2) DEFAULT NULL,
  `remark` text,
  `task_depend` varchar(500) DEFAULT NULL,
  `dependencies_type` int(11) DEFAULT NULL,
    `stage` int(11) DEFAULT NULL,
  `user_role` int(11) DEFAULT NULL,
  `deliverable` int(11) DEFAULT NULL,
  `task_type` int(11) DEFAULT '0',
  `is_active` tinyint(1) NOT NULL
  PRIMARY KEY (`tId`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `art_task_discipline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_discipline` text NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `art_timesheet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_type` int(11) NOT NULL COMMENT 'project/non project type',
  `task_for_date` datetime NOT NULL,
  `sub_task_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `notes` text,
  `pId` int(11) NOT NULL,
  `hours` decimal(10,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `art_user` (
  `uid` int(15) NOT NULL AUTO_INCREMENT,
  `uname` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `profile_image` varchar(200) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `division` int(11) DEFAULT NULL,
  `gerencia` int(11) DEFAULT NULL,
  `department` int(11) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
 `birth_date` date NOT NULL,
`office_number` text NOT NULL,
 `joining_date` date NOT NULL,
  `isadmin` int(5) NOT NULL COMMENT '''0-front end user'',''1-back end admin''',
  `isverify` int(5) NOT NULL COMMENT '''0-if email is not veri fy'',''1-if enail is verify''',
  `verify_code` varchar(100) NOT NULL COMMENT '''This code is encripted go with verification mail''',
  `verify_date` datetime NOT NULL COMMENT '''date when email verify by user''',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '''Active'',''Inactive''',
  `added_date` datetime NOT NULL,
 `rut_number` text NOT NULL,
  `rate_hour` int(15) NOT NULL,
 `contact_number` varchar(15) NOT NULL,
  `user_type` int(11) NOT NULL,
  `work_hours` decimal(10,2) NOT NULL,
  `bonus_app` int(11) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_user_project_mapping` (
  `uId` int(11) NOT NULL,
  `pId` int(11) NOT NULL,
  `show_project` int(11) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_user_role` (
  `rId` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(50) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`rId`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_user_skills` (
  `skill_id` int(11) NOT NULL AUTO_INCREMENT,
  `skill` text NOT NULL,
  PRIMARY KEY (`skill_id`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `art_user_skills_mapping` (
  `uId` int(11) NOT NULL COMMENT 'user id',
  `prId` int(11) DEFAULT NULL,
  `sId` int(11) NOT NULL COMMENT 'skill id',
  `rating` int(11) NOT NULL,
  `isEndorsed` int(11) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `play_evolutions` (
  `id` int(11) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `apply_script` text,
  `revert_script` text,
  `state` varchar(255) DEFAULT NULL,
  `last_problem` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS  `document_master` (
 `id` INT( 11 ) NOT NULL AUTO_INCREMENT ,
 `extension` TEXT NOT NULL ,
 `parent_type` TEXT NOT NULL ,
 `parent_id` INT( 11 ) NOT NULL ,
 `title` TEXT NOT NULL ,
PRIMARY KEY (  `id` )
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `version_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `version_no` decimal(10,2) NOT NULL,
  `version_alias` decimal(10,2) NOT NULL,
  `version_notes` text NOT NULL,
  `parent_version_id` int(11) DEFAULT NULL,
  `is_deleted`  tinyint(1) NOT NULL,
  `document_type` int(11) NOT NULL,
  `creation_date` datetime NOT NULL,
  `file_name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_generic_task` (
  `tId` int(11) NOT NULL AUTO_INCREMENT,
  `task_title` text NOT NULL COMMENT 'task title',
  `task_code` text NOT NULL,
  `plan_start_date` datetime NOT NULL,
  `plan_end_date` datetime NOT NULL,
  `task_description` varchar(2000) NOT NULL,
  `plan_time` decimal(10,2) DEFAULT '0.00',
  `creation_date` datetime NOT NULL,
  `task_status` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `owner` int(11) DEFAULT '0',
  `task_discipline` int(11) DEFAULT NULL,
  `completion_percentage` double(10,2) DEFAULT NULL,
  `remark` text,
  `task_depend` int(11) DEFAULT NULL,
  `stage` int(11) DEFAULT NULL,
  `user_role` int(11) DEFAULT NULL,
  `deliverable` int(11) DEFAULT NULL,
  `task_type` int(11) DEFAULT '0',
  `task_mode` int(11)  DEFAULT NULL,
    `predefined_task_id` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`tId`)
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS `art_predefined_task` (
  `tId` int(11) NOT NULL AUTO_INCREMENT,
  `task_title` text NOT NULL COMMENT 'task title',
  `task_description` varchar(2000) NOT NULL,
  `task_discipline` int(11) DEFAULT NULL,
  `remark` text,
  `stage` int(11) DEFAULT NULL,
  `user_role` int(11) DEFAULT NULL,
  `deliverable` int(11) DEFAULT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`tId`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_project_workflow_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_workflow_status` text NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
)ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS `art_program_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `program_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL COMMENT 'user id',
  `is_active` int(5) NOT NULL COMMENT 'Active/In-active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `art_budget_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `budget_for` varchar(100) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `art_program_sap_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `program_id` int(11) NOT NULL,
  `sap_number` int(11) NOT NULL,
  `budget_type` int(11) NOT NULL,
  `cui1` decimal(10,2) NOT NULL,
  `cui1_per` decimal(10,0) NOT NULL,
  `cui2` decimal(10,2) NOT NULL,
  `cui2_per` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `art_program_sap_ibfk_1` (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS `art_program_sap_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sap_id` int(11) NOT NULL,
  `budget_code` int(11) NOT NULL COMMENT 'Investment(0)/Expenditure(1)',
  `ie_type` int(11) NOT NULL COMMENT 'reference from budget master',
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;


#--ALTER TABLE version_details ADD file_path text DEFAULT NULL;

CREATE TABLE IF NOT EXISTS `art_program_stage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stage` text COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;



CREATE TABLE IF NOT EXISTS `art_program_deliverable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deliverable` text NOT NULL,
  `description` varchar(2000) NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `art_program_generic_project_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `generic_project_type` text NOT NULL,
  `description` varchar(2000) NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS `art_program_document_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_type` text NOT NULL,
  `description` varchar(2000) NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS `art_program_budget_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `budget_type` text NOT NULL,
  `description` varchar(2000) NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS `art_program_stage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stage` text COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(2000) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;



CREATE TABLE IF NOT EXISTS `art_program_deliverable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deliverable` text COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(2000) COLLATE utf8_unicode_ci NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;


CREATE TABLE IF NOT EXISTS `art_program_generic_project_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `generic_project_type` text COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(2000) COLLATE utf8_unicode_ci NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;



CREATE TABLE IF NOT EXISTS `art_program_document_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_type` text COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(2000) COLLATE utf8_unicode_ci NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;



CREATE TABLE IF NOT EXISTS `art_program_budget_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `budget_type` text COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(2000) COLLATE utf8_unicode_ci NOT NULL,
  `creation_date` date DEFAULT NULL,
  `updation_date` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `isActive` int(2) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;



CREATE TABLE IF NOT EXISTS `art_program_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `program_id` int(11) NOT NULL,
  `status_for_date` datetime NOT NULL,
  `reason_for_change` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;


CREATE TABLE IF NOT EXISTS `art_project_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `status_for_date` datetime NOT NULL,
  `reason_for_change` text COLLATE utf8_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `art_sub_task_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sub_task_id` int(11) NOT NULL,
  `status_for_date` datetime NOT NULL,
  `reason_for_change` text COLLATE utf8_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `art_task_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `status_for_date` datetime NOT NULL,
  `reason_for_change` text COLLATE utf8_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `art_erned_value` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_type` int(11) NOT NULL COMMENT '0 -  Program 1- Project',
  `parent_id` int(11) NOT NULL,
  `recorded_date` datetime NOT NULL,
  `erned_value` double DEFAULT '0',
  `planned_value` double DEFAULT '0',
  `actual_cost` double DEFAULT '0',
  `completion_percentage` double DEFAULT '0',
  `scheduled_varience` double DEFAULT '0',
  `cost_varience` double DEFAULT '0',
  `scheduled_perforamce_index` double DEFAULT '0',
  `cost_performance_index` double DEFAULT '0',
  `estimate_at_completion` double DEFAULT '0',
  `estimate_to_complete` double DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

#--ALTER TABLE  art_user ADD `rId` int(11) DEFAULT 1 AFTER password;

#-- ALTER TABLE  art_user ADD `profile_image` varchar(200) DEFAULT NULL AFTER password;


#--ALTER TABLE  art_project_master ADD project_mode int(11) NOT NULL AFTER program;
#--ALTER TABLE art_generic_task ADD task_mode int(11) DEFAULT NULL


#--ALTER TABLE art_task ADD stage int(11) DEFAULT NULL;
#--ALTER TABLE art_task ADD user_role int(11) DEFAULT NULL;
#--ALTER TABLE art_task ADD deliverable int(11) DEFAULT NULL;
#--ALTER TABLE art_task ADD task_type int(11) DEFAULT 0;


#--ALTER TABLE `art_project_master`  ADD CONSTRAINT `art_project_master_ibfk_1` FOREIGN KEY (`program`) REFERENCES `art_program` (`program_id`);
#--ALTER TABLE art_milestone MODIFY task_depend varchar(500) DEFAULT NULL;
#--ALTER TABLE art_milestone DROP country_id;
#--ALTER TABLE art_milestone DROP state_id;
#--ALTER TABLE art_milestone DROP city_id;
#--ALTER TABLE art_milestone ADD task_depend int(11) DEFAULT NULL AFTER remark;
#--ALTER TABLE art_milestone ADD dependencies_type int(11) DEFAULT NULL AFTER task_depend;
#--ALTER TABLE  art_milestone_task ADD sub_task_depend int(11) DEFAULT NULL;
#--ALTER TABLE  art_milestone_task ADD dependencies_type int(11) DEFAULT NULL; 
#--ALTER TABLE art_baseline ENGINE = INNODB;
#--ALTER TABLE art_department_master ENGINE = INNODB;
#--ALTER TABLE art_genrencia_master ENGINE = INNODB;
#--ALTER TABLE art_division_master ENGINE = INNODB;
#--ALTER TABLE art_milestone ENGINE = INNODB;
#--ALTER TABLE art_milestone_team_mapping ENGINE = INNODB;
#--ALTER TABLE art_non_project_task ENGINE = INNODB;
#--ALTER TABLE art_program ENGINE = INNODB;
#--ALTER TABLE art_project_master ENGINE = INNODB;
#--ALTER TABLE art_sub_task_allocation ENGINE = INNODB;
#--ALTER TABLE art_team ENGINE = INNODB;
#--ALTER TABLE art_team_member ENGINE = INNODB;
#--ALTER TABLE art_timesheet ENGINE = INNODB;
#--ALTER TABLE art_user ENGINE = INNODB;
#--ALTER TABLE art_user_admin_mapping ENGINE = INNODB;
#--ALTER TABLE art_user_ceo_mapping ENGINE = INNODB;
#--ALTER TABLE art_user_pm_mapping ENGINE = INNODB;
#--ALTER TABLE art_user_project_mapping ENGINE = INNODB;
#--ALTER TABLE art_user_role ENGINE = INNODB;
#--ALTER TABLE art_user_skills ENGINE = INNODB;
#--ALTER TABLE art_user_skills_mapping ENGINE = INNODB;
#--ALTER TABLE play_evolutions ENGINE = INNODB;
#--ALTER TABLE art_milestone_task ENGINE = INNODB;


#--ALTER TABLE art_user MODIFY status int(11) DEFAULT 1;
#--ALTER TABLE art_user ADD division int(11) DEFAULT NULL AFTER last_name;
#--ALTER TABLE art_user ADD management int(11) DEFAULT NULL AFTER division;
#--ALTER TABLE art_user MODIFY department int(11) DEFAULT NULL;


#--ALTER TABLE  art_project_master MODIFY total_sap decimal(12,2) DEFAULT NULL;
#--ALTER TABLE  art_project_master MODIFY budget_approved_staff decimal(12,2) DEFAULT NULL;
#--ALTER TABLE  art_project_master MODIFY budget_approved_contractor decimal(12,2) DEFAULT NULL;
#--ALTER TABLE  art_project_master MODIFY budget_approved_hardware decimal(12,2) DEFAULT NULL;
#--ALTER TABLE  art_project_master MODIFY budget_approved_software decimal(12,2) DEFAULT NULL;

#--ALTER TABLE  art_project_master MODIFY budget_approved_staff DOUBLE DEFAULT NULL;
#--ALTER TABLE  art_project_master MODIFY budget_approved_contractor DOUBLE DEFAULT NULL;
#--ALTER TABLE  art_project_master MODIFY budget_approved_hardware DOUBLE DEFAULT NULL;
#--ALTER TABLE  art_project_master MODIFY budget_approved_software DOUBLE DEFAULT NULL;

#--ALTER TABLE art_milestone ADD task_discipline int(11) DEFAULT NULL  AFTER owner;
#--ALTER TABLE art_milestone ADD completion_percentage double(10,2)  DEFAULT NULL  AFTER task_discipline;
#--ALTER TABLE art_milestone ADD remark text DEFAULT NULL  AFTER completion_percentage;
#--ALTER TABLE art_project_master ADD genrencia int(11) DEFAULT NULL  AFTER division;
#--ALTER TABLE art_project_master DROP COLUMN  project_sub_code;

#--INSERT INTO `art_program` (`program_id`, `program_type`, `program_sub_type`, `program_name`, `program_code`, `projects_numbers`, `system_code`, `internal_number`, `pLevel`, `program_description`, `work_flow_status`, `internal_state`, `demand_management_status`, `demand_manager`, `program_manager`, `devison`, `management`, `department`, `impact_type`, `business_line`, `sap_code`, `total_sap`, `completion_percentage`, `state_gantt`, `creation_date`, `initiation_planned_date`, `end_planned_date`, `baseline_date`, `clossing_date_gantt`, `actual_release_date`, `closure_date`, `last_action_date`) VALUES
#--(1, 2, 1, 'SM - Proyectos de Service Manager - Año 2014', 145045, 0, 0.00, 0, '00', 'SM - Proyectos de Service Manager - Año 2014', 1, '0', 'Initiativa OK', 665, 665, 2, 11, 2, 1, 'Sin Impacto en la Banca', 99999, 0, 0.00, 'NA', '2014-06-19 19:34:16', '2014-06-13 00:00:00', '2014-06-20 00:00:00', '2014-07-11 00:00:00', '2014-06-24 00:00:00', '2014-06-25 00:00:00', '2014-06-30 00:00:00', '2014-07-11 18:30:03'),
#--(2, 1, 3, 'Normativo Cambio Ley TMC', 83973, 0, 0.00, 0, '00', 'Normativo Cambio Ley TMC', 1, '0', 'Initiativa OK', 553, 4, 1, 13, 14, 1, 'Sin Impacto en la Banca', 5202, 4556, 55.00, 'NA', '2014-06-19 19:34:16', '2014-06-13 00:00:00', '2014-06-20 00:00:00', '2014-07-11 00:00:00', '2014-06-24 00:00:00', '2014-06-25 00:00:00', '2014-06-30 00:00:00', '2014-07-11 18:31:45'),
#--(3, 2, 1, 'SM - CorrecciÃ³n Archivo D03', 145045, 0, 0.00, 0, '00', 'SM - CorrecciÃ³n Archivo D03', 1, '0', 'Initiativa OK', 14, 667, 2, 14, 2, 1, 'Sin Impacto en la Banca', 5202, 4556, 65.00, 'NA', '2014-06-19 19:34:16', '2014-06-13 00:00:00', '2014-06-20 00:00:00', '2014-07-11 00:00:00', '2014-06-24 00:00:00', '2014-06-25 00:00:00', '2014-06-30 00:00:00', '2014-07-11 18:31:55'),
#--(6, 2, 1, 'Test 2001', 454545, 0, 0.00, 0, '00', 'Description', 3, '0', 'Initiativa OK', 30, 11, 1, 13, 21, 2, 'Test', 5000, 45454, 55.00, 'NA', '2014-07-11 13:07:28', '2014-07-09 00:00:00', '2014-07-23 00:00:00', '2014-07-11 00:00:00', '2014-07-25 00:00:00', '2014-07-29 00:00:00', '2014-07-24 00:00:00', '2014-07-11 18:42:35');


#-- INSERT INTO `art_program` (`program_id`, `program_type`, `program_sub_type`, `program_code`, `projects_numbers`, `system_code`, `internal_number`, `pLevel`, `program_description`, `work_flow_status`, `internal_state`, `demand_management_status`, `demand_manager`, `program_manager`, `program_manager_designation`, `management_representative`, `department_representative`, `devison`, `management`, `department`, `impact_type`, `business_line`, `sap_code`, `total_sap`, `completion_percentage`, `state_gantt`, `creation_date`, `initiation_planned_date`, `end_planned_date`, `baseline_date`, `clossing_date_gantt`, `actual_release_date`, `closure_date`, `last_action_date`) VALUES
#-- (1, 'BCH - Proyecto Parametrico', 'Proyecto Parametrico', '145045', 5, 145045.70, 145150, 'No', 'SM - Corrección Archivo D03', 'SM - Corrección Archivo D03', 'En planificacion', 'En Curso', 7, 6, 101, 'Gerencia Desarrollo Sist. de Apoyo', 'Depto. Continuidad de Sistemas', '2', '2', '2', 'Auditoría', 'Sin Impacto en la Banca', 5202, 4556, 55.00, 'test', '2014-06-19 19:34:16', '2014-06-13 00:00:00', '2014-06-20 00:00:00', '2014-06-22 00:00:00', '2014-06-24 00:00:00', '2014-06-25 00:00:00', '2014-06-30 00:00:00', '2014-06-19 19:34:16'),
#-- (2, 'BCH - Proyecto de Gestion', 'Proyecto Parametrico', '145045', 5, 145045.70, 145150, 'No', 'SM - CorrecciÃ³n Archivo D03', 'SM - CorrecciÃ³n Archivo D03', 'En planificacion', 'En Curso', 7, 6, 101, 'Gerencia Desarrollo Sist. de Apoyo', 'Depto. Continuidad de Sistemas', '2', '2', '2', 'AuditorÃ­a', 'Sin Impacto en la Banca', 5202, 4556, 55.00, 'test', '2014-06-19 19:34:16', '2014-06-13 00:00:00', '2014-06-20 00:00:00', '2014-06-22 00:00:00', '2014-06-24 00:00:00', '2014-06-25 00:00:00', '2014-06-30 00:00:00', '2014-06-19 19:34:16'),
#-- (3, 'BCH - Proyecto de Desarrollo', 'Proyecto Parametrico', '145045', 5, 145045.70, 145150, 'No', 'SM - CorrecciÃ³n Archivo D03', 'SM - CorrecciÃ³n Archivo D03', 'En planificacion', 'En Curso', 7, 6, 101, 'Gerencia Desarrollo Sist. de Apoyo', 'Depto. Continuidad de Sistemas', '2', '2', '2', 'AuditorÃ­a', 'Sin Impacto en la Banca', 5202, 4556, 55.00, 'test', '2014-06-19 19:34:16', '2014-06-13 00:00:00', '2014-06-20 00:00:00', '2014-06-22 00:00:00', '2014-06-24 00:00:00', '2014-06-25 00:00:00', '2014-06-30 00:00:00', '2014-06-19 19:34:16');

# --- !Downs

