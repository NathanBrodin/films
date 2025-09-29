-- Custom SQL migration file, put your code below! --

-- Add new columns to user table
ALTER TABLE `user` ADD COLUMN `bio` text;
ALTER TABLE `user` ADD COLUMN `instagram` text;
ALTER TABLE `user` ADD COLUMN `website` text;
