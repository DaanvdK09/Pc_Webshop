-- SQLite
-- To Run: CTRL + SHIFT + Q

-- .tables

SELECT * FROM review;

-- Add new user
-- Note: Passwords have to be hashed before inserting
-- INSERT INTO user (email, username, password) VALUES ('Test@gmail.com', 'Test', 'Test');

-- Remove user
-- DELETE FROM user WHERE (email, username, password) = ('Test@gmail.com', 'Test', 'Test');