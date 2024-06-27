export default function de_duplicate_array_of_objects(array: Array<object>, object_to_deduplicate: string) {


    let de_Duplicated_Array: Array<object> = []
    for (let x = 0; x < array.length; x++) {

        if (array[x + 1] && (array[x][object_to_deduplicate] == array[x + 1][object_to_deduplicate])) {
            continue
        }
        else {
            de_Duplicated_Array.push(array[x])
        }


    }
    console.log(de_Duplicated_Array)
    return de_Duplicated_Array

}
// console.log('cool')
// let tarse = de_duplicate_array_of_object(testObject, 'question')
function de_duplicate_array_of_object(array: Array<object>, object_to_deduplicate: string) {

    let parse = array.reduce((de_Duplicated_Array: any, currentValue: object, index: number) => {
        if (array[index + 1] && currentValue[object_to_deduplicate] != array[index + 1][object_to_deduplicate]) {
            de_Duplicated_Array.push(currentValue)
        }
        else {
        }
        return de_Duplicated_Array

    }, [])
    return parse
}

// console.log(tarse)
// console.log('cool')

