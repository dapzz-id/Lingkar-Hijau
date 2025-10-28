-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 28, 2025 at 03:22 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lingkarhijau`
--
CREATE DATABASE IF NOT EXISTS `lingkarhijau` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `lingkarhijau`;

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
CREATE TABLE `achievements` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `icon` varchar(50) DEFAULT NULL,
  `rarity` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_replies`
--

DROP TABLE IF EXISTS `forum_replies`;
CREATE TABLE `forum_replies` (
  `id` int NOT NULL,
  `thread_id` int NOT NULL,
  `author_id` int NOT NULL,
  `content` text NOT NULL,
  `likes` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `forum_replies`
--

INSERT INTO `forum_replies` (`id`, `thread_id`, `author_id`, `content`, `likes`, `created_at`) VALUES
(1, 1, 1, 'Bagaimana menurut Anda semua?', 0, '2025-10-26 01:54:37');

-- --------------------------------------------------------

--
-- Table structure for table `forum_threads`
--

DROP TABLE IF EXISTS `forum_threads`;
CREATE TABLE `forum_threads` (
  `id` int NOT NULL,
  `author_id` int NOT NULL,
  `category` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_pinned` tinyint(1) DEFAULT '0',
  `views` int DEFAULT '0',
  `replies_count` int DEFAULT '0',
  `likes` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `forum_threads`
--

INSERT INTO `forum_threads` (`id`, `author_id`, `category`, `title`, `content`, `is_pinned`, `views`, `replies_count`, `likes`, `created_at`, `updated_at`) VALUES
(1, 1, 'Inovasi', 'Langkah Hijau Jabar', 'Penghijauan Lingkungan Jawa Barat', 0, 20, 1, 2, '2025-10-26 00:09:57', '2025-10-28 12:31:48'),
(2, 1, 'Diskusi', 'tes', 'tes', 0, 4, 0, 3, '2025-10-26 06:02:07', '2025-10-28 06:14:46');

-- --------------------------------------------------------

--
-- Table structure for table `history_transaction`
--

DROP TABLE IF EXISTS `history_transaction`;
CREATE TABLE `history_transaction` (
  `id` int NOT NULL,
  `id_products` int NOT NULL,
  `id_buyer` int NOT NULL,
  `transaction_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `transaction_code` varchar(50) NOT NULL,
  `rated` enum('Sudah','Belum') NOT NULL DEFAULT 'Belum',
  `count_rate` decimal(3,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `history_transaction`
--

INSERT INTO `history_transaction` (`id`, `id_products`, `id_buyer`, `transaction_date`, `transaction_code`, `rated`, `count_rate`) VALUES
(1, 1, 1, '2025-10-26 02:18:16', 'DVSPRK-23CF54FDE11', 'Sudah', 4.00);

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_products`
--

DROP TABLE IF EXISTS `marketplace_products`;
CREATE TABLE `marketplace_products` (
  `id` int NOT NULL,
  `seller_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `eco_score` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `reviews_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `marketplace_products`
--

INSERT INTO `marketplace_products` (`id`, `seller_id`, `name`, `description`, `category`, `price`, `original_price`, `eco_score`, `image_url`, `rating`, `reviews_count`, `created_at`) VALUES
(1, 1, 'Tes', 'apa gek, tes jualan', 'Kaca', 3200000.00, 3200000.00, 80, 'https://firebasestorage.googleapis.com/v0/b/test-7bad2.appspot.com/o/whatsapp-image-2022-09-05-at-13-20-43-6315956e6292e94ca36b8f73.jpeg?alt=media&token=d08449ae-d718-422d-864d-d0583a060cd1', 2.50, 2, '2025-10-25 17:34:20'),
(2, 1, 'Produk 1', 'apa aja deh  hahahahahha', 'Fashion', 120000.00, 190000.00, 98, '/uploads/product-1761450438872.png', 0.00, 0, '2025-10-26 03:49:47'),
(3, 1, 'tesq', 'tes 121212 hahah', 'Kesehatan', 90000.00, 120000.00, 80, '/uploads/product-1761450685449.png', 0.00, 0, '2025-10-26 03:51:42'),
(4, 1, 'tes', 'tes', 'Kesehatan', 200000.00, 210000.00, 90, '/uploads/product-1761458583112.png', 0.00, 0, '2025-10-26 06:03:52');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `id_buyer` int NOT NULL,
  `id_seller` int NOT NULL,
  `id_products` int NOT NULL,
  `comment_buyer` text NOT NULL,
  `reply_comment_by_seller` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `id_buyer`, `id_seller`, `id_products`, `comment_buyer`, `reply_comment_by_seller`, `created_at`) VALUES
(1, 1, 1, 1, 'Bagus produknya', NULL, '2025-10-25 20:37:06');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `total_points` int NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'completed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `total_amount`, `total_points`, `status`, `created_at`) VALUES
(1, 1, 360000.00, 400, 'completed', '2025-10-26 04:11:14'),
(2, 1, 120000.00, 100, 'completed', '2025-10-26 04:11:30'),
(3, 1, 720000.00, 600, 'completed', '2025-10-26 04:13:16'),
(4, 1, 13040000.00, 600, 'completed', '2025-10-26 04:13:55'),
(5, 1, 540000.00, 500, 'completed', '2025-10-26 04:14:06'),
(6, 1, 3440000.00, 300, 'completed', '2025-10-26 05:59:19'),
(7, 1, 3200000.00, 50, 'completed', '2025-10-28 05:51:25'),
(8, 1, 3200000.00, 100, 'completed', '2025-10-28 05:52:18');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_items`
--

DROP TABLE IF EXISTS `transaction_items`;
CREATE TABLE `transaction_items` (
  `id` int NOT NULL,
  `transaction_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `points_earned` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaction_items`
--

INSERT INTO `transaction_items` (`id`, `transaction_id`, `product_id`, `product_name`, `quantity`, `price`, `points_earned`, `created_at`) VALUES
(1, 1, 3, 'tesq', 4, 90000.00, 400, '2025-10-26 04:11:14'),
(2, 2, 2, 'Produk 1', 1, 120000.00, 100, '2025-10-26 04:11:30'),
(3, 3, 2, 'Produk 1', 6, 120000.00, 600, '2025-10-26 04:13:16'),
(4, 4, 2, 'Produk 1', 2, 120000.00, 200, '2025-10-26 04:13:55'),
(5, 4, 1, 'Tes', 4, 3200000.00, 400, '2025-10-26 04:13:55'),
(6, 5, 2, 'Produk 1', 3, 120000.00, 300, '2025-10-26 04:14:06'),
(7, 5, 3, 'tesq', 2, 90000.00, 200, '2025-10-26 04:14:06'),
(8, 6, 1, 'Tes', 1, 3200000.00, 100, '2025-10-26 05:59:19'),
(9, 6, 2, 'Produk 1', 2, 120000.00, 200, '2025-10-26 05:59:19'),
(10, 7, 1, 'Tes', 1, 3200000.00, 100, '2025-10-28 05:51:25'),
(11, 8, 1, 'Tes', 1, 3200000.00, 100, '2025-10-28 05:52:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` text,
  `city` varchar(100) DEFAULT NULL,
  `points` int DEFAULT '0',
  `level` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar_url`, `bio`, `city`, `points`, `level`, `created_at`, `updated_at`) VALUES
(1, 'Kadavi', 'kadaviradityaa@gmail.com', '$2y$12$YnSYBOtTBCACQe37rd.Zy.9Ir3L0NP3wNKSWN/QNJtIk39OgQqEcy', NULL, NULL, 'Kab. Bekasi', 2600, 6, '2025-10-21 07:19:40', '2025-10-28 05:52:18'),
(2, 'Naufal Ma\'ruf Ashrori', 'naufalmaruf225@gmail.com', '$2b$10$PhhT3Pyla85mIgByJ7W6UuDzS5XnL8RD1/FoZlB5lzVHmTf.TDXkG', NULL, NULL, 'Kabupaten Bekasi', 0, 1, '2025-10-21 07:29:56', '2025-10-21 07:29:56'),
(3, 'ka', 'budi12@gmail.com', '$2b$10$Zq3tyt.M/ANXARCT0ORJ4.xvAgAYOj48A2aQfi/x0HPzbuu.qXIUK', NULL, NULL, 'bekasi', 0, 1, '2025-10-26 06:07:40', '2025-10-26 06:07:40');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

DROP TABLE IF EXISTS `user_achievements`;
CREATE TABLE `user_achievements` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `achievement_id` int NOT NULL,
  `unlocked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `waste_catalog`
--

DROP TABLE IF EXISTS `waste_catalog`;
CREATE TABLE `waste_catalog` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `recycling_tips` text,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `waste_categories`
--

DROP TABLE IF EXISTS `waste_categories`;
CREATE TABLE `waste_categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `forum_replies`
--
ALTER TABLE `forum_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thread_id` (`thread_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `forum_threads`
--
ALTER TABLE `forum_threads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `history_transaction`
--
ALTER TABLE `history_transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_products` (`id_products`),
  ADD KEY `id_buyer` (`id_buyer`),
  ADD KEY `transaction_date` (`transaction_date`),
  ADD KEY `transaction_code` (`transaction_code`);

--
-- Indexes for table `marketplace_products`
--
ALTER TABLE `marketplace_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_buyer` (`id_buyer`),
  ADD KEY `id_seller` (`id_seller`),
  ADD KEY `id_products` (`id_products`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_achievement` (`user_id`,`achievement_id`),
  ADD KEY `achievement_id` (`achievement_id`);

--
-- Indexes for table `waste_catalog`
--
ALTER TABLE `waste_catalog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `waste_categories`
--
ALTER TABLE `waste_categories`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `forum_replies`
--
ALTER TABLE `forum_replies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `forum_threads`
--
ALTER TABLE `forum_threads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `history_transaction`
--
ALTER TABLE `history_transaction`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `marketplace_products`
--
ALTER TABLE `marketplace_products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `transaction_items`
--
ALTER TABLE `transaction_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `waste_catalog`
--
ALTER TABLE `waste_catalog`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `waste_categories`
--
ALTER TABLE `waste_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `forum_replies`
--
ALTER TABLE `forum_replies`
  ADD CONSTRAINT `forum_replies_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`id`),
  ADD CONSTRAINT `forum_replies_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `forum_threads`
--
ALTER TABLE `forum_threads`
  ADD CONSTRAINT `forum_threads_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `history_transaction`
--
ALTER TABLE `history_transaction`
  ADD CONSTRAINT `history_transaction_ibfk_1` FOREIGN KEY (`id_buyer`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `history_transaction_ibfk_2` FOREIGN KEY (`id_products`) REFERENCES `marketplace_products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `marketplace_products`
--
ALTER TABLE `marketplace_products`
  ADD CONSTRAINT `marketplace_products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `id_buyer_fk` FOREIGN KEY (`id_buyer`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_products_fk` FOREIGN KEY (`id_products`) REFERENCES `marketplace_products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_seller_fk` FOREIGN KEY (`id_seller`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `transaction_items_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`);

--
-- Constraints for table `waste_catalog`
--
ALTER TABLE `waste_catalog`
  ADD CONSTRAINT `waste_catalog_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `waste_categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
