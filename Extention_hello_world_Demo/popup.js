console.log("This is a popup!")
urlFetcher()
async function urlFetcher(){

    const url = "http://localhost:3000/WorkSearchApp/api"
    data = null
  
  let response = await fetch('http://localhost:3000/WorkSearchApp/api')
  //   let response = await fetch(url, {
  //   method: 'Get',
  //   headers: {
  //     'Content-Type': 'application/json' // Set the content type if you're sending JSON data
  //     // Add any other headers as needed
  //   },
  //   body: JSON.stringify(data) // Convert the data to a JSON string
  // })

  let final = await response.json()
    console.log(final)
  }