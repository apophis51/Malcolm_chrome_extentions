export let exportData = {}

export function createButton(text, data) {
    var button = document.createElement('button');
    button.textContent = text;
    button.className = 'button';
    button.onclick = function (){
        exportData[text] = data
        console.log('exportdata', exportData)
    }
    // Add any additional button properties or event listeners as needed
    return button;
}

export function saveButton(){
    console.log('triggered')
    var button = document.createElement('button');
    button.textContent = 'Save';
    button.className = 'button';
    button.onclick = function() {
        console.log('clicked save')
        console.log('exportData', exportData)       
        try{
            const url = "http://localhost:3000/WorkSearchApp/api"
            // let data = {server: "echo me biiatch"}
            fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' // Set the content type if you're sending JSON data
            // Add any other headers as needed
            },
            body: JSON.stringify(exportData) // Convert the data to a JSON string
            })
            }
            catch(error){
            console.log('we have an error', error)
    }
    // Add any additional button properties or event listeners as needed
} 
return button;

}

export function removeButton(buttonContainer){
    var button = document.createElement('button');
    button.textContent = 'Remove Buttons';
    button.className = 'button';
    button.onclick = function() {
        buttonContainer.remove()
    }
    // Add any additional button properties or event listeners as needed
    return button;
} 
