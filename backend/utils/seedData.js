const dotenv  = require('dotenv');
const mongoose = require('mongoose');
const Product  = require('../models/Product');

dotenv.config();

const products = [
  // FOOTWEAR
  { name: 'Classic White Sneakers', description: 'Comfortable everyday sneakers', price: 3500, category: 'footwear', color: 'white', sizes: ['38','39','40','41','42'], stock: 50, tags: ['sneakers','casual','white'], rating: 4.5, numReviews: 120, isFeatured: true, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'] },
  { name: 'Black Leather Boots', description: 'Premium leather boots for all occasions', price: 8500, category: 'footwear', color: 'black', sizes: ['39','40','41','42','43'], stock: 30, tags: ['boots','leather','formal'], rating: 4.7, numReviews: 85, isFeatured: true, images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400'] },
  { name: 'Red Running Shoes', description: 'Lightweight shoes for running and sports', price: 5500, category: 'footwear', color: 'red', sizes: ['38','39','40','41'], stock: 40, tags: ['running','sports','lightweight'], rating: 4.3, numReviews: 65, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'] },
  { name: 'Brown Casual Loafers', description: 'Slip-on loafers perfect for casual outings', price: 4200, category: 'footwear', color: 'brown', sizes: ['39','40','41','42'], stock: 25, tags: ['loafers','casual','slip-on'], rating: 4.1, numReviews: 42, images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400'] },
  { name: 'Blue Flip Flops', description: 'Comfortable summer flip flops', price: 800, category: 'footwear', color: 'blue', sizes: ['38','39','40','41','42'], stock: 100, tags: ['flip-flops','summer','beach'], rating: 3.9, numReviews: 200, images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400'] },

  // CLOTHING
  { name: 'Black Formal Shirt', description: 'Slim fit formal shirt for office and events', price: 2800, category: 'clothing', color: 'black', sizes: ['S','M','L','XL'], stock: 60, tags: ['shirt','formal','office'], rating: 4.4, numReviews: 95, isFeatured: true, images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400'] },
  { name: 'White Cotton Kurta', description: 'Breathable cotton kurta for daily wear', price: 1500, category: 'clothing', color: 'white', sizes: ['S','M','L','XL','XXL'], stock: 80, tags: ['kurta','cotton','daily'], rating: 4.6, numReviews: 180, isFeatured: true, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400'] },
  { name: 'Blue Denim Jacket', description: 'Classic denim jacket for all seasons', price: 4500, category: 'clothing', color: 'blue', sizes: ['S','M','L','XL'], stock: 35, tags: ['jacket','denim','casual'], rating: 4.5, numReviews: 72, images: ['https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400'] },
  { name: 'Green Hoodie', description: 'Warm and cozy hoodie for winter', price: 3200, category: 'clothing', color: 'green', sizes: ['S','M','L','XL'], stock: 45, tags: ['hoodie','winter','warm'], rating: 4.3, numReviews: 110, images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400'] },
  { name: 'Red Polo T-Shirt', description: 'Classic polo t-shirt for casual outings', price: 1800, category: 'clothing', color: 'red', sizes: ['S','M','L','XL','XXL'], stock: 70, tags: ['polo','tshirt','casual'], rating: 4.0, numReviews: 55, images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'] },
  { name: 'Black Winter Coat', description: 'Heavy winter coat for extreme cold', price: 9500, category: 'clothing', color: 'black', sizes: ['S','M','L','XL'], stock: 20, tags: ['coat','winter','heavy'], rating: 4.8, numReviews: 40, isFeatured: true, images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400'] },

  // ACCESSORIES
  { name: 'Brown Leather Wallet', description: 'Genuine leather wallet with card slots', price: 2200, category: 'accessories', color: 'brown', stock: 90, tags: ['wallet','leather','card'], rating: 4.6, numReviews: 220, isFeatured: true, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'] },
  { name: 'Black Sunglasses', description: 'UV400 protection stylish sunglasses', price: 1800, category: 'accessories', color: 'black', stock: 60, tags: ['sunglasses','uv','stylish'], rating: 4.2, numReviews: 88, images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'] },
  { name: 'Silver Watch', description: 'Elegant silver analog watch', price: 12000, category: 'accessories', color: 'silver', stock: 15, tags: ['watch','silver','elegant','formal'], rating: 4.9, numReviews: 150, isFeatured: true, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'] },
  { name: 'Blue Backpack', description: '30L waterproof backpack for travel', price: 3800, category: 'accessories', color: 'blue', stock: 40, tags: ['backpack','travel','waterproof'], rating: 4.4, numReviews: 130, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'] },
  { name: 'Black Belt', description: 'Genuine leather belt for formal wear', price: 1200, category: 'accessories', color: 'black', stock: 75, tags: ['belt','leather','formal'], rating: 4.1, numReviews: 95, images: ['https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=400'] },

  // ELECTRONICS
  { name: 'Wireless Earbuds', description: 'Bluetooth 5.0 earbuds with noise cancellation', price: 8500, category: 'electronics', color: 'white', stock: 55, tags: ['earbuds','wireless','bluetooth','noise-cancellation'], rating: 4.6, numReviews: 340, isFeatured: true, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'] },
  { name: 'Black Laptop Bag', description: '15.6 inch waterproof laptop bag', price: 2500, category: 'electronics', color: 'black', stock: 45, tags: ['laptop','bag','waterproof'], rating: 4.3, numReviews: 175, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'] },
  { name: 'Portable Charger', description: '20000mAh power bank fast charging', price: 3200, category: 'electronics', color: 'black', stock: 80, tags: ['powerbank','charging','portable'], rating: 4.5, numReviews: 260, images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'] },
  { name: 'Smart Watch', description: 'Fitness tracker with heart rate monitor', price: 15000, category: 'electronics', color: 'black', stock: 25, tags: ['smartwatch','fitness','heartrate'], rating: 4.7, numReviews: 195, isFeatured: true, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'] },
  { name: 'Bluetooth Speaker', description: 'Waterproof portable speaker 360 sound', price: 5500, category: 'electronics', color: 'blue', stock: 35, tags: ['speaker','bluetooth','waterproof'], rating: 4.4, numReviews: 142, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'] },

  // SPORTS
  { name: 'Yoga Mat', description: 'Non-slip thick yoga mat with carry strap', price: 2200, category: 'sports', color: 'green', stock: 60, tags: ['yoga','mat','fitness','exercise'], rating: 4.5, numReviews: 210, images: ['https://images.unsplash.com/photo-1601925228843-a12be6b6c0da?w=400'] },
  { name: 'Dumbbell Set 5kg', description: 'Rubber coated dumbbell set for home gym', price: 4500, category: 'sports', color: 'black', stock: 30, tags: ['dumbbell','gym','fitness','weight'], rating: 4.6, numReviews: 88, images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'] },
  { name: 'Sports Water Bottle', description: '1L BPA free sports water bottle', price: 950, category: 'sports', color: 'blue', stock: 120, tags: ['water','bottle','sports','bpa-free'], rating: 4.2, numReviews: 155, images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'] },

  // HOME
  { name: 'Ceramic Coffee Mug', description: 'Large 450ml ceramic coffee mug', price: 650, category: 'home', color: 'white', stock: 150, tags: ['mug','coffee','ceramic','kitchen'], rating: 4.3, numReviews: 320, images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'] },
  { name: 'Scented Candle Set', description: 'Set of 3 lavender scented candles', price: 1800, category: 'home', color: 'white', stock: 70, tags: ['candle','scented','lavender','gift'], rating: 4.7, numReviews: 185, isFeatured: true, images: ['https://images.unsplash.com/photo-1608181831718-c9fca6c01b84?w=400'] },
  { name: 'Desk Organizer', description: 'Bamboo desk organizer with 5 compartments', price: 2100, category: 'home', color: 'brown', stock: 45, tags: ['desk','organizer','bamboo','office'], rating: 4.4, numReviews: 98, images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400'] },

  // BEAUTY
  { name: 'Rose Face Serum', description: 'Hydrating rose extract face serum 30ml', price: 2800, category: 'beauty', color: 'pink', stock: 55, tags: ['serum','rose','face','skincare'], rating: 4.6, numReviews: 275, isFeatured: true, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'] },
  { name: 'Lip Balm Set', description: 'Set of 5 moisturizing lip balms', price: 750, category: 'beauty', color: 'pink', stock: 200, tags: ['lip','balm','moisturizing','set'], rating: 4.4, numReviews: 410, images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=400'] },
  { name: 'Sunscreen SPF 50', description: 'Lightweight sunscreen for daily use', price: 1600, category: 'beauty', color: 'white', stock: 90, tags: ['sunscreen','spf','skincare','daily'], rating: 4.5, numReviews: 330, images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'] },
  { name: 'Perfume Gift Set', description: 'Luxury perfume gift set 3x30ml', price: 6500, category: 'beauty', color: 'brown', stock: 25, tags: ['perfume','gift','luxury','fragrance'], rating: 4.8, numReviews: 160, isFeatured: true, images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=400'] }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Product.deleteMany({});
    console.log('Old products deleted');

    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedProducts();