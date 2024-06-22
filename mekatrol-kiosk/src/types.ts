export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  showLabel: boolean;
  isDefault?: boolean | undefined;
}

export interface AppConfig {
  title: string;
  icon: string;
  type: string;
  menu: MenuItem[];
}

interface HomeAssistantMessage {
  type: string;
}

const AUTH_REQUIRED = 'auth_required';
const AUTH_OK = 'auth_ok';

export interface HomeAssistantConfig {
  connection: {
    socket: WebSocket;
  };
}

export class HomeAssistant {
  private _url: string | undefined;
  private _accessToken: string | undefined;
  private _ws: WebSocket | undefined;
  private _isConnected: boolean = false;

  constructor(url?: string | undefined, accessToken?: string | undefined) {
    this._url = url;
    this._accessToken = accessToken;
    this._ws = undefined;
  }

  public attachSocket = (ws: WebSocket): void => {
    // If it is the same socket then don't update
    if (this._ws === ws) {
      return;
    }

    // Set the member socket instance
    this._ws = ws;

    // Listen for socket events
    ws.onmessage = this._messageEvent;
    ws.onclose = this._closeEvent;
    ws.onerror = this._errorEvent;
  };

  public connect = async (accessToken?: string | undefined): Promise<void> => {
    if (this._ws) {
      throw new Error('Already connected, call disconnect first.');
    }

    if (!!accessToken) {
      this._accessToken = accessToken;
    }

    return this._connect();
  };

  public disconnect = async (): Promise<void> => {
    if (!this._ws) {
      // Already disconnected
      return;
    }

    // Connection action?
    if (this._isConnected) {
      // Send close to home assistant
    }

    // Close socket
    this._ws.close();

    // Release resource
    this._ws = undefined;
  };

  private _closeEvent = (): void => {
    // Release resource
    this._ws = undefined;
  };

  private _errorEvent = (): void => {
    console.error('error');
  };

  private _messageEvent = (messageEvent: MessageEvent<any>): void => {
    const haMessage = JSON.parse(messageEvent.data) as HomeAssistantMessage;

    console.log('message:', haMessage.type, messageEvent.data);

    switch (haMessage.type) {
      case AUTH_REQUIRED:
        this._isConnected = true;
        this._auth();
        break;

      case AUTH_OK:
        break;
    }
  };

  private _auth = (): void => {
    if (!this._ws) {
      throw new Error('_ws must be connected to call _auth method.');
    }

    if (!this._url) {
      throw new Error('_url be set to call _auth method.');
    }

    if (!this._accessToken) {
      throw new Error('_accessToken must be set to call _auth method.');
    }

    this._ws.send(
      JSON.stringify({
        type: 'auth',
        access_token: this._accessToken
      })
    );
  };

  private _connect = async (): Promise<void> => {
    if (!this._url) {
      throw new Error('_url be set to call _connect method.');
    }

    // Allow access to url inside promise closure
    const url = this._url;

    const closeEvent = this._closeEvent;
    const messageEvent = this._messageEvent;
    const errorEvent = this._errorEvent;

    // Open connection, will throw exception if connection fails
    this._ws = await new Promise((resolve, reject) => {
      try {
        // Create the socket for the given URL
        const ws = new WebSocket(url);

        // Set up callbacks
        ws.onopen = (): void => {
          resolve(ws);
        };

        ws.onmessage = messageEvent;
        ws.onclose = closeEvent;
        ws.onerror = errorEvent;
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  };
}

// We want a singleton
let homeAssistant: HomeAssistant | undefined;

export const useHomeAssistant = (url?: string | undefined, accessToken?: string | undefined): HomeAssistant => {
  // Already created?
  if (homeAssistant) {
    // Return existing instance
    return homeAssistant;
  }

  homeAssistant = new HomeAssistant(url, accessToken);

  return homeAssistant;
};