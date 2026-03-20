function openModal(){
document.getElementById("editModal").classList.add("show")
}

function closeModal(){
document.getElementById("editModal").classList.remove("show")
}

function togglePassword(){

const block = document.getElementById("passwordFields")

if(block.style.display === "block"){
block.style.display = "none"
}else{
block.style.display = "block"
}

}

document.getElementById("editForm").addEventListener("submit",function(e){

e.preventDefault()

const oldPass = document.getElementById("oldPassword").value

if(oldPass === ""){
alert("Введите старый пароль")
return
}

const newPass = document.getElementById("newPassword").value
const confirmPass = document.getElementById("confirmPassword").value

if(newPass !== "" || confirmPass !== ""){

if(newPass !== confirmPass){
alert("Пароли не совпадают")
return
}

alert("Пароль успешно изменён")

}

const name = document.getElementById("editName").value
const surname = document.getElementById("editSurname").value
const email = document.getElementById("editEmail").value
const phone = document.getElementById("editPhone").value

document.getElementById("profileName").innerText = name + " " + surname
document.getElementById("profileEmail").innerText = email

document.getElementById("infoName").innerText = name
document.getElementById("infoSurname").innerText = surname
document.getElementById("infoEmail").innerText = email
document.getElementById("infoPhone").innerText = phone

closeModal()

})