// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAIr3NTcE_RCe5l2m5EGLvIiQO0l9uvz_M",
  authDomain: "midea-art-project.firebaseapp.com",
  databaseURL: "https://midea-art-project-default-rtdb.firebaseio.com",
  projectId: "midea-art-project",
  storageBucket: "midea-art-project.firebaseapp.com",
  messagingSenderId: "826265566034",
  appId: "1:826265566034:web:1e133a6e7145e59339588b",
  measurementId: "G-K8NFG4CEES"
};

// ✅ Firebase 초기화
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let cam;
let inputField;
let tabCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO, () => {
    cam.size(windowWidth, windowHeight);
  });
  cam.hide();

  // 입력창 생성
  inputField = createInput();
  inputField.size(300);
  inputField.attribute('placeholder', '지금 떠오르는 기억이나 생각을 입력해주세요');
  inputField.style('font-size', '16px');
  positionInputField();
}

function draw() {
  background(0);
  tint(255, map(tabCount, 0, 20, 255, 60));
  image(cam, 0, 0, width, height);
}

function keyPressed() {
  if (keyCode === ENTER && inputField.value().trim() !== '') {
    let text = inputField.value().trim();
    inputField.value('');

    // ✅ Firebase에 저장
    database.ref("memories").push({
      text: text,
      timestamp: Date.now()
    });

    createMemoryTab(text);
    tabCount++;
  }
}

function createMemoryTab(text) {
  const totalTabs = 10;
  const tabsPerStep = 2;
  const delayPerStep = 200;

  for (let step = 0; step < totalTabs / tabsPerStep; step++) {
    setTimeout(() => {
      for (let i = 0; i < tabsPerStep; i++) {
        let distortedText = distortText(text);

        let tab = createDiv();
        tab.style('position', 'absolute');
        tab.style('width', '300px');
        tab.style('background', '#ffffff');
        tab.style('border', '1px solid #ccc');
        tab.style('border-radius', '8px');
        tab.style('box-shadow', '3px 3px 10px rgba(0,0,0,0.2)');
        tab.style('font-family', 'sans-serif');
        tab.style('overflow', 'hidden');
        tab.position(random(20, windowWidth - 320), random(20, windowHeight - 180));

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

        let content = createDiv(distortedText);
        content.style('padding', '12px');
        content.style('font-size', '14px');
        content.style('color', '#333');
        content.parent(tab);
      }
    }, step * delayPerStep);
  }
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

function positionInputField() {
  inputField.position(20, windowHeight - 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.size(windowWidth, windowHeight);
  positionInputField();
}
