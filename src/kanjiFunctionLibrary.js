const japanese = require('japanese/sugar');
let kanjiUrlStarter = 'https://kanjiapi.dev';


export async function getKanjiPerGrade(grade, allJoyoKanji, setInitiateGetDetails) {
  
  const response = await fetch(kanjiUrlStarter + "/v1/kanji/" + grade);
  const jsonData = await response.json();

  for(let i = 0;i < jsonData.length; i++) {
    let idx = i;
    allJoyoKanji.current[grade] = {...allJoyoKanji.current[grade], [idx]: {kanji: jsonData[i]}};
  }

  if(grade == 'grade-8') {
    setInitiateGetDetails(true);
  }

}

export async function generateKanjiDetails(neededKanji){
  if(neededKanji) {
    const response = await fetch(kanjiUrlStarter + "/v1/kanji/" + neededKanji.kanji);
    const jsonData = await response.json();
    console.log(jsonData);
    neededKanji.details = jsonData;
  }
}

export async function getKanji(passedGradeList, totalWantedKanji, kanjiTotalCount, allJoyoKanji, setWantedKanji, setKanjiLength, setCurrentKanjiCount, setKanjiList, setInitiateShuffle) {
  !totalWantedKanji && (totalWantedKanji = kanjiTotalCount);
  
  setWantedKanji(totalWantedKanji);
  setKanjiLength(totalWantedKanji);

  let kanjiCollector = [];
  passedGradeList.forEach((grade) => {

    Object.keys(allJoyoKanji.current[grade]).forEach((idx) => {
      kanjiCollector.push(allJoyoKanji.current[grade][idx]);
    })

    console.log(grade)
  });
  setCurrentKanjiCount(1);
  // console.log(kanjiCollector);
  setKanjiList(kanjiCollector);

  setInitiateShuffle(true);
}

export function shuffle(array, totalWantedKanji) {
  let currentIndex = array.length,  randomIndex;
  // console.log(array)
  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  // console.log(array)
  let slicedArr = array.slice(0, totalWantedKanji);
  // console.log(slicedArr)

  return slicedArr;
}

export function handleCompareRomanjiToKanji(e, passedKanji, kanjiLength, kanjiList, setKanjiList, currentKanjiCount, setCurrentKanjiCount, finishedKanjiList, setFinishedKanjiList, setEndScore, setInitiateShuffle) {
  let inputValue = e.target.value;
  let doneCheck = false;

  console.log(passedKanji);
  passedKanji.details.kun_readings[0] && console.log(japanese.romanize(passedKanji.details.kun_readings[0]));
  passedKanji.details.on_readings[0] && console.log(japanese.romanize(passedKanji.details.on_readings[0]));
  for(let i = 0; i < passedKanji.details.kun_readings.length; i++) {
    let romanizedRead = japanese.romanize(passedKanji.details.kun_readings[i]);
    if(inputValue === romanizedRead) {
      let newKanjiList = kanjiList.slice(1);
      setKanjiList(newKanjiList);
      e.target.value = "";
      currentKanjiCount < kanjiLength && setCurrentKanjiCount(currentKanjiCount + 1);
      setFinishedKanjiList((prevKanjiList) => [...prevKanjiList, passedKanji.details]);
      setEndScore((prevScore) => prevScore + 1);
      doneCheck = true;
      break;
    }
  }

  if(doneCheck === false) {
    for(let i = 0; i < passedKanji.details.on_readings.length; i++) {
      let romanizedRead = japanese.romanize(passedKanji.details.on_readings[i]);
      if(inputValue === romanizedRead) {
        let newKanjiList = kanjiList.slice(1);
        setKanjiList(newKanjiList);
        e.target.value = "";
        currentKanjiCount < kanjiLength && setCurrentKanjiCount(currentKanjiCount + 1);
        setFinishedKanjiList((prevKanjiList) => [...prevKanjiList, passedKanji.details]);
        setEndScore((prevScore) => prevScore + 1);
        break;
      }
    }
  }


  // console.log(finishedKanjiList);
}

export function skipKanji(passedKanji, kanjiLength, kanjiList, setKanjiList, setCurrentKanji, currentKanjiCount, setCurrentKanjiCount, setFinishedKanjiList) {
  
  let newKanjiList = kanjiList.slice(1);
  setKanjiList(newKanjiList);
  document.getElementById('kanjiInput').value = "";
  currentKanjiCount < kanjiLength && setCurrentKanjiCount(currentKanjiCount + 1);
  setFinishedKanjiList((prevKanjiList) => [...prevKanjiList, passedKanji.details]);
  

  document.getElementById('skipButton').disabled = true;
  setTimeout(() => {document.getElementById('skipButton').disabled = false}, 100);

}
