-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_ibfk_1`;

-- AlterTable
ALTER TABLE `Profile` MODIFY `user_id` VARCHAR(191);

-- AddForeignKey
ALTER TABLE `Profile` ADD FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
