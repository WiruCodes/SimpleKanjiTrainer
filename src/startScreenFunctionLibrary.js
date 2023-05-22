export function handleCollectedGrades(isChecked, grade, setCollectedGrades) {
  isChecked ? setCollectedGrades((allGrades) => [...allGrades, grade]): setCollectedGrades((allGrades) => {
    const index = allGrades.indexOf(grade);
      console.log(index)
      allGrades.splice(index, 1);
      return [...allGrades];
  });
}

export function handleKanjiCount(e, grade, setKanjiTotalCount, setCollectedGrades, setInitiateShuffle) {
  let isChecked = e.target.checked;
  let gradeList = [
    {level: 'grade-1', val: 80},
    {level: 'grade-2', val: 160},
    {level: 'grade-3', val: 200},
    {level: 'grade-4', val: 200},
    {level: 'grade-5', val: 185},
    {level: 'grade-6', val: 181},
    {level: 'grade-8', val: 1130}
  ];

  setInitiateShuffle(false);

  gradeList.forEach((gradeItem) => {
    if(gradeItem.level == grade) {
      console.log(grade);
      console.log(gradeItem);
      setKanjiTotalCount((prevKanjiTotalCount) => prevKanjiTotalCount + (isChecked ? gradeItem.val : -gradeItem.val));
      handleCollectedGrades(isChecked, gradeItem.level, setCollectedGrades);
    }
  });
}

export function handleRandomKanjiCount(e, kanjiTotalCount, setTotalWantedKanji) {
  let randomKanjiCount = Number(e.target.value);
  if(randomKanjiCount < kanjiTotalCount) {
    setTotalWantedKanji(randomKanjiCount);
  }
}

export function handleInput(e, totalWantedKanji, setTotalWantedKanji, kanjiTotalCount) {
  if(totalWantedKanji >= 0 && Number(totalWantedKanji.toString() + e.key) > kanjiTotalCount) {
    setTotalWantedKanji(kanjiTotalCount);
    e.target.value = kanjiTotalCount;
    e.preventDefault();
  }
  let unwantedChars = ['E', 'e', '+', '-'];
  unwantedChars.forEach((char) => {
    e.key === char && e.preventDefault();
  });
}