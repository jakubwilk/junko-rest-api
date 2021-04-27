-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_ibfk_1`;

-- AddForeignKey
ALTER TABLE `User` ADD FOREIGN KEY (`id`) REFERENCES `Profile`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
