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
