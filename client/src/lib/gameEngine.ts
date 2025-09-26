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
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
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
        const { useMarketData } = require('./stores/useMarketData');
        useMarketData.getState().updateStock(data.symbol, data.price);
      }
      break;
      
    case 'news_event':
      // Handle market-moving news events
      console.log('News event:', data.event);
      break;
      
    case 'lawsuit_filed':
      // Handle new lawsuits
      const { useGameState } = require('./stores/useGameState');
      if (data.lawsuit) {
        const state = useGameState.getState();
        state.lawsuits.push(data.lawsuit);
      }
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
