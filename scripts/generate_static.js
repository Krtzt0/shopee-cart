// ต้องติดตั้ง node-fetch กับ fs/promises ก่อน
// npm install node-fetch@2

//รัน node scripts/generate_static.js


const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const sheetURL = 'https://api.sheetbest.com/sheets/6648eb95-967f-48d5-bdb2-faa07c15426c'; // แก้เป็นของคุณ

async function fetchProducts() {
  const res = await fetch(sheetURL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();
  return data; // Array ของสินค้า
}

function sanitizeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function generateProductHTML(product) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${product.name} - KT-RO Shop</title>
  <meta property="og:title" content="${product.name} - ราคา ${product.price} บาท" />
  <meta property="og:description" content="${product.description}" />
  <meta property="og:image" content="${product.image}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://krtzt0.github.io/shopee-cart/${sanitizeFilename(product.name)}.html" />
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
</head>
<body class="bg-pink-50 min-h-screen flex flex-col items-center px-4 py-10">
  <div class="max-w-xl w-full bg-white p-6 rounded-3xl shadow-xl border-4 border-pink-200 text-center">
    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover rounded-xl shadow mb-4" />
    <h1 class="text-2xl font-bold text-pink-700 mb-2">${product.name}</h1>
    <p class="text-2xl text-pink-500 font-extrabold mb-2">${product.price} บาท</p>
    <p class="text-gray-700 mb-4">${product.description}</p>
    <a href="${product.link}" target="_blank" class="block text-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full text-lg font-semibold transition">
      🛒 สั่งซื้อผ่าน Shopee
    </a>
    <div class="mt-6">
      <h2 class="text-lg font-semibold text-pink-600 mb-2">แชร์สินค้า</h2>
      <div class="flex justify-center space-x-4 text-pink-500 text-2xl">
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://yourdomain.com/products/${sanitizeFilename(product.name)}.html" target="_blank" aria-label="Facebook">
          <i class="fab fa-facebook"></i> แชร์ Facebook
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateIndexHTML(products) {
  const links = products.map(p => {
    const file = sanitizeFilename(p.name) + '.html';
    return `<a href="products/${file}" class="block bg-white border border-pink-300 hover:bg-pink-100 p-4 rounded shadow mb-2" target="_blank">${p.name} - ${p.price} บาท</a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>รายการสินค้า KT-RO Shop</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
</head>
<body class="bg-pink-50 p-6">
  <h1 class="text-3xl font-bold text-pink-700 mb-6 text-center">📦 รายการสินค้า KT-RO Shop</h1>
  <div class="max-w-xl mx-auto">
    ${links}
  </div>
</body>
</html>`;
}

async function run() {
  try {
    const products = await fetchProducts();
    await fs.mkdir('products', { recursive: true });

    for (const product of products) {
      const fileName = sanitizeFilename(product.name) + '.html';
      const content = generateProductHTML(product);
      await fs.writeFile(path.join('products', fileName), content, 'utf-8');
      console.log(`สร้างไฟล์ products/${fileName} เรียบร้อย`);
    }

    const indexContent = generateIndexHTML(products);
    await fs.writeFile('index.html', indexContent, 'utf-8');
    console.log('สร้างไฟล์ index.html เรียบร้อย');

  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  }
}

run();
