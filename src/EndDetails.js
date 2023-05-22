import {
  Button,
  Box,
  Text
} from '@chakra-ui/react'

function EndDetails({setDelayDone, endScore, setEndScore, kanjiLength, setFinishedKanjiList, setPlayingNow, setWantedKanji, setCurrentKanjiCount, setKanjiList }) {

  function playAgain() {
    setFinishedKanjiList([]);
    setKanjiList([]);
    setEndScore(0);
    setWantedKanji(0);
    setCurrentKanjiCount(0);
    setPlayingNow(false);
    setDelayDone(false);
  }

  return (
    <Box  w='100%' h='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='space-evenly'>
      <Text fontSize={[40, 40, 60]}>{endScore} of {kanjiLength}</Text>
      <Text fontSize={[20, 20, 40]}>{((endScore / kanjiLength) * 100).toFixed(2)}%</Text>
      <Button w='fit-content' onClick={playAgain}  bg='pink.500'>Play Again</Button>
    </Box>
    
  )
}

export default EndDetails;