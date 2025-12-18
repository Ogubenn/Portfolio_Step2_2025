-- CreateTable
CREATE TABLE `Education` (
    `id` VARCHAR(191) NOT NULL,
    `school` LONGTEXT NOT NULL,
    `degree` LONGTEXT NOT NULL,
    `field` LONGTEXT NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `current` BOOLEAN NOT NULL DEFAULT false,
    `gpa` LONGTEXT NULL,
    `description` LONGTEXT NOT NULL,
    `location` LONGTEXT NULL,
    `achievements` LONGTEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Education_visible_idx`(`visible`),
    INDEX `Education_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
