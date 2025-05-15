-- SQLite
-- To Run: CTRL + SHIFT + Q

-- .tables
SELECT * FROM user;

-- Add new user
-- Note: Password is hashed using bcrypt, Hash in Hash.py
-- INSERT INTO user (username, password) VALUES ('Test', '$2b$12$ApCjAHEJFcQhuzB9.qYPyeGBeQQyQXRq58G5XBBd1M/pSVJUQHkg');

-- Remove user
-- FROM user WHERE (username = 'Test' AND password = '$2b$12$ApCjAHEJFcQhuzB9.qYPyeGBeQQyQXRq58G5XBBd1M/pSVJUQHkg');