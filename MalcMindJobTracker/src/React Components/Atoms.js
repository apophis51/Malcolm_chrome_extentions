import {atom} from 'jotai'




// Create a new Date object representing the current date and time
const currentDate = new Date();

// Get the current year, month, and day
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(currentDate.getDate()).padStart(2, '0');

// Format the date as "YYYY-MM-DD"
const formattedDate = `${year}-${month}-${day}`;

// Log the formatted date
console.log('Current Date:', formattedDate);


export const exportedDate =  atom(formattedDate) 


export const testAtom = atom('test')

export const exportData = atom({data: {Job_Title: 'test Title', Applied_Date: formattedDate}})

export const postingUrlSet = atom(false)