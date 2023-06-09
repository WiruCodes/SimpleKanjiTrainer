import './App.css';
import { Button, ChakraProvider, Grid, GridItem, Heading, Input, Spinner, Stack, StackDivider, Text, ColorModeScript, extendTheme, useColorMode, ThemeConfig, Progress } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { getKanjiPerGrade, generateKanjiDetails, getKanji, shuffle, handleCompareRomanjiToKanji, skipKanji } from './kanjiFunctionLibrary';
import StartScreen from './StartScreen';
import EndDetails from './EndDetails'

function App() {
  const allJoyoKanji = useRef({});
  const [apiKanjiComplete, setApiKanjiComplete] = useState(false);
  
  const [kanjiList, setKanjiList] = useState([]);
  const [currentKanji, setCurrentKanji] = useState({});
  
  const [kanjiLength, setKanjiLength] = useState(0);
  const [currentKanjiCount, setCurrentKanjiCount] = useState(1);
  
  const [wantedKanji, setWantedKanji] = useState(0);
  
  // to handle useEffect after api calls, allKanji per grade -> all kanji details -> shuffle
  const [initiateGetDetails, setInitiateGetDetails] = useState(false);
  const [initiateShuffle, setInitiateShuffle] = useState(false);
  
  const [finishedKanjiList, setFinishedKanjiList] = useState([]);

  const [playingNow, setPlayingNow] = useState(false);
  const [endScore, setEndScore] = useState(0);

  const[delayDone, setDelayDone] = useState(false);
  
  const[loadingCount, setLoadingCount] = useState(0);
  
  let startScreenGetKanjiValues = {allJoyoKanji, setWantedKanji, setKanjiLength, setCurrentKanjiCount, setKanjiList, setInitiateShuffle};

  let gradeList = [
    'grade-1',
    'grade-2',
    'grade-3',
    'grade-4',
    'grade-5',
    'grade-6',
    'grade-8'
  ];

  // check if api is complete
  function apiComplete() {
    let gradeCheck = 'grade-8' in allJoyoKanji.current;
    let idxCheck = false;
    let detailsCheck = false;
    gradeCheck && (idxCheck = '0' in allJoyoKanji.current['grade-8']);
    (gradeCheck && idxCheck) && (detailsCheck = 'details' in allJoyoKanji.current['grade-8']['0']);

    if(gradeCheck && idxCheck && detailsCheck) {
      setApiKanjiComplete(true);

      // put collected kanji objects into localstorage
      let kanjiObj = allJoyoKanji.current;

      let kanjiObj_serialized = JSON.stringify(kanjiObj);
      
      localStorage.setItem("kanjiObj", kanjiObj_serialized);
      clearInterval(getApiInterval)
      // let kanjiObj_deserialized = JSON.parse(localStorage.getItem("kanjiObj"));
    }
  }

  var getApiInterval = setInterval(apiComplete, 500);




  // collect all kanji per grade
  let kanjiObj_deserialized  = JSON.parse(localStorage.getItem("kanjiObj"));
  // console.log(kanjiObj_deserialized)
  useEffect(() => {
    if(kanjiObj_deserialized !== null) {
      allJoyoKanji.current = kanjiObj_deserialized;
      setApiKanjiComplete(true);
    } else {
      gradeList.forEach((grade) => {
        getKanjiPerGrade(grade, allJoyoKanji, setInitiateGetDetails);
      });
    }

    
  }, []);

  // set kanji details for each kanji in grade
  const ONE_SECOND = 100;
  function delay(milliseconds) {
    return new Promise(ok => setTimeout(ok, milliseconds));
  }

  // limit the number of requests for api and batch them
  async function rateLimitedRequests (params) {
    let allJoyoClone = { ...params }
    let kanjiApiIteration = 0;
    while (Object.keys(allJoyoClone).length > 0) {
        let startTime = Date.now();


        for (let i=0; i < (kanjiApiIteration > 200 ? 15 : 3); i++) {
            kanjiApiIteration++;
            let thisParam = allJoyoClone[Object.keys(allJoyoClone)[Object.keys(allJoyoClone).length - 1]];
            delete allJoyoClone[`${Object.keys(allJoyoClone).length-1}`]
            if (thisParam) {
                generateKanjiDetails(params[Object.keys(allJoyoClone).length]);
                setLoadingCount((prevState) => prevState + 1);
            }
        }

        let endTime = Date.now();
        let requestTime = endTime - startTime;
        let delayTime = ONE_SECOND - requestTime;

        if (delayTime > 0) {
            await delay(delayTime);
        }
    }

    // console.log(allJoyoKanji.current)
  }

  useEffect(() => {
    if(Object.keys(allJoyoKanji.current).length == 7 && kanjiObj_deserialized == null && initiateGetDetails == true) {
      Object.keys(allJoyoKanji.current).forEach((grade) => {
        rateLimitedRequests(allJoyoKanji.current[grade])
      });
      apiComplete();
      // console.log(allJoyoKanji.current)
    }
  }, [initiateGetDetails]);
  
  // use shuffle on total kanji chosen, then cut them based on wantedkanjicount
  useEffect(() => {

    if(apiKanjiComplete && initiateShuffle === true) {
      setKanjiList(shuffle(kanjiList, wantedKanji));
      setPlayingNow(true);
      setDelayDone(true);
    }
  }, [initiateShuffle]);
  

  // set currentkanji value when kanjiList is complete
  useEffect(() => {
    setCurrentKanji(kanjiList[0]);
    // console.log(endScore)
  }, [kanjiList]);
  



  function quit() {
    setKanjiList([]);
  }

  return (
    <ChakraProvider>
      <Box className="App" w='100vw' h='100vh' display='flex' justifyContent='center' alignItems='center'>
        <Box border='5px solid black' bg='tomato' w={['420px', '420px', '640px']} h={['420px', '420px', '640px']} p={4} color='white'>
          {!apiKanjiComplete ? 
            <Box width='100%' height='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
              <Text marginBottom='5px'>Getting All Kanji</Text>
              <Progress value={(loadingCount / 2136) * 100}  size={'lg'} width={['200px','200px', '300px']}/>
            </Box> : 
            (kanjiList.length <= 0 && playingNow === false) ? <StartScreen getKanji={getKanji} startScreenGetKanjiValues={startScreenGetKanjiValues} setInitiateShuffle={setInitiateShuffle} /> : <Grid w='100%' h='100%' templateColumns='repeat(2, 1fr)' templateRows='repeat(6, 1fr)' gap={3}>
            <GridItem border='5px solid black' colSpan={1} rowSpan={4}  bg='blue.500'>
              <Box id='kanji-container' display='flex' w='100%' h='100%' alignItems='center' justifyContent='center'>
              {(kanjiList.length <= 0 && playingNow === true) ? <EndDetails setDelayDone={setDelayDone} endScore={endScore} setEndScore={setEndScore} kanjiLength={kanjiLength} setFinishedKanjiList={setFinishedKanjiList} setPlayingNow={setPlayingNow} setWantedKanji={setWantedKanji} setCurrentKanjiCount={setCurrentKanjiCount} setKanjiList={setKanjiList} /> : delayDone ? <Text fontSize={['80px', '80px', '120px']}>{kanjiList[0].kanji}</Text> : <Spinner size='xl' />}
              </Box>
            </GridItem>
            <GridItem border='5px solid black' colSpan={1} rowSpan={5} overflow='hidden' overflowY='auto' bg='blue.500' display='flex' flexDirection='column'>
            {finishedKanjiList.length > 0 && <Card  borderRadius="0px" bg="green.500" >
              <CardBody>
                <Stack divider={<StackDivider />} spacing='4' display='flex' flexDirection='column-reverse'>
                    {finishedKanjiList.map((kanjiDetails, index) => {
                      return <Box key={`kanji_details_${index}`}>
                        <Heading size='xs' textTransform='uppercase'>
                          <Text mb={3} color="red.500" fontSize={20}>{kanjiDetails.kanji}</Text>
                            <Box>
                              <Box flexWrap='wrap' textAlign='center' justifyContent='center' whiteSpace="pre"  display='flex' flexDirection='row'>
                              {kanjiDetails.kun_readings.map((kun_reading, index_kun) => {
                                return <Text key={`kun_reading_${index_kun}`} pl={3} pr={3} pt={1}>{kun_reading}</Text>;
                              })}
                              {kanjiDetails.on_readings.map((on_reading, index_on) => {
                                return <Text key={`on_reading_${index_on}`} pl={3} pr={3} pt={1}>{on_reading}</Text>;
                              })}
                            </Box>
                          </Box>
                        </Heading>
                        <Box pt={3} flexWrap='wrap' textAlign='center' justifyContent='center' whiteSpace="pre" display='flex' flexDirection='row'>
                          {kanjiDetails.meanings.map((meaning, index_meaning) => {
                              return <Text key={`kanji_meaning_${index_meaning}`} pl={3} pr={3} pt={1} fontSize='sm'>{meaning}</Text>;
                          })}
                        </Box>
                      </Box>
                    })}
                  </Stack>
                </CardBody>
              </Card>}
            </GridItem>
            <GridItem border='5px solid black' colSpan={1} rowSpan={1} bg='blue.500' display='flex' justifyContent='space-evenly' alignItems='center'>
              <Text fontSize={20}>{currentKanjiCount} of {kanjiLength}</Text>
              <Button id='skipButton' onClick={() => skipKanji(currentKanji, kanjiLength, kanjiList, setKanjiList, setCurrentKanji, currentKanjiCount, setCurrentKanjiCount, setFinishedKanjiList)}  bg='pink.500' isDisabled={kanjiList.length === 0 ? true : false} _hover={kanjiList.length === 0  ? {background: 'pink.500'} : {background: 'pink.500'}}>Skip</Button>
            </GridItem>
            <GridItem border='5px solid black' colSpan={2} rowSpan={1} bg='blue.500'  display='flex' justifyContent='space-evenly' alignItems='center'>
              <Input id='kanjiInput' autoComplete='off' textAlign='center' onInput={(e) => handleCompareRomanjiToKanji(e, currentKanji,kanjiLength, kanjiList, setKanjiList, currentKanjiCount, setCurrentKanjiCount, finishedKanjiList, setFinishedKanjiList, setEndScore, setInitiateShuffle)} bg='white'color='blackAlpha.900' m={3} w='50%' isDisabled={kanjiList.length === 0 ? true : false} _hover={{border: '1px solid black'}}></Input>
              <Button onClick={() => {quit()}} bg='pink.500' isDisabled={kanjiList.length === 0 ? true : false} _hover={kanjiList.length === 0  ? {background: 'pink.500'} : {background: 'var(--chakra-colors-whiteAlpha-300)'}}>Quit</Button>
            </GridItem>
          </Grid>}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
