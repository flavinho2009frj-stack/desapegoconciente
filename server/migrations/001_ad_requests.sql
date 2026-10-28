USE essencia_organizada;

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
