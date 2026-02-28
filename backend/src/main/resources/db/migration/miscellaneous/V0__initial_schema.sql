CREATE TABLE users
(
    username      VARCHAR(32) PRIMARY KEY, -- must be lowercase
    display_name  VARCHAR(32),             -- must be identical to username except for capitalization
    password_hash VARCHAR(128),
    messages_sent INT,
    created       DATE DEFAULT now(),
    last_seen     DATE DEFAULT now()
);

CREATE OR REPLACE FUNCTION validate_user()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.username := LOWER(NEW.username);

    IF LOWER(NEW.display_name) != LOWER(NEW.username) THEN
        RAISE EXCEPTION 'Display name must match username (case-insensitive), got: % and %', NEW.display_name, NEW.username;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER validate_user_trigger
    BEFORE INSERT OR UPDATE
    ON users
    FOR EACH ROW
EXECUTE FUNCTION validate_user();
