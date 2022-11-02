import DataLoader, { BatchLoadFn, Options } from "dataloader";
import md5 from "md5";

type BatchLoadFnWithPayload<K, V, P> = (
  keys: ReadonlyArray<K>,
  payload: P
) => ReturnType<BatchLoadFn<K, V>>;

export class NullableDataLoader<K, V, P = {}> extends DataLoader<K, V> {
  payload: P;
  payloadHash: string;

  constructor(
    batchLoadFnWithPayload: BatchLoadFnWithPayload<K, V, P>,
    options?: Options<K, V>
  ) {
    const batchLoadFn: BatchLoadFn<K, V> = (keys: ReadonlyArray<K>) =>
      batchLoadFnWithPayload(keys, this.payload);
    super(batchLoadFn, options);
  }

  async loadOrNull(key: K | null | undefined, payload?: P): Promise<V | null> {
    if (!key) {
      return null;
    }

    if (payload) {
      this.processPayload(payload);
    }

    return this.load(key);
  }

  async load(key: K, payload?: P): Promise<V> {
    if (payload) {
      this.processPayload(payload);
    }

    return super.load(key);
  }

  /**
   * Payload сохраняется в объект один раз. В случае, если он поменяется - возвращаем ошибку
   * (В текущей реализации невозможно вернуть корректный ответ на запрос с различными payload)
   */
  private processPayload(payload: P) {
    if (!this.payload) {
      this.payload = payload;
      this.payloadHash = md5(transformPayloadToString(payload));
    } else {
      const payloadHash = md5(transformPayloadToString(payload));

      if (payloadHash !== this.payloadHash) {
        throw new Error("[DataLoaderWithPayload]: Изменился payload");
      }
    }
  }
}

function transformPayloadToString<T>(payload: T): string {
  if (typeof payload !== "object" || payload === null) {
    return `${payload}`;
  }

  if (payload instanceof Date) {
    return payload.toISOString();
  }

  return Object.values(payload).map(transformPayloadToString).join(",");
}
