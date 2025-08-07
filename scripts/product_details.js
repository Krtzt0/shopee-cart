const sheetURL = 'https://api.sheetbest.com/sheets/6648eb95-967f-48d5-bdb2-faa07c15426c';

// สมมติว่า URL สินค้าเป็น query param ชื่อ id เช่น product_details.html?id=CAMEL_1000W
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

let productData = null;
let currentIndex = 0;

function updateSlide() {
  if (!productData || !productData.images || productData.images.length === 0) return;
  const img = document.getElementById("productImage");
  img.src = productData.images[currentIndex];
  img.alt = productData.name + " รูปที่ " + (currentIndex + 1);
}

function showNext() {
  if (!productData || !productData.images) return;
  currentIndex = (currentIndex + 1) % productData.images.length;
  updateSlide();
}

function showPrev() {
  if (!productData || !productData.images) return;
  currentIndex = (currentIndex - 1 + productData.images.length) % productData.images.length;
  updateSlide();
}

function setupProductDetails() {
  if (!productData) return;
  document.getElementById("productName").textContent = productData.name;
  document.getElementById("productPrice").textContent = productData.price;
  document.getElementById("productDescription").textContent = productData.description;
  document.getElementById("buyButton").href = productData.link;

  // OG meta tags
  document.getElementById("ogTitle").setAttribute("content", `${productData.name} - ราคา ${productData.price}`);
  document.getElementById("ogDesc").setAttribute("content", productData.description);
  document.getElementById("ogImage").setAttribute("content", productData.images[0]);
  document.getElementById("ogURL").setAttribute("content", window.location.href);
  document.title = `${productData.name} - KT-RO Shop`;

  updateSlide();
}

function createSliderControls() {
  const container = document.querySelector(".max-w-xl");

  const controls = document.createElement("div");
  controls.className = "flex justify-center space-x-6 mt-4";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "◀️";
  prevBtn.className = "px-4 py-2 bg-pink-300 rounded-full hover:bg-pink-400 text-white font-bold";
  prevBtn.onclick = showPrev;

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "▶️";
  nextBtn.className = "px-4 py-2 bg-pink-300 rounded-full hover:bg-pink-400 text-white font-bold";
  nextBtn.onclick = showNext;

  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  container.appendChild(controls);
}

async function fetchProductData() {
  try {
    const response = await fetch(sheetURL);
    const data = await response.json();

    const productId = getProductIdFromURL();
    if (!productId) {
      alert("ไม่พบรหัสสินค้าบน URL");
      return;
    }

    // หาข้อมูลสินค้าตาม productId โดยสมมติว่า productId ตรงกับ name หรือ id ใน sheet
    // คุณอาจต้องแก้ตรงนี้ตามโครงสร้าง sheet จริง
    const product = data.find(item => {
      // สมมติว่าชื่อ productId ถูกเก็บในคอลัมน์ name (หรือ id)
      // ทำให้ทั้งสองฝั่งเป็น lowercase และแปลง space เป็น _ เพื่อแมตช์ง่ายขึ้น
      const cleanName = item.name.toLowerCase().replace(/\s+/g, "_");
      return cleanName === productId.toLowerCase();
    });

    if (!product) {
      alert("ไม่พบข้อมูลสินค้าตามรหัสที่ระบุ");
      return;
    }

    // แปลง URL รูปหลายรูป คั่นด้วยคอมม่า เป็น array
    const images = product.image ? product.image.split(",").map(url => url.trim()) : [];

    productData = {
      name: product.name,
      price: product.price,
      description: product.description,
      link: product.link,
      images: images.length > 0 ? images : ["https://via.placeholder.com/400x300?text=No+Image"],
    };

    setupProductDetails();
    createSliderControls();

  } catch (error) {
    console.error("Error fetching product data:", error);
    alert("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
  }
}

// เรียกโหลดข้อมูลเมื่อหน้าพร้อม
window.onload = () => {
  fetchProductData();
};
