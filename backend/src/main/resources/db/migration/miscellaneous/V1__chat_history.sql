CREATE TABLE chat_messages
(
    id        BIGINT       PRIMARY KEY,
    sender    VARCHAR(32)  NOT NULL,
    content   VARCHAR(256) NOT NULL,
    timestamp BIGINT       NOT NULL,
    deleted   BOOLEAN      NOT NULL DEFAULT FALSE
);
