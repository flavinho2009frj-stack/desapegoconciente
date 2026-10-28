CREATE DATABASE IF NOT EXISTS essencia_organizada
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE essencia_organizada;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Blumenau',
  state VARCHAR(100) NOT NULL DEFAULT 'Santa Catarina',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(140) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  condition_label VARCHAR(60) NOT NULL,
  operation ENUM('VENDA', 'TROCA') NOT NULL,
  price DECIMAL(10,2) NULL,
  exchange_description VARCHAR(255) NULL,
  status ENUM('ATIVO', 'PAUSADO', 'CONCLUIDO') NOT NULL DEFAULT 'ATIVO',
  view_count INT UNSIGNED NOT NULL DEFAULT 0,
  city VARCHAR(100) NOT NULL DEFAULT 'Blumenau',
  state VARCHAR(100) NOT NULL DEFAULT 'Santa Catarina',
  image_path VARCHAR(512) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ads_created_at (created_at),
  KEY idx_ads_operation (operation),
  KEY idx_ads_category (category),
  KEY idx_ads_user_id (user_id),
  KEY idx_ads_status_created (status, created_at),
  CONSTRAINT fk_ads_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_ads_price CHECK ((operation = 'VENDA' AND price IS NOT NULL AND price > 0) OR (operation = 'TROCA' AND price IS NULL))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ad_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ad_id BIGINT UNSIGNED NOT NULL,
  requester_user_id BIGINT UNSIGNED NOT NULL,
  request_type ENUM('INTERESSE', 'TROCA') NOT NULL,
  status ENUM('PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ad_requests_ad_user (ad_id, requester_user_id),
  KEY idx_ad_requests_requester (requester_user_id),
  CONSTRAINT fk_ad_requests_ad
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  CONSTRAINT fk_ad_requests_user
    FOREIGN KEY (requester_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ad_id BIGINT UNSIGNED NOT NULL,
  sender_user_id BIGINT UNSIGNED NOT NULL,
  recipient_user_id BIGINT UNSIGNED NOT NULL,
  body VARCHAR(2000) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_messages_conversation (ad_id, sender_user_id, recipient_user_id, created_at),
  KEY idx_messages_recipient (recipient_user_id, created_at),
  CONSTRAINT fk_messages_ad FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
