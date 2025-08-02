// Elementler
const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const websiteName = document.getElementById('website-name');
const websiteUrl = document.getElementById('website-url');
const websiteTag = document.getElementById('website-tag');
const editIndex = document.getElementById('edit-index');
const backlinksContainer = document.getElementById('backlinks-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const backLinkForm = document.getElementById('backlink-form');
const modalTitle = document.getElementById('modal-title');

// Veriler
let backlinks = [];

// Modal aç
function showModal() {
  modal.classList.add('show-modal');
  modalTitle.textContent = "Backlink Ekle";
  backLinkForm.reset();
  editIndex.value = '';
  websiteName.focus();
}

// Modal kapat
function closeModal() {
  modal.classList.remove('show-modal');
}

// URL doğrulama
function validate(nameValue, urlValue, tagValue) {
  const regex = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.+)?$/;

  if (!nameValue || !urlValue || !tagValue) {
    alert('Lütfen tüm alanları doldurun!');
    return false;
  }

  if (!urlValue.match(regex)) {
    alert('Geçerli bir URL girin!');
    return false;
  }

  return true;
}

// Backlink sil
function deleteBacklink(index) {
  backlinks.splice(index, 1);
  saveAndRender();
}

// Backlink düzenle
function editBacklink(index) {
  const { name, url, tag } = backlinks[index];
  websiteName.value = name;
  websiteUrl.value = url;
  websiteTag.value = tag;
  editIndex.value = index;
  modalTitle.textContent = "Backlink Düzenle";
  modal.classList.add('show-modal');
}

// Backlink görüntüleme
function buildBackLinks(filtered = backlinks) {
  backlinksContainer.innerHTML = '';

  filtered.forEach((item, i) => {
    const { name, url, tag, clicks = 0 } = item;

    const card = document.createElement('div');
    card.classList.add('item');

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = name;

    a.onclick = () => {
      backlinks[i].clicks = (backlinks[i].clicks || 0) + 1;
      saveAndRender();
    };

    const tagEl = document.createElement('div');
    tagEl.className = 'tag';
    tagEl.textContent = tag;

    const counter = document.createElement('div');
    counter.className = 'counter';
    counter.textContent = `Tıklanma: ${clicks}`;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const delBtn = document.createElement('i');
    delBtn.className = 'fas fa-times';
    delBtn.title = "Sil";
    delBtn.onclick = () => deleteBacklink(i);

    const editBtn = document.createElement('i');
    editBtn.className = 'fas fa-edit';
    editBtn.title = "Düzenle";
    editBtn.onclick = () => editBacklink(i);

    actions.append(editBtn, delBtn);
    nameEl.appendChild(a);
    card.append(actions, nameEl, tagEl, counter);
    backlinksContainer.appendChild(card);
  });
}

// Backlink kaydet (yeni/düzenle)
function storeBackLink(e) {
  e.preventDefault();
  const nameValue = websiteName.value.trim();
  let urlValue = websiteUrl.value.trim();
  const tagValue = websiteTag.value;

  if (!urlValue.startsWith('http')) {
    urlValue = 'https://' + urlValue;
  }

  if (!validate(nameValue, urlValue, tagValue)) return;

  const backlink = {
    name: nameValue,
    url: urlValue,
    tag: tagValue,
    clicks: 0
  };

  if (editIndex.value !== '') {
    backlinks[editIndex.value] = { ...backlink, clicks: backlinks[editIndex.value].clicks || 0 };
  } else {
    backlinks.push(backlink);
  }

  closeModal();
  saveAndRender();
}

// LocalStorage kaydet + render
function saveAndRender() {
  localStorage.setItem('backlinks', JSON.stringify(backlinks));
  applyFilters();
}

// Backlinkleri yükle
function loadBacklinks() {
  const stored = localStorage.getItem('backlinks');
  backlinks = stored ? JSON.parse(stored) : [];
  applyFilters();
}

// Arama + Filtre uygulama
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = backlinks.filter(item => {
    const matchesText = item.name.toLowerCase().includes(searchText);
    const matchesCategory = selectedCategory === 'all' || item.tag === selectedCategory;
    return matchesText && matchesCategory;
  });

  buildBackLinks(filtered);
}

// Eventler
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', closeModal);
backLinkForm.addEventListener('submit', storeBackLink);
searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);

// İlk yükleme
loadBacklinks();
