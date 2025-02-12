## Getting Started

```
yarn install
yarn dev
```
# Binance Clone

**React Query**, **Next.js**, **TypeScript**, **WebSocket**을 사용한 바이낸스 클론 작업 내용을 기록한 문서입니다.

---

## **목차**

1. 프로젝트 개요
2. 기술 스택
3. 기본 [](https://www.notion.so/Binance-Clone-159660ffc3848050ae14ec962c641ec0?pvs=21)구조
4. 컴포넌트 설명
5. 서비스 레이어
6. Challenges
7. 소요 시간

---

## **프로젝트 개요**

- WebSocket을 사용한 실시간 가격 업데이트
- 캔들스틱 차트 시각화
- 주문서 및 거래 기능
- 암호화폐 페어 검색
- 금액과 가격을 설정하여 주문 배치

## **기술 스택**

- **Next.js**: 서버사이드 렌더링과 라우팅을 위한 프레임워크
- **TypeScript**: 타입 안정성을 보장하는 JavaScript 개발
- **React Query**: 데이터 페칭 및 캐싱
- **WebSocket**: 실시간 데이터 업데이트
- **ApexCharts**: 캔들스틱 차트 렌더링
- **Zustand**: 데이터 상태 관리

---

## **기본 구조**

### 1. **Root Layout (`layout.tsx`)**

애플리케이션의 루트 레이아웃을 정의하며, 글로벌 스타일과 프로바이더를 포함합니다.

**주요 기능**

- Tailwind CSS를 활용하여 글로벌 스타일 설정
- react-query 프로바이더 설정

```tsx
import Providers from "@/components/Providers";
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-900 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### 2. **BTC/USDT 거래 페이지 (`app/en/trade/BTC_USDT/page.tsx`)**

BTC/USDT 페어의 주요 거래 인터페이스

**주요 기능**

- `React Query`로 초기 가격 데이터 가져오기
- Header, OrderBook, TradeChart, CoinSearch, HeaderGuide 등의 컴포넌트를 표시

```tsx
export default function BTCUSDTPage() {
  const { setSelectedOrder } = useAppState();

  const { isLoading, isError } = useQuery({
    queryKey: ["initialPrice"],
    queryFn: fetchInitialPrice,
    onSuccess: (data) => setSelectedOrder(data),
  });

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />

      <main className="w-full p-4 grid lg:grid-cols-12 gap-6 text-sm">
        <div className="lg:col-span-9 space-y-6">
          <HeaderGuide />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-4 bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-sm font-bold mb-4">Order Book</h2>
              <OrderBook />
            </section>

            <section className="lg:col-span-8 bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-sm font-bold mb-4">Trading Chart</h2>
              <TradeChart />
              <OrderForm />
            </section>
          </div>
        </div>

        <section className="lg:col-span-3 bg-gray-800 p-4 rounded-lg shadow-md">
          <CoinSearch />
        </section>
      </main>
    </div>
  );
}
```

---

## **컴포넌트 설명**

### **CoinSearch (`components/CoinSearch.tsx`)**

검색어에 따라 암호화폐를 필터링하는 검색 바, 검색어가 없을 경우 거래량 기준 상위 10개의 코인 표시

**주요 기능**

- WebSocket 데이터를 사용해 코인 필터링
- 검색 결과에 따라 동적인 UI 업데이트

### **HeaderGuide (`components/HeaderGuide.tsx`)**

BTC/USDT 페어의 실시간 시장 데이터 표.

**주요 기능**

- 가격 변동을 추적하고 상승/하락 여부에 따라 색상 변경

### **OrderBook (`components/OrderBook.tsx`)**

BTC/USDT의 상위 10개 매수 및 매도 가격을 표시

**주요 기능**

- WebSocket으로 실시간 데이터 업데이트
- 사용자가 가격을 선택할 수 있도록 지원

### **OrderForm (`components/OrderForm.tsx`)**

사용자가 매수 또는 매도 주문을 금액과 가격을 설정하여 배치

**주요 기능**

- OrderBook의 price, amount와 연동
- 가격과 금액을 증감할 수 있는 버튼

### **TradeChart (`components/TradeChart.tsx`)**

BTC/USDT의 캔들스틱 데이터 시각화

**주요 기능**

- REST API와 WebSocket 데이터를 결합해 동적인 업데이트 제공
- 여러 시간 간격의 캔들스틱 보기 옵션 제공

### **Providers (`components/Providers.tsx`)**

애플리케이션을 `QueryClientProvider`로 감싸 상태 관리를 지원합니다.

**주요 기능**

- React Query의 `QueryClient` 설정

---

## **서비스 레이어**

실시간 및 비동기 데이터 처리를 위한 중앙 집중식 API 및 WebSocket 연결.

### **Binance API (`services/binanceAPI.ts`)**

Binance REST API에서 암호화폐 데이터를 가져오는 함수 제공

- fetchInitialPrice
- fetchCandlestickData

### **WebSocket (`services/webSocket.ts`)**

1. REST API는 데이터를 주기적으로 가져와야 하지만, WebSocket은 새로운 데이터가 발생할 때마다 클라이언트로 푸시되어 실시간 업데이트 최적화 
2. 지속적인 연결로 인해 각 요청에 대해 HTTP 헤더를 포함하지 않으므로 네트워크 사용량 감소
- Market Data
- Order Book
- Candle Stick Data

```tsx
const connectMarketWebSocket = (
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
```

---

## Challenges

### **React Query에서 WebSocket으로 전환**

초기에는 **React Query**를 사용하여 데이터를 주기적으로 폴링 방식으로 가져왔으나, 실시간 데이터 업데이트를 처리하는 데 비효율적이라고 판단하였습니다. 이를 개선하기 위해 **WebSocket**을 도입하여 실시간으로 데이터를 푸시받는 방식으로 전환하였습니다.





