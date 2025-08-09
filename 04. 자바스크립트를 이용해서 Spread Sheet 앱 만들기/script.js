/***** 설정 *****/
const ROWS = 20;      // 데이터 행 수 (1~ROWS)
const COLS = 12;      // 열 수 (A~)
const FILE_NAME = 'spreadsheet.xlsx';

/***** 유틸 *****/
const colName = c => String.fromCharCode(65 + c); // 0->A
const qs  = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

/***** 시트 빌드 *****/
function buildSheet() {
  const tbl = qs('#sheet');

  // 헤더행 (좌상단 빈칸 + A..)
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  const corner = document.createElement('th');
  headRow.appendChild(corner);
  for (let c = 0; c < COLS; c++) {
    const th = document.createElement('th');
    th.textContent = colName(c);
    th.dataset.col = c;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  tbl.appendChild(thead);

  // 본문
  const tbody = document.createElement('tbody');
  for (let r = 1; r <= ROWS; r++) {
    const tr = document.createElement('tr');

    // 행 헤더
    const th = document.createElement('th');
    th.textContent = r;
    th.dataset.row = r;
    tr.appendChild(th);

    // 셀
    for (let c = 0; c < COLS; c++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'cell';
      input.dataset.row = r;
      input.dataset.col = c;

      // 포커스/블러 이벤트
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);

      // 편의: 방향키 이동
      input.addEventListener('keydown', e => handleArrows(e, input));

      td.appendChild(input);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  tbl.appendChild(tbody);
}

/***** 헤더 하이라이트 + 셀 표시 *****/
function handleFocus(e) {
  const { row, col } = e.target.dataset;
  // 표시
  qs('#cell-indicator').textContent = `Cell: ${colName(+col)}${row}`;

  // 기존 하이라이트 제거
  qsa('.th-highlight').forEach(el => el.classList.remove('th-highlight'));

  // 상단 헤더 하이라이트 (thead 의 (col+2)번째 = 좌상단 + A…)
  const topTh = qs(`#sheet thead th:nth-child(${+col + 2})`);
  if (topTh) topTh.classList.add('th-highlight');

  // 좌측 헤더 하이라이트 (tbody 의 row번째 tr 의 첫 th)
  const leftTh = qs(`#sheet tbody tr:nth-child(${row}) th`);
  if (leftTh) leftTh.classList.add('th-highlight');
}

function handleBlur() {
  // 다른 셀로 포커스가 옮겨질 때 focus 이벤트가 바로 들어오므로
  // 약간 지연 후 남아있는 포커스가 없으면 하이라이트 해제
  setTimeout(() => {
    if (!document.activeElement.classList.contains('cell')) {
      qsa('.th-highlight').forEach(el => el.classList.remove('th-highlight'));
      qs('#cell-indicator').textContent = 'Cell: -';
    }
  }, 0);
}

/***** 방향키/엔터/탭 이동 (품질 향상용, 필수는 아님) *****/
function handleArrows(e, input) {
  const r = +input.dataset.row;
  const c = +input.dataset.col;

  const focusCell = (nr, nc) => {
    const next = qs(`input.cell[data-row="${nr}"][data-col="${nc}"]`);
    if (next) next.focus();
  };

  switch (e.key) {
    case 'ArrowUp':    e.preventDefault(); focusCell(Math.max(1, r-1), c); break;
    case 'ArrowDown':  e.preventDefault(); focusCell(Math.min(ROWS, r+1), c); break;
    case 'ArrowLeft':  if (input.selectionStart===0 && input.selectionEnd===0){ e.preventDefault(); focusCell(r, Math.max(0, c-1)); } break;
    case 'ArrowRight': if (input.selectionStart===input.value.length && input.selectionEnd===input.value.length){ e.preventDefault(); focusCell(r, Math.min(COLS-1, c+1)); } break;
    case 'Enter':      e.preventDefault(); focusCell(Math.min(ROWS, r+1), c); break;
    default: break;
  }
}

/***** Export (Excel .xlsx) *****/
function exportToExcel() {
  // 2차원 배열(AOA) 구성: [ [ , A, B, ...], [1, val, val, ...], ... ]
  const aoa = [];

  // 첫 행(헤더)
  const headerRow = [''];             // 좌상단 빈 칸
  for (let c = 0; c < COLS; c++) headerRow.push(colName(c));
  aoa.push(headerRow);

  // 데이터 행
  for (let r = 1; r <= ROWS; r++) {
    const row = [r]; // 맨 앞은 행 번호
    for (let c = 0; c < COLS; c++) {
      const val = qs(`input.cell[data-row="${r}"][data-col="${c}"]`).value;
      // 숫자로만 구성된 경우 숫자형으로 저장(구글 스프레드시트 호환성 ↑)
      const num = Number(val);
      row.push(val !== '' && !isNaN(num) ? num : val);
    }
    aoa.push(row);
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, FILE_NAME);
}

/***** 초기화 *****/
document.addEventListener('DOMContentLoaded', () => {
  buildSheet();
  qs('#export-btn').addEventListener('click', exportToExcel);
});
