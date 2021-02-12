var playerSize = 20;
var blockSize = 50;
var lvlxOffset = 0;
var lvlyOffset = 0;
function drawPlayer() {
  let canvas = id("playerLayer");
  let pL = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  pL.clearRect(0, 0, canvas.width, canvas.height);
  let ratio = player.currentJumps / player.maxJumps;
  if (player.maxJumps === Infinity) ratio = 1;
  if (player.maxJumps === 0) ratio = 0;
  pL.fillStyle = `rgb(${255 - ratio * 255},0,${ratio * 255})`;
  if (player.godMode) pL.fillStyle = "#FF00FF";
  if (player.noclip) pL.fillStyle += "88";
  pL.fillRect(
    Math.floor(player.x) + lvlxOffset,
    Math.floor(player.y) + lvlyOffset,
    playerSize,
    playerSize
  );
}
var prevLevel = [];
var prevSwitch = false;
var prevTimer = false;
var prevTimerStage = 0;
var prevJumpState = false;
var prevSpawnPos = [];
function drawLevel() {
  let canvas = id("levelLayer");
  id("background").style.width = level.length * blockSize + "px";
  id("background").style.height = level[0].length * blockSize + "px";
  for (let x in level) {
    for (let y in level[x]) {
      if (prevLevel[x] == undefined) {
        drawBlock(canvas, parseInt(x), parseInt(y));
      } else {
        let prevBlock = prevLevel[x][y];
        if (prevBlock == undefined) prevBlock = 0;
        if (
          level[x][y] != prevBlock ||
          (player.switchOn != prevSwitch &&
            [31, 32, 33, 34, 35].includes(level[x][y])) ||
          ((timerStage != prevTimerStage || player.timerOn != prevTimer) &&
            [36, 37, 38, 39].includes(level[x][y])) ||
          (player.jumpOn != prevJumpState &&
            [42, 43, 44, 45].includes(level[x][y])) ||
          (!arraysEqual(prevSpawnPos, [
            player.spawnPoint[0],
            player.spawnPoint[1]
          ]) &&
            [3, 17, 18].includes(level[x][y]))
        )
          drawBlock(canvas, parseInt(x), parseInt(y));
      }
    }
  }
  adjustScreen();
  drawPlayer();
  prevLevel = deepCopy(level);
  prevSwitch = player.switchOn;
  prevTimer = player.timerOn;
  prevTimerStage = timerStage;
  prevJumpState = player.jumpOn;
  prevSpawnPos = [player.spawnPoint[0], player.spawnPoint[1]];
}
function drawBlock(
  canvas,
  x,
  y,
  type = getBlockType(x, y, false),
  xOffset = 0,
  yOffset = 0,
  size = 1,
  useDefault = false
) {
  blockSize *= size;
  let lL = canvas.getContext("2d");
  lL.lineWidth = (blockSize * 3) / 25;
  let xb = ((x + xOffset) / size) * blockSize;
  let yb = ((y + yOffset) / size) * blockSize;
  let clear = false;
  let data;
  if (hasProperty(type)) {
    data = level[x][y];
    if (useDefault) {
      data = defaultProperty[type].slice();
      data.unshift(0);
    }
  }
  let sOn = player.switchOn;
  let tOn = player.timerOn;
  let tMs =
    timerStage * Math.min(1000, player.timerInterval / 4) + sinceLastTimerStage;
  let tIn = player.timerInterval;
  let jOn = player.jumpOn;
  if (useDefault) {
    sOn = false;
    tOn = false;
    tMs = 0;
    tIn = 4000;
    jOn = false;
  }
  lL.clearRect(xb, yb, blockSize, blockSize);
  switch (type) {
    case 1:
      lL.fillStyle = "#000000";
      break;
    case 2:
      lL.fillStyle = "#FF0000";
      break;
    case 3:
      if (isSpawn(x, y)) {
        lL.fillStyle = "#00FFFF88";
      } else lL.fillStyle = "#00888888";
      break;
    case 5:
      lL.fillStyle = "#FFFF00";
      break;
    case 6:
      lL.fillStyle = "#FF888888";
      break;
    case 7:
      lL.fillStyle = "#8888FF88";
      break;
    case 8:
      lL.fillStyle = "#FFFF8888";
      break;
    case 9:
      lL.fillStyle = "#88FF8888";
      break;
    case 10:
      lL.fillStyle = "#88FFFF88";
      break;
    case 11:
      lL.fillStyle = "#7289DA";
      break;
    case 12:
      lL.fillStyle = "#77440088";
      break;
    case 13:
      lL.fillStyle = "#99550088";
      break;
    case 14:
      lL.fillStyle = "#BB660088";
      break;
    case 15:
      lL.fillStyle = "#DD770088";
      break;
    case 16:
      lL.fillStyle = "#FF880088";
      break;
    case 17:
      if (isSpawn(x, y)) {
        lL.fillStyle = "#FFFF0088";
      } else lL.fillStyle = "#88880088";
      break;
    case 18:
      if (isSpawn(x, y)) {
        lL.fillStyle = "#FFFF0088";
      } else lL.fillStyle = "#88880088";
      break;
    case 21:
      lL.fillStyle = "#00880088";
      break;
    case 22:
      lL.fillStyle = "#00BB0088";
      break;
    case 23:
      lL.fillStyle = "#00FF0088";
      break;
    case 24:
      lL.fillStyle = "#FF00FF";
      break;
    case 25:
      lL.fillStyle = "#FF8888";
      break;
    case 26:
      lL.fillStyle = "#88FFFF";
      break;
    case 27:
      lL.fillStyle = "#00000088";
      break;
    case 28:
      lL.fillStyle = "#00000088";
      break;
    case 29:
      lL.fillStyle = "#00000088";
      break;
    case 30:
      lL.fillStyle = "#00000088";
      break;
    case 31:
      if (!sOn) {
        lL.fillStyle = "#00880088";
      } else lL.fillStyle = "#00FF0088";
      break;
    case 32:
      if (!sOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#00FF00";
      break;
    case 33:
      if (sOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#008800";
      break;
    case 34:
      if (!sOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#00FF00";
      break;
    case 35:
      if (sOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#008800";
      break;
    case 36:
      if (!tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#BBBBBB";
      break;
    case 37:
      if (tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#666666";
      break;
    case 38:
      if (!tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#BBBBBB";
      break;
    case 39:
      if (tOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#666666";
      break;
    case 40:
      lL.fillStyle = "#8888FF";
      break;
    case 41:
      lL.fillStyle = "#FF88FF88";
      break;
    case 42:
      if (!jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#FF8800";
      break;
    case 43:
      if (jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#884400";
      break;
    case 44:
      if (!jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#FF8800";
      break;
    case 45:
      if (jOn) {
        lL.fillStyle = "#00000000";
      } else lL.fillStyle = "#884400";
      break;
    case 46:
      lL.fillStyle = "#0000FF88";
      break;
    case 47:
      lL.fillStyle = `hsl(${(data[1] / 1000) * 360},100%,50%)`;
      break;
    case 48:
      lL.fillStyle = `hsla(${(data[1] / 2000) * 360},100%,50%,0.5)`;
      break;
    case 49:
      lL.fillStyle = `hsla(${(data[1] * 360) / 10},100%,50%,0.5)`;
      break;
    case 50:
      lL.fillStyle = `hsla(${(data[1] / 2000) * 360},100%,50%,0.5)`;
      break;
    case 51:
      lL.fillStyle = `rgb(${data[1]},${data[2]},${data[3]})`;
      break;
    case 59:
      lL.fillStyle = "#FF88FF88";
      break;
    case 60:
      lL.fillStyle = "#FFBB8888";
      break;
    case 61:
      lL.fillStyle = "#FF88FF";
      break;
    case 62:
      lL.fillStyle = "#FFBB88";
      break;
    case 63:
      lL.fillStyle = "#BBBBBB88";
      break;
    default:
      clear = true;
  }
  if (!clear) lL.fillRect(xb, yb, blockSize, blockSize);
  switch (type) {
    case 2:
      lL.strokeStyle = "#880000";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 3:
      if (isSpawn(x, y)) {
        lL.strokeStyle = "#00888888";
      } else lL.strokeStyle = "#00444488";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 5:
      lL.strokeStyle = "#888800";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 6:
      lL.strokeStyle = "#88000088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 6
      );
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2 + (blockSize / 25) * 3,
        yb + (blockSize / 25) * 6
      );
      lL.stroke();
      break;
    case 7:
      lL.strokeStyle = "#00008888";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5 + (blockSize / 25) * 6);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize / 2 - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize / 2 + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6
      );
      lL.stroke();
      break;
    case 8:
      lL.strokeStyle = "#88880088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 9
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 9:
      lL.strokeStyle = "#00880088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize / 4
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 10:
      lL.strokeStyle = "#00888888";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + (blockSize / 25) * 3
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 11:
      lL.strokeStyle = "#4E5D94";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize - blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();
      break;
    case 12:
      lL.strokeStyle = "#44220088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 13:
      lL.strokeStyle = "#55270088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 3) * 2, yb + (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 3, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + (blockSize / 3) * 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 14:
      lL.strokeStyle = "#66330088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 3) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(
          xb + (blockSize / 3) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }

      lL.beginPath();
      lL.moveTo(xb + blockSize / 6, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 6) * 5, yb + (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 6, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + (blockSize / 6) * 5,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 15:
      lL.strokeStyle = "#77380088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      for (let i = 1; i < 4; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 4) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(
          xb + (blockSize / 4) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 16:
      lL.strokeStyle = "#88440088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.quadraticCurveTo(
        xb + (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3,
        xb + (blockSize / 25) * 3,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3,
        xb + blockSize / 2,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize / 2
      );
      lL.quadraticCurveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3,
        xb + blockSize - blockSize / 2,
        yb + blockSize / 2
      );
      lL.stroke();
      break;
    case 17:
      if (isSpawn(x, y)) {
        lL.strokeStyle = "#88880088";
      } else lL.strokeStyle = "#44440088";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        2 * Math.PI
      );
      lL.stroke();
      break;
    case 18:
      if (isSpawn(x, y)) {
        lL.strokeStyle = "#88880088";
      } else lL.strokeStyle = "#44440088";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 21:
      lL.strokeStyle = "#00440088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 4 + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 4, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();
      break;
    case 22:
      lL.strokeStyle = "#00660088";
      lL.lineWidth = blockSize / 25;
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 6) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 6) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 6) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 23:
      lL.strokeStyle = "#00880088";
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      for (let i = 1; i < 4; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 8) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 8) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 8) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 24:
      lL.strokeStyle = "#880088";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 25:
      lL.strokeStyle = "#884444";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 2
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 4
      );
      lL.stroke();
      break;
    case 26:
      lL.strokeStyle = "#448888";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 5);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 5);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 3);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 4);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 3
      );
      lL.stroke();
      break;
    case 27:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 5, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 4,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 28:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 5, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 5, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 4, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 29:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 5);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 2
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 4
      );
      lL.stroke();
      break;
    case 30:
      lL.strokeStyle = "#FFFFFF88";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 5);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 2);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 5);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 5) * 3);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 5) * 4);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 5) * 3
      );
      lL.stroke();
      break;
    case 31:
      lL.lineWidth = blockSize / 25;
      if (!sOn) {
        lL.strokeStyle = "#00440088";
        lL.fillStyle = "#00440088";
        lL.strokeRect(
          xb + blockSize / 3,
          yb + (blockSize / 25) * 3,
          blockSize / 3,
          blockSize - (blockSize / 25) * 6
        );
        lL.fillRect(
          xb + blockSize / 3 + (blockSize / 50) * 3,
          yb + (blockSize / 25) * 3 + (blockSize / 50) * 3,
          blockSize / 3 - (blockSize / 25) * 3,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 50) * 3
        );
      } else {
        lL.strokeStyle = "#00880088";
        lL.fillStyle = "#00880088";
        lL.strokeRect(
          xb + blockSize / 3,
          yb + (blockSize / 25) * 3,
          blockSize / 3,
          blockSize - (blockSize / 25) * 6
        );
        lL.fillRect(
          xb + blockSize / 3 + (blockSize / 50) * 3,
          yb + blockSize / 2,
          blockSize / 3 - (blockSize / 25) * 3,
          blockSize / 2 - (blockSize / 25) * 3 - (blockSize / 50) * 3
        );
      }
      break;
    case 32:
      lL.strokeStyle = "#008800";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 33:
      lL.strokeStyle = "#004400";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 34:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#008800";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      lL.lineWidth = blockSize / 25;
      break;
    case 35:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#004400";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 36:
      lL.fillStyle = "#66666688";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.strokeStyle = "#66666688";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 37:
      lL.fillStyle = "#33333388";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.strokeStyle = "#33333388";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 38:
      lL.fillStyle = "#66666688";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#66666688";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 39:
      lL.fillStyle = "#33333388";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#33333388";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 40:
      lL.strokeStyle = "#444488";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.moveTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 2);
      lL.stroke();
      break;
    case 41:
      lL.strokeStyle = "#88448888";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        0,
        2 * Math.PI
      );
      lL.stroke();
      break;
    case 42:
      lL.strokeStyle = "#880000";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 43:
      lL.strokeStyle = "#442200";
      lL.lineWidth = blockSize / 25;
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 44:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#880000";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      lL.lineWidth = blockSize / 25;
      break;
    case 45:
      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#442200";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);

      lL.lineWidth = (blockSize / 25) * 3;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 46:
      lL.strokeStyle = "#00008888";
      lL.fillStyle = "#00008888";
      lL.font = blockSize + "px serif";
      lL.textAlign = "center";
      lL.textBaseline = "middle";
      lL.fillText(
        "T",
        xb + blockSize / 2,
        yb + blockSize / 2 + (blockSize / 50) * 3
      );
      break;
    case 47:
      lL.strokeStyle = `hsl(${(data[1] / 1000) * 360},100%,25%)`;
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 4);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize - blockSize / 4);
      lL.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - blockSize / 4
      );
      lL.stroke();
      break;
    case 48:
      lL.strokeStyle = `hsla(${(data[1] / 2000) * 360},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize - blockSize / 5) / 2,
        yb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        blockSize / 5,
        blockSize / 5
      );

      for (let i = 0; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize / 4
        );
        lL.lineTo(
          xb + (blockSize - blockSize / 5) / 2 + (blockSize * i) / 10,
          yb + blockSize - blockSize / 5 - (blockSize / 25) * 6
        );
        lL.stroke();
      }
      break;
    case 49:
      lL.strokeStyle = `hsla(${(data[1] * 360) / 10},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.quadraticCurveTo(
        xb + blockSize / 2,
        yb - blockSize / 2,
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 50:
      lL.strokeStyle = `hsla(${(data[1] / 2000) * 360},100%,25%,0.5)`;
      lL.lineWidth = blockSize / 25;
      for (let i = 1; i < 3; i++) {
        lL.beginPath();
        lL.moveTo(xb + (blockSize / 6) * i, yb + (blockSize / 25) * 3);
        lL.lineTo(xb + (blockSize / 6) * i + blockSize / 2, yb + blockSize / 2);
        lL.lineTo(
          xb + (blockSize / 6) * i,
          yb + blockSize - (blockSize / 25) * 3
        );
        lL.stroke();
      }
      break;
    case 52:
      if (sOn !== data[3]) {
        drawBlock(canvas, x, y, data[1]);
        drawBlock(canvas, x, y, data[2], 1 / 4, 1 / 4, 1 / 2);
      } else {
        drawBlock(canvas, x, y, data[2]);
        drawBlock(canvas, x, y, data[1], 1 / 4, 1 / 4, 1 / 2);
      }

      lL.fillStyle = "#00880044";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#008800";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 53:
      if (tOn !== data[3]) {
        drawBlock(canvas, x, y, data[1]);
        drawBlock(canvas, x, y, data[2], 1 / 4, 1 / 4, 1 / 2);
      } else {
        drawBlock(canvas, x, y, data[2]);
        drawBlock(canvas, x, y, data[1], 1 / 4, 1 / 4, 1 / 2);
      }

      lL.fillStyle = "#88888844";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.fillStyle = "#888888BB";
      lL.beginPath();
      lL.arc(
        xb + blockSize / 2,
        yb + blockSize / 2,
        blockSize / 2 - (blockSize / 25) * 3,
        -Math.PI / 2,
        (tMs / tIn) * 2 * Math.PI - Math.PI / 2
      );
      lL.lineTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.fill();

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#888888";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 54:
      if (jOn !== data[3]) {
        drawBlock(canvas, x, y, data[1]);
        drawBlock(canvas, x, y, data[2], 1 / 4, 1 / 4, 1 / 2);
      } else {
        drawBlock(canvas, x, y, data[2]);
        drawBlock(canvas, x, y, data[1], 1 / 4, 1 / 4, 1 / 2);
      }

      lL.fillStyle = "#88440044";
      lL.fillRect(xb, yb, blockSize, blockSize);

      lL.lineWidth = blockSize / 25;
      lL.strokeStyle = "#884400";
      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    case 55:
      lL.fillStyle = "#000000";
      lL.fillRect(xb, yb, (blockSize / 25) * 3, blockSize);
      lL.fillRect(xb, yb, (blockSize / 25) * 6, (blockSize / 25) * 3);
      lL.fillRect(
        xb,
        yb + blockSize - (blockSize / 25) * 3,
        (blockSize / 25) * 6,
        (blockSize / 25) * 3
      );
      break;
    case 56:
      lL.fillStyle = "#000000";
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 3,
        yb,
        (blockSize / 25) * 3,
        blockSize
      );
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 6,
        yb,
        (blockSize / 25) * 6,
        (blockSize / 25) * 3
      );
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 6,
        yb + blockSize - (blockSize / 25) * 3,
        (blockSize / 25) * 6,
        (blockSize / 25) * 3
      );
      break;
    case 57:
      lL.fillStyle = "#000000";
      lL.fillRect(xb, yb, blockSize, (blockSize / 25) * 3);
      lL.fillRect(xb, yb, (blockSize / 25) * 3, (blockSize / 25) * 6);
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 3,
        yb,
        (blockSize / 25) * 3,
        (blockSize / 25) * 6
      );
      break;
    case 58:
      lL.fillStyle = "#000000";
      lL.fillRect(
        xb,
        yb + blockSize - (blockSize / 25) * 3,
        blockSize,
        (blockSize / 25) * 3
      );
      lL.fillRect(
        xb,
        yb + blockSize - (blockSize / 25) * 6,
        (blockSize / 25) * 3,
        (blockSize / 25) * 6
      );
      lL.fillRect(
        xb + blockSize - (blockSize / 25) * 3,
        yb + blockSize - (blockSize / 25) * 6,
        (blockSize / 25) * 3,
        (blockSize / 25) * 6
      );
      break;
    case 59:
      lL.strokeStyle = "#88008888";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + blockSize - blockSize / 5 - (blockSize / 25) * 3,
        yb + (blockSize - blockSize / 5) / 2,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - blockSize / 5 - (blockSize / 25) * 6,
        yb + blockSize / 2
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + (blockSize / 25) * 6,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 25) * 6,
        yb + blockSize / 2 + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 60:
      lL.strokeStyle = "#88440088";
      lL.lineWidth = blockSize / 25;
      lL.strokeRect(
        xb + (blockSize / 25) * 3,
        yb + (blockSize - blockSize / 5) / 2,
        blockSize / 5,
        blockSize / 5
      );

      lL.beginPath();
      lL.moveTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 5 + (blockSize / 25) * 6, yb + blockSize / 2);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(
        xb + blockSize - (blockSize / 25) * 6,
        yb + blockSize / 2 - (blockSize / 25) * 3
      );
      lL.lineTo(xb + blockSize - (blockSize / 25) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + blockSize - (blockSize / 25) * 6,
        yb + blockSize / 2 + (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 61:
      lL.strokeStyle = "#884488";
      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 2, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + blockSize / 5, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 2,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 4, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 3, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 4,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 62:
      lL.strokeStyle = "#886644";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 5, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 2, yb + blockSize / 2);
      lL.lineTo(xb + blockSize / 5, yb + blockSize - (blockSize / 25) * 3);
      lL.stroke();

      lL.beginPath();
      lL.moveTo(xb + (blockSize / 5) * 3, yb + (blockSize / 25) * 3);
      lL.lineTo(xb + (blockSize / 5) * 4, yb + blockSize / 2);
      lL.lineTo(
        xb + (blockSize / 5) * 3,
        yb + blockSize - (blockSize / 25) * 3
      );
      lL.stroke();
      break;
    case 63:
      let minAngle = (data[1] / (60 * 1000) / 60) * 2 * Math.PI;
      let secAngle = ((data[1] % (60 * 1000)) / 60000) * 2 * Math.PI;
      lL.strokeStyle = "#66666688";
      lL.lineWidth = (blockSize / 25) * 2;
      lL.lineCap = "round";
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb +
          blockSize / 2 +
          (blockSize / 50) * 19 * Math.cos(Math.PI / 2 - minAngle),
        yb +
          blockSize / 2 -
          (blockSize / 50) * 19 * Math.sin(Math.PI / 2 - minAngle)
      );
      lL.stroke();

      lL.lineWidth = blockSize / 25;
      lL.beginPath();
      lL.moveTo(xb + blockSize / 2, yb + blockSize / 2);
      lL.lineTo(
        xb +
          blockSize / 2 +
          (blockSize / 50) * 19 * Math.cos(Math.PI / 2 - secAngle),
        yb +
          blockSize / 2 -
          (blockSize / 50) * 19 * Math.sin(Math.PI / 2 - secAngle)
      );
      lL.stroke();
      lL.lineCap = "butt";

      lL.setLineDash([blockSize / 10]);
      lL.strokeRect(
        xb + blockSize / 25,
        yb + blockSize / 25,
        blockSize - (blockSize / 25) * 2,
        blockSize - (blockSize / 25) * 2
      );
      lL.setLineDash([]);
      break;
    default:
  }
  blockSize /= size;
}
function drawGrid() {
  let canvas = id("grid");
  let g = canvas.getContext("2d");
  g.strokeStyle = "#888888";
  g.lineWidth = blockSize / 25;
  canvas.width = level.length * blockSize;
  canvas.height = level[0].length * blockSize;
  for (let x in level) {
    x = parseInt(x);
    if (x === 0) continue;
    g.beginPath();
    g.moveTo(blockSize * x, 0);
    g.lineTo(blockSize * x, canvas.height);
    g.stroke();
  }
  for (let y in level[0]) {
    y = parseInt(y);
    if (y === 0) continue;
    g.beginPath();
    g.moveTo(0, blockSize * y);
    g.lineTo(canvas.width, blockSize * y);
    g.stroke();
  }
  adjustScreen();
}
function adjustScreen() {
  if (player.playerFocus) {
    lvlxOffset = Math.floor((window.innerWidth - level.length * blockSize) / 2);
    lvlyOffset = Math.floor(
      (window.innerHeight - level.length[0] * blockSize) / 2
    );
    if (lvlxOffset < 0) {
      lvlxOffset =
        Math.floor(window.innerWidth / 2) -
        Math.floor(player.x + playerSize / 2);
      if (lvlxOffset > 0) lvlxOffset = 0;
      if (lvlxOffset < window.innerWidth - level.length * blockSize)
        lvlxOffset = Math.floor(window.innerWidth - level.length * blockSize);
    }
    lvlyOffset = Math.floor(
      (window.innerHeight - level[0].length * blockSize) / 2
    );
    if (lvlyOffset < 0) {
      lvlyOffset =
        Math.floor(window.innerHeight / 2) -
        Math.floor(player.y + playerSize / 2);
      if (lvlyOffset > 0) lvlyOffset = 0;
      if (lvlyOffset < window.innerHeight - level[0].length * blockSize)
        lvlyOffset = Math.floor(
          window.innerHeight - level[0].length * blockSize
        );
    }
  }
  id("levelLayer").style.left = lvlxOffset + "px";
  id("levelLayer").style.top = lvlyOffset + "px";
  id("background").style.left = lvlxOffset + "px";
  id("background").style.top = lvlyOffset + "px";
  id("grid").style.left = lvlxOffset + "px";
  id("grid").style.top = lvlyOffset + "px";
  drawPlayer();
}
