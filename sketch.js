// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAIr3NTcE_RCe5l2m5EGLvIiQO0l9uvz_M",
  authDomain: "midea-art-project.firebaseapp.com",
  databaseURL: "https://midea-art-project-default-rtdb.firebaseio.com",
  projectId: "midea-art-project",
  storageBucket: "midea-art-project.firebasestorage.app",
  messagingSenderId: "826265566034",
  appId: "1:826265566034:web:1e133a6e7145e59339588b",
  measurementId: "G-K8NFG4CEES"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let cam;
let inputField;
let tabCount = 0;
let triggerWords = ["얼굴", "시발", "ㅅㅂ", "ㅆㅂ", "ㅈㄴ", "존나", "개새끼", "개새", "새끼", "ㅅㄲ", "병신","ㅂㅅ", "씨발", "꺼져","ㄲㅈ", "지랄", "ㅈㄹ", "ㅁㅊ", "미친", "fuck", "shit"];
let captureImage;
let soundEffect;

function preload() {
  soundEffect = loadSound("sound/popup.mp3"); // ✅ 같은 경로에 popup.mp3 파일 필요
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.size(width, height);
  cam.hide();

  inputField = createInput();
  inputField.size(360);
  inputField.attribute('placeholder', '지우고 싶은 기억이나 떠오르는 생각을 입력해주세요.');
  inputField.style('font-size', '16px');
  inputField.style('z-index', '100');
  inputField.position(20, height - 40);
}

function draw() {
  background(0);
  tint(255, map(tabCount, 0, 20, 255, 60));
  image(cam, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.size(windowWidth, windowHeight);
  inputField.position(20, height - 40);
}

function keyPressed() {
  if (keyCode === ENTER && inputField.value().trim() !== '') {
    let text = inputField.value().trim();
    inputField.value('');

    database.ref("memories").push({
      text: text,
      timestamp: Date.now()
    });

    tabCount++;

    const lowerText = text.toLowerCase();
    const matched = triggerWords.some(word => lowerText.includes(word.toLowerCase()));

    if (matched) {
      captureImage = cam.get();
      createImageTab(text, captureImage);
    } else {
      createMemoryTab(text);
    }
  }
}

function createMemoryTab(text) {
  const totalTabs = 10;
  const tabsPerStep = 2;
  const delayPerStep = 200;

  for (let step = 0; step < totalTabs / tabsPerStep; step++) {
    setTimeout(() => {
      for (let i = 0; i < tabsPerStep; i++) {
        createTabWithContent(distortText(text), null);
      }
    }, step * delayPerStep);
  }
}

function createImageTab(text, img) {
  createTabWithContent(distortText(text), img);
}

function createTabWithContent(distortedText, img) {
  if (soundEffect && soundEffect.isLoaded()) {
    soundEffect.play(); // ✅ 효과음 재생
  }

  let tab = createDiv();
  tab.style('position', 'absolute');
  tab.style('width', '300px');
  tab.style('background', '#fff');
  tab.style('border', '1px solid #ccc');
  tab.style('border-radius', '8px');
  tab.style('box-shadow', '3px 3px 10px rgba(0,0,0,0.2)');
  tab.style('font-family', 'sans-serif');
  tab.style('overflow', 'hidden');
  tab.style('z-index', '10');

  let x = random(20, width - 320);
  let y = random(60, height - 200);
  tab.position(x, y);

  let topBar = createDiv();
  topBar.style('background', '#f5f5f5');
  topBar.style('height', '24px');
  topBar.style('display', 'flex');
  topBar.style('align-items', 'center');
  topBar.style('padding', '0 10px');
  topBar.style('border-bottom', '1px solid #ccc');
  topBar.parent(tab);

  ['#ff5f57', '#febc2e', '#28c940'].forEach(color => {
    let dot = createDiv();
    dot.style('width', '12px');
    dot.style('height', '12px');
    dot.style('border-radius', '50%');
    dot.style('margin-right', '6px');
    dot.style('background', color);
    dot.parent(topBar);
  });

  if (img) {
    let captured = createImg(img.canvas.toDataURL(), 'captured');
    captured.style('width', '100%');
    captured.style('display', 'block');
    captured.style('margin', '0');
    captured.style('z-index', '5');
    captured.parent(tab);
  }

  let content = createDiv(distortedText);
  content.style('padding', '12px');
  content.style('font-size', '14px');
  content.style('color', '#333');
  content.style('z-index', '20');
  content.parent(tab);
}

function distortText(original) {
  let specialChars = ['%', '&', '/', '*', '#', '@', '!', '$'];
  let result = '';

  for (let i = 0; i < original.length; i++) {
    result += original[i];
    if (random(1) < 0.3) {
      result += random(specialChars);
    }
  }

  return result;
}
