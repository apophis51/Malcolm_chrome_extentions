
export const Mouseevent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window
});


export function wrapperfunction(observedMutations, manipulate){
    
    return (
        function handleMutations(mutationsList, observer) {
            let Evaluate_These_Patterns = [
                /\*/
            ]
            console.error('we had one run')
            // manipulate.value = 'fuck'
            let itteration_tracker = 0

            mutationsList.forEach(mutation => {
        
                if (mutation.type === 'childList') {
                    // Iterate over added nodes
                    mutation.addedNodes.forEach(node => {
                        // Check if the node is an element node (type 1) and read its text content
                        if (node.nodeType === 1) {
                            let expressionTest = textExpression(node.innerText)
                            function textExpression(expression) {
                                let accumulator = []
                                Evaluate_These_Patterns.forEach(pattern => {
                                    accumulator.push(pattern.test(expression))
                                })
                                if (accumulator.includes(true)) {
                                    return true
                                }
                                else {
                                    return false
                                }
                            }
        
                            if (expressionTest == true) {
                                let replay = node.innerText
                                replay = replay.split(/\*/)
                                // console.error(node)
                                if (replay != '' && replay.length > 2) {
                                    console.error(replay)
                                    manipulate.set(node, replay)
                                    console.error('tracker',itteration_tracker)
                                    console.error(observedMutations[itteration_tracker])
                                    observedMutations[itteration_tracker]["options"] = replay
                                }
                            }
        
                        }
                        itteration_tracker = itteration_tracker + 1
                    })
                };
        
            })
        
        }
    )
  
}












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


export function triggerDomMutations(doc) {
    let DOM_Input_Locations: any = doc.querySelectorAll('input , select, textarea')
    DOM_Input_Locations.forEach(field => {
    //   console.log(field)
      // we also need to push the label to the data so we can reference it later  
      const label = document.querySelector(`label[for="${field.id}"]`) || field.closest('label') || field.parentElement;
      field.focus()
       field.dispatchEvent(Mouseevent)
    })
   
  }

  export function sum(a, b) {
    return a + b
  }

  