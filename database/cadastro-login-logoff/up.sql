-- altera pra aceitar login
USE teste_receitas_rg_sistemas;

CREATE TABLE IF NOT EXISTS sessoes_usuario (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuarios INT(10) UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  criado_em DATETIME NOT NULL,
  expira_em DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX token_hash_UNIQUE (token_hash),
  INDEX fk_sessoes_usuario_idx (id_usuarios),
  CONSTRAINT fk_sessoes_usuario
   FOREIGN KEY (id_usuarios)
    REFERENCES usuarios (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;
