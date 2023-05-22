import './App.css';
import { Button, ChakraProvider, Grid, GridItem, Heading, Input, Stack, StackDivider, Text } from '@chakra-ui/react'
import { Checkbox } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { handleCollectedGrades, handleKanjiCount, handleRandomKanjiCount, handleInput } from './startScreenFunctionLibrary';

function StartScreen({getKanji, startScreenGetKanjiValues, setInitiateShuffle }) {

  const [kanjiTotalCount, setKanjiTotalCount] = useState(0);
  const [totalWantedKanji, setTotalWantedKanji] = useState(0);
  const [collectedGrades, setCollectedGrades] = useState([]);
  


  return (
    <Box w='100%' h='100%' display='flex' flexDirection='column' justifyContent='space-evenly' alignItems='center'>
      <Stack w='75%' spacing={5} display='flex' flexDirection='row' justifyContent='space-evenly'>
        <Box display='flex' flexDirection='column' pr={['25px', '25px', '50px']}>
          <Checkbox w={['100px', '100px', '200px']} m={2} p={1} bg='pink.500' borderRadius='10px' border='1px' onChange={(e) => handleKanjiCount(e, 'grade-1', setKanjiTotalCount, setCollectedGrades, setInitiateShuffle)}>Grade 1</Checkbox>
          <Checkbox w={['100px', '100px', '200px']} m={2} p={1} bg='pink.500' borderRadius='10px' border='1px' onChange={(e) => handleKanjiCount(e, 'grade-2', setKanjiTotalCount, setCollectedGrades, setInitiateShuffle)}>Grade 2</Checkbox>
          <Checkbox w={['100px', '100px', '200px']} m={2} p={1} bg='pink.500' borderRadius='10px' border='1px' onChange={(e) => handleKanjiCount(e, 'grade-3', setKanjiTotalCount, setCollectedGrades, setInitiateShuffle)}>Grade 3</Checkbox>
          <Checkbox w={['100px', '100px', '200px']} m={2} p={1} bg='pink.500' borderRadius='10px' border='1px' onChange={(e) => handleKanjiCount(e, 'grade-4', setKanjiTotalCount, setCollectedGrades, setInitiateShuffle)}>Grade 4</Checkbox>
        </Box>
        <Box display='flex' flexDirection='column'>
          <Checkbox w='200px' m={2} p={1} bg='pink.500' borderRadius='10px' border='1px' onChange={(e) => handleKanjiCount(e, 'grade-5', setKanjiTotalCount, setCollectedGrades, setInitiateShuffle)}>Grade 5</Checkbox>
          <Checkbox w='200px' m={2} p={1} bg='pink.500' borderRadius='10px' border='1px' onChange={(e) => handleKanjiCount(e, 'grade-6', setKanjiTotalCount, setCollectedGrades, setInitiateShuffle)}>Grade 6</Checkbox>
          <Checkbox w='200px' m={2} p={1} bg='pink.500' borderRadius='10px' border='1px' onChange={(e) => handleKanjiCount(e, 'grade-8', setKanjiTotalCount, setCollectedGrades, setInitiateShuffle)}>remanaing Joyo kanji</Checkbox>
        </Box>
      </Stack> 
      <Box fontSize={20}>Total Kanji: {kanjiTotalCount}</Box>
      <Box>
        <Text>Set Random Kanji Count</Text>
        <Input textAlign='center' onKeyDown={(e) => {handleInput(e, totalWantedKanji, setTotalWantedKanji, kanjiTotalCount)}} onKeyUp={(e) => handleRandomKanjiCount(e, kanjiTotalCount, setTotalWantedKanji)} type='number' bg='white'color='blackAlpha.900' m={3} w='50%'></Input>
      </Box>
      <Button onClick={() => getKanji(collectedGrades, totalWantedKanji, kanjiTotalCount, startScreenGetKanjiValues.allJoyoKanji, startScreenGetKanjiValues.setWantedKanji, startScreenGetKanjiValues.setKanjiLength, startScreenGetKanjiValues.setCurrentKanjiCount, startScreenGetKanjiValues.setKanjiList, startScreenGetKanjiValues.setInitiateShuffle)} bg='pink.500' isDisabled={kanjiTotalCount === 0 ? true : false} _hover={kanjiTotalCount === 0  ? {background: 'pink.500'} : {background: 'var(--chakra-colors-whiteAlpha-300)'}}>Start</Button>
    </Box>
  );
}

export default StartScreen;