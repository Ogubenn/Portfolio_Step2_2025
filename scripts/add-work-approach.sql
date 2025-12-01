-- Add workApproach column to SiteSettings table
ALTER TABLE `SiteSettings` ADD COLUMN `workApproach` TEXT NULL AFTER `aboutImage`;
