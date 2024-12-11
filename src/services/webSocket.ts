import { CandlestickData } from "./binanceAPI";

export interface CoinData {
  symbol: string;
  volume: number;
  priceChangePercent: number;
}

export interface MarketData {
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
}

export interface Order {
  price: number;
  amount: number;
}

/**
 * 공통 WebSocket 연결 함수
 */
const connectWebSocket = (
  url: string,
  onMessage: (data: any) => void,
  onError: (error: any) => void
): WebSocket => {
  const ws = new WebSocket(url);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    onError(error);
  };

  return ws;
};

/**
 * WebSocket 연결 함수 - CoinData
 */
export const connectToWebSocket = (
  onMessage: (coins: CoinData[]) => void,
  onError: (error: any) => void
) => {
  return connectWebSocket(
    "wss://stream.binance.com:9443/ws/!ticker@arr",
    (data) => {
      const formattedData: CoinData[] = data.map((item: any) => ({
        symbol: item.s,
        volume: parseFloat(item.q),
        priceChangePercent: parseFloat(item.P),
      }));
      onMessage(formattedData);
    },
    onError
  );
};

/**
 * WebSocket 연결 함수 - MarketData
 */
export const connectMarketWebSocket = (
  symbol: string,
  onMessage: (data: MarketData) => void,
  onError: (error: any) => void
) => {
  return connectWebSocket(
    `wss://stream.binance.com:9443/ws/${symbol}@ticker`,
    (data) => {
      const marketData: MarketData = {
        price: parseFloat(data.c),
        change: parseFloat(data.P),
        high: parseFloat(data.h),
        low: parseFloat(data.l),
        volume: parseFloat(data.v),
      };
      onMessage(marketData);
    },
    onError
  );
};

/**
 * WebSocket 연결 함수 - OrderBook
 */
export const connectOrderBookWebSocket = (
  symbol: string,
  onMessage: (bids: Order[], asks: Order[]) => void,
  onError: (error: any) => void
) => {
  return connectWebSocket(
    `wss://stream.binance.com:9443/ws/${symbol}@depth`,
    (data) => {
      const formattedBids = data.b.map((order: [string, string]) => ({
        price: parseFloat(order[0]),
        amount: parseFloat(order[1]),
      }));

      const formattedAsks = data.a.map((order: [string, string]) => ({
        price: parseFloat(order[0]),
        amount: parseFloat(order[1]),
      }));

      onMessage(formattedBids, formattedAsks);
    },
    onError
  );
};

/**
 * WebSocket 연결 함수 - CandlestickData
 */
export const connectStreamCandlestickData = (
  symbol: string,
  interval: string,
  onMessage: (data: CandlestickData) => void,
  onError: (error: any) => void
) => {
  return connectWebSocket(
    `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`,
    (message) => {
      const candle = message.k;
      const newCandle: CandlestickData = {
        time: candle.t,
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c),
      };
      onMessage(newCandle);
    },
    onError
  );
};
