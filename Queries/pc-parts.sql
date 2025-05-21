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

-- Add new item
-- INSERT INTO GPU (name, manufacturer, price, memory_size, memory_type, core_clock, boost_clock, tdp) VALUES
-- ('RTX 5080', 'NVIDIA', 1129.99, 32, 'GDDR7', 1500, 1800, 250),
-- ('RTX 5070', 'NVIDIA', 629.99, 16, 'GDDR6X', 1500, 1800, 250),
-- ('RTX 5070 Ti', 'NVIDIA', 889.99, 16, 'GDDR6X', 1800, 2100, 300),
-- ('RTX 5060 Ti', 'NVIDIA', 479.99, 8, 'GDDR6', 1800, 2100, 200),
-- ('RTX 4060', 'NVIDIA', 499.99, 8, 'GDDR6', 1830, 2460, 115),
-- ('RTX 4060 Ti', 'NVIDIA', 399.99, 8, 'GDDR6', 2535, 2760, 160),
-- ('RTX 4070', 'NVIDIA', 609.99, 12, 'GDDR6X', 1920, 2475, 200),
-- ('RTX 4070 Super', 'NVIDIA', 689.99, 12, 'GDDR6X', 2310, 2610, 285),
-- ('RTX 4070 Ti Super', 'NVIDIA', 899.99, 12, 'GDDR6X', 1920, 2475, 200),
-- ('RTX 4080', 'NVIDIA', 1149.99, 16, 'GDDR6X', 2205, 2505, 320),
-- ('RTX 4090', 'NVIDIA', 1599.99, 24, 'GDDR6X', 2235, 2520, 450);

-- Remove
-- DELETE FROM GPU WHERE (name, manufacturer, price, memory_size, memory_type, core_clock, boost_clock, tdp) = ('RTX 5090', 'NVIDIA', '1899', '32', 'GDDR7', '1500', '1800', '250');

-- Edit
-- UPDATE GPU SET image_url = 'https://computercity.com/wp-content/uploads/geforce-rtx-5090-founders-edition-photo-007-transparent-1536x1152.png' WHERE id = 1;

-- Add new column
-- ALTER TABLE GPU ADD COLUMN image_url TEXT;