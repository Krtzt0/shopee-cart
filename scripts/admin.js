// ---------------------------
// admin.js (ใช้ใน admin.html)
// ---------------------------

const sheetURL = 'https://api.sheetbest.com/sheets/6648eb95-967f-48d5-bdb2-faa07c15426c';

const form = document.getElementById('addProductForm');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const image = form.image.value.trim();
    const description = form.description.value.trim();
    const category = form.category.value.trim();
    const link = form.link.value.trim();
    const date = new Date().toISOString();

    const newProduct = { name, image, description, category, link, date };

    fetch(sheetURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    })
    .then(res => {
      console.log('Status:', res.status, res.statusText);
      return res.json();
    })
    .then(data => {
      console.log('Response data:', data);
      alert("เพิ่มสินค้าเรียบร้อยแล้ว!");
      form.reset();
    })
    .catch(err => {
      console.error("เพิ่มสินค้าไม่สำเร็จ:", err);
      alert("เกิดข้อผลในการเพิ่มสินค้า");
    });
  });
}

const imageFileInput = document.getElementById('imageFile');
const imagePreview = document.getElementById('imagePreview');
const imageURLField = document.getElementById('imageURL');

// ✅ แสดงรูป preview ทันทีเมื่อเลือก
imageFileInput.addEventListener('change', async function () {
  const file = this.files[0];
  if (!file) return;

  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove('hidden');

  const formData = new FormData();
  formData.append("image", file);

  // 👇 ใส่ API Key จาก imgbb
  const apiKey = "000fd7ca2c8ea163c03a09915386af74";

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  if (data && data.data && data.data.url) {
    imageURLField.value = data.data.url; // ใส่ URL ไปในช่องซ่อน
  } else {
    alert("อัปโหลดภาพไม่สำเร็จ");
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = form.name.value.trim();
  const image = form.image.value.trim();
  const description = form.description.value.trim();
  const category = form.category.value.trim();
  const link = form.link.value.trim();
  const date = new Date().toISOString();

  const newProduct = { name, image, description, category, link, date };

  fetch(sheetURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct)
  })
  .then(res => res.json())
  .then(data => {
    alert("เพิ่มสินค้าเรียบร้อยแล้ว!");


    
    form.reset(); // ✅ ล้างข้อมูลหลังส่ง
    if (document.getElementById('imagePreview')) {
      document.getElementById('imagePreview').classList.add('hidden');
    }
  })
  .catch(err => {
    console.error("เพิ่มสินค้าไม่สำเร็จ:", err);
    alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
  });
});





// ✅ ไว้ใต้สุด
window.addEventListener('load', () => {
  if (form) form.reset(); // ✅ รีเซ็ตฟอร์มตอนโหลดหน้าใหม่
});
