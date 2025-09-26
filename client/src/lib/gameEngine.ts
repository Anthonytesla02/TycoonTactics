import { useMarketData } from './stores/useMarketData';
import { useGameState } from './stores/useGameState';

let websocket: WebSocket | null = null;

export async function initializeWebSocket(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      websocket = new WebSocket(wsUrl);
      
      websocket.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };
      
      websocket.onmessage = (event) => {
        try {
          let data;
          // Check if data is already parsed or needs parsing
          if (typeof event.data === 'string') {
            data = JSON.parse(event.data);
          } else {
            data = event.data;
          }
          console.log('Processing WebSocket message:', data.type, data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', event.data);
          console.error('Error details:', error);
          console.error('Error stack:', error instanceof Error ? error.stack : error);
        }
      };
      
      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (websocket?.readyState === WebSocket.CLOSED) {
            initializeWebSocket().catch(console.error);
          }
        }, 3000);
      };
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      // Fallback timeout
      setTimeout(() => {
        if (websocket?.readyState !== WebSocket.OPEN) {
          console.log('WebSocket connection timeout, continuing with fallback');
          resolve();
        }
      }, 5000);
      
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      resolve(); // Don't fail the entire app if WebSocket fails
    }
  });
}

function handleWebSocketMessage(data: any) {
  switch (data.type) {
    case 'market_update':
      // Handle real-time market updates
      if (data.symbol && data.price) {
        // Update market data store
        useMarketData.getState().updateStock(data.symbol, data.price);
        console.log(`Updated ${data.symbol} to ${data.price}`);
      }
      break;
      
    case 'market_event':
      // Handle market events
      console.log('Market event:', data.eventType, data.symbol, `${data.impact}%`);
      break;
      
    case 'news_event':
      // Handle market-moving news events
      console.log('News event:', data.event);
      break;
      
    case 'lawsuit_filed':
      // Handle new lawsuits
      if (data.lawsuit) {
        const state = useGameState.getState();
        state.lawsuits.push(data.lawsuit);
      }
      break;
      
    case 'connected':
      console.log('Game server connected:', data.message);
      break;
      
    default:
      console.log('Unknown WebSocket message type:', data.type);
  }
}

export function sendWebSocketMessage(data: any) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(data));
  }
}

export function closeWebSocket() {
  if (websocket) {
    websocket.close();
    websocket = null;
  }
}
