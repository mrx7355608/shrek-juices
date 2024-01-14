/*
    * TODO: write documentation for these functions
*/
export default function convertName(name) {
    if (name.includes("-")) {
        const splittedName = name.split("-")
        const capitalizedName = capitalize(splittedName[0]);
        return capitalizedName + " " + splittedName[1];
    } else {
        return capitalize(name);
    }
}

function capitalize(name) {
    const nameArr = name.split("");
    nameArr[0] = nameArr[0].toUpperCase();
    return nameArr.join("");
}
