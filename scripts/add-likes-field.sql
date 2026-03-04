-- Add likes column to Project table
ALTER TABLE `Project` ADD COLUMN `likes` INT NOT NULL DEFAULT 0;

-- Update existing projects with random likes between 8-130
UPDATE `Project` 
SET `likes` = FLOOR(8 + (RAND() * 123))
WHERE `likes` = 0;
