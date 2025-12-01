-- Extend VARCHAR limits for medium-length fields
-- Run this manually: mysql -u username -p database_name < extend-varchar-limits.sql

-- Project fields
ALTER TABLE `Project` MODIFY COLUMN `shortDesc` VARCHAR(500);
ALTER TABLE `Project` MODIFY COLUMN `duration` VARCHAR(100);
ALTER TABLE `Project` MODIFY COLUMN `description` TEXT;
ALTER TABLE `Project` MODIFY COLUMN `problem` TEXT;
ALTER TABLE `Project` MODIFY COLUMN `solution` TEXT;
ALTER TABLE `Project` MODIFY COLUMN `process` TEXT;
ALTER TABLE `Project` MODIFY COLUMN `learnings` TEXT;

-- Service fields
ALTER TABLE `Service` MODIFY COLUMN `description` TEXT;

-- WorkExperience fields
ALTER TABLE `WorkExperience` MODIFY COLUMN `description` TEXT;

-- SiteSettings fields
ALTER TABLE `SiteSettings` MODIFY COLUMN `heroSubtitle` VARCHAR(500);
ALTER TABLE `SiteSettings` MODIFY COLUMN `heroBio` TEXT;
ALTER TABLE `SiteSettings` MODIFY COLUMN `aboutDescription` TEXT;
ALTER TABLE `SiteSettings` MODIFY COLUMN `aboutBio1` TEXT;
ALTER TABLE `SiteSettings` MODIFY COLUMN `aboutBio2` TEXT;
ALTER TABLE `SiteSettings` MODIFY COLUMN `aboutBio3` TEXT;

-- ActivityLog
ALTER TABLE `ActivityLog` MODIFY COLUMN `description` TEXT;
