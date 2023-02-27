//? json-server -w db.json -p 8000   zapusk db - terminal

//? eto API dlya zaprosov
const API = "http://localhost:8000/products";
//? blok kuda  my dobav kartochki
const list = document.querySelector("#products-list");
//? forma s inputami dlya vvoda dannyh
const addForm = document.querySelector("#add-form");
const titleInp = document.querySelector("#title");
const priceInp = document.querySelector("#price");
const descriptionInp = document.querySelector("#description");
const imageInp = document.querySelector("#image");

const searchInput = document.querySelector('#search');
let searchVal="";
const paginationList = document.querySelector(".pagination-List")
const prev =document.querySelector(".prev")
const next = document.querySelector(".next")
const limit = 3;
let currentPage =1;
let pageTotalCount =1;
//? inp i knopki iz  modalki
const editTitleInp = document.querySelector("#edit-title");
const editPriceInp = document.querySelector("#edit-price");
const editDescriptionInp = document.querySelector("#edit-descr");
const editImageInp = document.querySelector("#edit-image");
const editSaveBtn = document.querySelector("#btn-save-edit");

//? pervonachalnoe zagrujenie dannyh
getProducts();

//? styagivaem dannye s servera
async function getProducts() {
  const res = await fetch(`${API}?title_like=${searchVal}&_limit=$
  {limit}&_page=${currentPage}`);
  const count = res.headers.get("x-total-count");
  pageTotalCount = Math.ceil(count/limit);

  const data = await res.json(); //? Rasshrivrovka dannyh
  //? otobrajaem aktualnye dannye
  render(data);
}
//? funkciya dlya dobavleniya db json
async function addProducts(products) {
  await fetch(API, {
    //? await dlya togo chtoby  func getProducts podojdala poka dannye dobavyatsya
    method: "POST",
    body: JSON.stringify(products),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getProducts(); // styanut i otobrazit aktualnye dannye
}
//?func dlya udaleniya db.json
async function deleteProduct(id) {
  // await dlya togo chtoby getProduct podojdal
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  getProducts();
}

//? func dlya polucheniya odnogo producta
async function getOneProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json(); //rasshivrovka dannyh
  return data; //? vozv product s db.json
}

//? func dlya izm dannyh
async function editProduct(id, editProduct) {
  console.log(id);
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getProducts();
}
//? otobrajaem na stranice
function render(arr) {
  //? ochiwaem chtoby kartochki ne dublirovalis
  list.innerHTML = "";
  arr.forEach((item) => {
    list.innerHTML += `
       <div class="card m-5" style="width: 18rem;">
       <img src="${item.image}" class="card-img-top" alt="...">
       <div class="card-body">
         <h5 class="card-title">${item.title}</h5>
         <p class="card-text">${item.description.slice(0, 70)}...</p>
         <p class="card-text">$ ${item.price}</p>
         <button id ="${
           item.id
         }" class="btn btn-danger btn-delete ">delete</button>
         <button data-bs-toggle="modal" data-bs-target ="#exampleModal" id="${
           item.id
         }" class="btn btn-dark btn-edit">EDIT</button>
       </div>
     </div>
       `;
  });
  renderpagination();
}
//? obrabotchik sobytiya dlya dobavleniya(Create)
addForm.addEventListener("submit", (e) => {
  //? chtoby stranica ne perezagrujalas
  console.log("fdss");
  if (
    //? proverka na zapolnennost polei
    !titleInp.value.trim() ||
    !priceInp.value.trim() ||
    !descriptionInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert("Zapolnite vse polya");
    return;
  }
  //? sozdaem ob'ekt dlya dobav v db.json
  const product = {
    title: titleInp.value,
    price: priceInp.value,
    description: descriptionInp.value,
    image: imageInp.value,
  };
  console.log(product);
  //? otprav obj v db.json
  addProducts(product);

  //? ochishaem inputy
  titleInp.value = "";
  priceInp.value = "";
  descriptionInp.value = "";
  imageInp.value = "";
});

//? obrabotchik sobytiya dlya udaleniya  (DELETE)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    deleteProduct(e.target.id);
  }
});
// peremennya dlya sohraneniya id producta na kotoryi my njali
let id = null;
//? obrabotchik sobytiya na otkritie izapolneniya modalki
document.addEventListener("click", async (e) => {
  console.log(e.target.classList);
  if (e.target.classList.contains("btn-edit")) {
    //? sohr id producta
    id = e.target.id;
    //? poluchaem obj produkta na kotoryi my najali
    //? postavili await potomu chto getOneProduct assinhronnaya producciya
    const product = await getOneProduct(e.target.id);
    console.log(product);

    //? zapolnyaem inputy dannymi producta
    editTitleInp.value = product.title;
    editPriceInp.value = product.price;
    editDescriptionInp.value = product.description;
    editImageInp.value = product.image;
  }
});

//? obrabotchik sobytiya na sphranenie dannyh
editSaveBtn.addEventListener("click", () => {
  //? proverka na pustotu inputov
  if (
    !editTitleInp.value.trim() ||
    !editPriceInp.value.trim() ||
    !editDescriptionInp.value.trim() ||
    !editImageInp.value.trim()
  ) {
    alert("zapolnite vse polya");
    //? esli hotya by odin inp pustoi, vyvodim preduprejdenie i ostanavlivaem
    return;
  }

  //? sobiraem izmenennyi obj dlya izmeneniya producta
  const editedProduct = {
    title: editTitleInp.value,
    price: editPriceInp.value,
    description: editDescriptionInp.value,
    image: editImageInp.value,
  };

  //? vyzyvaem func dlya  izmemeniya
  editProduct(id, editedProduct);
});
searchInput.addEventListener("input",()=>{
    searchVal = searchInput.value;
    getProducts();

});
function renderpagination(){
    paginationList.innerHTML="";
    for ( let i =1; i<=pageTotalCount; i++){
paginationList.innerHTML += `<li class="page-item ${currentPage == i ? 'active' : ''}">
<button class="page-link page_number">${i}</button>
</li>`

    }
    if(currentPage ==1){
        prev.classList.add("disabled");
        } else{
                prev.classList.remove("disabled");

            }
        if (currentPage == pageTotalCount){
            next.classList.add("disabled");
        }else{
            next.classList.remove("disabled");
        }
    
}
document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("page_number"))
    {
        currentPage = e.target.innertext;
        getProducts();
    }
});
next.addEventListener("click",()=>{
    if(currentPage == pageTotalCount){
        return;
    }
    currentPage ++;
    getProducts();
});
prev.addEventListener("click",()=>{
    if(currentPage ==1){
        return;

    }
    currentPage--;
    getProducts();
})