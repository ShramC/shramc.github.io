import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ====== НАСТРОЙКА FIREBASE ======
// Замени на свои данные из Firebase Console
// 1. Создай проект: https://console.firebase.google.com
// 2. Включи Authentication (анонимный вход)
// 3. Создай Firestore Database
// 4. Создай Storage Bucket
// 5. Скопируй конфиг сюда:
const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "твой-проект.firebaseapp.com",
  projectId: "твой-проект",
  storageBucket: "твой-проект.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const postsRef = collection(db, "posts");

// ====== ЭЛЕМЕНТЫ ======
const form = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalDesc = document.getElementById("modalDesc");
const modalDate = document.getElementById("modalDate");
const closeModal = document.getElementById("closeModal");

// ====== ПРЕВЬЮ ФОТО ======
let base64Photo = null;

photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5000000) {
    alert("Файл слишком большой (макс 5 МБ)");
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    base64Photo = ev.target.result;
    preview.src = base64Photo;
    preview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

// ====== ОТПРАВКА ФОРМЫ ======
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name || !description) return;

  const btn = form.querySelector("button[type='submit']");
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = "ЗАГРУЗКА...";
  btn.querySelector('.btn-icon').textContent = "⏳";

  try {
    let photoURL = null;

    if (base64Photo) {
      const fileName = `posts/${Date.now()}_${name.replace(/\s+/g, "_")}`;
      const fileRef = ref(storage, fileName);
      await uploadString(fileRef, base64Photo, "data_url");
      photoURL = await getDownloadURL(fileRef);
    }

    await addDoc(postsRef, {
      name,
      description,
      photoURL,
      createdAt: new Date().toISOString()
    });

    form.reset();
    preview.classList.add("hidden");
    base64Photo = null;
  } catch (err) {
    alert("Ошибка: " + err.message);
  } finally {
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = "ОПОЗОРИТЬ";
    btn.querySelector('.btn-icon').textContent = "🔥";
  }
});

// ====== РЕАЛЬНОЕ ВРЕМЯ (СЛУШАЕМ БД) ======
const q = query(postsRef, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  postsContainer.innerHTML = "";

  if (snapshot.empty) {
    postsContainer.innerHTML = '<div class="empty-msg">Пока пусто. Будь первым!</div>';
    return;
  }

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement("div");
    card.className = "post-card";

    const date = new Date(data.createdAt).toLocaleString("ru-RU");

    card.innerHTML = `
      ${data.photoURL
        ? `<img src="${data.photoURL}" alt="${data.name}">`
        : `<div class="no-photo">🚫</div>`
      }
      <div class="card-body">
        <h3>${escapeHtml(data.name)}</h3>
        <p>${escapeHtml(data.description)}</p>
        <span class="date">${date}</span>
      </div>
      <button class="delete-btn" title="Удалить">&times;</button>
    `;

    // Клик по карточке — открыть модалку
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      openModal(data);
    });

    // Удаление
    card.querySelector(".delete-btn").addEventListener("click", async () => {
      if (confirm("Удалить эту запись?")) {
        await deleteDoc(doc(db, "posts", id));
      }
    });

    postsContainer.appendChild(card);
  });
});

// ====== МОДАЛКА ======
function openModal(data) {
  if (data.photoURL) {
    modalImg.src = data.photoURL;
    modalImg.classList.remove("hidden");
  } else {
    modalImg.classList.add("hidden");
  }
  modalName.textContent = data.name;
  modalDesc.textContent = data.description;
  modalDate.textContent = new Date(data.createdAt).toLocaleString("ru-RU");
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.classList.add("hidden");
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
