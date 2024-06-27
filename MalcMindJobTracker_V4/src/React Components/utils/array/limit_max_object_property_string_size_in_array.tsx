export default function limit_max_object_property_string_size_in_array(array: Array<object>, object_property: string, desired_size_to_limit: number){
    let limitedArray: Array<object> = []
    for(let x = 0; x < array.length; x++){
       if((array[x][object_property]).length > desired_size_to_limit){
            continue
        }
        else{
            limitedArray.push(array[x])
        }     
    }
    return limitedArray
}