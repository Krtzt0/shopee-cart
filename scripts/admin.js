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
