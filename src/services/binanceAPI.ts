export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface PriceData {
  price: number;
  amount: number;
}

/**
 * 공통 fetch 함수
 * @param url - API 요청 URL
 * @param errorMessage - 에러 메시지
 */
const fetchData = async <T>(url: string, errorMessage: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json();
};

/**
 * 초기 가격 가져오기
 * @returns PriceData - 가격 및 초기 수량
 */
export const fetchInitialPrice = async (): Promise<PriceData> => {
  const data = await fetchData<{ price: string }>(
    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
    "Failed to fetch initial price"
  );
  return {
    price: parseFloat(data.price),
    amount: 0,
  };
};

/**
 * 캔들스틱 데이터 가져오기
 * @param symbol - 거래 쌍 (예: BTCUSDT)
 * @param interval - 시간 간격 (예: 1m, 15m, 1h)
 * @returns CandlestickData[] - 캔들스틱 데이터 배열
 */
export const fetchCandlestickData = async (
  symbol: string,
  interval: string
): Promise<CandlestickData[]> => {
  const data = await fetchData<any[]>(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`,
    "Failed to fetch candlestick data"
  );
  return data.map((candle) => ({
    time: candle[0], // Open time
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
  }));
};
