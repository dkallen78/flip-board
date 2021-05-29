let flipRate = 25;
let lineLength = 40;
let lastWord = 0;

function makeDiv(id, ...classes) {

  //----------------------------------------------------//
  //Makes a <div> element and assigns it an id and class//
  //string-> id: id of the element                      //
  //  "   -> classes: class(es) of the element          //
  //----------------------------------------------------//

  let div = document.createElement("div");
  if (typeof id === "string") {div.id = id}
  classes.forEach(x => div.classList.add(classes));
  return div;
}

function flipChar(cell, newChar) {
  //----------------------------------------------------//
  //"flips" a character in a single cell until it       //
  //  displays the new character                        //
  //DOM node-> cell: the cell where the character to be //
  //  changed is displayed                              //
  //string-> newChar: the new character to be displayed //
  //  in the cell                                       //
  //----------------------------------------------------//


  let oldCharCode = cell.innerHTML.charCodeAt(0);
  let newCharCode = newChar.charCodeAt(0);

  if (cell.innerHTML !== newChar) {
    let cellFlip = setInterval(function() {

      if (cell.innerHTML !== String.fromCharCode(newCharCode)) {

        oldCharCode++;
        cell.innerHTML = String.fromCharCode((oldCharCode % 95) + 32);
      } else {
        clearInterval(cellFlip);
      }
    }, flipRate);
  }
}

function fillLine(words, start) {
  //----------------------------------------------------//
  //Fills the line with words from the string to be     //
  //  displayed                                         //
  //string array-> words: the words that are to be      //
  //  displayed                                         //
  //integer-> start: which index in the words array to  //
  //  begin the line with                               //
  //----------------------------------------------------//

  let line = "";
  for (let i = start; i < words.length; i++) {
    if (line.length + words[i].length < lineLength + 1) {
      //console.log(`adding ${words[i]} to string ${line}`);
      line += (words[i] + " ");
      lastWord = i + 1;
    } else {
      //console.log(`${words[i]} is too long, sending it to next line`);
      break;
    }
  }
  return line;
}

function fillFrame(target, rows) {
  //----------------------------------------------------//
  //Fills the frame with div elements in preparation    //
  //  for display                                       //
  //HTML element-> target: where the div elements are   //
  //  to be inserted                                    //
  //integer-> rows: the number of rows to be inserted   //
  //----------------------------------------------------//

  for (let i = 1; i < (rows * lineLength) + 1; i++) {
    let char = makeDiv("", "char");
    char.innerHTML = " ";
    target.appendChild(char);
  }
  return target.getElementsByClassName("char");
}

function display(quote) {
  //----------------------------------------------------//
  //Displays the quotation and source in the frames     //
  //JSON-> quote: JSON object retreived by the API call //
  //----------------------------------------------------//

  console.log(quote);

  function displayFrame(target, cells, string) {
    //----------------------------------------------------//
    //Puts the text in a frame                            //
    //HTML element-> target: which element (frame) the    //
    //  text will be displayed in                         //
    //HTML collection-> cells: the individual elements    //
    //  (cells) where the letters will be displayed       //
    //string-> string: the text to be displayed           //
    //----------------------------------------------------//

    let lines = Array(cells.length / lineLength).fill("");
    lastWord = 0;

    string = string.replace("’", "'").replace("/n", "");
    let words = string.split(" ");

    //
    //Puts the words in the the lines array to prepare
    //  it for display
    lines.forEach(function(element, index) {
      lines[index] = fillLine(words, lastWord);
      if (typeof lines[index + 1] === "undefined" && typeof words[lastWord] !== "undefined") {
        console.log(`word overflow. ${words[lastWord]} is too long`);
        let slicePoint = words[lastWord].length - (lineLength - lines[index].length) + 3;
        lines[index] += words[lastWord].slice(0, -slicePoint) + "...";
      }
    });

    //
    //Ensures that all lines of the display have precisely
    //  30 characters
    lines.forEach(function(element, index) {
      lines[index] = element.padEnd(lineLength);
    });

    //
    //Concatenates all of the strings in the lines array
    //  into one string
    let finalString = lines.reduce((a, b) => a += b);

    //
    //Goes through each character in the finalString and displays
    //  it in its corresponding cell
    for (let i = 0; i < cells.length; i++) {
      flipChar(cells[i], finalString[i]);
    }
  }

  displayFrame(quoteFrame, quoteChars, quote.quote);
  displayFrame(charFrame, charChars, quote.character);
  displayFrame(animeFrame, animeChars, quote.anime);

}

function findQuote() {
  fetch('https://animechan.vercel.app/api/random')
      .then(response => response.json())
      .then(quote => display(quote))
}

//
//The holding elements for the individual character cells
let quoteFrame = document.getElementById("quoteFrame");
let charFrame = document.getElementById("charFrame");
let animeFrame = document.getElementById("animeFrame");

let quoteChars = fillFrame(quoteFrame, 5);
let charChars = fillFrame(charFrame, 1);
let animeChars = fillFrame(animeFrame, 2);

findQuote();

let quoteInterval = setInterval(function() {
  findQuote();
}, 30000);



/*fetch('https://animechan.vercel.app/api/random')
    .then(response => response.json())
    .then(quote => display(quote))*/
