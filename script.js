const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-LengthNumber]");
const passworddisplay = document.querySelector("[data-passwordDisplay]");
const copymsg = document.querySelector("[data-copymsg]");
const copybutton = document.querySelector("[data-copy]");
const indicator = document.querySelector("[data-indicator]");
const generatebutton = document.querySelector(".GenerateButton");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberscheck = document.querySelector("#numbers");
const symbolscheck = document.querySelector("#symbols");
const allcheckboxes = document.querySelectorAll("input[type=checkbox]");
const symbols = "#$%&'()*+,-./:;<=>?@[\]^_`{|}~"

let password = "";
let passwordLength = 10;
let checkcount = 1 ;
handleSlider();

setIndicator("#ccc");


// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
      ((passwordLength - min) * 100) / (max - min) + "% 100%";
  }

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =` 0px 0px 12px 1px ${color}`;
}


function getRndNumber(min,max){
    // math.floor -> roundfigure the value
    // math.randow -> give value b/w 0 to 1
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber(){
    return getRndNumber(0,9);
}

function generateLowercase(){
    // String.fromCharCode -> ye no. se character/ string la convert krke deta hai
    // in other words ye asci table m se no. ke according character la kr deta hai
    return String.fromCharCode(getRndNumber(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndNumber(65,91));
}

function generateSymbols(){
    // charAt -> hume character at that position batata hai
    return symbols.charAt(getRndNumber(0,symbols.length));
}

function calcstrength(){

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercasecheck.checked) hasUpper = true;
    if(lowercasecheck.checked) hasLower = true;
    if(numberscheck.checked) hasNum = true;
    if(symbolscheck.checked) hasSym = true;

    if(hasUpper && hasLower && hasNum && hasSym && passwordLength >= 8){
        setIndicator("#0f0");
    } else if(
        (hasUpper || hasLower) && 
        (hasNum || hasSym) && 
        passwordLength >=6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("f00");
    }
}

function sufflePassword(array){
    //fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handlecheckboxchange(){
    checkcount = 0;

    allcheckboxes.forEach((checkbox) =>{
        if(checkbox.checked)
            checkcount++ ;
    })
    
    //special case
    if(passwordLength < checkcount){
        passwordLength = checkcount;
        handleSlider();
    }
}

// allcheckboxes.addEventListener('change', handlecheckboxchange);
allcheckboxes.forEach( (checkbox) => {
    checkbox.addEventListener('change',handlecheckboxchange);
})
console.log('handlecheckbox done')

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText = "copied";
    }
    catch(e){
        copymsg.innerText = "failed";
    }

    //to make copy span visiable
    copymsg.classList.add("active");

    setTimeout(() => {
        copymsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener("input", (e)=>{
    passwordLength = e.target.value ;
    // lengthDisplay.innerText = passwordLength;
    handleSlider();
});

copybutton.addEventListener('click',()=>{
    if(passworddisplay.value)
        copyContent();
})

generatebutton.addEventListener('click',()=>{
    //none of the checkboxes are checked

    if(checkcount <= 0){
        return;
    }

    //let's start the journey

    if(passwordLength < checkcount){
        passwordLength = checkcount;
        handleSlider();
    }

    if(password.length) password = "";
    console.log('starting the journey')

    let funcArr = [];

    if(uppercasecheck.checked)
        funcArr.push(generateUppercase);

    if(lowercasecheck.checked)
        funcArr.push(generateLowercase);

    if(numberscheck.checked)
        funcArr.push(generateRndNumber);

    if(symbolscheck.checked)
        funcArr.push(generateSymbols);

    //compulsary addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    console.log('compulsary done')
    // remaining addition

    for(let i=0; i < passwordLength - funcArr.length ; i++){
        let randIndex = getRndNumber(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log('remaining done');

    password = sufflePassword(Array.from(password));

    console.log('suffling done')
    passworddisplay.value = password;


    console.log('password done')
    calcstrength();
})
