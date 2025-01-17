const btnCount = document.getElementById("btnCount")
const txtCounter = document.getElementById("txtCounter")

let count = 0;

btnCount.addEventListener("click", () => {
    // logic
    count += 1
    console.log("Clicked")
    console.log(count)
    txtCounter.textContent = count
}); 