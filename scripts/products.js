// ---------------------------
// products.js (ใช้ใน index.html)
// ---------------------------

const sheetURL = 'https://api.sheetbest.com/sheets/6648eb95-967f-48d5-bdb2-faa07c15426c';

const container = document.getElementById('productContainer');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');

let products = [];
let currentCategory = "all";
let currentSort = "newest"; // default sort by newest

function renderProducts() {
  container.innerHTML = '';
  const searchTerm = searchInput.value.toLowerCase();

  let filtered = products.filter(product => {
    const inCategory = currentCategory === "all" || product.category === currentCategory;
    const inSearch = product.name.toLowerCase().includes(searchTerm);
    return inCategory && inSearch;
  });

  if (currentSort === "newest") {
    filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  } else if (currentSort === "oldest") {
    filtered.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  }

  filtered.forEach(product => {
    const card = document.createElement('a');
    card.href = `product_details.html?name=${encodeURIComponent(product.name)}`;

    card.target = "_blank";
    card.className = "block bg-white rounded-xl shadow hover:shadow-lg overflow-hidden text-center";

    card.innerHTML = `
  <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
  <div class="px-4 py-3">
    <h2 class="text-pink-700 font-semibold text-lg">${product.name}</h2>
    <p class="text-pink-800 text-xl font-extrabold mt-2">฿ ${product.price || '-'}</p>
    <p class="text-sm text-pink-500 mt-1 font-medium">${product.description}</p>
  </div>
`;



    container.appendChild(card);
  });
}

searchInput.addEventListener("input", renderProducts);
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});

// Add sort control (dropdown)
const sortDropdown = document.createElement('select');
sortDropdown.className = "mt-4 px-4 py-2 rounded-full border border-pink-300 text-pink-700 bg-white shadow hover:bg-pink-100";
sortDropdown.innerHTML = `
  <option value="newest">📅 เรียงจากใหม่ล่าสุด</option>
  <option value="oldest">📆 เรียงจากเก่าที่สุด</option>
`;
sortDropdown.addEventListener('change', () => {
  currentSort = sortDropdown.value;
  renderProducts();
});
document.querySelector('.text-center.mt-3')?.appendChild(sortDropdown);

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts();
  })
  .catch(err => {
    console.error("โหลดข้อมูลจาก Google Sheets ไม่สำเร็จ:", err);
  });
