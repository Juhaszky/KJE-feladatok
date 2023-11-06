function simulate(playerSwap) {
    let result = {
      player: {
        swapWin: 0,
        noSwapWin: 0,
      },
      gameMasterWin: 0
    };
    const doors = generateDoors();
    doors.forEach((game) => {
      let playersDoorIdx = generateRandomDoorNumber();
      const mastersDoorIdx = gameMasterShowsADoor(game, playersDoorIdx);
      if (playerSwap) {
        playersDoorIdx = game.findIndex((door, doorIdx) => doorIdx !== playersDoorIdx && doorIdx !== mastersDoorIdx);
      }
      const win = playerWin(game[playersDoorIdx]);
      if (win) {
        playerSwap ? result.player.swapWin++ : result.player.noSwapWin++;
      } else {
        result.gameMasterWin++;
      }
    });
    console.log(returnResult(result, playerSwap));
  }
  
  function playerWin(playersDoorIdx) {
    return playersDoorIdx === 0;
  }
  
  function returnResult(result, playerSwap) {
    const strategy = playerSwap ? 'choosing a new door.' : 'without choosing a new door.';
    return  `The player won: ${result.player[playerSwap ? "swapWin" : "noSwapWin"]} times, after ${strategy}.
     The game master won: ${result.gameMasterWin} times.`;
  }
  
  function gameMasterShowsADoor(doors, playersDoorIdxIdx) {
    let mastersPick = 0;
    do {
      mastersPick = generateRandomDoorNumber();
    } while (!(doors[mastersPick] !== 0 && mastersPick !== playersDoorIdxIdx));
  
    return mastersPick;
  }
  function generateDoors() {

    const gameAmount = 1000;
    const doorsArr = [];
    // 0 - Car / 1 - Goat
    const validDoors = [
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1],
    ];
    for (let i = 0; i < gameAmount; i++) {
      const doors = validDoors[generateRandomDoorNumber()];
      doorsArr.push(doors);
    }
    return doorsArr;
  }
  
  function generateRandomDoorNumber() {
    return Math.floor(Math.random() * 3);
  }
  
  simulate(false);
  simulate(true);
  