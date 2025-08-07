const sheetURL = 'https://api.sheetbest.com/sheets/6648eb95-967f-48d5-bdb2-faa07c15426c';

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
  img.alt = `${productData.name} รูปที่ ${currentIndex + 1}`;
}

function setupImageGallery() {
  const gallery = document.getElementById("imageGallery");
  gallery.innerHTML = "";

  productData.images.forEach((url, index) => {
    const thumb = document.createElement("img");
    thumb.src = url;
    thumb.alt = `รูปที่ ${index + 1}`;
    thumb.className = "w-16 h-16 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-pink-400";
    
    thumb.onclick = () => {
      currentIndex = index;
      updateSlide();
    };

    gallery.appendChild(thumb);
  });
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
  setupImageGallery();
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

    const product = data.find(item => {
      const cleanName = (item.name || "").toLowerCase().replace(/\s+/g, "_");
      return cleanName === productId.toLowerCase();
    });

    if (!product) {
      alert("ไม่พบข้อมูลสินค้าตามรหัสที่ระบุ");
      return;
    }

    const images = product.image ? product.image.split(",").map(url => url.trim()) : [];

    productData = {
      name: product.name,
      price: product.price,
      description: product.description,
      link: product.link,
      images: images.length > 0 ? images : ["https://via.placeholder.com/400x300?text=No+Image"],
    };

    setupProductDetails();

  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    alert("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
  }
}

window.onload = () => {
  fetchProductData();
};
