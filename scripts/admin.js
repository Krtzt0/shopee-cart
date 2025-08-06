// ---------------------------
// admin.js (ใช้ใน admin.html)
// ---------------------------

const sheetURL = 'https://api.sheetbest.com/sheets/6648eb95-967f-48d5-bdb2-faa07c15426c';
const imgbbAPIKey = "000fd7ca2c8ea163c03a09915386af74"; // 👈 เปลี่ยนเป็น API Key ของคุณ

const form = document.getElementById('addProductForm');
const imageFileInput = document.getElementById('imageFile');
const imagePreview = document.getElementById('imagePreview');
const imageURLField = document.getElementById('imageURL');

let uploadedImageURL = "";

// ✅ แสดงรูป preview ทันทีเมื่อเลือก และอัปโหลดขึ้น imgbb
imageFileInput.addEventListener('change', async function () {
  const file = this.files[0];
  if (!file) return;

  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove('hidden');

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data && data.data && data.data.url) {
      uploadedImageURL = data.data.url;
      imageURLField.value = uploadedImageURL;
    } else {
      alert("อัปโหลดภาพไม่สำเร็จ");
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลดภาพ:", err);
    alert("ไม่สามารถอัปโหลดภาพได้");
  }
});

document.getElementById("generateStatic").addEventListener("click", async () => {
  const name = form.name.value.trim();
  const imageUrl = document.getElementById("imageURL").value;
  const description = form.description.value.trim();
  const category = form.category.value.trim();
  const link = form.link.value.trim();
  const price = form.price?.value?.trim() || "ไม่ระบุ";
  const date = new Date().toISOString().split("T")[0];

  const fileName = name.toLowerCase().replace(/\s+/g, "_") + ".html";

  const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} - KT-RO Shop</title>

  <meta property="og:title" content="${name} - ราคา ${price} บาท">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="">

  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
</head>
<body class="bg-pink-50 min-h-screen flex flex-col items-center px-4 py-10">
  <div class="max-w-xl w-full bg-white p-6 rounded-3xl shadow-xl border-4 border-pink-200 text-center">
    <img src="${imageUrl}" alt="${name}" class="w-full h-64 object-cover rounded-xl shadow mb-4" />
    <h1 class="text-2xl font-bold text-pink-700 mb-2">${name}</h1>
    <p class="text-2xl text-pink-500 font-extrabold mb-2">${price} บาท</p>
    <p class="text-gray-700 mb-4">${description}</p>
    <a href="${link}" target="_blank" class="block text-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full text-lg font-semibold transition">
      🛒 สั่งซื้อผ่าน Shopee
    </a>
    <div class="mt-6">
      <h2 class="text-lg font-semibold text-pink-600 mb-2">แชร์สินค้า</h2>
      <div class="flex justify-center space-x-4 text-pink-500 text-2xl">
        <a href="https://www.facebook.com/sharer/sharer.php?u=" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
      </div>
    </div>
  </div>
</body>
</html>
`;

  // บันทึก HTML
  const blob = new Blob([htmlContent], { type: "text/html" });
  const linkDownload = document.createElement("a");
  linkDownload.href = URL.createObjectURL(blob);
  linkDownload.download = fileName;
  linkDownload.click();

  // ดาวน์โหลดรูปแยก
  const imageRes = await fetch(imageUrl);
  const imageBlob = await imageRes.blob();
  const imageName = fileName.replace(".html", ".jpg");

  const imageLink = document.createElement("a");
  imageLink.href = URL.createObjectURL(imageBlob);
  imageLink.download = imageName;
  imageLink.click();

  alert("✅ แปลงเสร็จแล้ว! HTML และรูปถูกดาวน์โหลดเรียบร้อย");
});


// ✅ ส่งฟอร์ม
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // ป้องกันส่งโดยไม่อัปโหลดรูป
  if (!uploadedImageURL) {
    alert("กรุณาเลือกรูปภาพและรอให้อัปโหลดเสร็จก่อน");
    return;
  }

  const name = form.name.value.trim();
  const price = form.price.value.trim(); // ✅ เพิ่มช่องราคา
  const image = uploadedImageURL;
  const description = form.description.value.trim();
  const category = form.category.value.trim();
  const link = form.link.value.trim();
  const date = new Date().toISOString();

  const newProduct = { name, price, image, description, category, link, date };

  try {
    const res = await fetch(sheetURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    });

    const data = await res.json();
    console.log("เพิ่มสินค้า:", data);

    alert("เพิ่มสินค้าเรียบร้อยแล้ว!");
    form.reset(); // ล้างฟอร์ม
    uploadedImageURL = "";
    imagePreview.classList.add('hidden');
  } catch (err) {
    console.error("เพิ่มสินค้าไม่สำเร็จ:", err);
    alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
  }
});

// ✅ รีเซ็ตฟอร์มเมื่อโหลดหน้า
window.addEventListener('load', () => {
  if (form) form.reset();
  if (imagePreview) imagePreview.classList.add('hidden');
});
