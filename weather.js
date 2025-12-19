const defaultLocation = {
    name: '東京',
    latitude: 35.6762,
    longitude: 139.6503,
    country: '日本',
    timezone: 'Asia/Tokyo'
};

const selectors = {
    status: document.getElementById('status'),
    locationForm: document.getElementById('locationForm'),
    locationInput: document.getElementById('locationInput'),
    geoButton: document.getElementById('geoButton'),
    results: document.getElementById('results'),
    locationName: document.getElementById('locationName'),
    currentTemp: document.getElementById('currentTemp'),
    currentSummary: document.getElementById('currentSummary'),
    updatedAt: document.getElementById('updatedAt'),
    currentBadges: document.getElementById('currentBadges'),
    forecastGrid: document.getElementById('forecastGrid'),
    hourlyList: document.getElementById('hourlyList'),
};

const STORAGE_KEY = 'sp-weather:last-location';

function setStatus(message, type = 'info') {
    if (!selectors.status) return;
    selectors.status.textContent = message;
    selectors.status.className = `status ${type}`;
}

document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    const storedLocation = readStoredLocation();
    fetchAndRenderWeather(storedLocation || defaultLocation);
});

function bindEvents() {
    selectors.locationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = selectors.locationInput.value.trim();
        if (!query) {
            setStatus('地域名を入力してください。', 'error');
            return;
        }
        await searchLocation(query);
    });

    selectors.geoButton.addEventListener('click', () => {
        if (!navigator.geolocation) {
            setStatus('位置情報が利用できません。入力検索をご利用ください。', 'error');
            return;
        }

        setStatus('現在地を取得しています...', 'info');
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const location = {
                name: '現在地',
                latitude,
                longitude,
                country: '',
                timezone: 'auto'
            };
            await fetchAndRenderWeather(location);
        }, () => {
            setStatus('現在地の取得に失敗しました。権限と通信状況をご確認ください。', 'error');
        });
    });
}

async function searchLocation(query) {
    setStatus('候補を検索しています...', 'info');
    selectors.results.innerHTML = '';

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ja&format=json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            setStatus('候補が見つかりませんでした。別のキーワードをお試しください。', 'error');
            return;
        }

        renderSearchResults(data.results);
        setStatus('候補から表示したい地域を選択してください。', 'success');
    } catch (error) {
        console.error('Search error', error);
        setStatus('検索中に問題が発生しました。通信状況をご確認ください。', 'error');
    }
}

function renderSearchResults(results) {
    selectors.results.innerHTML = '';
    results.forEach((item) => {
        const location = {
            name: item.name,
            latitude: item.latitude,
            longitude: item.longitude,
            country: item.country || '',
            timezone: item.timezone || 'auto'
        };

        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <div>
                <div class="result-title">${location.name}</div>
                <div class="result-meta">${location.country} / ${item.admin1 || ''} / 緯度${location.latitude.toFixed(2)}, 経度${location.longitude.toFixed(2)}</div>
            </div>
            <button class="btn secondary" type="button"><i class="fa-solid fa-arrow-right"></i> この地域の予報</button>
        `;

        div.querySelector('button').addEventListener('click', async () => {
            selectors.results.innerHTML = '';
            await fetchAndRenderWeather(location);
        });

        selectors.results.appendChild(div);
    });
}

async function fetchAndRenderWeather(location) {
    try {
        setStatus(`「${location.name}」の予報を取得しています...`, 'info');
        const data = await fetchWeather(location);
        renderCurrent(data, location);
        renderDaily(data);
        renderHourly(data);
        storeLocation(location);
        setStatus(`「${location.name}」の最新予報を表示中`, 'success');
    } catch (error) {
        console.error('Weather fetch error', error);
        setStatus('予報の取得に失敗しました。時間をおいて再度お試しください。', 'error');
    }
}

async function fetchWeather(location) {
    const params = new URLSearchParams({
        latitude: location.latitude,
        longitude: location.longitude,
        current_weather: 'true',
        hourly: 'temperature_2m,precipitation_probability',
        daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
        forecast_days: '5',
        timezone: location.timezone || 'auto'
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Forecast HTTP ${res.status}`);
    return res.json();
}

function renderCurrent(data, location) {
    const current = data.current_weather;
    if (!current) return;

    const info = getWeatherInfo(current.weathercode);
    selectors.locationName.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${location.name}${location.country ? `（${location.country}）` : ''}`;
    selectors.currentTemp.textContent = `${Math.round(current.temperature)}°C`;
    selectors.currentSummary.innerHTML = `<i class="${info.icon}"></i> ${info.label}`;
    selectors.updatedAt.textContent = `更新: ${formatDateTime(current.time, data.timezone)}`;

    selectors.currentBadges.innerHTML = '';
    const wind = createBadge(`<i class="fa-solid fa-wind"></i> 風速 ${current.windspeed} km/h`);
    const direction = createBadge(`<i class="fa-solid fa-compass"></i> 風向 ${current.winddirection}°`);
    selectors.currentBadges.append(wind, direction);
}

function renderDaily(data) {
    const { daily } = data;
    if (!daily || !daily.time) return;

    selectors.forecastGrid.innerHTML = '';
    daily.time.forEach((date, index) => {
        const code = daily.weathercode[index];
        const info = getWeatherInfo(code);
        const max = Math.round(daily.temperature_2m_max[index]);
        const min = Math.round(daily.temperature_2m_min[index]);
        const rain = daily.precipitation_probability_max?.[index];

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h4>${formatDate(date)}</h4>
            <div class="forecast-meta"><i class="${info.icon}"></i> ${info.label}</div>
            <div class="forecast-temp">${max}°C / ${min}°C</div>
            <div class="forecast-meta"><i class="fa-solid fa-umbrella"></i> 降水確率 ${rain ?? '--'}%</div>
        `;
        selectors.forecastGrid.appendChild(card);
    });
}

function renderHourly(data) {
    const { hourly } = data;
    if (!hourly || !hourly.time) return;

    const now = new Date();
    const rows = hourly.time.map((t, i) => ({
        time: t,
        temperature: hourly.temperature_2m[i],
        precipitation: hourly.precipitation_probability[i]
    }))
    .filter((row) => new Date(row.time) > now)
    .slice(0, 8);

    selectors.hourlyList.innerHTML = '';
    rows.forEach((row) => {
        const div = document.createElement('div');
        div.className = 'hourly-item';
        div.innerHTML = `
            <div><strong>${formatTime(row.time)}</strong></div>
            <div class="forecast-meta">気温 ${Math.round(row.temperature)}°C</div>
            <div class="forecast-meta"><i class="fa-solid fa-droplet"></i> 降水確率 ${row.precipitation ?? '--'}%</div>
        `;
        selectors.hourlyList.appendChild(div);
    });
}

function createBadge(html) {
    const span = document.createElement('span');
    span.className = 'badge';
    span.innerHTML = html;
    return span;
}

function getWeatherInfo(code) {
    const mapping = [
        { codes: [0], label: '快晴', icon: 'fa-solid fa-sun' },
        { codes: [1, 2], label: '晴れ時々薄曇り', icon: 'fa-solid fa-cloud-sun' },
        { codes: [3], label: '曇り', icon: 'fa-solid fa-cloud' },
        { codes: [45, 48], label: '霧', icon: 'fa-solid fa-smog' },
        { codes: [51, 53, 55], label: '霧雨', icon: 'fa-solid fa-cloud-rain' },
        { codes: [61, 63, 65], label: '雨', icon: 'fa-solid fa-cloud-showers-heavy' },
        { codes: [66, 67], label: '冷たい雨', icon: 'fa-solid fa-cloud-showers-water' },
        { codes: [71, 73, 75, 77], label: '雪', icon: 'fa-solid fa-snowflake' },
        { codes: [80, 81, 82], label: 'にわか雨', icon: 'fa-solid fa-cloud-sun-rain' },
        { codes: [85, 86], label: 'にわか雪', icon: 'fa-solid fa-snowflake' },
        { codes: [95, 96, 99], label: '雷雨', icon: 'fa-solid fa-cloud-bolt' },
    ];

    return mapping.find((m) => m.codes.includes(code)) || { label: '不明', icon: 'fa-solid fa-circle-question' };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${date.getMonth() + 1}/${date.getDate()} (${weekday})`;
}

function formatTime(dateString) {
    const d = new Date(dateString);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateTime(dateString, timezone) {
    const date = new Date(dateString);
    return `${date.toLocaleString('ja-JP', { timeZone: timezone || 'Asia/Tokyo' })}`;
}

function pad(n) {
    return n.toString().padStart(2, '0');
}

function storeLocation(location) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch (error) {
        console.warn('Failed to store location', error);
    }
}

function readStoredLocation() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.warn('Failed to read stored location', error);
        return null;
    }
}
