// ✅ Firebase 연동된 p5.js 전체 코드

// 🔥 Firebase 설정 객체
const firebaseConfig = {
  apiKey: "AIzaSyDX8UKlMciIKSpeM3Edzzg2_BwlWUtl4LA",
  authDomain: "media-art-80473.firebaseapp.com",
  databaseURL: "https://media-art-80473-default-rtdb.firebaseio.com",
  projectId: "media-art-80473",
  storageBucket: "media-art-80473.appspot.com",
  messagingSenderId: "1023571157209",
  appId: "1:1023571157209:web:d42a86d0d94d00365f1ec8",
  measurementId: "G-YBNKWMP6V3"
};

// 🔥 Firebase 초기화
firebase.initializeApp(firebaseConfig);

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

  // 탭 수에 따라 흐릿해지는 효과
  tint(255, map(tabCount, 0, 20, 255, 60));
  image(cam, 0, 0, width, height);
}

function keyPressed() {
  if (keyCode === ENTER && inputField.value().trim() !== '') {
    let memoryText = inputField.value().trim();

    // 특수기호로 노이즈 삽입
    let noisyText = addNoiseToText(memoryText);

    // 메모리 탭 생성
    createMemoryTab(noisyText);
    inputField.value('');
    tabCount++;

    // 🔥 Firebase에 저장
    const db = firebase.database();
    firebase.push(firebase.ref(db, "memories"), {
      text: memoryText,
      timestamp: Date.now()
    });
  }
}

function createMemoryTab(text) {
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

  // ⬆️ 상단 바 (브라우저처럼)
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

  // 내용 영역
  let content = createDiv(text);
  content.style('padding', '12px');
  content.style('font-size', '14px');
  content.style('color', '#333');
  content.parent(tab);
}

// 🌀 텍스트에 특수기호 삽입하는 함수
function addNoiseToText(text) {
  const noiseChars = ['%', '&', '/', '*', '$', '#', '@', '~'];
  let noisy = '';
  for (let i = 0; i < text.length; i++) {
    noisy += text[i];
    if (random() < 0.2) noisy += random(noiseChars);
  }
  return noisy;
}
