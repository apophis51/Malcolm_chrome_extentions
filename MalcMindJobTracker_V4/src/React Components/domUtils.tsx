
export const Mouseevent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window
});


export function handleMutations(mutationsList, observer) {


    mutationsList.forEach(mutation => {
        
            if (mutation.type === 'childList') {
                // Iterate over added nodes
                mutation.addedNodes.forEach(node => {
                    // Check if the node is an element node (type 1) and read its text content
                    if (node.nodeType === 1) {
                        // console.log('New element added:', node.innerText);
                        // console.log(node)
                        let replay = node.innerText
                        replay = replay.split(/\n/)
                        console.error(node)
                        // try{
                        //     if (node.id = '#react-select-2-option-2') {
                        //         node.focus()
                        //         node.click()
                        //         node.dispatchEvent(Mouseevent)
                        //     }
                        // }
                        // catch   {}
                        }
                    })
                };

            })
      
    };







// autofillField(field, questionText);

export function autofillField(field, questionText) {
    // Here you can define rules or data to fill the fields based on the question or field type
    if (field.type === 'text') {
        if (questionText.toLowerCase().includes('name')) {
            // field.value = 'John Doe'; // Example name
        } else if (questionText.toLowerCase().includes('email')) {
            // field.value = 'john.doe@example.com'; // Example email
        }
    } else if (field.tagName.toLowerCase() === 'select') {
        // Assume we always select the second option for demonstration
        if (field.options.length > 1) {
            // field.value = field.options[1].value;
            // console.log(field.options[1].value)
        }
    }
}


export function simulateKeydown(element, key) {
    const event = new KeyboardEvent('keydown', {
        key: key,
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true
    });
    element.dispatchEvent(event);
}
