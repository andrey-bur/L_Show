import {Header} from "./src/components/header/index";
const app=document.getElementById("body")
if(app){
    const header=new Header();
    header.mount(app);
}
else {
    alert("что-то пошло не так" );
}