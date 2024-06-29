import {
  Auth,
  Connection,
  HassEntities,
  HassEntity,
  UnsubscribeFunc,
  callService,
  configColl,
  createConnection,
  createLongLivedTokenAuth,
  getStates,
  subscribeEntities
} from 'home-assistant-js-websocket';

export interface HomeAssistantSubscriber {
  onHomeAssistantInitialised: () => void;
  onHomeAssistantEntities: (entities: HassEntities) => void;
}

export interface UnitSystem {
  length: string;
  mass: string;
  volume: string;
  temperature: string;
  pressure: string;
  wind_speed: string;
  accumulated_precipitation: string;
}

interface HomeAssistantSubscriberConfig {
  subscriber: HomeAssistantSubscriber;
  entities: string[];
}

export class HomeAssistant {
  private _connection: Connection | undefined = undefined;
  private _auth: Auth | undefined = undefined;
  private _unsubscribe: UnsubscribeFunc | undefined = undefined;
  private _subscribers: HomeAssistantSubscriberConfig[] = [];
  private _unitSystem: UnitSystem = {} as UnitSystem;

  private _entityStates: Record<string, HassEntity> = {};

  public get connected() {
    return !!this._connection;
  }

  public get unitSystem() {
    return this._unitSystem;
  }

  public async connect(url: string, longLivedToken: string): Promise<boolean> {
    try {
      // Create auth token for URL
      this._auth = createLongLivedTokenAuth(url, longLivedToken);

      // Connect to server
      this._connection = await createConnection({ auth: this._auth });

      this.initialise();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async disconnect() {
    if (!this._connection) {
      // Already disconnected
      return;
    }

    // Unsubscribe from events (if subscribed)
    await this.stopListening();

    // Close the connection
    this._connection.close();
    this._connection = undefined;
  }

  private publishEntities(entities: HassEntities) {
    this._subscribers.forEach((s) => {
      let filteredEntities = entities;

      if (s.entities.length > 0) {
        // Clear items
        filteredEntities = {};

        // Only add those that the caller is subscribed to
        for (let key in entities) {
          if (s.entities.includes(key)) {
            filteredEntities[key] = entities[key];
          }
        }
      }

      if (Object.keys(filteredEntities).length > 0) {
        s.subscriber.onHomeAssistantEntities(filteredEntities);
      }
    });
  }

  public async startListening() {
    if (!this._connection) {
      throw new Error('Not connected to home assistant');
    }

    if (this._unsubscribe) {
      // Already subscribed
      return;
    }

    this._unsubscribe = subscribeEntities(this._connection, (entities) => {
      const changedEntities: Record<string, HassEntity> = {};

      for (const key in entities) {
        const entity = entities[key];
        const previousState = this._entityStates[key]?.state ?? undefined;
        this._entityStates[key] = entity;

        if (previousState === undefined || previousState !== entity.state) {
          changedEntities[key] = entity;
        }
      }

      this.publishEntities(changedEntities);
    });
  }

  public async stopListening() {
    if (!this._unsubscribe) {
      // Already unsubscribed
      return;
    }
  }

  public async callService(entityId: string, service: string = 'toggle') {
    if (!this._connection) {
      throw new Error('Not connected to home assistant');
    }

    callService(this._connection, 'homeassistant', service, {
      entity_id: entityId
    });
  }

  private subscribeInternal(subscriber: HomeAssistantSubscriber): HomeAssistantSubscriberConfig {
    const existing = this._subscribers.find((s) => s.subscriber === subscriber);

    if (!!existing) {
      // Already subscribed, so return
      return existing;
    }

    const config: HomeAssistantSubscriberConfig = {
      subscriber: subscriber,
      entities: []
    };

    this._subscribers.push(config);

    return config;
  }

  public subscribe(subscriber: HomeAssistantSubscriber) {
    this.subscribeInternal(subscriber);
  }

  public unsubscribe(subscriber: HomeAssistantSubscriber) {
    // Just filter to exclude, is ignored if not in subscribe list
    this._subscribers = this._subscribers.filter((s) => s.subscriber !== subscriber);
  }

  public subscribeEntities(subscriber: HomeAssistantSubscriber, entities: string[]) {
    // Make sure subscribed
    const config = this.subscribeInternal(subscriber);

    // The entities to subscribe to
    config.entities = entities;
  }

  public subscribeEntity(subscriber: HomeAssistantSubscriber, entityId: string) {
    this.subscribeEntities(subscriber, [entityId]);
  }

  public getEntities(ids: string[]): Record<string, HassEntity> {
    const entities: Record<string, HassEntity> = {};

    ids.forEach((id) => {
      if (id in this._entityStates) {
        entities[id] = this._entityStates[id];
      }
    });

    return entities;
  }

  public getEntity(id: string): HassEntity | undefined {
    return this._entityStates[id];
  }

  private async initialise() {
    if (!this._connection) {
      return;
    }

    // Reset states
    this._entityStates = {};

    // Get the existing states of all entities
    const states = await getStates(this._connection);
    states.forEach((e) => {
      this._entityStates[e.entity_id] = e;
    });

    const coll = configColl(this._connection);
    await coll.refresh();
    this._unitSystem = coll.state.unit_system;

    this._subscribers.forEach((s) => {
      s.subscriber.onHomeAssistantInitialised();
    });

    // Publish all entities
    this.publishEntities(Object.assign({}, ...states.map((x) => ({ [x.entity_id]: x }))));
  }
}

const homeAssistantSingleton = new HomeAssistant();
export const useHomeAssistant = (): HomeAssistant => {
  return homeAssistantSingleton;
};
