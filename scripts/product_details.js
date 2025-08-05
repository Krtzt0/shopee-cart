// ---------------------------
// product_details.js
// ---------------------------

const sheetURL = 'https://api.sheetbest.com/sheets/6648eb95-967f-48d5-bdb2-faa07c15426c';
const urlParams = new URLSearchParams(window.location.search);
const productName = decodeURIComponent(urlParams.get('name') || '');

fetch(sheetURL)
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.name === productName);

    if (!product) {
      document.body.innerHTML = '<p class="text-center mt-10 text-red-500">ไม่พบสินค้า</p>';
      return;
    }

    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = product.price + ' บาท';
    document.getElementById('productDescription').textContent = product.description;

    const buyBtn = document.getElementById('buyButton');
    buyBtn.href = product.link;
  })
  .catch(err => {
    console.error("ดึงข้อมูลสินค้าไม่สำเร็จ:", err);
    document.body.innerHTML = '<p class="text-center mt-10 text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า</p>';
  });
  
// สร้างลิงก์แชร์ Facebook จาก URL ปัจจุบัน
const facebookShareBtn = document.getElementById("facebookShare");

const shareURL = window.location.href;
const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;

facebookShareBtn.href = facebookShareURL;
