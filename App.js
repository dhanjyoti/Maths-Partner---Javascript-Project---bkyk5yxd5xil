let category = document.getElementById('category')
let problem = document.getElementById('problem')
let result = document.getElementById('output')
let operationText = document.getElementById('operation')
let savedSection = document.getElementById('saved-section')


function onClickSaved(){
    savedSection.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}

const clearOutput = ()=>{
    result.innerHTML = ""
    operationText.innerText = "Simplify : "
}
const capitalize = (string) => {
    return string.substring(0, 1).toUpperCase() + string.substring(1)
}
const genSavedItem = () => {
    const template = (output, operation, id, time) => `<div class="saved-item">
    <div>${time}</div>
    <h3>${operation}</h3>
    <div class="saved-part">
        <div class="output">${output}</div>
        <div class="output-button">
            <button onclick=deleteSavedItem(${id})>
                <img src="4701158.png" />
            </button>
        </div>
    </div>
</div>`

    let tempSavedSolutions = localStorage.getItem("solutions")
    try {
        tempSavedSolutions = JSON.parse(tempSavedSolutions)
        if (Array.isArray(tempSavedSolutions)) {
            tempSavedSolutions = tempSavedSolutions.map((test) => template(test.result, `${capitalize(test.operation)} : ${test.expression}`, test.id, (new Date(test.time)).toLocaleString()))
            savedSection.innerHTML = tempSavedSolutions
        }
    } catch (e) {

    }
}

const deleteSavedItem = (id) => {
    let savedSolutions = localStorage.getItem("solutions")
    try {
        savedSolutions = JSON.parse(savedSolutions)
        if (Array.isArray(savedSolutions)) {
            savedSolutions = savedSolutions.filter((i) => i.id != id)
            localStorage.setItem("solutions", JSON.stringify(savedSolutions))
            genSavedItem()
        }
    }
    catch (e) {
        console.log(e);
    }
}


const onSubmit = async () => {
    result.innerText = ""
    let c = category.value;
    let p = problem.value;
    if (c && p) {
        let encodedUrl = encodeURIComponent(p)
        console.log(encodedUrl);
        await fetch(`https://newton.vercel.app/api/v2/${c}/${encodedUrl}`).then((e) => e.json())
            .then((r) => {
                console.log(r);
                result.innerText = r.result
                let savedSolutions = localStorage.getItem("solutions")
                try {
                    savedSolutions = JSON.parse(savedSolutions)
                    if (Array.isArray(savedSolutions)) {
                        savedSolutions.push({ ...r, time: new Date(), id: Date.now() })
                    } else {
                        savedSolutions = [{ ...r, time: new Date(), id: Date.now() }]
                    }
                    localStorage.setItem("solutions", JSON.stringify(savedSolutions))
                    genSavedItem()
                }
                catch (e) {
                    console.log(e);
                    localStorage.setItem("solutions", JSON.stringify([{ ...r, time: new Date(), id: Date.now() }]))
                }
            })
    }
}

problem.addEventListener('change', (e) => {
    operationText.innerText = capitalize(category.value) + " : " + problem.value
})

const onOperationChanged = (e) => {
    console.log(e.value)
    operationText.innerText = capitalize(e.value) + " : " + problem.value
}

genSavedItem()