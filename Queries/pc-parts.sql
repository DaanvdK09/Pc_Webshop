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
-- INSERT INTO GPU (id, name, manufacturer, price, memory_size, memory_type, core_clock, boost_clock, tdp, image_url) VALUES
      -- ('2', 'RTX 5080', 'NVIDIA', 1129.99, 16, 'GDDR7', 2300, 2620, 360, 'https://assets.nvidia.partners/images/png/RTX5080-3QTR-Back-Left-small.png'),
      -- ('3', 'RTX 5070 Ti', 'NVIDIA', 889.99, 16, 'GDDR7', 2300, 2450, 300, 'https://ucarecdn.com/1f969b9d-d012-4131-b02b-825c199ed1e0/-/format/auto/-/preview/3000x3000/-/quality/lighter/RTX5070.png'),
      -- ('4', 'RTX 5070', 'NVIDIA', 629.99, 12, 'GDDR7', 2330, 2510, 250, 'https://ucarecdn.com/1f969b9d-d012-4131-b02b-825c199ed1e0/-/format/auto/-/preview/3000x3000/-/quality/lighter/RTX5070.png'),
      -- ('5', 'RTX 5060 Ti', 'NVIDIA', 489, 16, 'GDDR7', 2410, 2602, 180, 'https://tweakers.net/i/8ZNdG1qoKHIWIueLVeomFZ1Q7uY=/fit-in/374x326/filters:fill(white):strip_exif()/i/2007406302.png?f=imagemediumplus');
      -- expected ('6', 'RTX 5060', 'NVIDIA', ?€, 8, 'GDDR7', 2280, 2500, 145, ''),
      -- ('7', 'RTX 4090', 'NVIDIA', 1779.99, 24, 'GDDR6X', 2230, 2520, 450, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/news/rtx-40-series-graphics-cards-announcements/geforce-rtx-4090-product-photo-001.png'),
      -- ('8', 'RTX 4080 Super', 'NVIDIA', 1119.99, 16, 'GDDR6X', 2290, 2550, 320, 'https://assetsio.gnwcdn.com/4080-super.jpg?width=690&quality=70&format=jpg&dpr=2&auto=webp'),
      -- ('9', 'RTX 4080', 'NVIDIA', 1149.99, 16, 'GDDR6X', 2210, 2510, 320, 'https://www.createpcs.co.uk/wp-content/uploads/2023/07/nvidia-4080-gpu-new.png'),
      -- ('10', 'RTX 4070 Ti Super', 'NVIDIA', 899.99, 16, 'GDDR6X', 2340, 2610, 285, 'https://assets.nvidia.partners/images/png/GeForce_RTX_4070_Ti_SUPER_16G_EXPERT_series_boxcard.png'),
      -- ('11', 'RTX 4070 Super', 'NVIDIA', 689.99, 12, 'GDDR6X', 1980, 2480, 220, 'https://www.notebookcheck.nl/fileadmin/_processed_/9/7/csm_GeForce-RTX-4070-SUPER-Image_702a9355f3.jpg'),
      -- ('12', 'RTX 4070', 'NVIDIA', 609.99, 12, 'GDDR6X', 1920, 2480, 200, 'https://cdna.pcpartpicker.com/static/forever/images/product/8258cfebf744bbf8e9d175944093d490.256p.jpg'),
      -- ('13', 'RTX 4060 Ti', 'NVIDIA', 459.99, 16, 'GDDR6', 2310, 2540, 165, 'https://assets.nvidia.partners/images/png/GeForce-ADA-RTX4060Ti-Back.png'),
      -- ('14', 'RTX 4060', 'NVIDIA', 329.99, 8, 'GDDR6', 1830, 2460, 115, 'https://oc3dmedia.s3.eu-west-2.amazonaws.com/2023/07/nvidia-rtx-4060-3dmark-benchmark-scores-leak-23-faster-than-a-12gb-rtx-3060-on-average_64c2ad847eace.jpeg');

-- Remove
-- DELETE FROM GPU WHERE (name, manufacturer, price, memory_size, memory_type, core_clock, boost_clock, tdp) = ('RTX 5090', 'NVIDIA', '1899', '32', 'GDDR7', '1500', '1800', '250');

-- Edit
-- UPDATE GPU SET boost_clock ='2602' WHERE id = 5;

-- Add new column
-- ALTER TABLE GPU ADD COLUMN image_url TEXT;