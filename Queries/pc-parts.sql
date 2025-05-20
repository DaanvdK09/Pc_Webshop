-- SQLite

-- .tables

SELECT * FROM GPU;

-- Create Table
-- CREATE TABLE IF NOT EXISTS GPU (
      -- id INTEGER PRIMARY KEY AUTOINCREMENT,
      -- name TEXT NOT NULL,
      -- manufacturer TEXT NOT NULL,
      -- price REAL NOT NULL,
      -- memory_size INTEGER NOT NULL,
      -- memory_type TEXT NOT NULL,
      -- core_clock REAL NOT NULL,
      -- boost_clock REAL NOT NULL,
      -- tdp INTEGER NOT NULL,
-- );

-- Add new
-- INSERT INTO GPU (name, manufacturer, price, memory_size, memory_type, core_clock, boost_clock, tdp) VALUES ('RTX 5090', 'NVIDIA', 1899.99, 32, 'GDDR7', 2017, 2407, 575);

-- Remove
-- DELETE FROM GPU WHERE (name, manufacturer, price, memory_size, memory_type, core_clock, boost_clock, tdp) = ('RTX 5090', 'NVIDIA', '1899', '32', 'GDDR7', '1500', '1800', '250');

-- Edit
-- UPDATE GPU SET image_url = https://computercity.com/wp-content/uploads/geforce-rtx-5090-founders-edition-photo-007-transparent-1536x1152.png WHERE id = 1;

-- Add new column
-- ALTER TABLE GPU ADD COLUMN image_url TEXT;