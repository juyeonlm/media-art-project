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

// ✅ Firebase 초기화
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let cam;
let inputField;
let tabCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.size(width, height);
  cam.hide();

  // 입력창 생성
  inputField = createInput();
  inputField.position(20, height - 50);
  inputField.size(300);
  inputField.attribute('placeholder', '지금 떠오르는 기억이나 생각을 입력해주세요');
  inputField.style('font-size', '16px');
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

// 🔧 입력된 텍스트를 왜곡하고, 여러 개의 브라우저 탭처럼 생성
function createMemoryTab(text) {
  let numTabs = int(random(3, 7)); // 3~6개의 탭 생성

  for (let i = 0; i < numTabs; i++) {
    let distortedText = distortText(text); // 텍스트 왜곡

    let tab = createDiv();
    tab.style('position', 'absolute');
    tab.style('width', '300px');
    tab.style('background', '#ffffff');
    tab.style('border', '1px solid #ccc');
    tab.style('border-radius', '8px');
    tab.style('box-shadow', '3px 3px 10px rgba(0,0,0,0.2)');
    tab.style('font-family', 'sans-serif');
    tab.style('overflow', 'hidden');
    tab.position(random(20, width - 320), random(20, height - 180));

    // 상단 바 (브라우저처럼)
    let topBar = createDiv();
    topBar.style('background', '#f5f5f5');
    topBar.style('height', '24px');
    topBar.style('display', 'flex');
    topBar.style('align-items', 'center');
    topBar.style('padding', '0 10px');
    topBar.style('border-bottom', '1px solid #ccc');
    topBar.parent(tab);

    // 🔴🟡🟢 맥북 브라우저 버튼
    ['#ff5f57', '#febc2e', '#28c940'].forEach(color => {
      let dot = createDiv();
      dot.style('width', '12px');
      dot.style('height', '12px');
      dot.style('border-radius', '50%');
      dot.style('margin-right', '6px');
      dot.style('background', color);
      dot.parent(topBar);
    });

    // 내용 영역 (왜곡된 텍스트)
    let content = createDiv(distortedText);
    content.style('padding', '12px');
    content.style('font-size', '14px');
    content.style('color', '#333');
    content.parent(tab);
  }
}

// ✨ 텍스트 사이사이에 특수기호 삽입하는 함수
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