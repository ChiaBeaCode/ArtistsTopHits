export function CapitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  export function CapitalizeEachWord(string) {
    const newString = string.split(" ");
    const newNew = []
    for (const i in newString) {
      newNew.push(newString[i].charAt(0).toUpperCase() + newString[i].slice(1)) 
    }
    return newNew.join(" ")
  }
  