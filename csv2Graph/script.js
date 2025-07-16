// グローバル変数
let currentData = null;
let currentChart = null;
let parsedData = null;

// DOM要素の取得
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileDetails = document.getElementById('fileDetails');
const chartSettings = document.getElementById('chartSettings');
const dataPreview = document.getElementById('dataPreview');
const chartType = document.getElementById('chartType');
const xAxis = document.getElementById('xAxis');
const yAxis = document.getElementById('yAxis');
const previewTable = document.getElementById('previewTable');
const dataTable = document.getElementById('dataTable');
const chartCanvas = document.getElementById('chartCanvas');
const chartTitle = document.getElementById('chartTitle');

// ファイルアップロード処理
fileInput.addEventListener('change', handleFileSelect);

// ドラッグ＆ドロップ処理
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// ファイル選択処理
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// ファイル処理
function handleFile(file) {
    currentData = file;
    
    // ファイル情報表示
    displayFileInfo(file);
    
    // ファイルタイプに応じて処理
    if (file.name.toLowerCase().endsWith('.csv')) {
        parseCSV(file);
    } else if (file.name.toLowerCase().endsWith('.json')) {
        parseJSON(file);
    } else {
        alert('CSVまたはJSONファイルを選択してください。');
    }
}

// ファイル情報表示
function displayFileInfo(file) {
    fileInfo.style.display = 'block';
    fileDetails.innerHTML = `
        <strong>ファイル名:</strong> ${file.name}<br>
        <strong>サイズ:</strong> ${(file.size / 1024).toFixed(2)} KB<br>
        <strong>タイプ:</strong> ${file.type || '不明'}
    `;
}

// CSVファイル解析
function parseCSV(file) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            if (results.errors.length > 0) {
                alert('CSVファイルの解析中にエラーが発生しました: ' + results.errors[0].message);
                return;
            }
            parsedData = results.data;
            displayData(parsedData);
            setupChartOptions(parsedData);
        },
        error: function(error) {
            alert('CSVファイルの読み込みに失敗しました: ' + error.message);
        }
    });
}

// JSONファイル解析
function parseJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            parsedData = JSON.parse(e.target.result);
            if (Array.isArray(parsedData)) {
                displayData(parsedData);
                setupChartOptions(parsedData);
            } else {
                alert('JSONファイルは配列形式である必要があります。');
            }
        } catch (error) {
            alert('JSONファイルの解析に失敗しました: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// データ表示
function displayData(data) {
    if (!data || data.length === 0) {
        alert('データが空です。');
        return;
    }

    // データプレビュー表示
    dataPreview.style.display = 'block';
    displayPreviewTable(data);
    
    // データテーブル表示
    displayDataTable(data);
    
    // グラフ設定表示
    chartSettings.style.display = 'block';
}

// プレビューテーブル表示
function displayPreviewTable(data) {
    const headers = Object.keys(data[0]);
    const previewData = data.slice(0, 5); // 最初の5行のみ表示
    
    let headerHtml = '<tr>';
    headers.forEach(header => {
        headerHtml += `<th>${header}</th>`;
    });
    headerHtml += '</tr>';
    
    let bodyHtml = '';
    previewData.forEach(row => {
        bodyHtml += '<tr>';
        headers.forEach(header => {
            bodyHtml += `<td>${row[header] || ''}</td>`;
        });
        bodyHtml += '</tr>';
    });
    
    previewTable.querySelector('thead').innerHTML = headerHtml;
    previewTable.querySelector('tbody').innerHTML = bodyHtml;
}

// データテーブル表示
function displayDataTable(data) {
    const headers = Object.keys(data[0]);
    
    let headerHtml = '<tr>';
    headers.forEach(header => {
        headerHtml += `<th>${header}</th>`;
    });
    headerHtml += '</tr>';
    
    let bodyHtml = '';
    data.forEach(row => {
        bodyHtml += '<tr>';
        headers.forEach(header => {
            bodyHtml += `<td>${row[header] || ''}</td>`;
        });
        bodyHtml += '</tr>';
    });
    
    dataTable.querySelector('thead').innerHTML = headerHtml;
    dataTable.querySelector('tbody').innerHTML = bodyHtml;
}

// グラフオプション設定
function setupChartOptions(data) {
    const headers = Object.keys(data[0]);
    
    // X軸選択肢
    xAxis.innerHTML = '';
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        xAxis.appendChild(option);
    });
    
    // Y軸選択肢
    yAxis.innerHTML = '';
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        yAxis.appendChild(option);
    });
    
    // デフォルト選択
    if (headers.length >= 2) {
        xAxis.value = headers[0];
        yAxis.value = headers[1];
    }
}

// グラフ生成
function generateChart() {
    if (!parsedData || parsedData.length === 0) {
        alert('データがありません。');
        return;
    }
    
    const selectedChartType = chartType.value;
    const selectedXAxis = xAxis.value;
    const selectedYAxis = yAxis.value;
    
    if (!selectedXAxis || !selectedYAxis) {
        alert('X軸とY軸を選択してください。');
        return;
    }
    
    // 既存のグラフを破棄
    if (currentChart) {
        currentChart.destroy();
    }
    
    // データの準備
    const chartData = prepareChartData(selectedChartType, selectedXAxis, selectedYAxis);
    
    // グラフタイトル更新
    chartTitle.textContent = `${selectedYAxis} vs ${selectedXAxis}`;
    
    // グラフ作成
    const ctx = chartCanvas.getContext('2d');
    currentChart = new Chart(ctx, {
        type: selectedChartType,
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${selectedYAxis} vs ${selectedXAxis}`
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: selectedXAxis
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: selectedYAxis
                    }
                }
            }
        }
    });
}

// グラフデータ準備
function prepareChartData(chartType, xAxis, yAxis) {
    const labels = [];
    const data = [];
    
    parsedData.forEach(row => {
        const xValue = row[xAxis];
        const yValue = parseFloat(row[yAxis]);
        
        if (xValue !== undefined && !isNaN(yValue)) {
            labels.push(xValue);
            data.push(yValue);
        }
    });
    
    if (chartType === 'pie') {
        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: generateColors(data.length)
            }]
        };
    } else {
        return {
            labels: labels,
            datasets: [{
                label: yAxis,
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: chartType === 'bar' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(75, 192, 192, 0.1)',
                tension: 0.1
            }]
        };
    }
}

// 色生成
function generateColors(count) {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    return result;
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('データ可視化ツールが読み込まれました。');
}); 