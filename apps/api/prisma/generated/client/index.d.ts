
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model Store
 * 
 */
export type Store = $Result.DefaultSelection<Prisma.$StorePayload>
/**
 * Model ToolDefinition
 * 
 */
export type ToolDefinition = $Result.DefaultSelection<Prisma.$ToolDefinitionPayload>
/**
 * Model StoreToolAssignment
 * 
 */
export type StoreToolAssignment = $Result.DefaultSelection<Prisma.$StoreToolAssignmentPayload>
/**
 * Model UserStoreAssignment
 * 
 */
export type UserStoreAssignment = $Result.DefaultSelection<Prisma.$UserStoreAssignmentPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model DataProcessingConsent
 * 
 */
export type DataProcessingConsent = $Result.DefaultSelection<Prisma.$DataProcessingConsentPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.store`: Exposes CRUD operations for the **Store** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Stores
    * const stores = await prisma.store.findMany()
    * ```
    */
  get store(): Prisma.StoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.toolDefinition`: Exposes CRUD operations for the **ToolDefinition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ToolDefinitions
    * const toolDefinitions = await prisma.toolDefinition.findMany()
    * ```
    */
  get toolDefinition(): Prisma.ToolDefinitionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.storeToolAssignment`: Exposes CRUD operations for the **StoreToolAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StoreToolAssignments
    * const storeToolAssignments = await prisma.storeToolAssignment.findMany()
    * ```
    */
  get storeToolAssignment(): Prisma.StoreToolAssignmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userStoreAssignment`: Exposes CRUD operations for the **UserStoreAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserStoreAssignments
    * const userStoreAssignments = await prisma.userStoreAssignment.findMany()
    * ```
    */
  get userStoreAssignment(): Prisma.UserStoreAssignmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dataProcessingConsent`: Exposes CRUD operations for the **DataProcessingConsent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DataProcessingConsents
    * const dataProcessingConsents = await prisma.dataProcessingConsent.findMany()
    * ```
    */
  get dataProcessingConsent(): Prisma.DataProcessingConsentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.2
   * Query Engine version: 94a226be1cf2967af2541cca5529f0f7ba866919
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Tenant: 'Tenant',
    Store: 'Store',
    ToolDefinition: 'ToolDefinition',
    StoreToolAssignment: 'StoreToolAssignment',
    UserStoreAssignment: 'UserStoreAssignment',
    Subscription: 'Subscription',
    AuditLog: 'AuditLog',
    DataProcessingConsent: 'DataProcessingConsent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "tenant" | "store" | "toolDefinition" | "storeToolAssignment" | "userStoreAssignment" | "subscription" | "auditLog" | "dataProcessingConsent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      Store: {
        payload: Prisma.$StorePayload<ExtArgs>
        fields: Prisma.StoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          findFirst: {
            args: Prisma.StoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          findMany: {
            args: Prisma.StoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          create: {
            args: Prisma.StoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          createMany: {
            args: Prisma.StoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          delete: {
            args: Prisma.StoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          update: {
            args: Prisma.StoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          deleteMany: {
            args: Prisma.StoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          upsert: {
            args: Prisma.StoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          aggregate: {
            args: Prisma.StoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStore>
          }
          groupBy: {
            args: Prisma.StoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoreCountArgs<ExtArgs>
            result: $Utils.Optional<StoreCountAggregateOutputType> | number
          }
        }
      }
      ToolDefinition: {
        payload: Prisma.$ToolDefinitionPayload<ExtArgs>
        fields: Prisma.ToolDefinitionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ToolDefinitionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ToolDefinitionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>
          }
          findFirst: {
            args: Prisma.ToolDefinitionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ToolDefinitionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>
          }
          findMany: {
            args: Prisma.ToolDefinitionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>[]
          }
          create: {
            args: Prisma.ToolDefinitionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>
          }
          createMany: {
            args: Prisma.ToolDefinitionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ToolDefinitionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>[]
          }
          delete: {
            args: Prisma.ToolDefinitionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>
          }
          update: {
            args: Prisma.ToolDefinitionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>
          }
          deleteMany: {
            args: Prisma.ToolDefinitionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ToolDefinitionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ToolDefinitionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>[]
          }
          upsert: {
            args: Prisma.ToolDefinitionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolDefinitionPayload>
          }
          aggregate: {
            args: Prisma.ToolDefinitionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToolDefinition>
          }
          groupBy: {
            args: Prisma.ToolDefinitionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ToolDefinitionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ToolDefinitionCountArgs<ExtArgs>
            result: $Utils.Optional<ToolDefinitionCountAggregateOutputType> | number
          }
        }
      }
      StoreToolAssignment: {
        payload: Prisma.$StoreToolAssignmentPayload<ExtArgs>
        fields: Prisma.StoreToolAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoreToolAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoreToolAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>
          }
          findFirst: {
            args: Prisma.StoreToolAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoreToolAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>
          }
          findMany: {
            args: Prisma.StoreToolAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>[]
          }
          create: {
            args: Prisma.StoreToolAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>
          }
          createMany: {
            args: Prisma.StoreToolAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StoreToolAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>[]
          }
          delete: {
            args: Prisma.StoreToolAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>
          }
          update: {
            args: Prisma.StoreToolAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.StoreToolAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoreToolAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StoreToolAssignmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>[]
          }
          upsert: {
            args: Prisma.StoreToolAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreToolAssignmentPayload>
          }
          aggregate: {
            args: Prisma.StoreToolAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStoreToolAssignment>
          }
          groupBy: {
            args: Prisma.StoreToolAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoreToolAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoreToolAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<StoreToolAssignmentCountAggregateOutputType> | number
          }
        }
      }
      UserStoreAssignment: {
        payload: Prisma.$UserStoreAssignmentPayload<ExtArgs>
        fields: Prisma.UserStoreAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserStoreAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserStoreAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>
          }
          findFirst: {
            args: Prisma.UserStoreAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserStoreAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>
          }
          findMany: {
            args: Prisma.UserStoreAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>[]
          }
          create: {
            args: Prisma.UserStoreAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>
          }
          createMany: {
            args: Prisma.UserStoreAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserStoreAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>[]
          }
          delete: {
            args: Prisma.UserStoreAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>
          }
          update: {
            args: Prisma.UserStoreAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.UserStoreAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserStoreAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserStoreAssignmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>[]
          }
          upsert: {
            args: Prisma.UserStoreAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoreAssignmentPayload>
          }
          aggregate: {
            args: Prisma.UserStoreAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserStoreAssignment>
          }
          groupBy: {
            args: Prisma.UserStoreAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserStoreAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserStoreAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<UserStoreAssignmentCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      DataProcessingConsent: {
        payload: Prisma.$DataProcessingConsentPayload<ExtArgs>
        fields: Prisma.DataProcessingConsentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DataProcessingConsentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DataProcessingConsentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>
          }
          findFirst: {
            args: Prisma.DataProcessingConsentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DataProcessingConsentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>
          }
          findMany: {
            args: Prisma.DataProcessingConsentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>[]
          }
          create: {
            args: Prisma.DataProcessingConsentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>
          }
          createMany: {
            args: Prisma.DataProcessingConsentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DataProcessingConsentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>[]
          }
          delete: {
            args: Prisma.DataProcessingConsentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>
          }
          update: {
            args: Prisma.DataProcessingConsentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>
          }
          deleteMany: {
            args: Prisma.DataProcessingConsentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DataProcessingConsentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DataProcessingConsentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>[]
          }
          upsert: {
            args: Prisma.DataProcessingConsentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataProcessingConsentPayload>
          }
          aggregate: {
            args: Prisma.DataProcessingConsentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataProcessingConsent>
          }
          groupBy: {
            args: Prisma.DataProcessingConsentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataProcessingConsentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DataProcessingConsentCountArgs<ExtArgs>
            result: $Utils.Optional<DataProcessingConsentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    tenant?: TenantOmit
    store?: StoreOmit
    toolDefinition?: ToolDefinitionOmit
    storeToolAssignment?: StoreToolAssignmentOmit
    userStoreAssignment?: UserStoreAssignmentOmit
    subscription?: SubscriptionOmit
    auditLog?: AuditLogOmit
    dataProcessingConsent?: DataProcessingConsentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    storeAssignments: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    storeAssignments?: boolean | UserCountOutputTypeCountStoreAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStoreAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStoreAssignmentWhereInput
  }


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    users: number
    stores: number
    consents: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs
    stores?: boolean | TenantCountOutputTypeCountStoresArgs
    consents?: boolean | TenantCountOutputTypeCountConsentsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountStoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountConsentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataProcessingConsentWhereInput
  }


  /**
   * Count Type StoreCountOutputType
   */

  export type StoreCountOutputType = {
    tools: number
    userAssignments: number
  }

  export type StoreCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tools?: boolean | StoreCountOutputTypeCountToolsArgs
    userAssignments?: boolean | StoreCountOutputTypeCountUserAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreCountOutputType
     */
    select?: StoreCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountToolsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreToolAssignmentWhereInput
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountUserAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStoreAssignmentWhereInput
  }


  /**
   * Count Type ToolDefinitionCountOutputType
   */

  export type ToolDefinitionCountOutputType = {
    assignments: number
  }

  export type ToolDefinitionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | ToolDefinitionCountOutputTypeCountAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * ToolDefinitionCountOutputType without action
   */
  export type ToolDefinitionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinitionCountOutputType
     */
    select?: ToolDefinitionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ToolDefinitionCountOutputType without action
   */
  export type ToolDefinitionCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreToolAssignmentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    role: string | null
    tenantId: string | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    role: string | null
    tenantId: string | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    passwordHash: number
    role: number
    tenantId: number
    isActive: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    tenantId?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    tenantId?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    tenantId?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string
    passwordHash: string
    role: string
    tenantId: string | null
    isActive: boolean
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    tenantId?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | User$tenantArgs<ExtArgs>
    storeAssignments?: boolean | User$storeAssignmentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    tenantId?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | User$tenantArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    tenantId?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | User$tenantArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    tenantId?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "passwordHash" | "role" | "tenantId" | "isActive" | "lastLoginAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | User$tenantArgs<ExtArgs>
    storeAssignments?: boolean | User$storeAssignmentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | User$tenantArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | User$tenantArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs> | null
      storeAssignments: Prisma.$UserStoreAssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
      passwordHash: string
      role: string
      tenantId: string | null
      isActive: boolean
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends User$tenantArgs<ExtArgs> = {}>(args?: Subset<T, User$tenantArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    storeAssignments<T extends User$storeAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$storeAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly tenantId: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.tenant
   */
  export type User$tenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    where?: TenantWhereInput
  }

  /**
   * User.storeAssignments
   */
  export type User$storeAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    where?: UserStoreAssignmentWhereInput
    orderBy?: UserStoreAssignmentOrderByWithRelationInput | UserStoreAssignmentOrderByWithRelationInput[]
    cursor?: UserStoreAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserStoreAssignmentScalarFieldEnum | UserStoreAssignmentScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    maxUsers: number | null
  }

  export type TenantSumAggregateOutputType = {
    maxUsers: number | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    status: string | null
    contactEmail: string | null
    contactName: string | null
    contactPhone: string | null
    maxUsers: number | null
    logoUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    status: string | null
    contactEmail: string | null
    contactName: string | null
    contactPhone: string | null
    maxUsers: number | null
    logoUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    status: number
    contactEmail: number
    contactName: number
    contactPhone: number
    maxUsers: number
    logoUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantAvgAggregateInputType = {
    maxUsers?: true
  }

  export type TenantSumAggregateInputType = {
    maxUsers?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
    contactEmail?: true
    contactName?: true
    contactPhone?: true
    maxUsers?: true
    logoUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
    contactEmail?: true
    contactName?: true
    contactPhone?: true
    maxUsers?: true
    logoUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
    contactEmail?: true
    contactName?: true
    contactPhone?: true
    maxUsers?: true
    logoUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    name: string
    slug: string
    status: string
    contactEmail: string | null
    contactName: string | null
    contactPhone: string | null
    maxUsers: number
    logoUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
    contactEmail?: boolean
    contactName?: boolean
    contactPhone?: boolean
    maxUsers?: boolean
    logoUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    users?: boolean | Tenant$usersArgs<ExtArgs>
    stores?: boolean | Tenant$storesArgs<ExtArgs>
    subscription?: boolean | Tenant$subscriptionArgs<ExtArgs>
    consents?: boolean | Tenant$consentsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
    contactEmail?: boolean
    contactName?: boolean
    contactPhone?: boolean
    maxUsers?: boolean
    logoUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
    contactEmail?: boolean
    contactName?: boolean
    contactPhone?: boolean
    maxUsers?: boolean
    logoUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
    contactEmail?: boolean
    contactName?: boolean
    contactPhone?: boolean
    maxUsers?: boolean
    logoUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "status" | "contactEmail" | "contactName" | "contactPhone" | "maxUsers" | "logoUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Tenant$usersArgs<ExtArgs>
    stores?: boolean | Tenant$storesArgs<ExtArgs>
    subscription?: boolean | Tenant$subscriptionArgs<ExtArgs>
    consents?: boolean | Tenant$consentsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      stores: Prisma.$StorePayload<ExtArgs>[]
      subscription: Prisma.$SubscriptionPayload<ExtArgs> | null
      consents: Prisma.$DataProcessingConsentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      status: string
      contactEmail: string | null
      contactName: string | null
      contactPhone: string | null
      maxUsers: number
      logoUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Tenant$usersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    stores<T extends Tenant$storesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$storesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscription<T extends Tenant$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$subscriptionArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    consents<T extends Tenant$consentsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$consentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly slug: FieldRef<"Tenant", 'String'>
    readonly status: FieldRef<"Tenant", 'String'>
    readonly contactEmail: FieldRef<"Tenant", 'String'>
    readonly contactName: FieldRef<"Tenant", 'String'>
    readonly contactPhone: FieldRef<"Tenant", 'String'>
    readonly maxUsers: FieldRef<"Tenant", 'Int'>
    readonly logoUrl: FieldRef<"Tenant", 'String'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.users
   */
  export type Tenant$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Tenant.stores
   */
  export type Tenant$storesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    where?: StoreWhereInput
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    cursor?: StoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Tenant.subscription
   */
  export type Tenant$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
  }

  /**
   * Tenant.consents
   */
  export type Tenant$consentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    where?: DataProcessingConsentWhereInput
    orderBy?: DataProcessingConsentOrderByWithRelationInput | DataProcessingConsentOrderByWithRelationInput[]
    cursor?: DataProcessingConsentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DataProcessingConsentScalarFieldEnum | DataProcessingConsentScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model Store
   */

  export type AggregateStore = {
    _count: StoreCountAggregateOutputType | null
    _min: StoreMinAggregateOutputType | null
    _max: StoreMaxAggregateOutputType | null
  }

  export type StoreMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    city: string | null
    address: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoreMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    city: string | null
    address: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoreCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    city: number
    address: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StoreMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    city?: true
    address?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoreMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    city?: true
    address?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoreCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    city?: true
    address?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Store to aggregate.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Stores
    **/
    _count?: true | StoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoreMaxAggregateInputType
  }

  export type GetStoreAggregateType<T extends StoreAggregateArgs> = {
        [P in keyof T & keyof AggregateStore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStore[P]>
      : GetScalarType<T[P], AggregateStore[P]>
  }




  export type StoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreWhereInput
    orderBy?: StoreOrderByWithAggregationInput | StoreOrderByWithAggregationInput[]
    by: StoreScalarFieldEnum[] | StoreScalarFieldEnum
    having?: StoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoreCountAggregateInputType | true
    _min?: StoreMinAggregateInputType
    _max?: StoreMaxAggregateInputType
  }

  export type StoreGroupByOutputType = {
    id: string
    tenantId: string
    name: string
    city: string | null
    address: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: StoreCountAggregateOutputType | null
    _min: StoreMinAggregateOutputType | null
    _max: StoreMaxAggregateOutputType | null
  }

  type GetStoreGroupByPayload<T extends StoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoreGroupByOutputType[P]>
            : GetScalarType<T[P], StoreGroupByOutputType[P]>
        }
      >
    >


  export type StoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    city?: boolean
    address?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    tools?: boolean | Store$toolsArgs<ExtArgs>
    userAssignments?: boolean | Store$userAssignmentsArgs<ExtArgs>
    _count?: boolean | StoreCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["store"]>

  export type StoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    city?: boolean
    address?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["store"]>

  export type StoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    city?: boolean
    address?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["store"]>

  export type StoreSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    city?: boolean
    address?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "city" | "address" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["store"]>
  export type StoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    tools?: boolean | Store$toolsArgs<ExtArgs>
    userAssignments?: boolean | Store$userAssignmentsArgs<ExtArgs>
    _count?: boolean | StoreCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StoreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type StoreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $StorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Store"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      tools: Prisma.$StoreToolAssignmentPayload<ExtArgs>[]
      userAssignments: Prisma.$UserStoreAssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      name: string
      city: string | null
      address: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["store"]>
    composites: {}
  }

  type StoreGetPayload<S extends boolean | null | undefined | StoreDefaultArgs> = $Result.GetResult<Prisma.$StorePayload, S>

  type StoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoreCountAggregateInputType | true
    }

  export interface StoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Store'], meta: { name: 'Store' } }
    /**
     * Find zero or one Store that matches the filter.
     * @param {StoreFindUniqueArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoreFindUniqueArgs>(args: SelectSubset<T, StoreFindUniqueArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Store that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StoreFindUniqueOrThrowArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoreFindUniqueOrThrowArgs>(args: SelectSubset<T, StoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Store that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindFirstArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoreFindFirstArgs>(args?: SelectSubset<T, StoreFindFirstArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Store that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindFirstOrThrowArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoreFindFirstOrThrowArgs>(args?: SelectSubset<T, StoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Stores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stores
     * const stores = await prisma.store.findMany()
     * 
     * // Get first 10 Stores
     * const stores = await prisma.store.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storeWithIdOnly = await prisma.store.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoreFindManyArgs>(args?: SelectSubset<T, StoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Store.
     * @param {StoreCreateArgs} args - Arguments to create a Store.
     * @example
     * // Create one Store
     * const Store = await prisma.store.create({
     *   data: {
     *     // ... data to create a Store
     *   }
     * })
     * 
     */
    create<T extends StoreCreateArgs>(args: SelectSubset<T, StoreCreateArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Stores.
     * @param {StoreCreateManyArgs} args - Arguments to create many Stores.
     * @example
     * // Create many Stores
     * const store = await prisma.store.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoreCreateManyArgs>(args?: SelectSubset<T, StoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Stores and returns the data saved in the database.
     * @param {StoreCreateManyAndReturnArgs} args - Arguments to create many Stores.
     * @example
     * // Create many Stores
     * const store = await prisma.store.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Stores and only return the `id`
     * const storeWithIdOnly = await prisma.store.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StoreCreateManyAndReturnArgs>(args?: SelectSubset<T, StoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Store.
     * @param {StoreDeleteArgs} args - Arguments to delete one Store.
     * @example
     * // Delete one Store
     * const Store = await prisma.store.delete({
     *   where: {
     *     // ... filter to delete one Store
     *   }
     * })
     * 
     */
    delete<T extends StoreDeleteArgs>(args: SelectSubset<T, StoreDeleteArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Store.
     * @param {StoreUpdateArgs} args - Arguments to update one Store.
     * @example
     * // Update one Store
     * const store = await prisma.store.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoreUpdateArgs>(args: SelectSubset<T, StoreUpdateArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Stores.
     * @param {StoreDeleteManyArgs} args - Arguments to filter Stores to delete.
     * @example
     * // Delete a few Stores
     * const { count } = await prisma.store.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoreDeleteManyArgs>(args?: SelectSubset<T, StoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stores
     * const store = await prisma.store.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoreUpdateManyArgs>(args: SelectSubset<T, StoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stores and returns the data updated in the database.
     * @param {StoreUpdateManyAndReturnArgs} args - Arguments to update many Stores.
     * @example
     * // Update many Stores
     * const store = await prisma.store.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Stores and only return the `id`
     * const storeWithIdOnly = await prisma.store.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StoreUpdateManyAndReturnArgs>(args: SelectSubset<T, StoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Store.
     * @param {StoreUpsertArgs} args - Arguments to update or create a Store.
     * @example
     * // Update or create a Store
     * const store = await prisma.store.upsert({
     *   create: {
     *     // ... data to create a Store
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Store we want to update
     *   }
     * })
     */
    upsert<T extends StoreUpsertArgs>(args: SelectSubset<T, StoreUpsertArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreCountArgs} args - Arguments to filter Stores to count.
     * @example
     * // Count the number of Stores
     * const count = await prisma.store.count({
     *   where: {
     *     // ... the filter for the Stores we want to count
     *   }
     * })
    **/
    count<T extends StoreCountArgs>(
      args?: Subset<T, StoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Store.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoreAggregateArgs>(args: Subset<T, StoreAggregateArgs>): Prisma.PrismaPromise<GetStoreAggregateType<T>>

    /**
     * Group by Store.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoreGroupByArgs['orderBy'] }
        : { orderBy?: StoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Store model
   */
  readonly fields: StoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Store.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tools<T extends Store$toolsArgs<ExtArgs> = {}>(args?: Subset<T, Store$toolsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userAssignments<T extends Store$userAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Store$userAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Store model
   */
  interface StoreFieldRefs {
    readonly id: FieldRef<"Store", 'String'>
    readonly tenantId: FieldRef<"Store", 'String'>
    readonly name: FieldRef<"Store", 'String'>
    readonly city: FieldRef<"Store", 'String'>
    readonly address: FieldRef<"Store", 'String'>
    readonly isActive: FieldRef<"Store", 'Boolean'>
    readonly createdAt: FieldRef<"Store", 'DateTime'>
    readonly updatedAt: FieldRef<"Store", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Store findUnique
   */
  export type StoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store findUniqueOrThrow
   */
  export type StoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store findFirst
   */
  export type StoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stores.
     */
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store findFirstOrThrow
   */
  export type StoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stores.
     */
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store findMany
   */
  export type StoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Stores to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store create
   */
  export type StoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The data needed to create a Store.
     */
    data: XOR<StoreCreateInput, StoreUncheckedCreateInput>
  }

  /**
   * Store createMany
   */
  export type StoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Stores.
     */
    data: StoreCreateManyInput | StoreCreateManyInput[]
  }

  /**
   * Store createManyAndReturn
   */
  export type StoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * The data used to create many Stores.
     */
    data: StoreCreateManyInput | StoreCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Store update
   */
  export type StoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The data needed to update a Store.
     */
    data: XOR<StoreUpdateInput, StoreUncheckedUpdateInput>
    /**
     * Choose, which Store to update.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store updateMany
   */
  export type StoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Stores.
     */
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyInput>
    /**
     * Filter which Stores to update
     */
    where?: StoreWhereInput
    /**
     * Limit how many Stores to update.
     */
    limit?: number
  }

  /**
   * Store updateManyAndReturn
   */
  export type StoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * The data used to update Stores.
     */
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyInput>
    /**
     * Filter which Stores to update
     */
    where?: StoreWhereInput
    /**
     * Limit how many Stores to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Store upsert
   */
  export type StoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The filter to search for the Store to update in case it exists.
     */
    where: StoreWhereUniqueInput
    /**
     * In case the Store found by the `where` argument doesn't exist, create a new Store with this data.
     */
    create: XOR<StoreCreateInput, StoreUncheckedCreateInput>
    /**
     * In case the Store was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoreUpdateInput, StoreUncheckedUpdateInput>
  }

  /**
   * Store delete
   */
  export type StoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter which Store to delete.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store deleteMany
   */
  export type StoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stores to delete
     */
    where?: StoreWhereInput
    /**
     * Limit how many Stores to delete.
     */
    limit?: number
  }

  /**
   * Store.tools
   */
  export type Store$toolsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    where?: StoreToolAssignmentWhereInput
    orderBy?: StoreToolAssignmentOrderByWithRelationInput | StoreToolAssignmentOrderByWithRelationInput[]
    cursor?: StoreToolAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreToolAssignmentScalarFieldEnum | StoreToolAssignmentScalarFieldEnum[]
  }

  /**
   * Store.userAssignments
   */
  export type Store$userAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    where?: UserStoreAssignmentWhereInput
    orderBy?: UserStoreAssignmentOrderByWithRelationInput | UserStoreAssignmentOrderByWithRelationInput[]
    cursor?: UserStoreAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserStoreAssignmentScalarFieldEnum | UserStoreAssignmentScalarFieldEnum[]
  }

  /**
   * Store without action
   */
  export type StoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
  }


  /**
   * Model ToolDefinition
   */

  export type AggregateToolDefinition = {
    _count: ToolDefinitionCountAggregateOutputType | null
    _avg: ToolDefinitionAvgAggregateOutputType | null
    _sum: ToolDefinitionSumAggregateOutputType | null
    _min: ToolDefinitionMinAggregateOutputType | null
    _max: ToolDefinitionMaxAggregateOutputType | null
  }

  export type ToolDefinitionAvgAggregateOutputType = {
    priceMonthly: number | null
    sortOrder: number | null
  }

  export type ToolDefinitionSumAggregateOutputType = {
    priceMonthly: number | null
    sortOrder: number | null
  }

  export type ToolDefinitionMinAggregateOutputType = {
    id: string | null
    key: string | null
    name: string | null
    description: string | null
    category: string | null
    icon: string | null
    priceMonthly: number | null
    isActive: boolean | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ToolDefinitionMaxAggregateOutputType = {
    id: string | null
    key: string | null
    name: string | null
    description: string | null
    category: string | null
    icon: string | null
    priceMonthly: number | null
    isActive: boolean | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ToolDefinitionCountAggregateOutputType = {
    id: number
    key: number
    name: number
    description: number
    category: number
    icon: number
    priceMonthly: number
    isActive: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ToolDefinitionAvgAggregateInputType = {
    priceMonthly?: true
    sortOrder?: true
  }

  export type ToolDefinitionSumAggregateInputType = {
    priceMonthly?: true
    sortOrder?: true
  }

  export type ToolDefinitionMinAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
    category?: true
    icon?: true
    priceMonthly?: true
    isActive?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ToolDefinitionMaxAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
    category?: true
    icon?: true
    priceMonthly?: true
    isActive?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ToolDefinitionCountAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
    category?: true
    icon?: true
    priceMonthly?: true
    isActive?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ToolDefinitionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ToolDefinition to aggregate.
     */
    where?: ToolDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolDefinitions to fetch.
     */
    orderBy?: ToolDefinitionOrderByWithRelationInput | ToolDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ToolDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ToolDefinitions
    **/
    _count?: true | ToolDefinitionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ToolDefinitionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ToolDefinitionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ToolDefinitionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ToolDefinitionMaxAggregateInputType
  }

  export type GetToolDefinitionAggregateType<T extends ToolDefinitionAggregateArgs> = {
        [P in keyof T & keyof AggregateToolDefinition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToolDefinition[P]>
      : GetScalarType<T[P], AggregateToolDefinition[P]>
  }




  export type ToolDefinitionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ToolDefinitionWhereInput
    orderBy?: ToolDefinitionOrderByWithAggregationInput | ToolDefinitionOrderByWithAggregationInput[]
    by: ToolDefinitionScalarFieldEnum[] | ToolDefinitionScalarFieldEnum
    having?: ToolDefinitionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ToolDefinitionCountAggregateInputType | true
    _avg?: ToolDefinitionAvgAggregateInputType
    _sum?: ToolDefinitionSumAggregateInputType
    _min?: ToolDefinitionMinAggregateInputType
    _max?: ToolDefinitionMaxAggregateInputType
  }

  export type ToolDefinitionGroupByOutputType = {
    id: string
    key: string
    name: string
    description: string | null
    category: string
    icon: string | null
    priceMonthly: number
    isActive: boolean
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: ToolDefinitionCountAggregateOutputType | null
    _avg: ToolDefinitionAvgAggregateOutputType | null
    _sum: ToolDefinitionSumAggregateOutputType | null
    _min: ToolDefinitionMinAggregateOutputType | null
    _max: ToolDefinitionMaxAggregateOutputType | null
  }

  type GetToolDefinitionGroupByPayload<T extends ToolDefinitionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ToolDefinitionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ToolDefinitionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ToolDefinitionGroupByOutputType[P]>
            : GetScalarType<T[P], ToolDefinitionGroupByOutputType[P]>
        }
      >
    >


  export type ToolDefinitionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    icon?: boolean
    priceMonthly?: boolean
    isActive?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assignments?: boolean | ToolDefinition$assignmentsArgs<ExtArgs>
    _count?: boolean | ToolDefinitionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["toolDefinition"]>

  export type ToolDefinitionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    icon?: boolean
    priceMonthly?: boolean
    isActive?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["toolDefinition"]>

  export type ToolDefinitionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    icon?: boolean
    priceMonthly?: boolean
    isActive?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["toolDefinition"]>

  export type ToolDefinitionSelectScalar = {
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    icon?: boolean
    priceMonthly?: boolean
    isActive?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ToolDefinitionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "name" | "description" | "category" | "icon" | "priceMonthly" | "isActive" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["toolDefinition"]>
  export type ToolDefinitionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | ToolDefinition$assignmentsArgs<ExtArgs>
    _count?: boolean | ToolDefinitionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ToolDefinitionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ToolDefinitionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ToolDefinitionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ToolDefinition"
    objects: {
      assignments: Prisma.$StoreToolAssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      name: string
      description: string | null
      category: string
      icon: string | null
      priceMonthly: number
      isActive: boolean
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["toolDefinition"]>
    composites: {}
  }

  type ToolDefinitionGetPayload<S extends boolean | null | undefined | ToolDefinitionDefaultArgs> = $Result.GetResult<Prisma.$ToolDefinitionPayload, S>

  type ToolDefinitionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ToolDefinitionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ToolDefinitionCountAggregateInputType | true
    }

  export interface ToolDefinitionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ToolDefinition'], meta: { name: 'ToolDefinition' } }
    /**
     * Find zero or one ToolDefinition that matches the filter.
     * @param {ToolDefinitionFindUniqueArgs} args - Arguments to find a ToolDefinition
     * @example
     * // Get one ToolDefinition
     * const toolDefinition = await prisma.toolDefinition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ToolDefinitionFindUniqueArgs>(args: SelectSubset<T, ToolDefinitionFindUniqueArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ToolDefinition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ToolDefinitionFindUniqueOrThrowArgs} args - Arguments to find a ToolDefinition
     * @example
     * // Get one ToolDefinition
     * const toolDefinition = await prisma.toolDefinition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ToolDefinitionFindUniqueOrThrowArgs>(args: SelectSubset<T, ToolDefinitionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ToolDefinition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolDefinitionFindFirstArgs} args - Arguments to find a ToolDefinition
     * @example
     * // Get one ToolDefinition
     * const toolDefinition = await prisma.toolDefinition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ToolDefinitionFindFirstArgs>(args?: SelectSubset<T, ToolDefinitionFindFirstArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ToolDefinition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolDefinitionFindFirstOrThrowArgs} args - Arguments to find a ToolDefinition
     * @example
     * // Get one ToolDefinition
     * const toolDefinition = await prisma.toolDefinition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ToolDefinitionFindFirstOrThrowArgs>(args?: SelectSubset<T, ToolDefinitionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ToolDefinitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolDefinitionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ToolDefinitions
     * const toolDefinitions = await prisma.toolDefinition.findMany()
     * 
     * // Get first 10 ToolDefinitions
     * const toolDefinitions = await prisma.toolDefinition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const toolDefinitionWithIdOnly = await prisma.toolDefinition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ToolDefinitionFindManyArgs>(args?: SelectSubset<T, ToolDefinitionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ToolDefinition.
     * @param {ToolDefinitionCreateArgs} args - Arguments to create a ToolDefinition.
     * @example
     * // Create one ToolDefinition
     * const ToolDefinition = await prisma.toolDefinition.create({
     *   data: {
     *     // ... data to create a ToolDefinition
     *   }
     * })
     * 
     */
    create<T extends ToolDefinitionCreateArgs>(args: SelectSubset<T, ToolDefinitionCreateArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ToolDefinitions.
     * @param {ToolDefinitionCreateManyArgs} args - Arguments to create many ToolDefinitions.
     * @example
     * // Create many ToolDefinitions
     * const toolDefinition = await prisma.toolDefinition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ToolDefinitionCreateManyArgs>(args?: SelectSubset<T, ToolDefinitionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ToolDefinitions and returns the data saved in the database.
     * @param {ToolDefinitionCreateManyAndReturnArgs} args - Arguments to create many ToolDefinitions.
     * @example
     * // Create many ToolDefinitions
     * const toolDefinition = await prisma.toolDefinition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ToolDefinitions and only return the `id`
     * const toolDefinitionWithIdOnly = await prisma.toolDefinition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ToolDefinitionCreateManyAndReturnArgs>(args?: SelectSubset<T, ToolDefinitionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ToolDefinition.
     * @param {ToolDefinitionDeleteArgs} args - Arguments to delete one ToolDefinition.
     * @example
     * // Delete one ToolDefinition
     * const ToolDefinition = await prisma.toolDefinition.delete({
     *   where: {
     *     // ... filter to delete one ToolDefinition
     *   }
     * })
     * 
     */
    delete<T extends ToolDefinitionDeleteArgs>(args: SelectSubset<T, ToolDefinitionDeleteArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ToolDefinition.
     * @param {ToolDefinitionUpdateArgs} args - Arguments to update one ToolDefinition.
     * @example
     * // Update one ToolDefinition
     * const toolDefinition = await prisma.toolDefinition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ToolDefinitionUpdateArgs>(args: SelectSubset<T, ToolDefinitionUpdateArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ToolDefinitions.
     * @param {ToolDefinitionDeleteManyArgs} args - Arguments to filter ToolDefinitions to delete.
     * @example
     * // Delete a few ToolDefinitions
     * const { count } = await prisma.toolDefinition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ToolDefinitionDeleteManyArgs>(args?: SelectSubset<T, ToolDefinitionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ToolDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolDefinitionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ToolDefinitions
     * const toolDefinition = await prisma.toolDefinition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ToolDefinitionUpdateManyArgs>(args: SelectSubset<T, ToolDefinitionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ToolDefinitions and returns the data updated in the database.
     * @param {ToolDefinitionUpdateManyAndReturnArgs} args - Arguments to update many ToolDefinitions.
     * @example
     * // Update many ToolDefinitions
     * const toolDefinition = await prisma.toolDefinition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ToolDefinitions and only return the `id`
     * const toolDefinitionWithIdOnly = await prisma.toolDefinition.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ToolDefinitionUpdateManyAndReturnArgs>(args: SelectSubset<T, ToolDefinitionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ToolDefinition.
     * @param {ToolDefinitionUpsertArgs} args - Arguments to update or create a ToolDefinition.
     * @example
     * // Update or create a ToolDefinition
     * const toolDefinition = await prisma.toolDefinition.upsert({
     *   create: {
     *     // ... data to create a ToolDefinition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ToolDefinition we want to update
     *   }
     * })
     */
    upsert<T extends ToolDefinitionUpsertArgs>(args: SelectSubset<T, ToolDefinitionUpsertArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ToolDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolDefinitionCountArgs} args - Arguments to filter ToolDefinitions to count.
     * @example
     * // Count the number of ToolDefinitions
     * const count = await prisma.toolDefinition.count({
     *   where: {
     *     // ... the filter for the ToolDefinitions we want to count
     *   }
     * })
    **/
    count<T extends ToolDefinitionCountArgs>(
      args?: Subset<T, ToolDefinitionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ToolDefinitionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ToolDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolDefinitionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ToolDefinitionAggregateArgs>(args: Subset<T, ToolDefinitionAggregateArgs>): Prisma.PrismaPromise<GetToolDefinitionAggregateType<T>>

    /**
     * Group by ToolDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolDefinitionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ToolDefinitionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ToolDefinitionGroupByArgs['orderBy'] }
        : { orderBy?: ToolDefinitionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ToolDefinitionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetToolDefinitionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ToolDefinition model
   */
  readonly fields: ToolDefinitionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ToolDefinition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ToolDefinitionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignments<T extends ToolDefinition$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, ToolDefinition$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ToolDefinition model
   */
  interface ToolDefinitionFieldRefs {
    readonly id: FieldRef<"ToolDefinition", 'String'>
    readonly key: FieldRef<"ToolDefinition", 'String'>
    readonly name: FieldRef<"ToolDefinition", 'String'>
    readonly description: FieldRef<"ToolDefinition", 'String'>
    readonly category: FieldRef<"ToolDefinition", 'String'>
    readonly icon: FieldRef<"ToolDefinition", 'String'>
    readonly priceMonthly: FieldRef<"ToolDefinition", 'Int'>
    readonly isActive: FieldRef<"ToolDefinition", 'Boolean'>
    readonly sortOrder: FieldRef<"ToolDefinition", 'Int'>
    readonly createdAt: FieldRef<"ToolDefinition", 'DateTime'>
    readonly updatedAt: FieldRef<"ToolDefinition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ToolDefinition findUnique
   */
  export type ToolDefinitionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which ToolDefinition to fetch.
     */
    where: ToolDefinitionWhereUniqueInput
  }

  /**
   * ToolDefinition findUniqueOrThrow
   */
  export type ToolDefinitionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which ToolDefinition to fetch.
     */
    where: ToolDefinitionWhereUniqueInput
  }

  /**
   * ToolDefinition findFirst
   */
  export type ToolDefinitionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which ToolDefinition to fetch.
     */
    where?: ToolDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolDefinitions to fetch.
     */
    orderBy?: ToolDefinitionOrderByWithRelationInput | ToolDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ToolDefinitions.
     */
    cursor?: ToolDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ToolDefinitions.
     */
    distinct?: ToolDefinitionScalarFieldEnum | ToolDefinitionScalarFieldEnum[]
  }

  /**
   * ToolDefinition findFirstOrThrow
   */
  export type ToolDefinitionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which ToolDefinition to fetch.
     */
    where?: ToolDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolDefinitions to fetch.
     */
    orderBy?: ToolDefinitionOrderByWithRelationInput | ToolDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ToolDefinitions.
     */
    cursor?: ToolDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ToolDefinitions.
     */
    distinct?: ToolDefinitionScalarFieldEnum | ToolDefinitionScalarFieldEnum[]
  }

  /**
   * ToolDefinition findMany
   */
  export type ToolDefinitionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which ToolDefinitions to fetch.
     */
    where?: ToolDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolDefinitions to fetch.
     */
    orderBy?: ToolDefinitionOrderByWithRelationInput | ToolDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ToolDefinitions.
     */
    cursor?: ToolDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolDefinitions.
     */
    skip?: number
    distinct?: ToolDefinitionScalarFieldEnum | ToolDefinitionScalarFieldEnum[]
  }

  /**
   * ToolDefinition create
   */
  export type ToolDefinitionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * The data needed to create a ToolDefinition.
     */
    data: XOR<ToolDefinitionCreateInput, ToolDefinitionUncheckedCreateInput>
  }

  /**
   * ToolDefinition createMany
   */
  export type ToolDefinitionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ToolDefinitions.
     */
    data: ToolDefinitionCreateManyInput | ToolDefinitionCreateManyInput[]
  }

  /**
   * ToolDefinition createManyAndReturn
   */
  export type ToolDefinitionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * The data used to create many ToolDefinitions.
     */
    data: ToolDefinitionCreateManyInput | ToolDefinitionCreateManyInput[]
  }

  /**
   * ToolDefinition update
   */
  export type ToolDefinitionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * The data needed to update a ToolDefinition.
     */
    data: XOR<ToolDefinitionUpdateInput, ToolDefinitionUncheckedUpdateInput>
    /**
     * Choose, which ToolDefinition to update.
     */
    where: ToolDefinitionWhereUniqueInput
  }

  /**
   * ToolDefinition updateMany
   */
  export type ToolDefinitionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ToolDefinitions.
     */
    data: XOR<ToolDefinitionUpdateManyMutationInput, ToolDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which ToolDefinitions to update
     */
    where?: ToolDefinitionWhereInput
    /**
     * Limit how many ToolDefinitions to update.
     */
    limit?: number
  }

  /**
   * ToolDefinition updateManyAndReturn
   */
  export type ToolDefinitionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * The data used to update ToolDefinitions.
     */
    data: XOR<ToolDefinitionUpdateManyMutationInput, ToolDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which ToolDefinitions to update
     */
    where?: ToolDefinitionWhereInput
    /**
     * Limit how many ToolDefinitions to update.
     */
    limit?: number
  }

  /**
   * ToolDefinition upsert
   */
  export type ToolDefinitionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * The filter to search for the ToolDefinition to update in case it exists.
     */
    where: ToolDefinitionWhereUniqueInput
    /**
     * In case the ToolDefinition found by the `where` argument doesn't exist, create a new ToolDefinition with this data.
     */
    create: XOR<ToolDefinitionCreateInput, ToolDefinitionUncheckedCreateInput>
    /**
     * In case the ToolDefinition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ToolDefinitionUpdateInput, ToolDefinitionUncheckedUpdateInput>
  }

  /**
   * ToolDefinition delete
   */
  export type ToolDefinitionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
    /**
     * Filter which ToolDefinition to delete.
     */
    where: ToolDefinitionWhereUniqueInput
  }

  /**
   * ToolDefinition deleteMany
   */
  export type ToolDefinitionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ToolDefinitions to delete
     */
    where?: ToolDefinitionWhereInput
    /**
     * Limit how many ToolDefinitions to delete.
     */
    limit?: number
  }

  /**
   * ToolDefinition.assignments
   */
  export type ToolDefinition$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    where?: StoreToolAssignmentWhereInput
    orderBy?: StoreToolAssignmentOrderByWithRelationInput | StoreToolAssignmentOrderByWithRelationInput[]
    cursor?: StoreToolAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreToolAssignmentScalarFieldEnum | StoreToolAssignmentScalarFieldEnum[]
  }

  /**
   * ToolDefinition without action
   */
  export type ToolDefinitionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolDefinition
     */
    select?: ToolDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolDefinition
     */
    omit?: ToolDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolDefinitionInclude<ExtArgs> | null
  }


  /**
   * Model StoreToolAssignment
   */

  export type AggregateStoreToolAssignment = {
    _count: StoreToolAssignmentCountAggregateOutputType | null
    _min: StoreToolAssignmentMinAggregateOutputType | null
    _max: StoreToolAssignmentMaxAggregateOutputType | null
  }

  export type StoreToolAssignmentMinAggregateOutputType = {
    id: string | null
    storeId: string | null
    toolId: string | null
    isActive: boolean | null
    assignedAt: Date | null
    config: string | null
  }

  export type StoreToolAssignmentMaxAggregateOutputType = {
    id: string | null
    storeId: string | null
    toolId: string | null
    isActive: boolean | null
    assignedAt: Date | null
    config: string | null
  }

  export type StoreToolAssignmentCountAggregateOutputType = {
    id: number
    storeId: number
    toolId: number
    isActive: number
    assignedAt: number
    config: number
    _all: number
  }


  export type StoreToolAssignmentMinAggregateInputType = {
    id?: true
    storeId?: true
    toolId?: true
    isActive?: true
    assignedAt?: true
    config?: true
  }

  export type StoreToolAssignmentMaxAggregateInputType = {
    id?: true
    storeId?: true
    toolId?: true
    isActive?: true
    assignedAt?: true
    config?: true
  }

  export type StoreToolAssignmentCountAggregateInputType = {
    id?: true
    storeId?: true
    toolId?: true
    isActive?: true
    assignedAt?: true
    config?: true
    _all?: true
  }

  export type StoreToolAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoreToolAssignment to aggregate.
     */
    where?: StoreToolAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreToolAssignments to fetch.
     */
    orderBy?: StoreToolAssignmentOrderByWithRelationInput | StoreToolAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoreToolAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreToolAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreToolAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StoreToolAssignments
    **/
    _count?: true | StoreToolAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoreToolAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoreToolAssignmentMaxAggregateInputType
  }

  export type GetStoreToolAssignmentAggregateType<T extends StoreToolAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateStoreToolAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStoreToolAssignment[P]>
      : GetScalarType<T[P], AggregateStoreToolAssignment[P]>
  }




  export type StoreToolAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreToolAssignmentWhereInput
    orderBy?: StoreToolAssignmentOrderByWithAggregationInput | StoreToolAssignmentOrderByWithAggregationInput[]
    by: StoreToolAssignmentScalarFieldEnum[] | StoreToolAssignmentScalarFieldEnum
    having?: StoreToolAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoreToolAssignmentCountAggregateInputType | true
    _min?: StoreToolAssignmentMinAggregateInputType
    _max?: StoreToolAssignmentMaxAggregateInputType
  }

  export type StoreToolAssignmentGroupByOutputType = {
    id: string
    storeId: string
    toolId: string
    isActive: boolean
    assignedAt: Date
    config: string | null
    _count: StoreToolAssignmentCountAggregateOutputType | null
    _min: StoreToolAssignmentMinAggregateOutputType | null
    _max: StoreToolAssignmentMaxAggregateOutputType | null
  }

  type GetStoreToolAssignmentGroupByPayload<T extends StoreToolAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoreToolAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoreToolAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoreToolAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], StoreToolAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type StoreToolAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    toolId?: boolean
    isActive?: boolean
    assignedAt?: boolean
    config?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
    tool?: boolean | ToolDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storeToolAssignment"]>

  export type StoreToolAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    toolId?: boolean
    isActive?: boolean
    assignedAt?: boolean
    config?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
    tool?: boolean | ToolDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storeToolAssignment"]>

  export type StoreToolAssignmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    toolId?: boolean
    isActive?: boolean
    assignedAt?: boolean
    config?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
    tool?: boolean | ToolDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storeToolAssignment"]>

  export type StoreToolAssignmentSelectScalar = {
    id?: boolean
    storeId?: boolean
    toolId?: boolean
    isActive?: boolean
    assignedAt?: boolean
    config?: boolean
  }

  export type StoreToolAssignmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "storeId" | "toolId" | "isActive" | "assignedAt" | "config", ExtArgs["result"]["storeToolAssignment"]>
  export type StoreToolAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
    tool?: boolean | ToolDefinitionDefaultArgs<ExtArgs>
  }
  export type StoreToolAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
    tool?: boolean | ToolDefinitionDefaultArgs<ExtArgs>
  }
  export type StoreToolAssignmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
    tool?: boolean | ToolDefinitionDefaultArgs<ExtArgs>
  }

  export type $StoreToolAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StoreToolAssignment"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
      tool: Prisma.$ToolDefinitionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeId: string
      toolId: string
      isActive: boolean
      assignedAt: Date
      config: string | null
    }, ExtArgs["result"]["storeToolAssignment"]>
    composites: {}
  }

  type StoreToolAssignmentGetPayload<S extends boolean | null | undefined | StoreToolAssignmentDefaultArgs> = $Result.GetResult<Prisma.$StoreToolAssignmentPayload, S>

  type StoreToolAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StoreToolAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoreToolAssignmentCountAggregateInputType | true
    }

  export interface StoreToolAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StoreToolAssignment'], meta: { name: 'StoreToolAssignment' } }
    /**
     * Find zero or one StoreToolAssignment that matches the filter.
     * @param {StoreToolAssignmentFindUniqueArgs} args - Arguments to find a StoreToolAssignment
     * @example
     * // Get one StoreToolAssignment
     * const storeToolAssignment = await prisma.storeToolAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoreToolAssignmentFindUniqueArgs>(args: SelectSubset<T, StoreToolAssignmentFindUniqueArgs<ExtArgs>>): Prisma__StoreToolAssignmentClient<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StoreToolAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StoreToolAssignmentFindUniqueOrThrowArgs} args - Arguments to find a StoreToolAssignment
     * @example
     * // Get one StoreToolAssignment
     * const storeToolAssignment = await prisma.storeToolAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoreToolAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, StoreToolAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoreToolAssignmentClient<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoreToolAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreToolAssignmentFindFirstArgs} args - Arguments to find a StoreToolAssignment
     * @example
     * // Get one StoreToolAssignment
     * const storeToolAssignment = await prisma.storeToolAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoreToolAssignmentFindFirstArgs>(args?: SelectSubset<T, StoreToolAssignmentFindFirstArgs<ExtArgs>>): Prisma__StoreToolAssignmentClient<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoreToolAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreToolAssignmentFindFirstOrThrowArgs} args - Arguments to find a StoreToolAssignment
     * @example
     * // Get one StoreToolAssignment
     * const storeToolAssignment = await prisma.storeToolAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoreToolAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, StoreToolAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoreToolAssignmentClient<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StoreToolAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreToolAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StoreToolAssignments
     * const storeToolAssignments = await prisma.storeToolAssignment.findMany()
     * 
     * // Get first 10 StoreToolAssignments
     * const storeToolAssignments = await prisma.storeToolAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storeToolAssignmentWithIdOnly = await prisma.storeToolAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoreToolAssignmentFindManyArgs>(args?: SelectSubset<T, StoreToolAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StoreToolAssignment.
     * @param {StoreToolAssignmentCreateArgs} args - Arguments to create a StoreToolAssignment.
     * @example
     * // Create one StoreToolAssignment
     * const StoreToolAssignment = await prisma.storeToolAssignment.create({
     *   data: {
     *     // ... data to create a StoreToolAssignment
     *   }
     * })
     * 
     */
    create<T extends StoreToolAssignmentCreateArgs>(args: SelectSubset<T, StoreToolAssignmentCreateArgs<ExtArgs>>): Prisma__StoreToolAssignmentClient<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StoreToolAssignments.
     * @param {StoreToolAssignmentCreateManyArgs} args - Arguments to create many StoreToolAssignments.
     * @example
     * // Create many StoreToolAssignments
     * const storeToolAssignment = await prisma.storeToolAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoreToolAssignmentCreateManyArgs>(args?: SelectSubset<T, StoreToolAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StoreToolAssignments and returns the data saved in the database.
     * @param {StoreToolAssignmentCreateManyAndReturnArgs} args - Arguments to create many StoreToolAssignments.
     * @example
     * // Create many StoreToolAssignments
     * const storeToolAssignment = await prisma.storeToolAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StoreToolAssignments and only return the `id`
     * const storeToolAssignmentWithIdOnly = await prisma.storeToolAssignment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StoreToolAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, StoreToolAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StoreToolAssignment.
     * @param {StoreToolAssignmentDeleteArgs} args - Arguments to delete one StoreToolAssignment.
     * @example
     * // Delete one StoreToolAssignment
     * const StoreToolAssignment = await prisma.storeToolAssignment.delete({
     *   where: {
     *     // ... filter to delete one StoreToolAssignment
     *   }
     * })
     * 
     */
    delete<T extends StoreToolAssignmentDeleteArgs>(args: SelectSubset<T, StoreToolAssignmentDeleteArgs<ExtArgs>>): Prisma__StoreToolAssignmentClient<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StoreToolAssignment.
     * @param {StoreToolAssignmentUpdateArgs} args - Arguments to update one StoreToolAssignment.
     * @example
     * // Update one StoreToolAssignment
     * const storeToolAssignment = await prisma.storeToolAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoreToolAssignmentUpdateArgs>(args: SelectSubset<T, StoreToolAssignmentUpdateArgs<ExtArgs>>): Prisma__StoreToolAssignmentClient<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StoreToolAssignments.
     * @param {StoreToolAssignmentDeleteManyArgs} args - Arguments to filter StoreToolAssignments to delete.
     * @example
     * // Delete a few StoreToolAssignments
     * const { count } = await prisma.storeToolAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoreToolAssignmentDeleteManyArgs>(args?: SelectSubset<T, StoreToolAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoreToolAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreToolAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StoreToolAssignments
     * const storeToolAssignment = await prisma.storeToolAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoreToolAssignmentUpdateManyArgs>(args: SelectSubset<T, StoreToolAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoreToolAssignments and returns the data updated in the database.
     * @param {StoreToolAssignmentUpdateManyAndReturnArgs} args - Arguments to update many StoreToolAssignments.
     * @example
     * // Update many StoreToolAssignments
     * const storeToolAssignment = await prisma.storeToolAssignment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StoreToolAssignments and only return the `id`
     * const storeToolAssignmentWithIdOnly = await prisma.storeToolAssignment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StoreToolAssignmentUpdateManyAndReturnArgs>(args: SelectSubset<T, StoreToolAssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StoreToolAssignment.
     * @param {StoreToolAssignmentUpsertArgs} args - Arguments to update or create a StoreToolAssignment.
     * @example
     * // Update or create a StoreToolAssignment
     * const storeToolAssignment = await prisma.storeToolAssignment.upsert({
     *   create: {
     *     // ... data to create a StoreToolAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StoreToolAssignment we want to update
     *   }
     * })
     */
    upsert<T extends StoreToolAssignmentUpsertArgs>(args: SelectSubset<T, StoreToolAssignmentUpsertArgs<ExtArgs>>): Prisma__StoreToolAssignmentClient<$Result.GetResult<Prisma.$StoreToolAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StoreToolAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreToolAssignmentCountArgs} args - Arguments to filter StoreToolAssignments to count.
     * @example
     * // Count the number of StoreToolAssignments
     * const count = await prisma.storeToolAssignment.count({
     *   where: {
     *     // ... the filter for the StoreToolAssignments we want to count
     *   }
     * })
    **/
    count<T extends StoreToolAssignmentCountArgs>(
      args?: Subset<T, StoreToolAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoreToolAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StoreToolAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreToolAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoreToolAssignmentAggregateArgs>(args: Subset<T, StoreToolAssignmentAggregateArgs>): Prisma.PrismaPromise<GetStoreToolAssignmentAggregateType<T>>

    /**
     * Group by StoreToolAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreToolAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoreToolAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoreToolAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: StoreToolAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoreToolAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoreToolAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StoreToolAssignment model
   */
  readonly fields: StoreToolAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StoreToolAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoreToolAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tool<T extends ToolDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ToolDefinitionDefaultArgs<ExtArgs>>): Prisma__ToolDefinitionClient<$Result.GetResult<Prisma.$ToolDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StoreToolAssignment model
   */
  interface StoreToolAssignmentFieldRefs {
    readonly id: FieldRef<"StoreToolAssignment", 'String'>
    readonly storeId: FieldRef<"StoreToolAssignment", 'String'>
    readonly toolId: FieldRef<"StoreToolAssignment", 'String'>
    readonly isActive: FieldRef<"StoreToolAssignment", 'Boolean'>
    readonly assignedAt: FieldRef<"StoreToolAssignment", 'DateTime'>
    readonly config: FieldRef<"StoreToolAssignment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * StoreToolAssignment findUnique
   */
  export type StoreToolAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which StoreToolAssignment to fetch.
     */
    where: StoreToolAssignmentWhereUniqueInput
  }

  /**
   * StoreToolAssignment findUniqueOrThrow
   */
  export type StoreToolAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which StoreToolAssignment to fetch.
     */
    where: StoreToolAssignmentWhereUniqueInput
  }

  /**
   * StoreToolAssignment findFirst
   */
  export type StoreToolAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which StoreToolAssignment to fetch.
     */
    where?: StoreToolAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreToolAssignments to fetch.
     */
    orderBy?: StoreToolAssignmentOrderByWithRelationInput | StoreToolAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoreToolAssignments.
     */
    cursor?: StoreToolAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreToolAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreToolAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoreToolAssignments.
     */
    distinct?: StoreToolAssignmentScalarFieldEnum | StoreToolAssignmentScalarFieldEnum[]
  }

  /**
   * StoreToolAssignment findFirstOrThrow
   */
  export type StoreToolAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which StoreToolAssignment to fetch.
     */
    where?: StoreToolAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreToolAssignments to fetch.
     */
    orderBy?: StoreToolAssignmentOrderByWithRelationInput | StoreToolAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoreToolAssignments.
     */
    cursor?: StoreToolAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreToolAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreToolAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoreToolAssignments.
     */
    distinct?: StoreToolAssignmentScalarFieldEnum | StoreToolAssignmentScalarFieldEnum[]
  }

  /**
   * StoreToolAssignment findMany
   */
  export type StoreToolAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which StoreToolAssignments to fetch.
     */
    where?: StoreToolAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreToolAssignments to fetch.
     */
    orderBy?: StoreToolAssignmentOrderByWithRelationInput | StoreToolAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StoreToolAssignments.
     */
    cursor?: StoreToolAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreToolAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreToolAssignments.
     */
    skip?: number
    distinct?: StoreToolAssignmentScalarFieldEnum | StoreToolAssignmentScalarFieldEnum[]
  }

  /**
   * StoreToolAssignment create
   */
  export type StoreToolAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a StoreToolAssignment.
     */
    data: XOR<StoreToolAssignmentCreateInput, StoreToolAssignmentUncheckedCreateInput>
  }

  /**
   * StoreToolAssignment createMany
   */
  export type StoreToolAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StoreToolAssignments.
     */
    data: StoreToolAssignmentCreateManyInput | StoreToolAssignmentCreateManyInput[]
  }

  /**
   * StoreToolAssignment createManyAndReturn
   */
  export type StoreToolAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * The data used to create many StoreToolAssignments.
     */
    data: StoreToolAssignmentCreateManyInput | StoreToolAssignmentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StoreToolAssignment update
   */
  export type StoreToolAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a StoreToolAssignment.
     */
    data: XOR<StoreToolAssignmentUpdateInput, StoreToolAssignmentUncheckedUpdateInput>
    /**
     * Choose, which StoreToolAssignment to update.
     */
    where: StoreToolAssignmentWhereUniqueInput
  }

  /**
   * StoreToolAssignment updateMany
   */
  export type StoreToolAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StoreToolAssignments.
     */
    data: XOR<StoreToolAssignmentUpdateManyMutationInput, StoreToolAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which StoreToolAssignments to update
     */
    where?: StoreToolAssignmentWhereInput
    /**
     * Limit how many StoreToolAssignments to update.
     */
    limit?: number
  }

  /**
   * StoreToolAssignment updateManyAndReturn
   */
  export type StoreToolAssignmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * The data used to update StoreToolAssignments.
     */
    data: XOR<StoreToolAssignmentUpdateManyMutationInput, StoreToolAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which StoreToolAssignments to update
     */
    where?: StoreToolAssignmentWhereInput
    /**
     * Limit how many StoreToolAssignments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StoreToolAssignment upsert
   */
  export type StoreToolAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the StoreToolAssignment to update in case it exists.
     */
    where: StoreToolAssignmentWhereUniqueInput
    /**
     * In case the StoreToolAssignment found by the `where` argument doesn't exist, create a new StoreToolAssignment with this data.
     */
    create: XOR<StoreToolAssignmentCreateInput, StoreToolAssignmentUncheckedCreateInput>
    /**
     * In case the StoreToolAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoreToolAssignmentUpdateInput, StoreToolAssignmentUncheckedUpdateInput>
  }

  /**
   * StoreToolAssignment delete
   */
  export type StoreToolAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
    /**
     * Filter which StoreToolAssignment to delete.
     */
    where: StoreToolAssignmentWhereUniqueInput
  }

  /**
   * StoreToolAssignment deleteMany
   */
  export type StoreToolAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoreToolAssignments to delete
     */
    where?: StoreToolAssignmentWhereInput
    /**
     * Limit how many StoreToolAssignments to delete.
     */
    limit?: number
  }

  /**
   * StoreToolAssignment without action
   */
  export type StoreToolAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreToolAssignment
     */
    select?: StoreToolAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoreToolAssignment
     */
    omit?: StoreToolAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreToolAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model UserStoreAssignment
   */

  export type AggregateUserStoreAssignment = {
    _count: UserStoreAssignmentCountAggregateOutputType | null
    _min: UserStoreAssignmentMinAggregateOutputType | null
    _max: UserStoreAssignmentMaxAggregateOutputType | null
  }

  export type UserStoreAssignmentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    storeId: string | null
    assignedAt: Date | null
  }

  export type UserStoreAssignmentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    storeId: string | null
    assignedAt: Date | null
  }

  export type UserStoreAssignmentCountAggregateOutputType = {
    id: number
    userId: number
    storeId: number
    assignedAt: number
    _all: number
  }


  export type UserStoreAssignmentMinAggregateInputType = {
    id?: true
    userId?: true
    storeId?: true
    assignedAt?: true
  }

  export type UserStoreAssignmentMaxAggregateInputType = {
    id?: true
    userId?: true
    storeId?: true
    assignedAt?: true
  }

  export type UserStoreAssignmentCountAggregateInputType = {
    id?: true
    userId?: true
    storeId?: true
    assignedAt?: true
    _all?: true
  }

  export type UserStoreAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStoreAssignment to aggregate.
     */
    where?: UserStoreAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStoreAssignments to fetch.
     */
    orderBy?: UserStoreAssignmentOrderByWithRelationInput | UserStoreAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserStoreAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStoreAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStoreAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserStoreAssignments
    **/
    _count?: true | UserStoreAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserStoreAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserStoreAssignmentMaxAggregateInputType
  }

  export type GetUserStoreAssignmentAggregateType<T extends UserStoreAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateUserStoreAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserStoreAssignment[P]>
      : GetScalarType<T[P], AggregateUserStoreAssignment[P]>
  }




  export type UserStoreAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStoreAssignmentWhereInput
    orderBy?: UserStoreAssignmentOrderByWithAggregationInput | UserStoreAssignmentOrderByWithAggregationInput[]
    by: UserStoreAssignmentScalarFieldEnum[] | UserStoreAssignmentScalarFieldEnum
    having?: UserStoreAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserStoreAssignmentCountAggregateInputType | true
    _min?: UserStoreAssignmentMinAggregateInputType
    _max?: UserStoreAssignmentMaxAggregateInputType
  }

  export type UserStoreAssignmentGroupByOutputType = {
    id: string
    userId: string
    storeId: string
    assignedAt: Date
    _count: UserStoreAssignmentCountAggregateOutputType | null
    _min: UserStoreAssignmentMinAggregateOutputType | null
    _max: UserStoreAssignmentMaxAggregateOutputType | null
  }

  type GetUserStoreAssignmentGroupByPayload<T extends UserStoreAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserStoreAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserStoreAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserStoreAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], UserStoreAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type UserStoreAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storeId?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStoreAssignment"]>

  export type UserStoreAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storeId?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStoreAssignment"]>

  export type UserStoreAssignmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storeId?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStoreAssignment"]>

  export type UserStoreAssignmentSelectScalar = {
    id?: boolean
    userId?: boolean
    storeId?: boolean
    assignedAt?: boolean
  }

  export type UserStoreAssignmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "storeId" | "assignedAt", ExtArgs["result"]["userStoreAssignment"]>
  export type UserStoreAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type UserStoreAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type UserStoreAssignmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $UserStoreAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserStoreAssignment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      storeId: string
      assignedAt: Date
    }, ExtArgs["result"]["userStoreAssignment"]>
    composites: {}
  }

  type UserStoreAssignmentGetPayload<S extends boolean | null | undefined | UserStoreAssignmentDefaultArgs> = $Result.GetResult<Prisma.$UserStoreAssignmentPayload, S>

  type UserStoreAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserStoreAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserStoreAssignmentCountAggregateInputType | true
    }

  export interface UserStoreAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserStoreAssignment'], meta: { name: 'UserStoreAssignment' } }
    /**
     * Find zero or one UserStoreAssignment that matches the filter.
     * @param {UserStoreAssignmentFindUniqueArgs} args - Arguments to find a UserStoreAssignment
     * @example
     * // Get one UserStoreAssignment
     * const userStoreAssignment = await prisma.userStoreAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserStoreAssignmentFindUniqueArgs>(args: SelectSubset<T, UserStoreAssignmentFindUniqueArgs<ExtArgs>>): Prisma__UserStoreAssignmentClient<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserStoreAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserStoreAssignmentFindUniqueOrThrowArgs} args - Arguments to find a UserStoreAssignment
     * @example
     * // Get one UserStoreAssignment
     * const userStoreAssignment = await prisma.userStoreAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserStoreAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, UserStoreAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserStoreAssignmentClient<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStoreAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoreAssignmentFindFirstArgs} args - Arguments to find a UserStoreAssignment
     * @example
     * // Get one UserStoreAssignment
     * const userStoreAssignment = await prisma.userStoreAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserStoreAssignmentFindFirstArgs>(args?: SelectSubset<T, UserStoreAssignmentFindFirstArgs<ExtArgs>>): Prisma__UserStoreAssignmentClient<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStoreAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoreAssignmentFindFirstOrThrowArgs} args - Arguments to find a UserStoreAssignment
     * @example
     * // Get one UserStoreAssignment
     * const userStoreAssignment = await prisma.userStoreAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserStoreAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, UserStoreAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserStoreAssignmentClient<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserStoreAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoreAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserStoreAssignments
     * const userStoreAssignments = await prisma.userStoreAssignment.findMany()
     * 
     * // Get first 10 UserStoreAssignments
     * const userStoreAssignments = await prisma.userStoreAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userStoreAssignmentWithIdOnly = await prisma.userStoreAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserStoreAssignmentFindManyArgs>(args?: SelectSubset<T, UserStoreAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserStoreAssignment.
     * @param {UserStoreAssignmentCreateArgs} args - Arguments to create a UserStoreAssignment.
     * @example
     * // Create one UserStoreAssignment
     * const UserStoreAssignment = await prisma.userStoreAssignment.create({
     *   data: {
     *     // ... data to create a UserStoreAssignment
     *   }
     * })
     * 
     */
    create<T extends UserStoreAssignmentCreateArgs>(args: SelectSubset<T, UserStoreAssignmentCreateArgs<ExtArgs>>): Prisma__UserStoreAssignmentClient<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserStoreAssignments.
     * @param {UserStoreAssignmentCreateManyArgs} args - Arguments to create many UserStoreAssignments.
     * @example
     * // Create many UserStoreAssignments
     * const userStoreAssignment = await prisma.userStoreAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserStoreAssignmentCreateManyArgs>(args?: SelectSubset<T, UserStoreAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserStoreAssignments and returns the data saved in the database.
     * @param {UserStoreAssignmentCreateManyAndReturnArgs} args - Arguments to create many UserStoreAssignments.
     * @example
     * // Create many UserStoreAssignments
     * const userStoreAssignment = await prisma.userStoreAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserStoreAssignments and only return the `id`
     * const userStoreAssignmentWithIdOnly = await prisma.userStoreAssignment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserStoreAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, UserStoreAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserStoreAssignment.
     * @param {UserStoreAssignmentDeleteArgs} args - Arguments to delete one UserStoreAssignment.
     * @example
     * // Delete one UserStoreAssignment
     * const UserStoreAssignment = await prisma.userStoreAssignment.delete({
     *   where: {
     *     // ... filter to delete one UserStoreAssignment
     *   }
     * })
     * 
     */
    delete<T extends UserStoreAssignmentDeleteArgs>(args: SelectSubset<T, UserStoreAssignmentDeleteArgs<ExtArgs>>): Prisma__UserStoreAssignmentClient<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserStoreAssignment.
     * @param {UserStoreAssignmentUpdateArgs} args - Arguments to update one UserStoreAssignment.
     * @example
     * // Update one UserStoreAssignment
     * const userStoreAssignment = await prisma.userStoreAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserStoreAssignmentUpdateArgs>(args: SelectSubset<T, UserStoreAssignmentUpdateArgs<ExtArgs>>): Prisma__UserStoreAssignmentClient<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserStoreAssignments.
     * @param {UserStoreAssignmentDeleteManyArgs} args - Arguments to filter UserStoreAssignments to delete.
     * @example
     * // Delete a few UserStoreAssignments
     * const { count } = await prisma.userStoreAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserStoreAssignmentDeleteManyArgs>(args?: SelectSubset<T, UserStoreAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStoreAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoreAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserStoreAssignments
     * const userStoreAssignment = await prisma.userStoreAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserStoreAssignmentUpdateManyArgs>(args: SelectSubset<T, UserStoreAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStoreAssignments and returns the data updated in the database.
     * @param {UserStoreAssignmentUpdateManyAndReturnArgs} args - Arguments to update many UserStoreAssignments.
     * @example
     * // Update many UserStoreAssignments
     * const userStoreAssignment = await prisma.userStoreAssignment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserStoreAssignments and only return the `id`
     * const userStoreAssignmentWithIdOnly = await prisma.userStoreAssignment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserStoreAssignmentUpdateManyAndReturnArgs>(args: SelectSubset<T, UserStoreAssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserStoreAssignment.
     * @param {UserStoreAssignmentUpsertArgs} args - Arguments to update or create a UserStoreAssignment.
     * @example
     * // Update or create a UserStoreAssignment
     * const userStoreAssignment = await prisma.userStoreAssignment.upsert({
     *   create: {
     *     // ... data to create a UserStoreAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserStoreAssignment we want to update
     *   }
     * })
     */
    upsert<T extends UserStoreAssignmentUpsertArgs>(args: SelectSubset<T, UserStoreAssignmentUpsertArgs<ExtArgs>>): Prisma__UserStoreAssignmentClient<$Result.GetResult<Prisma.$UserStoreAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserStoreAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoreAssignmentCountArgs} args - Arguments to filter UserStoreAssignments to count.
     * @example
     * // Count the number of UserStoreAssignments
     * const count = await prisma.userStoreAssignment.count({
     *   where: {
     *     // ... the filter for the UserStoreAssignments we want to count
     *   }
     * })
    **/
    count<T extends UserStoreAssignmentCountArgs>(
      args?: Subset<T, UserStoreAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserStoreAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserStoreAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoreAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserStoreAssignmentAggregateArgs>(args: Subset<T, UserStoreAssignmentAggregateArgs>): Prisma.PrismaPromise<GetUserStoreAssignmentAggregateType<T>>

    /**
     * Group by UserStoreAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoreAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserStoreAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserStoreAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: UserStoreAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserStoreAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserStoreAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserStoreAssignment model
   */
  readonly fields: UserStoreAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserStoreAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserStoreAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserStoreAssignment model
   */
  interface UserStoreAssignmentFieldRefs {
    readonly id: FieldRef<"UserStoreAssignment", 'String'>
    readonly userId: FieldRef<"UserStoreAssignment", 'String'>
    readonly storeId: FieldRef<"UserStoreAssignment", 'String'>
    readonly assignedAt: FieldRef<"UserStoreAssignment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserStoreAssignment findUnique
   */
  export type UserStoreAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which UserStoreAssignment to fetch.
     */
    where: UserStoreAssignmentWhereUniqueInput
  }

  /**
   * UserStoreAssignment findUniqueOrThrow
   */
  export type UserStoreAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which UserStoreAssignment to fetch.
     */
    where: UserStoreAssignmentWhereUniqueInput
  }

  /**
   * UserStoreAssignment findFirst
   */
  export type UserStoreAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which UserStoreAssignment to fetch.
     */
    where?: UserStoreAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStoreAssignments to fetch.
     */
    orderBy?: UserStoreAssignmentOrderByWithRelationInput | UserStoreAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStoreAssignments.
     */
    cursor?: UserStoreAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStoreAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStoreAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStoreAssignments.
     */
    distinct?: UserStoreAssignmentScalarFieldEnum | UserStoreAssignmentScalarFieldEnum[]
  }

  /**
   * UserStoreAssignment findFirstOrThrow
   */
  export type UserStoreAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which UserStoreAssignment to fetch.
     */
    where?: UserStoreAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStoreAssignments to fetch.
     */
    orderBy?: UserStoreAssignmentOrderByWithRelationInput | UserStoreAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStoreAssignments.
     */
    cursor?: UserStoreAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStoreAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStoreAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStoreAssignments.
     */
    distinct?: UserStoreAssignmentScalarFieldEnum | UserStoreAssignmentScalarFieldEnum[]
  }

  /**
   * UserStoreAssignment findMany
   */
  export type UserStoreAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which UserStoreAssignments to fetch.
     */
    where?: UserStoreAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStoreAssignments to fetch.
     */
    orderBy?: UserStoreAssignmentOrderByWithRelationInput | UserStoreAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserStoreAssignments.
     */
    cursor?: UserStoreAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStoreAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStoreAssignments.
     */
    skip?: number
    distinct?: UserStoreAssignmentScalarFieldEnum | UserStoreAssignmentScalarFieldEnum[]
  }

  /**
   * UserStoreAssignment create
   */
  export type UserStoreAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a UserStoreAssignment.
     */
    data: XOR<UserStoreAssignmentCreateInput, UserStoreAssignmentUncheckedCreateInput>
  }

  /**
   * UserStoreAssignment createMany
   */
  export type UserStoreAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserStoreAssignments.
     */
    data: UserStoreAssignmentCreateManyInput | UserStoreAssignmentCreateManyInput[]
  }

  /**
   * UserStoreAssignment createManyAndReturn
   */
  export type UserStoreAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * The data used to create many UserStoreAssignments.
     */
    data: UserStoreAssignmentCreateManyInput | UserStoreAssignmentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStoreAssignment update
   */
  export type UserStoreAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a UserStoreAssignment.
     */
    data: XOR<UserStoreAssignmentUpdateInput, UserStoreAssignmentUncheckedUpdateInput>
    /**
     * Choose, which UserStoreAssignment to update.
     */
    where: UserStoreAssignmentWhereUniqueInput
  }

  /**
   * UserStoreAssignment updateMany
   */
  export type UserStoreAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserStoreAssignments.
     */
    data: XOR<UserStoreAssignmentUpdateManyMutationInput, UserStoreAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which UserStoreAssignments to update
     */
    where?: UserStoreAssignmentWhereInput
    /**
     * Limit how many UserStoreAssignments to update.
     */
    limit?: number
  }

  /**
   * UserStoreAssignment updateManyAndReturn
   */
  export type UserStoreAssignmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * The data used to update UserStoreAssignments.
     */
    data: XOR<UserStoreAssignmentUpdateManyMutationInput, UserStoreAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which UserStoreAssignments to update
     */
    where?: UserStoreAssignmentWhereInput
    /**
     * Limit how many UserStoreAssignments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStoreAssignment upsert
   */
  export type UserStoreAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the UserStoreAssignment to update in case it exists.
     */
    where: UserStoreAssignmentWhereUniqueInput
    /**
     * In case the UserStoreAssignment found by the `where` argument doesn't exist, create a new UserStoreAssignment with this data.
     */
    create: XOR<UserStoreAssignmentCreateInput, UserStoreAssignmentUncheckedCreateInput>
    /**
     * In case the UserStoreAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserStoreAssignmentUpdateInput, UserStoreAssignmentUncheckedUpdateInput>
  }

  /**
   * UserStoreAssignment delete
   */
  export type UserStoreAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
    /**
     * Filter which UserStoreAssignment to delete.
     */
    where: UserStoreAssignmentWhereUniqueInput
  }

  /**
   * UserStoreAssignment deleteMany
   */
  export type UserStoreAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStoreAssignments to delete
     */
    where?: UserStoreAssignmentWhereInput
    /**
     * Limit how many UserStoreAssignments to delete.
     */
    limit?: number
  }

  /**
   * UserStoreAssignment without action
   */
  export type UserStoreAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoreAssignment
     */
    select?: UserStoreAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoreAssignment
     */
    omit?: UserStoreAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoreAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    stripeCustomerId: string | null
    stripeSubId: string | null
    status: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriod: boolean | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    stripeCustomerId: string | null
    stripeSubId: string | null
    status: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriod: boolean | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    tenantId: number
    stripeCustomerId: number
    stripeSubId: number
    status: number
    currentPeriodEnd: number
    cancelAtPeriod: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    tenantId?: true
    stripeCustomerId?: true
    stripeSubId?: true
    status?: true
    currentPeriodEnd?: true
    cancelAtPeriod?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    stripeCustomerId?: true
    stripeSubId?: true
    status?: true
    currentPeriodEnd?: true
    cancelAtPeriod?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    tenantId?: true
    stripeCustomerId?: true
    stripeSubId?: true
    status?: true
    currentPeriodEnd?: true
    cancelAtPeriod?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    tenantId: string
    stripeCustomerId: string
    stripeSubId: string
    status: string
    currentPeriodEnd: Date
    cancelAtPeriod: boolean
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriod?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriod?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriod?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriod?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "stripeCustomerId" | "stripeSubId" | "status" | "currentPeriodEnd" | "cancelAtPeriod", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      stripeCustomerId: string
      stripeSubId: string
      status: string
      currentPeriodEnd: Date
      cancelAtPeriod: boolean
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {SubscriptionUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly tenantId: FieldRef<"Subscription", 'String'>
    readonly stripeCustomerId: FieldRef<"Subscription", 'String'>
    readonly stripeSubId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
    readonly cancelAtPeriod: FieldRef<"Subscription", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription updateManyAndReturn
   */
  export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    userId: string | null
    action: string | null
    entity: string | null
    entityId: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    userId: string | null
    action: string | null
    entity: string | null
    entityId: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    tenantId: number
    userId: number
    action: number
    entity: number
    entityId: number
    details: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    action?: true
    entity?: true
    entityId?: true
    details?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    action?: true
    entity?: true
    entityId?: true
    details?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    action?: true
    entity?: true
    entityId?: true
    details?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    tenantId: string | null
    userId: string | null
    action: string
    entity: string
    entityId: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    action?: boolean
    entity?: boolean
    entityId?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    action?: boolean
    entity?: boolean
    entityId?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    action?: boolean
    entity?: boolean
    entityId?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    action?: boolean
    entity?: boolean
    entityId?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "userId" | "action" | "entity" | "entityId" | "details" | "ipAddress" | "createdAt", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string | null
      userId: string | null
      action: string
      entity: string
      entityId: string | null
      details: string | null
      ipAddress: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly tenantId: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entity: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'String'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Model DataProcessingConsent
   */

  export type AggregateDataProcessingConsent = {
    _count: DataProcessingConsentCountAggregateOutputType | null
    _min: DataProcessingConsentMinAggregateOutputType | null
    _max: DataProcessingConsentMaxAggregateOutputType | null
  }

  export type DataProcessingConsentMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    consentType: string | null
    grantedAt: Date | null
    grantedBy: string | null
    revokedAt: Date | null
    revokedBy: string | null
    version: string | null
    document: string | null
  }

  export type DataProcessingConsentMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    consentType: string | null
    grantedAt: Date | null
    grantedBy: string | null
    revokedAt: Date | null
    revokedBy: string | null
    version: string | null
    document: string | null
  }

  export type DataProcessingConsentCountAggregateOutputType = {
    id: number
    tenantId: number
    consentType: number
    grantedAt: number
    grantedBy: number
    revokedAt: number
    revokedBy: number
    version: number
    document: number
    _all: number
  }


  export type DataProcessingConsentMinAggregateInputType = {
    id?: true
    tenantId?: true
    consentType?: true
    grantedAt?: true
    grantedBy?: true
    revokedAt?: true
    revokedBy?: true
    version?: true
    document?: true
  }

  export type DataProcessingConsentMaxAggregateInputType = {
    id?: true
    tenantId?: true
    consentType?: true
    grantedAt?: true
    grantedBy?: true
    revokedAt?: true
    revokedBy?: true
    version?: true
    document?: true
  }

  export type DataProcessingConsentCountAggregateInputType = {
    id?: true
    tenantId?: true
    consentType?: true
    grantedAt?: true
    grantedBy?: true
    revokedAt?: true
    revokedBy?: true
    version?: true
    document?: true
    _all?: true
  }

  export type DataProcessingConsentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataProcessingConsent to aggregate.
     */
    where?: DataProcessingConsentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataProcessingConsents to fetch.
     */
    orderBy?: DataProcessingConsentOrderByWithRelationInput | DataProcessingConsentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DataProcessingConsentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataProcessingConsents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataProcessingConsents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DataProcessingConsents
    **/
    _count?: true | DataProcessingConsentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataProcessingConsentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataProcessingConsentMaxAggregateInputType
  }

  export type GetDataProcessingConsentAggregateType<T extends DataProcessingConsentAggregateArgs> = {
        [P in keyof T & keyof AggregateDataProcessingConsent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataProcessingConsent[P]>
      : GetScalarType<T[P], AggregateDataProcessingConsent[P]>
  }




  export type DataProcessingConsentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataProcessingConsentWhereInput
    orderBy?: DataProcessingConsentOrderByWithAggregationInput | DataProcessingConsentOrderByWithAggregationInput[]
    by: DataProcessingConsentScalarFieldEnum[] | DataProcessingConsentScalarFieldEnum
    having?: DataProcessingConsentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataProcessingConsentCountAggregateInputType | true
    _min?: DataProcessingConsentMinAggregateInputType
    _max?: DataProcessingConsentMaxAggregateInputType
  }

  export type DataProcessingConsentGroupByOutputType = {
    id: string
    tenantId: string
    consentType: string
    grantedAt: Date
    grantedBy: string
    revokedAt: Date | null
    revokedBy: string | null
    version: string
    document: string | null
    _count: DataProcessingConsentCountAggregateOutputType | null
    _min: DataProcessingConsentMinAggregateOutputType | null
    _max: DataProcessingConsentMaxAggregateOutputType | null
  }

  type GetDataProcessingConsentGroupByPayload<T extends DataProcessingConsentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataProcessingConsentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataProcessingConsentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataProcessingConsentGroupByOutputType[P]>
            : GetScalarType<T[P], DataProcessingConsentGroupByOutputType[P]>
        }
      >
    >


  export type DataProcessingConsentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    consentType?: boolean
    grantedAt?: boolean
    grantedBy?: boolean
    revokedAt?: boolean
    revokedBy?: boolean
    version?: boolean
    document?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataProcessingConsent"]>

  export type DataProcessingConsentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    consentType?: boolean
    grantedAt?: boolean
    grantedBy?: boolean
    revokedAt?: boolean
    revokedBy?: boolean
    version?: boolean
    document?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataProcessingConsent"]>

  export type DataProcessingConsentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    consentType?: boolean
    grantedAt?: boolean
    grantedBy?: boolean
    revokedAt?: boolean
    revokedBy?: boolean
    version?: boolean
    document?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataProcessingConsent"]>

  export type DataProcessingConsentSelectScalar = {
    id?: boolean
    tenantId?: boolean
    consentType?: boolean
    grantedAt?: boolean
    grantedBy?: boolean
    revokedAt?: boolean
    revokedBy?: boolean
    version?: boolean
    document?: boolean
  }

  export type DataProcessingConsentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "consentType" | "grantedAt" | "grantedBy" | "revokedAt" | "revokedBy" | "version" | "document", ExtArgs["result"]["dataProcessingConsent"]>
  export type DataProcessingConsentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type DataProcessingConsentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type DataProcessingConsentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $DataProcessingConsentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DataProcessingConsent"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      consentType: string
      grantedAt: Date
      grantedBy: string
      revokedAt: Date | null
      revokedBy: string | null
      version: string
      document: string | null
    }, ExtArgs["result"]["dataProcessingConsent"]>
    composites: {}
  }

  type DataProcessingConsentGetPayload<S extends boolean | null | undefined | DataProcessingConsentDefaultArgs> = $Result.GetResult<Prisma.$DataProcessingConsentPayload, S>

  type DataProcessingConsentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DataProcessingConsentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DataProcessingConsentCountAggregateInputType | true
    }

  export interface DataProcessingConsentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DataProcessingConsent'], meta: { name: 'DataProcessingConsent' } }
    /**
     * Find zero or one DataProcessingConsent that matches the filter.
     * @param {DataProcessingConsentFindUniqueArgs} args - Arguments to find a DataProcessingConsent
     * @example
     * // Get one DataProcessingConsent
     * const dataProcessingConsent = await prisma.dataProcessingConsent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DataProcessingConsentFindUniqueArgs>(args: SelectSubset<T, DataProcessingConsentFindUniqueArgs<ExtArgs>>): Prisma__DataProcessingConsentClient<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DataProcessingConsent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DataProcessingConsentFindUniqueOrThrowArgs} args - Arguments to find a DataProcessingConsent
     * @example
     * // Get one DataProcessingConsent
     * const dataProcessingConsent = await prisma.dataProcessingConsent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DataProcessingConsentFindUniqueOrThrowArgs>(args: SelectSubset<T, DataProcessingConsentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DataProcessingConsentClient<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DataProcessingConsent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataProcessingConsentFindFirstArgs} args - Arguments to find a DataProcessingConsent
     * @example
     * // Get one DataProcessingConsent
     * const dataProcessingConsent = await prisma.dataProcessingConsent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DataProcessingConsentFindFirstArgs>(args?: SelectSubset<T, DataProcessingConsentFindFirstArgs<ExtArgs>>): Prisma__DataProcessingConsentClient<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DataProcessingConsent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataProcessingConsentFindFirstOrThrowArgs} args - Arguments to find a DataProcessingConsent
     * @example
     * // Get one DataProcessingConsent
     * const dataProcessingConsent = await prisma.dataProcessingConsent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DataProcessingConsentFindFirstOrThrowArgs>(args?: SelectSubset<T, DataProcessingConsentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DataProcessingConsentClient<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DataProcessingConsents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataProcessingConsentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DataProcessingConsents
     * const dataProcessingConsents = await prisma.dataProcessingConsent.findMany()
     * 
     * // Get first 10 DataProcessingConsents
     * const dataProcessingConsents = await prisma.dataProcessingConsent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dataProcessingConsentWithIdOnly = await prisma.dataProcessingConsent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DataProcessingConsentFindManyArgs>(args?: SelectSubset<T, DataProcessingConsentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DataProcessingConsent.
     * @param {DataProcessingConsentCreateArgs} args - Arguments to create a DataProcessingConsent.
     * @example
     * // Create one DataProcessingConsent
     * const DataProcessingConsent = await prisma.dataProcessingConsent.create({
     *   data: {
     *     // ... data to create a DataProcessingConsent
     *   }
     * })
     * 
     */
    create<T extends DataProcessingConsentCreateArgs>(args: SelectSubset<T, DataProcessingConsentCreateArgs<ExtArgs>>): Prisma__DataProcessingConsentClient<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DataProcessingConsents.
     * @param {DataProcessingConsentCreateManyArgs} args - Arguments to create many DataProcessingConsents.
     * @example
     * // Create many DataProcessingConsents
     * const dataProcessingConsent = await prisma.dataProcessingConsent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DataProcessingConsentCreateManyArgs>(args?: SelectSubset<T, DataProcessingConsentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DataProcessingConsents and returns the data saved in the database.
     * @param {DataProcessingConsentCreateManyAndReturnArgs} args - Arguments to create many DataProcessingConsents.
     * @example
     * // Create many DataProcessingConsents
     * const dataProcessingConsent = await prisma.dataProcessingConsent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DataProcessingConsents and only return the `id`
     * const dataProcessingConsentWithIdOnly = await prisma.dataProcessingConsent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DataProcessingConsentCreateManyAndReturnArgs>(args?: SelectSubset<T, DataProcessingConsentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DataProcessingConsent.
     * @param {DataProcessingConsentDeleteArgs} args - Arguments to delete one DataProcessingConsent.
     * @example
     * // Delete one DataProcessingConsent
     * const DataProcessingConsent = await prisma.dataProcessingConsent.delete({
     *   where: {
     *     // ... filter to delete one DataProcessingConsent
     *   }
     * })
     * 
     */
    delete<T extends DataProcessingConsentDeleteArgs>(args: SelectSubset<T, DataProcessingConsentDeleteArgs<ExtArgs>>): Prisma__DataProcessingConsentClient<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DataProcessingConsent.
     * @param {DataProcessingConsentUpdateArgs} args - Arguments to update one DataProcessingConsent.
     * @example
     * // Update one DataProcessingConsent
     * const dataProcessingConsent = await prisma.dataProcessingConsent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DataProcessingConsentUpdateArgs>(args: SelectSubset<T, DataProcessingConsentUpdateArgs<ExtArgs>>): Prisma__DataProcessingConsentClient<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DataProcessingConsents.
     * @param {DataProcessingConsentDeleteManyArgs} args - Arguments to filter DataProcessingConsents to delete.
     * @example
     * // Delete a few DataProcessingConsents
     * const { count } = await prisma.dataProcessingConsent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DataProcessingConsentDeleteManyArgs>(args?: SelectSubset<T, DataProcessingConsentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataProcessingConsents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataProcessingConsentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DataProcessingConsents
     * const dataProcessingConsent = await prisma.dataProcessingConsent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DataProcessingConsentUpdateManyArgs>(args: SelectSubset<T, DataProcessingConsentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataProcessingConsents and returns the data updated in the database.
     * @param {DataProcessingConsentUpdateManyAndReturnArgs} args - Arguments to update many DataProcessingConsents.
     * @example
     * // Update many DataProcessingConsents
     * const dataProcessingConsent = await prisma.dataProcessingConsent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DataProcessingConsents and only return the `id`
     * const dataProcessingConsentWithIdOnly = await prisma.dataProcessingConsent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DataProcessingConsentUpdateManyAndReturnArgs>(args: SelectSubset<T, DataProcessingConsentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DataProcessingConsent.
     * @param {DataProcessingConsentUpsertArgs} args - Arguments to update or create a DataProcessingConsent.
     * @example
     * // Update or create a DataProcessingConsent
     * const dataProcessingConsent = await prisma.dataProcessingConsent.upsert({
     *   create: {
     *     // ... data to create a DataProcessingConsent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DataProcessingConsent we want to update
     *   }
     * })
     */
    upsert<T extends DataProcessingConsentUpsertArgs>(args: SelectSubset<T, DataProcessingConsentUpsertArgs<ExtArgs>>): Prisma__DataProcessingConsentClient<$Result.GetResult<Prisma.$DataProcessingConsentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DataProcessingConsents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataProcessingConsentCountArgs} args - Arguments to filter DataProcessingConsents to count.
     * @example
     * // Count the number of DataProcessingConsents
     * const count = await prisma.dataProcessingConsent.count({
     *   where: {
     *     // ... the filter for the DataProcessingConsents we want to count
     *   }
     * })
    **/
    count<T extends DataProcessingConsentCountArgs>(
      args?: Subset<T, DataProcessingConsentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataProcessingConsentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DataProcessingConsent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataProcessingConsentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DataProcessingConsentAggregateArgs>(args: Subset<T, DataProcessingConsentAggregateArgs>): Prisma.PrismaPromise<GetDataProcessingConsentAggregateType<T>>

    /**
     * Group by DataProcessingConsent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataProcessingConsentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DataProcessingConsentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DataProcessingConsentGroupByArgs['orderBy'] }
        : { orderBy?: DataProcessingConsentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DataProcessingConsentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataProcessingConsentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DataProcessingConsent model
   */
  readonly fields: DataProcessingConsentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DataProcessingConsent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DataProcessingConsentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DataProcessingConsent model
   */
  interface DataProcessingConsentFieldRefs {
    readonly id: FieldRef<"DataProcessingConsent", 'String'>
    readonly tenantId: FieldRef<"DataProcessingConsent", 'String'>
    readonly consentType: FieldRef<"DataProcessingConsent", 'String'>
    readonly grantedAt: FieldRef<"DataProcessingConsent", 'DateTime'>
    readonly grantedBy: FieldRef<"DataProcessingConsent", 'String'>
    readonly revokedAt: FieldRef<"DataProcessingConsent", 'DateTime'>
    readonly revokedBy: FieldRef<"DataProcessingConsent", 'String'>
    readonly version: FieldRef<"DataProcessingConsent", 'String'>
    readonly document: FieldRef<"DataProcessingConsent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DataProcessingConsent findUnique
   */
  export type DataProcessingConsentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * Filter, which DataProcessingConsent to fetch.
     */
    where: DataProcessingConsentWhereUniqueInput
  }

  /**
   * DataProcessingConsent findUniqueOrThrow
   */
  export type DataProcessingConsentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * Filter, which DataProcessingConsent to fetch.
     */
    where: DataProcessingConsentWhereUniqueInput
  }

  /**
   * DataProcessingConsent findFirst
   */
  export type DataProcessingConsentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * Filter, which DataProcessingConsent to fetch.
     */
    where?: DataProcessingConsentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataProcessingConsents to fetch.
     */
    orderBy?: DataProcessingConsentOrderByWithRelationInput | DataProcessingConsentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataProcessingConsents.
     */
    cursor?: DataProcessingConsentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataProcessingConsents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataProcessingConsents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataProcessingConsents.
     */
    distinct?: DataProcessingConsentScalarFieldEnum | DataProcessingConsentScalarFieldEnum[]
  }

  /**
   * DataProcessingConsent findFirstOrThrow
   */
  export type DataProcessingConsentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * Filter, which DataProcessingConsent to fetch.
     */
    where?: DataProcessingConsentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataProcessingConsents to fetch.
     */
    orderBy?: DataProcessingConsentOrderByWithRelationInput | DataProcessingConsentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataProcessingConsents.
     */
    cursor?: DataProcessingConsentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataProcessingConsents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataProcessingConsents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataProcessingConsents.
     */
    distinct?: DataProcessingConsentScalarFieldEnum | DataProcessingConsentScalarFieldEnum[]
  }

  /**
   * DataProcessingConsent findMany
   */
  export type DataProcessingConsentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * Filter, which DataProcessingConsents to fetch.
     */
    where?: DataProcessingConsentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataProcessingConsents to fetch.
     */
    orderBy?: DataProcessingConsentOrderByWithRelationInput | DataProcessingConsentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DataProcessingConsents.
     */
    cursor?: DataProcessingConsentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataProcessingConsents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataProcessingConsents.
     */
    skip?: number
    distinct?: DataProcessingConsentScalarFieldEnum | DataProcessingConsentScalarFieldEnum[]
  }

  /**
   * DataProcessingConsent create
   */
  export type DataProcessingConsentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * The data needed to create a DataProcessingConsent.
     */
    data: XOR<DataProcessingConsentCreateInput, DataProcessingConsentUncheckedCreateInput>
  }

  /**
   * DataProcessingConsent createMany
   */
  export type DataProcessingConsentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DataProcessingConsents.
     */
    data: DataProcessingConsentCreateManyInput | DataProcessingConsentCreateManyInput[]
  }

  /**
   * DataProcessingConsent createManyAndReturn
   */
  export type DataProcessingConsentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * The data used to create many DataProcessingConsents.
     */
    data: DataProcessingConsentCreateManyInput | DataProcessingConsentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DataProcessingConsent update
   */
  export type DataProcessingConsentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * The data needed to update a DataProcessingConsent.
     */
    data: XOR<DataProcessingConsentUpdateInput, DataProcessingConsentUncheckedUpdateInput>
    /**
     * Choose, which DataProcessingConsent to update.
     */
    where: DataProcessingConsentWhereUniqueInput
  }

  /**
   * DataProcessingConsent updateMany
   */
  export type DataProcessingConsentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DataProcessingConsents.
     */
    data: XOR<DataProcessingConsentUpdateManyMutationInput, DataProcessingConsentUncheckedUpdateManyInput>
    /**
     * Filter which DataProcessingConsents to update
     */
    where?: DataProcessingConsentWhereInput
    /**
     * Limit how many DataProcessingConsents to update.
     */
    limit?: number
  }

  /**
   * DataProcessingConsent updateManyAndReturn
   */
  export type DataProcessingConsentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * The data used to update DataProcessingConsents.
     */
    data: XOR<DataProcessingConsentUpdateManyMutationInput, DataProcessingConsentUncheckedUpdateManyInput>
    /**
     * Filter which DataProcessingConsents to update
     */
    where?: DataProcessingConsentWhereInput
    /**
     * Limit how many DataProcessingConsents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DataProcessingConsent upsert
   */
  export type DataProcessingConsentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * The filter to search for the DataProcessingConsent to update in case it exists.
     */
    where: DataProcessingConsentWhereUniqueInput
    /**
     * In case the DataProcessingConsent found by the `where` argument doesn't exist, create a new DataProcessingConsent with this data.
     */
    create: XOR<DataProcessingConsentCreateInput, DataProcessingConsentUncheckedCreateInput>
    /**
     * In case the DataProcessingConsent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DataProcessingConsentUpdateInput, DataProcessingConsentUncheckedUpdateInput>
  }

  /**
   * DataProcessingConsent delete
   */
  export type DataProcessingConsentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
    /**
     * Filter which DataProcessingConsent to delete.
     */
    where: DataProcessingConsentWhereUniqueInput
  }

  /**
   * DataProcessingConsent deleteMany
   */
  export type DataProcessingConsentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataProcessingConsents to delete
     */
    where?: DataProcessingConsentWhereInput
    /**
     * Limit how many DataProcessingConsents to delete.
     */
    limit?: number
  }

  /**
   * DataProcessingConsent without action
   */
  export type DataProcessingConsentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataProcessingConsent
     */
    select?: DataProcessingConsentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DataProcessingConsent
     */
    omit?: DataProcessingConsentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataProcessingConsentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    role: 'role',
    tenantId: 'tenantId',
    isActive: 'isActive',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    status: 'status',
    contactEmail: 'contactEmail',
    contactName: 'contactName',
    contactPhone: 'contactPhone',
    maxUsers: 'maxUsers',
    logoUrl: 'logoUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const StoreScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    city: 'city',
    address: 'address',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StoreScalarFieldEnum = (typeof StoreScalarFieldEnum)[keyof typeof StoreScalarFieldEnum]


  export const ToolDefinitionScalarFieldEnum: {
    id: 'id',
    key: 'key',
    name: 'name',
    description: 'description',
    category: 'category',
    icon: 'icon',
    priceMonthly: 'priceMonthly',
    isActive: 'isActive',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ToolDefinitionScalarFieldEnum = (typeof ToolDefinitionScalarFieldEnum)[keyof typeof ToolDefinitionScalarFieldEnum]


  export const StoreToolAssignmentScalarFieldEnum: {
    id: 'id',
    storeId: 'storeId',
    toolId: 'toolId',
    isActive: 'isActive',
    assignedAt: 'assignedAt',
    config: 'config'
  };

  export type StoreToolAssignmentScalarFieldEnum = (typeof StoreToolAssignmentScalarFieldEnum)[keyof typeof StoreToolAssignmentScalarFieldEnum]


  export const UserStoreAssignmentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    storeId: 'storeId',
    assignedAt: 'assignedAt'
  };

  export type UserStoreAssignmentScalarFieldEnum = (typeof UserStoreAssignmentScalarFieldEnum)[keyof typeof UserStoreAssignmentScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubId: 'stripeSubId',
    status: 'status',
    currentPeriodEnd: 'currentPeriodEnd',
    cancelAtPeriod: 'cancelAtPeriod'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    userId: 'userId',
    action: 'action',
    entity: 'entity',
    entityId: 'entityId',
    details: 'details',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const DataProcessingConsentScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    consentType: 'consentType',
    grantedAt: 'grantedAt',
    grantedBy: 'grantedBy',
    revokedAt: 'revokedAt',
    revokedBy: 'revokedBy',
    version: 'version',
    document: 'document'
  };

  export type DataProcessingConsentScalarFieldEnum = (typeof DataProcessingConsentScalarFieldEnum)[keyof typeof DataProcessingConsentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    tenantId?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantNullableScalarRelationFilter, TenantWhereInput> | null
    storeAssignments?: UserStoreAssignmentListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    storeAssignments?: UserStoreAssignmentOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    tenantId?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantNullableScalarRelationFilter, TenantWhereInput> | null
    storeAssignments?: UserStoreAssignmentListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    tenantId?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    slug?: StringFilter<"Tenant"> | string
    status?: StringFilter<"Tenant"> | string
    contactEmail?: StringNullableFilter<"Tenant"> | string | null
    contactName?: StringNullableFilter<"Tenant"> | string | null
    contactPhone?: StringNullableFilter<"Tenant"> | string | null
    maxUsers?: IntFilter<"Tenant"> | number
    logoUrl?: StringNullableFilter<"Tenant"> | string | null
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    stores?: StoreListRelationFilter
    subscription?: XOR<SubscriptionNullableScalarRelationFilter, SubscriptionWhereInput> | null
    consents?: DataProcessingConsentListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    maxUsers?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    stores?: StoreOrderByRelationAggregateInput
    subscription?: SubscriptionOrderByWithRelationInput
    consents?: DataProcessingConsentOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    status?: StringFilter<"Tenant"> | string
    contactEmail?: StringNullableFilter<"Tenant"> | string | null
    contactName?: StringNullableFilter<"Tenant"> | string | null
    contactPhone?: StringNullableFilter<"Tenant"> | string | null
    maxUsers?: IntFilter<"Tenant"> | number
    logoUrl?: StringNullableFilter<"Tenant"> | string | null
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    stores?: StoreListRelationFilter
    subscription?: XOR<SubscriptionNullableScalarRelationFilter, SubscriptionWhereInput> | null
    consents?: DataProcessingConsentListRelationFilter
  }, "id" | "slug">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    maxUsers?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    name?: StringWithAggregatesFilter<"Tenant"> | string
    slug?: StringWithAggregatesFilter<"Tenant"> | string
    status?: StringWithAggregatesFilter<"Tenant"> | string
    contactEmail?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    contactName?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    contactPhone?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    maxUsers?: IntWithAggregatesFilter<"Tenant"> | number
    logoUrl?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type StoreWhereInput = {
    AND?: StoreWhereInput | StoreWhereInput[]
    OR?: StoreWhereInput[]
    NOT?: StoreWhereInput | StoreWhereInput[]
    id?: StringFilter<"Store"> | string
    tenantId?: StringFilter<"Store"> | string
    name?: StringFilter<"Store"> | string
    city?: StringNullableFilter<"Store"> | string | null
    address?: StringNullableFilter<"Store"> | string | null
    isActive?: BoolFilter<"Store"> | boolean
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    tools?: StoreToolAssignmentListRelationFilter
    userAssignments?: UserStoreAssignmentListRelationFilter
  }

  export type StoreOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    city?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    tools?: StoreToolAssignmentOrderByRelationAggregateInput
    userAssignments?: UserStoreAssignmentOrderByRelationAggregateInput
  }

  export type StoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StoreWhereInput | StoreWhereInput[]
    OR?: StoreWhereInput[]
    NOT?: StoreWhereInput | StoreWhereInput[]
    tenantId?: StringFilter<"Store"> | string
    name?: StringFilter<"Store"> | string
    city?: StringNullableFilter<"Store"> | string | null
    address?: StringNullableFilter<"Store"> | string | null
    isActive?: BoolFilter<"Store"> | boolean
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    tools?: StoreToolAssignmentListRelationFilter
    userAssignments?: UserStoreAssignmentListRelationFilter
  }, "id">

  export type StoreOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    city?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StoreCountOrderByAggregateInput
    _max?: StoreMaxOrderByAggregateInput
    _min?: StoreMinOrderByAggregateInput
  }

  export type StoreScalarWhereWithAggregatesInput = {
    AND?: StoreScalarWhereWithAggregatesInput | StoreScalarWhereWithAggregatesInput[]
    OR?: StoreScalarWhereWithAggregatesInput[]
    NOT?: StoreScalarWhereWithAggregatesInput | StoreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Store"> | string
    tenantId?: StringWithAggregatesFilter<"Store"> | string
    name?: StringWithAggregatesFilter<"Store"> | string
    city?: StringNullableWithAggregatesFilter<"Store"> | string | null
    address?: StringNullableWithAggregatesFilter<"Store"> | string | null
    isActive?: BoolWithAggregatesFilter<"Store"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Store"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Store"> | Date | string
  }

  export type ToolDefinitionWhereInput = {
    AND?: ToolDefinitionWhereInput | ToolDefinitionWhereInput[]
    OR?: ToolDefinitionWhereInput[]
    NOT?: ToolDefinitionWhereInput | ToolDefinitionWhereInput[]
    id?: StringFilter<"ToolDefinition"> | string
    key?: StringFilter<"ToolDefinition"> | string
    name?: StringFilter<"ToolDefinition"> | string
    description?: StringNullableFilter<"ToolDefinition"> | string | null
    category?: StringFilter<"ToolDefinition"> | string
    icon?: StringNullableFilter<"ToolDefinition"> | string | null
    priceMonthly?: IntFilter<"ToolDefinition"> | number
    isActive?: BoolFilter<"ToolDefinition"> | boolean
    sortOrder?: IntFilter<"ToolDefinition"> | number
    createdAt?: DateTimeFilter<"ToolDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"ToolDefinition"> | Date | string
    assignments?: StoreToolAssignmentListRelationFilter
  }

  export type ToolDefinitionOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    icon?: SortOrderInput | SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assignments?: StoreToolAssignmentOrderByRelationAggregateInput
  }

  export type ToolDefinitionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: ToolDefinitionWhereInput | ToolDefinitionWhereInput[]
    OR?: ToolDefinitionWhereInput[]
    NOT?: ToolDefinitionWhereInput | ToolDefinitionWhereInput[]
    name?: StringFilter<"ToolDefinition"> | string
    description?: StringNullableFilter<"ToolDefinition"> | string | null
    category?: StringFilter<"ToolDefinition"> | string
    icon?: StringNullableFilter<"ToolDefinition"> | string | null
    priceMonthly?: IntFilter<"ToolDefinition"> | number
    isActive?: BoolFilter<"ToolDefinition"> | boolean
    sortOrder?: IntFilter<"ToolDefinition"> | number
    createdAt?: DateTimeFilter<"ToolDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"ToolDefinition"> | Date | string
    assignments?: StoreToolAssignmentListRelationFilter
  }, "id" | "key">

  export type ToolDefinitionOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    icon?: SortOrderInput | SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ToolDefinitionCountOrderByAggregateInput
    _avg?: ToolDefinitionAvgOrderByAggregateInput
    _max?: ToolDefinitionMaxOrderByAggregateInput
    _min?: ToolDefinitionMinOrderByAggregateInput
    _sum?: ToolDefinitionSumOrderByAggregateInput
  }

  export type ToolDefinitionScalarWhereWithAggregatesInput = {
    AND?: ToolDefinitionScalarWhereWithAggregatesInput | ToolDefinitionScalarWhereWithAggregatesInput[]
    OR?: ToolDefinitionScalarWhereWithAggregatesInput[]
    NOT?: ToolDefinitionScalarWhereWithAggregatesInput | ToolDefinitionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ToolDefinition"> | string
    key?: StringWithAggregatesFilter<"ToolDefinition"> | string
    name?: StringWithAggregatesFilter<"ToolDefinition"> | string
    description?: StringNullableWithAggregatesFilter<"ToolDefinition"> | string | null
    category?: StringWithAggregatesFilter<"ToolDefinition"> | string
    icon?: StringNullableWithAggregatesFilter<"ToolDefinition"> | string | null
    priceMonthly?: IntWithAggregatesFilter<"ToolDefinition"> | number
    isActive?: BoolWithAggregatesFilter<"ToolDefinition"> | boolean
    sortOrder?: IntWithAggregatesFilter<"ToolDefinition"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ToolDefinition"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ToolDefinition"> | Date | string
  }

  export type StoreToolAssignmentWhereInput = {
    AND?: StoreToolAssignmentWhereInput | StoreToolAssignmentWhereInput[]
    OR?: StoreToolAssignmentWhereInput[]
    NOT?: StoreToolAssignmentWhereInput | StoreToolAssignmentWhereInput[]
    id?: StringFilter<"StoreToolAssignment"> | string
    storeId?: StringFilter<"StoreToolAssignment"> | string
    toolId?: StringFilter<"StoreToolAssignment"> | string
    isActive?: BoolFilter<"StoreToolAssignment"> | boolean
    assignedAt?: DateTimeFilter<"StoreToolAssignment"> | Date | string
    config?: StringNullableFilter<"StoreToolAssignment"> | string | null
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
    tool?: XOR<ToolDefinitionScalarRelationFilter, ToolDefinitionWhereInput>
  }

  export type StoreToolAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    storeId?: SortOrder
    toolId?: SortOrder
    isActive?: SortOrder
    assignedAt?: SortOrder
    config?: SortOrderInput | SortOrder
    store?: StoreOrderByWithRelationInput
    tool?: ToolDefinitionOrderByWithRelationInput
  }

  export type StoreToolAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    storeId_toolId?: StoreToolAssignmentStoreIdToolIdCompoundUniqueInput
    AND?: StoreToolAssignmentWhereInput | StoreToolAssignmentWhereInput[]
    OR?: StoreToolAssignmentWhereInput[]
    NOT?: StoreToolAssignmentWhereInput | StoreToolAssignmentWhereInput[]
    storeId?: StringFilter<"StoreToolAssignment"> | string
    toolId?: StringFilter<"StoreToolAssignment"> | string
    isActive?: BoolFilter<"StoreToolAssignment"> | boolean
    assignedAt?: DateTimeFilter<"StoreToolAssignment"> | Date | string
    config?: StringNullableFilter<"StoreToolAssignment"> | string | null
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
    tool?: XOR<ToolDefinitionScalarRelationFilter, ToolDefinitionWhereInput>
  }, "id" | "storeId_toolId">

  export type StoreToolAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    storeId?: SortOrder
    toolId?: SortOrder
    isActive?: SortOrder
    assignedAt?: SortOrder
    config?: SortOrderInput | SortOrder
    _count?: StoreToolAssignmentCountOrderByAggregateInput
    _max?: StoreToolAssignmentMaxOrderByAggregateInput
    _min?: StoreToolAssignmentMinOrderByAggregateInput
  }

  export type StoreToolAssignmentScalarWhereWithAggregatesInput = {
    AND?: StoreToolAssignmentScalarWhereWithAggregatesInput | StoreToolAssignmentScalarWhereWithAggregatesInput[]
    OR?: StoreToolAssignmentScalarWhereWithAggregatesInput[]
    NOT?: StoreToolAssignmentScalarWhereWithAggregatesInput | StoreToolAssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StoreToolAssignment"> | string
    storeId?: StringWithAggregatesFilter<"StoreToolAssignment"> | string
    toolId?: StringWithAggregatesFilter<"StoreToolAssignment"> | string
    isActive?: BoolWithAggregatesFilter<"StoreToolAssignment"> | boolean
    assignedAt?: DateTimeWithAggregatesFilter<"StoreToolAssignment"> | Date | string
    config?: StringNullableWithAggregatesFilter<"StoreToolAssignment"> | string | null
  }

  export type UserStoreAssignmentWhereInput = {
    AND?: UserStoreAssignmentWhereInput | UserStoreAssignmentWhereInput[]
    OR?: UserStoreAssignmentWhereInput[]
    NOT?: UserStoreAssignmentWhereInput | UserStoreAssignmentWhereInput[]
    id?: StringFilter<"UserStoreAssignment"> | string
    userId?: StringFilter<"UserStoreAssignment"> | string
    storeId?: StringFilter<"UserStoreAssignment"> | string
    assignedAt?: DateTimeFilter<"UserStoreAssignment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
  }

  export type UserStoreAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    assignedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    store?: StoreOrderByWithRelationInput
  }

  export type UserStoreAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_storeId?: UserStoreAssignmentUserIdStoreIdCompoundUniqueInput
    AND?: UserStoreAssignmentWhereInput | UserStoreAssignmentWhereInput[]
    OR?: UserStoreAssignmentWhereInput[]
    NOT?: UserStoreAssignmentWhereInput | UserStoreAssignmentWhereInput[]
    userId?: StringFilter<"UserStoreAssignment"> | string
    storeId?: StringFilter<"UserStoreAssignment"> | string
    assignedAt?: DateTimeFilter<"UserStoreAssignment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
  }, "id" | "userId_storeId">

  export type UserStoreAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    assignedAt?: SortOrder
    _count?: UserStoreAssignmentCountOrderByAggregateInput
    _max?: UserStoreAssignmentMaxOrderByAggregateInput
    _min?: UserStoreAssignmentMinOrderByAggregateInput
  }

  export type UserStoreAssignmentScalarWhereWithAggregatesInput = {
    AND?: UserStoreAssignmentScalarWhereWithAggregatesInput | UserStoreAssignmentScalarWhereWithAggregatesInput[]
    OR?: UserStoreAssignmentScalarWhereWithAggregatesInput[]
    NOT?: UserStoreAssignmentScalarWhereWithAggregatesInput | UserStoreAssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserStoreAssignment"> | string
    userId?: StringWithAggregatesFilter<"UserStoreAssignment"> | string
    storeId?: StringWithAggregatesFilter<"UserStoreAssignment"> | string
    assignedAt?: DateTimeWithAggregatesFilter<"UserStoreAssignment"> | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    tenantId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringFilter<"Subscription"> | string
    stripeSubId?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeFilter<"Subscription"> | Date | string
    cancelAtPeriod?: BoolFilter<"Subscription"> | boolean
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriod?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId?: string
    stripeCustomerId?: string
    stripeSubId?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    status?: StringFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeFilter<"Subscription"> | Date | string
    cancelAtPeriod?: BoolFilter<"Subscription"> | boolean
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "tenantId" | "stripeCustomerId" | "stripeSubId">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriod?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    tenantId?: StringWithAggregatesFilter<"Subscription"> | string
    stripeCustomerId?: StringWithAggregatesFilter<"Subscription"> | string
    stripeSubId?: StringWithAggregatesFilter<"Subscription"> | string
    status?: StringWithAggregatesFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    cancelAtPeriod?: BoolWithAggregatesFilter<"Subscription"> | boolean
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    tenantId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entity?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    tenantId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entity?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    tenantId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entity?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    details?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type DataProcessingConsentWhereInput = {
    AND?: DataProcessingConsentWhereInput | DataProcessingConsentWhereInput[]
    OR?: DataProcessingConsentWhereInput[]
    NOT?: DataProcessingConsentWhereInput | DataProcessingConsentWhereInput[]
    id?: StringFilter<"DataProcessingConsent"> | string
    tenantId?: StringFilter<"DataProcessingConsent"> | string
    consentType?: StringFilter<"DataProcessingConsent"> | string
    grantedAt?: DateTimeFilter<"DataProcessingConsent"> | Date | string
    grantedBy?: StringFilter<"DataProcessingConsent"> | string
    revokedAt?: DateTimeNullableFilter<"DataProcessingConsent"> | Date | string | null
    revokedBy?: StringNullableFilter<"DataProcessingConsent"> | string | null
    version?: StringFilter<"DataProcessingConsent"> | string
    document?: StringNullableFilter<"DataProcessingConsent"> | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type DataProcessingConsentOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    consentType?: SortOrder
    grantedAt?: SortOrder
    grantedBy?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    revokedBy?: SortOrderInput | SortOrder
    version?: SortOrder
    document?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type DataProcessingConsentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_consentType?: DataProcessingConsentTenantIdConsentTypeCompoundUniqueInput
    AND?: DataProcessingConsentWhereInput | DataProcessingConsentWhereInput[]
    OR?: DataProcessingConsentWhereInput[]
    NOT?: DataProcessingConsentWhereInput | DataProcessingConsentWhereInput[]
    tenantId?: StringFilter<"DataProcessingConsent"> | string
    consentType?: StringFilter<"DataProcessingConsent"> | string
    grantedAt?: DateTimeFilter<"DataProcessingConsent"> | Date | string
    grantedBy?: StringFilter<"DataProcessingConsent"> | string
    revokedAt?: DateTimeNullableFilter<"DataProcessingConsent"> | Date | string | null
    revokedBy?: StringNullableFilter<"DataProcessingConsent"> | string | null
    version?: StringFilter<"DataProcessingConsent"> | string
    document?: StringNullableFilter<"DataProcessingConsent"> | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "tenantId_consentType">

  export type DataProcessingConsentOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    consentType?: SortOrder
    grantedAt?: SortOrder
    grantedBy?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    revokedBy?: SortOrderInput | SortOrder
    version?: SortOrder
    document?: SortOrderInput | SortOrder
    _count?: DataProcessingConsentCountOrderByAggregateInput
    _max?: DataProcessingConsentMaxOrderByAggregateInput
    _min?: DataProcessingConsentMinOrderByAggregateInput
  }

  export type DataProcessingConsentScalarWhereWithAggregatesInput = {
    AND?: DataProcessingConsentScalarWhereWithAggregatesInput | DataProcessingConsentScalarWhereWithAggregatesInput[]
    OR?: DataProcessingConsentScalarWhereWithAggregatesInput[]
    NOT?: DataProcessingConsentScalarWhereWithAggregatesInput | DataProcessingConsentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DataProcessingConsent"> | string
    tenantId?: StringWithAggregatesFilter<"DataProcessingConsent"> | string
    consentType?: StringWithAggregatesFilter<"DataProcessingConsent"> | string
    grantedAt?: DateTimeWithAggregatesFilter<"DataProcessingConsent"> | Date | string
    grantedBy?: StringWithAggregatesFilter<"DataProcessingConsent"> | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"DataProcessingConsent"> | Date | string | null
    revokedBy?: StringNullableWithAggregatesFilter<"DataProcessingConsent"> | string | null
    version?: StringWithAggregatesFilter<"DataProcessingConsent"> | string
    document?: StringNullableWithAggregatesFilter<"DataProcessingConsent"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant?: TenantCreateNestedOneWithoutUsersInput
    storeAssignments?: UserStoreAssignmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    role?: string
    tenantId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeAssignments?: UserStoreAssignmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneWithoutUsersNestedInput
    storeAssignments?: UserStoreAssignmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeAssignments?: UserStoreAssignmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    role?: string
    tenantId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    stores?: StoreCreateNestedManyWithoutTenantInput
    subscription?: SubscriptionCreateNestedOneWithoutTenantInput
    consents?: DataProcessingConsentCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    stores?: StoreUncheckedCreateNestedManyWithoutTenantInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutTenantInput
    consents?: DataProcessingConsentUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    stores?: StoreUpdateManyWithoutTenantNestedInput
    subscription?: SubscriptionUpdateOneWithoutTenantNestedInput
    consents?: DataProcessingConsentUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    stores?: StoreUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutTenantNestedInput
    consents?: DataProcessingConsentUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreCreateInput = {
    id?: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutStoresInput
    tools?: StoreToolAssignmentCreateNestedManyWithoutStoreInput
    userAssignments?: UserStoreAssignmentCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateInput = {
    id?: string
    tenantId: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tools?: StoreToolAssignmentUncheckedCreateNestedManyWithoutStoreInput
    userAssignments?: UserStoreAssignmentUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutStoresNestedInput
    tools?: StoreToolAssignmentUpdateManyWithoutStoreNestedInput
    userAssignments?: UserStoreAssignmentUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tools?: StoreToolAssignmentUncheckedUpdateManyWithoutStoreNestedInput
    userAssignments?: UserStoreAssignmentUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateManyInput = {
    id?: string
    tenantId: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolDefinitionCreateInput = {
    id?: string
    key: string
    name: string
    description?: string | null
    category: string
    icon?: string | null
    priceMonthly?: number
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: StoreToolAssignmentCreateNestedManyWithoutToolInput
  }

  export type ToolDefinitionUncheckedCreateInput = {
    id?: string
    key: string
    name: string
    description?: string | null
    category: string
    icon?: string | null
    priceMonthly?: number
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: StoreToolAssignmentUncheckedCreateNestedManyWithoutToolInput
  }

  export type ToolDefinitionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: StoreToolAssignmentUpdateManyWithoutToolNestedInput
  }

  export type ToolDefinitionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: StoreToolAssignmentUncheckedUpdateManyWithoutToolNestedInput
  }

  export type ToolDefinitionCreateManyInput = {
    id?: string
    key: string
    name: string
    description?: string | null
    category: string
    icon?: string | null
    priceMonthly?: number
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ToolDefinitionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolDefinitionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreToolAssignmentCreateInput = {
    id?: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
    store: StoreCreateNestedOneWithoutToolsInput
    tool: ToolDefinitionCreateNestedOneWithoutAssignmentsInput
  }

  export type StoreToolAssignmentUncheckedCreateInput = {
    id?: string
    storeId: string
    toolId: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
  }

  export type StoreToolAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    store?: StoreUpdateOneRequiredWithoutToolsNestedInput
    tool?: ToolDefinitionUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type StoreToolAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    toolId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StoreToolAssignmentCreateManyInput = {
    id?: string
    storeId: string
    toolId: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
  }

  export type StoreToolAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StoreToolAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    toolId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserStoreAssignmentCreateInput = {
    id?: string
    assignedAt?: Date | string
    user: UserCreateNestedOneWithoutStoreAssignmentsInput
    store: StoreCreateNestedOneWithoutUserAssignmentsInput
  }

  export type UserStoreAssignmentUncheckedCreateInput = {
    id?: string
    userId: string
    storeId: string
    assignedAt?: Date | string
  }

  export type UserStoreAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStoreAssignmentsNestedInput
    store?: StoreUpdateOneRequiredWithoutUserAssignmentsNestedInput
  }

  export type UserStoreAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoreAssignmentCreateManyInput = {
    id?: string
    userId: string
    storeId: string
    assignedAt?: Date | string
  }

  export type UserStoreAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoreAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    stripeCustomerId: string
    stripeSubId: string
    status: string
    currentPeriodEnd: Date | string
    cancelAtPeriod?: boolean
    tenant: TenantCreateNestedOneWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    tenantId: string
    stripeCustomerId: string
    stripeSubId: string
    status: string
    currentPeriodEnd: Date | string
    cancelAtPeriod?: boolean
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripeSubId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriod?: BoolFieldUpdateOperationsInput | boolean
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripeSubId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriod?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    tenantId: string
    stripeCustomerId: string
    stripeSubId: string
    status: string
    currentPeriodEnd: Date | string
    cancelAtPeriod?: boolean
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripeSubId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriod?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripeSubId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriod?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AuditLogCreateInput = {
    id?: string
    tenantId?: string | null
    userId?: string | null
    action: string
    entity: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    tenantId?: string | null
    userId?: string | null
    action: string
    entity: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    tenantId?: string | null
    userId?: string | null
    action: string
    entity: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataProcessingConsentCreateInput = {
    id?: string
    consentType: string
    grantedAt?: Date | string
    grantedBy: string
    revokedAt?: Date | string | null
    revokedBy?: string | null
    version: string
    document?: string | null
    tenant: TenantCreateNestedOneWithoutConsentsInput
  }

  export type DataProcessingConsentUncheckedCreateInput = {
    id?: string
    tenantId: string
    consentType: string
    grantedAt?: Date | string
    grantedBy: string
    revokedAt?: Date | string | null
    revokedBy?: string | null
    version: string
    document?: string | null
  }

  export type DataProcessingConsentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    document?: NullableStringFieldUpdateOperationsInput | string | null
    tenant?: TenantUpdateOneRequiredWithoutConsentsNestedInput
  }

  export type DataProcessingConsentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    document?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataProcessingConsentCreateManyInput = {
    id?: string
    tenantId: string
    consentType: string
    grantedAt?: Date | string
    grantedBy: string
    revokedAt?: Date | string | null
    revokedBy?: string | null
    version: string
    document?: string | null
  }

  export type DataProcessingConsentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    document?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataProcessingConsentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    document?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TenantNullableScalarRelationFilter = {
    is?: TenantWhereInput | null
    isNot?: TenantWhereInput | null
  }

  export type UserStoreAssignmentListRelationFilter = {
    every?: UserStoreAssignmentWhereInput
    some?: UserStoreAssignmentWhereInput
    none?: UserStoreAssignmentWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserStoreAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type StoreListRelationFilter = {
    every?: StoreWhereInput
    some?: StoreWhereInput
    none?: StoreWhereInput
  }

  export type SubscriptionNullableScalarRelationFilter = {
    is?: SubscriptionWhereInput | null
    isNot?: SubscriptionWhereInput | null
  }

  export type DataProcessingConsentListRelationFilter = {
    every?: DataProcessingConsentWhereInput
    some?: DataProcessingConsentWhereInput
    none?: DataProcessingConsentWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StoreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DataProcessingConsentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    contactEmail?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    maxUsers?: SortOrder
    logoUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    maxUsers?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    contactEmail?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    maxUsers?: SortOrder
    logoUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    contactEmail?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    maxUsers?: SortOrder
    logoUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    maxUsers?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type StoreToolAssignmentListRelationFilter = {
    every?: StoreToolAssignmentWhereInput
    some?: StoreToolAssignmentWhereInput
    none?: StoreToolAssignmentWhereInput
  }

  export type StoreToolAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StoreCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    city?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    city?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    city?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ToolDefinitionCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    icon?: SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ToolDefinitionAvgOrderByAggregateInput = {
    priceMonthly?: SortOrder
    sortOrder?: SortOrder
  }

  export type ToolDefinitionMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    icon?: SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ToolDefinitionMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    icon?: SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ToolDefinitionSumOrderByAggregateInput = {
    priceMonthly?: SortOrder
    sortOrder?: SortOrder
  }

  export type StoreScalarRelationFilter = {
    is?: StoreWhereInput
    isNot?: StoreWhereInput
  }

  export type ToolDefinitionScalarRelationFilter = {
    is?: ToolDefinitionWhereInput
    isNot?: ToolDefinitionWhereInput
  }

  export type StoreToolAssignmentStoreIdToolIdCompoundUniqueInput = {
    storeId: string
    toolId: string
  }

  export type StoreToolAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    toolId?: SortOrder
    isActive?: SortOrder
    assignedAt?: SortOrder
    config?: SortOrder
  }

  export type StoreToolAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    toolId?: SortOrder
    isActive?: SortOrder
    assignedAt?: SortOrder
    config?: SortOrder
  }

  export type StoreToolAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    toolId?: SortOrder
    isActive?: SortOrder
    assignedAt?: SortOrder
    config?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserStoreAssignmentUserIdStoreIdCompoundUniqueInput = {
    userId: string
    storeId: string
  }

  export type UserStoreAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    assignedAt?: SortOrder
  }

  export type UserStoreAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    assignedAt?: SortOrder
  }

  export type UserStoreAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storeId?: SortOrder
    assignedAt?: SortOrder
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriod?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriod?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriod?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type DataProcessingConsentTenantIdConsentTypeCompoundUniqueInput = {
    tenantId: string
    consentType: string
  }

  export type DataProcessingConsentCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    consentType?: SortOrder
    grantedAt?: SortOrder
    grantedBy?: SortOrder
    revokedAt?: SortOrder
    revokedBy?: SortOrder
    version?: SortOrder
    document?: SortOrder
  }

  export type DataProcessingConsentMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    consentType?: SortOrder
    grantedAt?: SortOrder
    grantedBy?: SortOrder
    revokedAt?: SortOrder
    revokedBy?: SortOrder
    version?: SortOrder
    document?: SortOrder
  }

  export type DataProcessingConsentMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    consentType?: SortOrder
    grantedAt?: SortOrder
    grantedBy?: SortOrder
    revokedAt?: SortOrder
    revokedBy?: SortOrder
    version?: SortOrder
    document?: SortOrder
  }

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type UserStoreAssignmentCreateNestedManyWithoutUserInput = {
    create?: XOR<UserStoreAssignmentCreateWithoutUserInput, UserStoreAssignmentUncheckedCreateWithoutUserInput> | UserStoreAssignmentCreateWithoutUserInput[] | UserStoreAssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStoreAssignmentCreateOrConnectWithoutUserInput | UserStoreAssignmentCreateOrConnectWithoutUserInput[]
    createMany?: UserStoreAssignmentCreateManyUserInputEnvelope
    connect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
  }

  export type UserStoreAssignmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserStoreAssignmentCreateWithoutUserInput, UserStoreAssignmentUncheckedCreateWithoutUserInput> | UserStoreAssignmentCreateWithoutUserInput[] | UserStoreAssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStoreAssignmentCreateOrConnectWithoutUserInput | UserStoreAssignmentCreateOrConnectWithoutUserInput[]
    createMany?: UserStoreAssignmentCreateManyUserInputEnvelope
    connect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TenantUpdateOneWithoutUsersNestedInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    upsert?: TenantUpsertWithoutUsersInput
    disconnect?: TenantWhereInput | boolean
    delete?: TenantWhereInput | boolean
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsersInput, TenantUpdateWithoutUsersInput>, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type UserStoreAssignmentUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserStoreAssignmentCreateWithoutUserInput, UserStoreAssignmentUncheckedCreateWithoutUserInput> | UserStoreAssignmentCreateWithoutUserInput[] | UserStoreAssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStoreAssignmentCreateOrConnectWithoutUserInput | UserStoreAssignmentCreateOrConnectWithoutUserInput[]
    upsert?: UserStoreAssignmentUpsertWithWhereUniqueWithoutUserInput | UserStoreAssignmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserStoreAssignmentCreateManyUserInputEnvelope
    set?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    disconnect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    delete?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    connect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    update?: UserStoreAssignmentUpdateWithWhereUniqueWithoutUserInput | UserStoreAssignmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserStoreAssignmentUpdateManyWithWhereWithoutUserInput | UserStoreAssignmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserStoreAssignmentScalarWhereInput | UserStoreAssignmentScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserStoreAssignmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserStoreAssignmentCreateWithoutUserInput, UserStoreAssignmentUncheckedCreateWithoutUserInput> | UserStoreAssignmentCreateWithoutUserInput[] | UserStoreAssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStoreAssignmentCreateOrConnectWithoutUserInput | UserStoreAssignmentCreateOrConnectWithoutUserInput[]
    upsert?: UserStoreAssignmentUpsertWithWhereUniqueWithoutUserInput | UserStoreAssignmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserStoreAssignmentCreateManyUserInputEnvelope
    set?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    disconnect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    delete?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    connect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    update?: UserStoreAssignmentUpdateWithWhereUniqueWithoutUserInput | UserStoreAssignmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserStoreAssignmentUpdateManyWithWhereWithoutUserInput | UserStoreAssignmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserStoreAssignmentScalarWhereInput | UserStoreAssignmentScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type StoreCreateNestedManyWithoutTenantInput = {
    create?: XOR<StoreCreateWithoutTenantInput, StoreUncheckedCreateWithoutTenantInput> | StoreCreateWithoutTenantInput[] | StoreUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutTenantInput | StoreCreateOrConnectWithoutTenantInput[]
    createMany?: StoreCreateManyTenantInputEnvelope
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedOneWithoutTenantInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type DataProcessingConsentCreateNestedManyWithoutTenantInput = {
    create?: XOR<DataProcessingConsentCreateWithoutTenantInput, DataProcessingConsentUncheckedCreateWithoutTenantInput> | DataProcessingConsentCreateWithoutTenantInput[] | DataProcessingConsentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: DataProcessingConsentCreateOrConnectWithoutTenantInput | DataProcessingConsentCreateOrConnectWithoutTenantInput[]
    createMany?: DataProcessingConsentCreateManyTenantInputEnvelope
    connect?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type StoreUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<StoreCreateWithoutTenantInput, StoreUncheckedCreateWithoutTenantInput> | StoreCreateWithoutTenantInput[] | StoreUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutTenantInput | StoreCreateOrConnectWithoutTenantInput[]
    createMany?: StoreCreateManyTenantInputEnvelope
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedOneWithoutTenantInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type DataProcessingConsentUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<DataProcessingConsentCreateWithoutTenantInput, DataProcessingConsentUncheckedCreateWithoutTenantInput> | DataProcessingConsentCreateWithoutTenantInput[] | DataProcessingConsentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: DataProcessingConsentCreateOrConnectWithoutTenantInput | DataProcessingConsentCreateOrConnectWithoutTenantInput[]
    createMany?: DataProcessingConsentCreateManyTenantInputEnvelope
    connect?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type StoreUpdateManyWithoutTenantNestedInput = {
    create?: XOR<StoreCreateWithoutTenantInput, StoreUncheckedCreateWithoutTenantInput> | StoreCreateWithoutTenantInput[] | StoreUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutTenantInput | StoreCreateOrConnectWithoutTenantInput[]
    upsert?: StoreUpsertWithWhereUniqueWithoutTenantInput | StoreUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: StoreCreateManyTenantInputEnvelope
    set?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    disconnect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    delete?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    update?: StoreUpdateWithWhereUniqueWithoutTenantInput | StoreUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: StoreUpdateManyWithWhereWithoutTenantInput | StoreUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: StoreScalarWhereInput | StoreScalarWhereInput[]
  }

  export type SubscriptionUpdateOneWithoutTenantNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput
    upsert?: SubscriptionUpsertWithoutTenantInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutTenantInput, SubscriptionUpdateWithoutTenantInput>, SubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type DataProcessingConsentUpdateManyWithoutTenantNestedInput = {
    create?: XOR<DataProcessingConsentCreateWithoutTenantInput, DataProcessingConsentUncheckedCreateWithoutTenantInput> | DataProcessingConsentCreateWithoutTenantInput[] | DataProcessingConsentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: DataProcessingConsentCreateOrConnectWithoutTenantInput | DataProcessingConsentCreateOrConnectWithoutTenantInput[]
    upsert?: DataProcessingConsentUpsertWithWhereUniqueWithoutTenantInput | DataProcessingConsentUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: DataProcessingConsentCreateManyTenantInputEnvelope
    set?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
    disconnect?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
    delete?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
    connect?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
    update?: DataProcessingConsentUpdateWithWhereUniqueWithoutTenantInput | DataProcessingConsentUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: DataProcessingConsentUpdateManyWithWhereWithoutTenantInput | DataProcessingConsentUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: DataProcessingConsentScalarWhereInput | DataProcessingConsentScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type StoreUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<StoreCreateWithoutTenantInput, StoreUncheckedCreateWithoutTenantInput> | StoreCreateWithoutTenantInput[] | StoreUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutTenantInput | StoreCreateOrConnectWithoutTenantInput[]
    upsert?: StoreUpsertWithWhereUniqueWithoutTenantInput | StoreUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: StoreCreateManyTenantInputEnvelope
    set?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    disconnect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    delete?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    update?: StoreUpdateWithWhereUniqueWithoutTenantInput | StoreUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: StoreUpdateManyWithWhereWithoutTenantInput | StoreUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: StoreScalarWhereInput | StoreScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateOneWithoutTenantNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput
    upsert?: SubscriptionUpsertWithoutTenantInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutTenantInput, SubscriptionUpdateWithoutTenantInput>, SubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type DataProcessingConsentUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<DataProcessingConsentCreateWithoutTenantInput, DataProcessingConsentUncheckedCreateWithoutTenantInput> | DataProcessingConsentCreateWithoutTenantInput[] | DataProcessingConsentUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: DataProcessingConsentCreateOrConnectWithoutTenantInput | DataProcessingConsentCreateOrConnectWithoutTenantInput[]
    upsert?: DataProcessingConsentUpsertWithWhereUniqueWithoutTenantInput | DataProcessingConsentUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: DataProcessingConsentCreateManyTenantInputEnvelope
    set?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
    disconnect?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
    delete?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
    connect?: DataProcessingConsentWhereUniqueInput | DataProcessingConsentWhereUniqueInput[]
    update?: DataProcessingConsentUpdateWithWhereUniqueWithoutTenantInput | DataProcessingConsentUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: DataProcessingConsentUpdateManyWithWhereWithoutTenantInput | DataProcessingConsentUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: DataProcessingConsentScalarWhereInput | DataProcessingConsentScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutStoresInput = {
    create?: XOR<TenantCreateWithoutStoresInput, TenantUncheckedCreateWithoutStoresInput>
    connectOrCreate?: TenantCreateOrConnectWithoutStoresInput
    connect?: TenantWhereUniqueInput
  }

  export type StoreToolAssignmentCreateNestedManyWithoutStoreInput = {
    create?: XOR<StoreToolAssignmentCreateWithoutStoreInput, StoreToolAssignmentUncheckedCreateWithoutStoreInput> | StoreToolAssignmentCreateWithoutStoreInput[] | StoreToolAssignmentUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreToolAssignmentCreateOrConnectWithoutStoreInput | StoreToolAssignmentCreateOrConnectWithoutStoreInput[]
    createMany?: StoreToolAssignmentCreateManyStoreInputEnvelope
    connect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
  }

  export type UserStoreAssignmentCreateNestedManyWithoutStoreInput = {
    create?: XOR<UserStoreAssignmentCreateWithoutStoreInput, UserStoreAssignmentUncheckedCreateWithoutStoreInput> | UserStoreAssignmentCreateWithoutStoreInput[] | UserStoreAssignmentUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: UserStoreAssignmentCreateOrConnectWithoutStoreInput | UserStoreAssignmentCreateOrConnectWithoutStoreInput[]
    createMany?: UserStoreAssignmentCreateManyStoreInputEnvelope
    connect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
  }

  export type StoreToolAssignmentUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<StoreToolAssignmentCreateWithoutStoreInput, StoreToolAssignmentUncheckedCreateWithoutStoreInput> | StoreToolAssignmentCreateWithoutStoreInput[] | StoreToolAssignmentUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreToolAssignmentCreateOrConnectWithoutStoreInput | StoreToolAssignmentCreateOrConnectWithoutStoreInput[]
    createMany?: StoreToolAssignmentCreateManyStoreInputEnvelope
    connect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
  }

  export type UserStoreAssignmentUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<UserStoreAssignmentCreateWithoutStoreInput, UserStoreAssignmentUncheckedCreateWithoutStoreInput> | UserStoreAssignmentCreateWithoutStoreInput[] | UserStoreAssignmentUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: UserStoreAssignmentCreateOrConnectWithoutStoreInput | UserStoreAssignmentCreateOrConnectWithoutStoreInput[]
    createMany?: UserStoreAssignmentCreateManyStoreInputEnvelope
    connect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
  }

  export type TenantUpdateOneRequiredWithoutStoresNestedInput = {
    create?: XOR<TenantCreateWithoutStoresInput, TenantUncheckedCreateWithoutStoresInput>
    connectOrCreate?: TenantCreateOrConnectWithoutStoresInput
    upsert?: TenantUpsertWithoutStoresInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutStoresInput, TenantUpdateWithoutStoresInput>, TenantUncheckedUpdateWithoutStoresInput>
  }

  export type StoreToolAssignmentUpdateManyWithoutStoreNestedInput = {
    create?: XOR<StoreToolAssignmentCreateWithoutStoreInput, StoreToolAssignmentUncheckedCreateWithoutStoreInput> | StoreToolAssignmentCreateWithoutStoreInput[] | StoreToolAssignmentUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreToolAssignmentCreateOrConnectWithoutStoreInput | StoreToolAssignmentCreateOrConnectWithoutStoreInput[]
    upsert?: StoreToolAssignmentUpsertWithWhereUniqueWithoutStoreInput | StoreToolAssignmentUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: StoreToolAssignmentCreateManyStoreInputEnvelope
    set?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    disconnect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    delete?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    connect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    update?: StoreToolAssignmentUpdateWithWhereUniqueWithoutStoreInput | StoreToolAssignmentUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: StoreToolAssignmentUpdateManyWithWhereWithoutStoreInput | StoreToolAssignmentUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: StoreToolAssignmentScalarWhereInput | StoreToolAssignmentScalarWhereInput[]
  }

  export type UserStoreAssignmentUpdateManyWithoutStoreNestedInput = {
    create?: XOR<UserStoreAssignmentCreateWithoutStoreInput, UserStoreAssignmentUncheckedCreateWithoutStoreInput> | UserStoreAssignmentCreateWithoutStoreInput[] | UserStoreAssignmentUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: UserStoreAssignmentCreateOrConnectWithoutStoreInput | UserStoreAssignmentCreateOrConnectWithoutStoreInput[]
    upsert?: UserStoreAssignmentUpsertWithWhereUniqueWithoutStoreInput | UserStoreAssignmentUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: UserStoreAssignmentCreateManyStoreInputEnvelope
    set?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    disconnect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    delete?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    connect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    update?: UserStoreAssignmentUpdateWithWhereUniqueWithoutStoreInput | UserStoreAssignmentUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: UserStoreAssignmentUpdateManyWithWhereWithoutStoreInput | UserStoreAssignmentUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: UserStoreAssignmentScalarWhereInput | UserStoreAssignmentScalarWhereInput[]
  }

  export type StoreToolAssignmentUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<StoreToolAssignmentCreateWithoutStoreInput, StoreToolAssignmentUncheckedCreateWithoutStoreInput> | StoreToolAssignmentCreateWithoutStoreInput[] | StoreToolAssignmentUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreToolAssignmentCreateOrConnectWithoutStoreInput | StoreToolAssignmentCreateOrConnectWithoutStoreInput[]
    upsert?: StoreToolAssignmentUpsertWithWhereUniqueWithoutStoreInput | StoreToolAssignmentUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: StoreToolAssignmentCreateManyStoreInputEnvelope
    set?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    disconnect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    delete?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    connect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    update?: StoreToolAssignmentUpdateWithWhereUniqueWithoutStoreInput | StoreToolAssignmentUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: StoreToolAssignmentUpdateManyWithWhereWithoutStoreInput | StoreToolAssignmentUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: StoreToolAssignmentScalarWhereInput | StoreToolAssignmentScalarWhereInput[]
  }

  export type UserStoreAssignmentUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<UserStoreAssignmentCreateWithoutStoreInput, UserStoreAssignmentUncheckedCreateWithoutStoreInput> | UserStoreAssignmentCreateWithoutStoreInput[] | UserStoreAssignmentUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: UserStoreAssignmentCreateOrConnectWithoutStoreInput | UserStoreAssignmentCreateOrConnectWithoutStoreInput[]
    upsert?: UserStoreAssignmentUpsertWithWhereUniqueWithoutStoreInput | UserStoreAssignmentUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: UserStoreAssignmentCreateManyStoreInputEnvelope
    set?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    disconnect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    delete?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    connect?: UserStoreAssignmentWhereUniqueInput | UserStoreAssignmentWhereUniqueInput[]
    update?: UserStoreAssignmentUpdateWithWhereUniqueWithoutStoreInput | UserStoreAssignmentUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: UserStoreAssignmentUpdateManyWithWhereWithoutStoreInput | UserStoreAssignmentUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: UserStoreAssignmentScalarWhereInput | UserStoreAssignmentScalarWhereInput[]
  }

  export type StoreToolAssignmentCreateNestedManyWithoutToolInput = {
    create?: XOR<StoreToolAssignmentCreateWithoutToolInput, StoreToolAssignmentUncheckedCreateWithoutToolInput> | StoreToolAssignmentCreateWithoutToolInput[] | StoreToolAssignmentUncheckedCreateWithoutToolInput[]
    connectOrCreate?: StoreToolAssignmentCreateOrConnectWithoutToolInput | StoreToolAssignmentCreateOrConnectWithoutToolInput[]
    createMany?: StoreToolAssignmentCreateManyToolInputEnvelope
    connect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
  }

  export type StoreToolAssignmentUncheckedCreateNestedManyWithoutToolInput = {
    create?: XOR<StoreToolAssignmentCreateWithoutToolInput, StoreToolAssignmentUncheckedCreateWithoutToolInput> | StoreToolAssignmentCreateWithoutToolInput[] | StoreToolAssignmentUncheckedCreateWithoutToolInput[]
    connectOrCreate?: StoreToolAssignmentCreateOrConnectWithoutToolInput | StoreToolAssignmentCreateOrConnectWithoutToolInput[]
    createMany?: StoreToolAssignmentCreateManyToolInputEnvelope
    connect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
  }

  export type StoreToolAssignmentUpdateManyWithoutToolNestedInput = {
    create?: XOR<StoreToolAssignmentCreateWithoutToolInput, StoreToolAssignmentUncheckedCreateWithoutToolInput> | StoreToolAssignmentCreateWithoutToolInput[] | StoreToolAssignmentUncheckedCreateWithoutToolInput[]
    connectOrCreate?: StoreToolAssignmentCreateOrConnectWithoutToolInput | StoreToolAssignmentCreateOrConnectWithoutToolInput[]
    upsert?: StoreToolAssignmentUpsertWithWhereUniqueWithoutToolInput | StoreToolAssignmentUpsertWithWhereUniqueWithoutToolInput[]
    createMany?: StoreToolAssignmentCreateManyToolInputEnvelope
    set?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    disconnect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    delete?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    connect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    update?: StoreToolAssignmentUpdateWithWhereUniqueWithoutToolInput | StoreToolAssignmentUpdateWithWhereUniqueWithoutToolInput[]
    updateMany?: StoreToolAssignmentUpdateManyWithWhereWithoutToolInput | StoreToolAssignmentUpdateManyWithWhereWithoutToolInput[]
    deleteMany?: StoreToolAssignmentScalarWhereInput | StoreToolAssignmentScalarWhereInput[]
  }

  export type StoreToolAssignmentUncheckedUpdateManyWithoutToolNestedInput = {
    create?: XOR<StoreToolAssignmentCreateWithoutToolInput, StoreToolAssignmentUncheckedCreateWithoutToolInput> | StoreToolAssignmentCreateWithoutToolInput[] | StoreToolAssignmentUncheckedCreateWithoutToolInput[]
    connectOrCreate?: StoreToolAssignmentCreateOrConnectWithoutToolInput | StoreToolAssignmentCreateOrConnectWithoutToolInput[]
    upsert?: StoreToolAssignmentUpsertWithWhereUniqueWithoutToolInput | StoreToolAssignmentUpsertWithWhereUniqueWithoutToolInput[]
    createMany?: StoreToolAssignmentCreateManyToolInputEnvelope
    set?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    disconnect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    delete?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    connect?: StoreToolAssignmentWhereUniqueInput | StoreToolAssignmentWhereUniqueInput[]
    update?: StoreToolAssignmentUpdateWithWhereUniqueWithoutToolInput | StoreToolAssignmentUpdateWithWhereUniqueWithoutToolInput[]
    updateMany?: StoreToolAssignmentUpdateManyWithWhereWithoutToolInput | StoreToolAssignmentUpdateManyWithWhereWithoutToolInput[]
    deleteMany?: StoreToolAssignmentScalarWhereInput | StoreToolAssignmentScalarWhereInput[]
  }

  export type StoreCreateNestedOneWithoutToolsInput = {
    create?: XOR<StoreCreateWithoutToolsInput, StoreUncheckedCreateWithoutToolsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutToolsInput
    connect?: StoreWhereUniqueInput
  }

  export type ToolDefinitionCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<ToolDefinitionCreateWithoutAssignmentsInput, ToolDefinitionUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: ToolDefinitionCreateOrConnectWithoutAssignmentsInput
    connect?: ToolDefinitionWhereUniqueInput
  }

  export type StoreUpdateOneRequiredWithoutToolsNestedInput = {
    create?: XOR<StoreCreateWithoutToolsInput, StoreUncheckedCreateWithoutToolsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutToolsInput
    upsert?: StoreUpsertWithoutToolsInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutToolsInput, StoreUpdateWithoutToolsInput>, StoreUncheckedUpdateWithoutToolsInput>
  }

  export type ToolDefinitionUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<ToolDefinitionCreateWithoutAssignmentsInput, ToolDefinitionUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: ToolDefinitionCreateOrConnectWithoutAssignmentsInput
    upsert?: ToolDefinitionUpsertWithoutAssignmentsInput
    connect?: ToolDefinitionWhereUniqueInput
    update?: XOR<XOR<ToolDefinitionUpdateToOneWithWhereWithoutAssignmentsInput, ToolDefinitionUpdateWithoutAssignmentsInput>, ToolDefinitionUncheckedUpdateWithoutAssignmentsInput>
  }

  export type UserCreateNestedOneWithoutStoreAssignmentsInput = {
    create?: XOR<UserCreateWithoutStoreAssignmentsInput, UserUncheckedCreateWithoutStoreAssignmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutStoreAssignmentsInput
    connect?: UserWhereUniqueInput
  }

  export type StoreCreateNestedOneWithoutUserAssignmentsInput = {
    create?: XOR<StoreCreateWithoutUserAssignmentsInput, StoreUncheckedCreateWithoutUserAssignmentsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutUserAssignmentsInput
    connect?: StoreWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutStoreAssignmentsNestedInput = {
    create?: XOR<UserCreateWithoutStoreAssignmentsInput, UserUncheckedCreateWithoutStoreAssignmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutStoreAssignmentsInput
    upsert?: UserUpsertWithoutStoreAssignmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStoreAssignmentsInput, UserUpdateWithoutStoreAssignmentsInput>, UserUncheckedUpdateWithoutStoreAssignmentsInput>
  }

  export type StoreUpdateOneRequiredWithoutUserAssignmentsNestedInput = {
    create?: XOR<StoreCreateWithoutUserAssignmentsInput, StoreUncheckedCreateWithoutUserAssignmentsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutUserAssignmentsInput
    upsert?: StoreUpsertWithoutUserAssignmentsInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutUserAssignmentsInput, StoreUpdateWithoutUserAssignmentsInput>, StoreUncheckedUpdateWithoutUserAssignmentsInput>
  }

  export type TenantCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionInput
    upsert?: TenantUpsertWithoutSubscriptionInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSubscriptionInput, TenantUpdateWithoutSubscriptionInput>, TenantUncheckedUpdateWithoutSubscriptionInput>
  }

  export type TenantCreateNestedOneWithoutConsentsInput = {
    create?: XOR<TenantCreateWithoutConsentsInput, TenantUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutConsentsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutConsentsNestedInput = {
    create?: XOR<TenantCreateWithoutConsentsInput, TenantUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutConsentsInput
    upsert?: TenantUpsertWithoutConsentsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutConsentsInput, TenantUpdateWithoutConsentsInput>, TenantUncheckedUpdateWithoutConsentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TenantCreateWithoutUsersInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stores?: StoreCreateNestedManyWithoutTenantInput
    subscription?: SubscriptionCreateNestedOneWithoutTenantInput
    consents?: DataProcessingConsentCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stores?: StoreUncheckedCreateNestedManyWithoutTenantInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutTenantInput
    consents?: DataProcessingConsentUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
  }

  export type UserStoreAssignmentCreateWithoutUserInput = {
    id?: string
    assignedAt?: Date | string
    store: StoreCreateNestedOneWithoutUserAssignmentsInput
  }

  export type UserStoreAssignmentUncheckedCreateWithoutUserInput = {
    id?: string
    storeId: string
    assignedAt?: Date | string
  }

  export type UserStoreAssignmentCreateOrConnectWithoutUserInput = {
    where: UserStoreAssignmentWhereUniqueInput
    create: XOR<UserStoreAssignmentCreateWithoutUserInput, UserStoreAssignmentUncheckedCreateWithoutUserInput>
  }

  export type UserStoreAssignmentCreateManyUserInputEnvelope = {
    data: UserStoreAssignmentCreateManyUserInput | UserStoreAssignmentCreateManyUserInput[]
  }

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stores?: StoreUpdateManyWithoutTenantNestedInput
    subscription?: SubscriptionUpdateOneWithoutTenantNestedInput
    consents?: DataProcessingConsentUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stores?: StoreUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutTenantNestedInput
    consents?: DataProcessingConsentUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserStoreAssignmentUpsertWithWhereUniqueWithoutUserInput = {
    where: UserStoreAssignmentWhereUniqueInput
    update: XOR<UserStoreAssignmentUpdateWithoutUserInput, UserStoreAssignmentUncheckedUpdateWithoutUserInput>
    create: XOR<UserStoreAssignmentCreateWithoutUserInput, UserStoreAssignmentUncheckedCreateWithoutUserInput>
  }

  export type UserStoreAssignmentUpdateWithWhereUniqueWithoutUserInput = {
    where: UserStoreAssignmentWhereUniqueInput
    data: XOR<UserStoreAssignmentUpdateWithoutUserInput, UserStoreAssignmentUncheckedUpdateWithoutUserInput>
  }

  export type UserStoreAssignmentUpdateManyWithWhereWithoutUserInput = {
    where: UserStoreAssignmentScalarWhereInput
    data: XOR<UserStoreAssignmentUpdateManyMutationInput, UserStoreAssignmentUncheckedUpdateManyWithoutUserInput>
  }

  export type UserStoreAssignmentScalarWhereInput = {
    AND?: UserStoreAssignmentScalarWhereInput | UserStoreAssignmentScalarWhereInput[]
    OR?: UserStoreAssignmentScalarWhereInput[]
    NOT?: UserStoreAssignmentScalarWhereInput | UserStoreAssignmentScalarWhereInput[]
    id?: StringFilter<"UserStoreAssignment"> | string
    userId?: StringFilter<"UserStoreAssignment"> | string
    storeId?: StringFilter<"UserStoreAssignment"> | string
    assignedAt?: DateTimeFilter<"UserStoreAssignment"> | Date | string
  }

  export type UserCreateWithoutTenantInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeAssignments?: UserStoreAssignmentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTenantInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeAssignments?: UserStoreAssignmentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTenantInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserCreateManyTenantInputEnvelope = {
    data: UserCreateManyTenantInput | UserCreateManyTenantInput[]
  }

  export type StoreCreateWithoutTenantInput = {
    id?: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tools?: StoreToolAssignmentCreateNestedManyWithoutStoreInput
    userAssignments?: UserStoreAssignmentCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutTenantInput = {
    id?: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tools?: StoreToolAssignmentUncheckedCreateNestedManyWithoutStoreInput
    userAssignments?: UserStoreAssignmentUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutTenantInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutTenantInput, StoreUncheckedCreateWithoutTenantInput>
  }

  export type StoreCreateManyTenantInputEnvelope = {
    data: StoreCreateManyTenantInput | StoreCreateManyTenantInput[]
  }

  export type SubscriptionCreateWithoutTenantInput = {
    id?: string
    stripeCustomerId: string
    stripeSubId: string
    status: string
    currentPeriodEnd: Date | string
    cancelAtPeriod?: boolean
  }

  export type SubscriptionUncheckedCreateWithoutTenantInput = {
    id?: string
    stripeCustomerId: string
    stripeSubId: string
    status: string
    currentPeriodEnd: Date | string
    cancelAtPeriod?: boolean
  }

  export type SubscriptionCreateOrConnectWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type DataProcessingConsentCreateWithoutTenantInput = {
    id?: string
    consentType: string
    grantedAt?: Date | string
    grantedBy: string
    revokedAt?: Date | string | null
    revokedBy?: string | null
    version: string
    document?: string | null
  }

  export type DataProcessingConsentUncheckedCreateWithoutTenantInput = {
    id?: string
    consentType: string
    grantedAt?: Date | string
    grantedBy: string
    revokedAt?: Date | string | null
    revokedBy?: string | null
    version: string
    document?: string | null
  }

  export type DataProcessingConsentCreateOrConnectWithoutTenantInput = {
    where: DataProcessingConsentWhereUniqueInput
    create: XOR<DataProcessingConsentCreateWithoutTenantInput, DataProcessingConsentUncheckedCreateWithoutTenantInput>
  }

  export type DataProcessingConsentCreateManyTenantInputEnvelope = {
    data: DataProcessingConsentCreateManyTenantInput | DataProcessingConsentCreateManyTenantInput[]
  }

  export type UserUpsertWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
  }

  export type UserUpdateManyWithWhereWithoutTenantInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    tenantId?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type StoreUpsertWithWhereUniqueWithoutTenantInput = {
    where: StoreWhereUniqueInput
    update: XOR<StoreUpdateWithoutTenantInput, StoreUncheckedUpdateWithoutTenantInput>
    create: XOR<StoreCreateWithoutTenantInput, StoreUncheckedCreateWithoutTenantInput>
  }

  export type StoreUpdateWithWhereUniqueWithoutTenantInput = {
    where: StoreWhereUniqueInput
    data: XOR<StoreUpdateWithoutTenantInput, StoreUncheckedUpdateWithoutTenantInput>
  }

  export type StoreUpdateManyWithWhereWithoutTenantInput = {
    where: StoreScalarWhereInput
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyWithoutTenantInput>
  }

  export type StoreScalarWhereInput = {
    AND?: StoreScalarWhereInput | StoreScalarWhereInput[]
    OR?: StoreScalarWhereInput[]
    NOT?: StoreScalarWhereInput | StoreScalarWhereInput[]
    id?: StringFilter<"Store"> | string
    tenantId?: StringFilter<"Store"> | string
    name?: StringFilter<"Store"> | string
    city?: StringNullableFilter<"Store"> | string | null
    address?: StringNullableFilter<"Store"> | string | null
    isActive?: BoolFilter<"Store"> | boolean
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
  }

  export type SubscriptionUpsertWithoutTenantInput = {
    update: XOR<SubscriptionUpdateWithoutTenantInput, SubscriptionUncheckedUpdateWithoutTenantInput>
    create: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
    where?: SubscriptionWhereInput
  }

  export type SubscriptionUpdateToOneWithWhereWithoutTenantInput = {
    where?: SubscriptionWhereInput
    data: XOR<SubscriptionUpdateWithoutTenantInput, SubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type SubscriptionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripeSubId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriod?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SubscriptionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: StringFieldUpdateOperationsInput | string
    stripeSubId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelAtPeriod?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DataProcessingConsentUpsertWithWhereUniqueWithoutTenantInput = {
    where: DataProcessingConsentWhereUniqueInput
    update: XOR<DataProcessingConsentUpdateWithoutTenantInput, DataProcessingConsentUncheckedUpdateWithoutTenantInput>
    create: XOR<DataProcessingConsentCreateWithoutTenantInput, DataProcessingConsentUncheckedCreateWithoutTenantInput>
  }

  export type DataProcessingConsentUpdateWithWhereUniqueWithoutTenantInput = {
    where: DataProcessingConsentWhereUniqueInput
    data: XOR<DataProcessingConsentUpdateWithoutTenantInput, DataProcessingConsentUncheckedUpdateWithoutTenantInput>
  }

  export type DataProcessingConsentUpdateManyWithWhereWithoutTenantInput = {
    where: DataProcessingConsentScalarWhereInput
    data: XOR<DataProcessingConsentUpdateManyMutationInput, DataProcessingConsentUncheckedUpdateManyWithoutTenantInput>
  }

  export type DataProcessingConsentScalarWhereInput = {
    AND?: DataProcessingConsentScalarWhereInput | DataProcessingConsentScalarWhereInput[]
    OR?: DataProcessingConsentScalarWhereInput[]
    NOT?: DataProcessingConsentScalarWhereInput | DataProcessingConsentScalarWhereInput[]
    id?: StringFilter<"DataProcessingConsent"> | string
    tenantId?: StringFilter<"DataProcessingConsent"> | string
    consentType?: StringFilter<"DataProcessingConsent"> | string
    grantedAt?: DateTimeFilter<"DataProcessingConsent"> | Date | string
    grantedBy?: StringFilter<"DataProcessingConsent"> | string
    revokedAt?: DateTimeNullableFilter<"DataProcessingConsent"> | Date | string | null
    revokedBy?: StringNullableFilter<"DataProcessingConsent"> | string | null
    version?: StringFilter<"DataProcessingConsent"> | string
    document?: StringNullableFilter<"DataProcessingConsent"> | string | null
  }

  export type TenantCreateWithoutStoresInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    subscription?: SubscriptionCreateNestedOneWithoutTenantInput
    consents?: DataProcessingConsentCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutStoresInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutTenantInput
    consents?: DataProcessingConsentUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutStoresInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutStoresInput, TenantUncheckedCreateWithoutStoresInput>
  }

  export type StoreToolAssignmentCreateWithoutStoreInput = {
    id?: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
    tool: ToolDefinitionCreateNestedOneWithoutAssignmentsInput
  }

  export type StoreToolAssignmentUncheckedCreateWithoutStoreInput = {
    id?: string
    toolId: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
  }

  export type StoreToolAssignmentCreateOrConnectWithoutStoreInput = {
    where: StoreToolAssignmentWhereUniqueInput
    create: XOR<StoreToolAssignmentCreateWithoutStoreInput, StoreToolAssignmentUncheckedCreateWithoutStoreInput>
  }

  export type StoreToolAssignmentCreateManyStoreInputEnvelope = {
    data: StoreToolAssignmentCreateManyStoreInput | StoreToolAssignmentCreateManyStoreInput[]
  }

  export type UserStoreAssignmentCreateWithoutStoreInput = {
    id?: string
    assignedAt?: Date | string
    user: UserCreateNestedOneWithoutStoreAssignmentsInput
  }

  export type UserStoreAssignmentUncheckedCreateWithoutStoreInput = {
    id?: string
    userId: string
    assignedAt?: Date | string
  }

  export type UserStoreAssignmentCreateOrConnectWithoutStoreInput = {
    where: UserStoreAssignmentWhereUniqueInput
    create: XOR<UserStoreAssignmentCreateWithoutStoreInput, UserStoreAssignmentUncheckedCreateWithoutStoreInput>
  }

  export type UserStoreAssignmentCreateManyStoreInputEnvelope = {
    data: UserStoreAssignmentCreateManyStoreInput | UserStoreAssignmentCreateManyStoreInput[]
  }

  export type TenantUpsertWithoutStoresInput = {
    update: XOR<TenantUpdateWithoutStoresInput, TenantUncheckedUpdateWithoutStoresInput>
    create: XOR<TenantCreateWithoutStoresInput, TenantUncheckedCreateWithoutStoresInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutStoresInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutStoresInput, TenantUncheckedUpdateWithoutStoresInput>
  }

  export type TenantUpdateWithoutStoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    subscription?: SubscriptionUpdateOneWithoutTenantNestedInput
    consents?: DataProcessingConsentUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutStoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutTenantNestedInput
    consents?: DataProcessingConsentUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type StoreToolAssignmentUpsertWithWhereUniqueWithoutStoreInput = {
    where: StoreToolAssignmentWhereUniqueInput
    update: XOR<StoreToolAssignmentUpdateWithoutStoreInput, StoreToolAssignmentUncheckedUpdateWithoutStoreInput>
    create: XOR<StoreToolAssignmentCreateWithoutStoreInput, StoreToolAssignmentUncheckedCreateWithoutStoreInput>
  }

  export type StoreToolAssignmentUpdateWithWhereUniqueWithoutStoreInput = {
    where: StoreToolAssignmentWhereUniqueInput
    data: XOR<StoreToolAssignmentUpdateWithoutStoreInput, StoreToolAssignmentUncheckedUpdateWithoutStoreInput>
  }

  export type StoreToolAssignmentUpdateManyWithWhereWithoutStoreInput = {
    where: StoreToolAssignmentScalarWhereInput
    data: XOR<StoreToolAssignmentUpdateManyMutationInput, StoreToolAssignmentUncheckedUpdateManyWithoutStoreInput>
  }

  export type StoreToolAssignmentScalarWhereInput = {
    AND?: StoreToolAssignmentScalarWhereInput | StoreToolAssignmentScalarWhereInput[]
    OR?: StoreToolAssignmentScalarWhereInput[]
    NOT?: StoreToolAssignmentScalarWhereInput | StoreToolAssignmentScalarWhereInput[]
    id?: StringFilter<"StoreToolAssignment"> | string
    storeId?: StringFilter<"StoreToolAssignment"> | string
    toolId?: StringFilter<"StoreToolAssignment"> | string
    isActive?: BoolFilter<"StoreToolAssignment"> | boolean
    assignedAt?: DateTimeFilter<"StoreToolAssignment"> | Date | string
    config?: StringNullableFilter<"StoreToolAssignment"> | string | null
  }

  export type UserStoreAssignmentUpsertWithWhereUniqueWithoutStoreInput = {
    where: UserStoreAssignmentWhereUniqueInput
    update: XOR<UserStoreAssignmentUpdateWithoutStoreInput, UserStoreAssignmentUncheckedUpdateWithoutStoreInput>
    create: XOR<UserStoreAssignmentCreateWithoutStoreInput, UserStoreAssignmentUncheckedCreateWithoutStoreInput>
  }

  export type UserStoreAssignmentUpdateWithWhereUniqueWithoutStoreInput = {
    where: UserStoreAssignmentWhereUniqueInput
    data: XOR<UserStoreAssignmentUpdateWithoutStoreInput, UserStoreAssignmentUncheckedUpdateWithoutStoreInput>
  }

  export type UserStoreAssignmentUpdateManyWithWhereWithoutStoreInput = {
    where: UserStoreAssignmentScalarWhereInput
    data: XOR<UserStoreAssignmentUpdateManyMutationInput, UserStoreAssignmentUncheckedUpdateManyWithoutStoreInput>
  }

  export type StoreToolAssignmentCreateWithoutToolInput = {
    id?: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
    store: StoreCreateNestedOneWithoutToolsInput
  }

  export type StoreToolAssignmentUncheckedCreateWithoutToolInput = {
    id?: string
    storeId: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
  }

  export type StoreToolAssignmentCreateOrConnectWithoutToolInput = {
    where: StoreToolAssignmentWhereUniqueInput
    create: XOR<StoreToolAssignmentCreateWithoutToolInput, StoreToolAssignmentUncheckedCreateWithoutToolInput>
  }

  export type StoreToolAssignmentCreateManyToolInputEnvelope = {
    data: StoreToolAssignmentCreateManyToolInput | StoreToolAssignmentCreateManyToolInput[]
  }

  export type StoreToolAssignmentUpsertWithWhereUniqueWithoutToolInput = {
    where: StoreToolAssignmentWhereUniqueInput
    update: XOR<StoreToolAssignmentUpdateWithoutToolInput, StoreToolAssignmentUncheckedUpdateWithoutToolInput>
    create: XOR<StoreToolAssignmentCreateWithoutToolInput, StoreToolAssignmentUncheckedCreateWithoutToolInput>
  }

  export type StoreToolAssignmentUpdateWithWhereUniqueWithoutToolInput = {
    where: StoreToolAssignmentWhereUniqueInput
    data: XOR<StoreToolAssignmentUpdateWithoutToolInput, StoreToolAssignmentUncheckedUpdateWithoutToolInput>
  }

  export type StoreToolAssignmentUpdateManyWithWhereWithoutToolInput = {
    where: StoreToolAssignmentScalarWhereInput
    data: XOR<StoreToolAssignmentUpdateManyMutationInput, StoreToolAssignmentUncheckedUpdateManyWithoutToolInput>
  }

  export type StoreCreateWithoutToolsInput = {
    id?: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutStoresInput
    userAssignments?: UserStoreAssignmentCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutToolsInput = {
    id?: string
    tenantId: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userAssignments?: UserStoreAssignmentUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutToolsInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutToolsInput, StoreUncheckedCreateWithoutToolsInput>
  }

  export type ToolDefinitionCreateWithoutAssignmentsInput = {
    id?: string
    key: string
    name: string
    description?: string | null
    category: string
    icon?: string | null
    priceMonthly?: number
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ToolDefinitionUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    key: string
    name: string
    description?: string | null
    category: string
    icon?: string | null
    priceMonthly?: number
    isActive?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ToolDefinitionCreateOrConnectWithoutAssignmentsInput = {
    where: ToolDefinitionWhereUniqueInput
    create: XOR<ToolDefinitionCreateWithoutAssignmentsInput, ToolDefinitionUncheckedCreateWithoutAssignmentsInput>
  }

  export type StoreUpsertWithoutToolsInput = {
    update: XOR<StoreUpdateWithoutToolsInput, StoreUncheckedUpdateWithoutToolsInput>
    create: XOR<StoreCreateWithoutToolsInput, StoreUncheckedCreateWithoutToolsInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutToolsInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutToolsInput, StoreUncheckedUpdateWithoutToolsInput>
  }

  export type StoreUpdateWithoutToolsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutStoresNestedInput
    userAssignments?: UserStoreAssignmentUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutToolsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userAssignments?: UserStoreAssignmentUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type ToolDefinitionUpsertWithoutAssignmentsInput = {
    update: XOR<ToolDefinitionUpdateWithoutAssignmentsInput, ToolDefinitionUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<ToolDefinitionCreateWithoutAssignmentsInput, ToolDefinitionUncheckedCreateWithoutAssignmentsInput>
    where?: ToolDefinitionWhereInput
  }

  export type ToolDefinitionUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: ToolDefinitionWhereInput
    data: XOR<ToolDefinitionUpdateWithoutAssignmentsInput, ToolDefinitionUncheckedUpdateWithoutAssignmentsInput>
  }

  export type ToolDefinitionUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolDefinitionUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutStoreAssignmentsInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant?: TenantCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutStoreAssignmentsInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    role?: string
    tenantId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutStoreAssignmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStoreAssignmentsInput, UserUncheckedCreateWithoutStoreAssignmentsInput>
  }

  export type StoreCreateWithoutUserAssignmentsInput = {
    id?: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutStoresInput
    tools?: StoreToolAssignmentCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutUserAssignmentsInput = {
    id?: string
    tenantId: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tools?: StoreToolAssignmentUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutUserAssignmentsInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutUserAssignmentsInput, StoreUncheckedCreateWithoutUserAssignmentsInput>
  }

  export type UserUpsertWithoutStoreAssignmentsInput = {
    update: XOR<UserUpdateWithoutStoreAssignmentsInput, UserUncheckedUpdateWithoutStoreAssignmentsInput>
    create: XOR<UserCreateWithoutStoreAssignmentsInput, UserUncheckedCreateWithoutStoreAssignmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStoreAssignmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStoreAssignmentsInput, UserUncheckedUpdateWithoutStoreAssignmentsInput>
  }

  export type UserUpdateWithoutStoreAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutStoreAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUpsertWithoutUserAssignmentsInput = {
    update: XOR<StoreUpdateWithoutUserAssignmentsInput, StoreUncheckedUpdateWithoutUserAssignmentsInput>
    create: XOR<StoreCreateWithoutUserAssignmentsInput, StoreUncheckedCreateWithoutUserAssignmentsInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutUserAssignmentsInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutUserAssignmentsInput, StoreUncheckedUpdateWithoutUserAssignmentsInput>
  }

  export type StoreUpdateWithoutUserAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutStoresNestedInput
    tools?: StoreToolAssignmentUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutUserAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tools?: StoreToolAssignmentUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type TenantCreateWithoutSubscriptionInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    stores?: StoreCreateNestedManyWithoutTenantInput
    consents?: DataProcessingConsentCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    stores?: StoreUncheckedCreateNestedManyWithoutTenantInput
    consents?: DataProcessingConsentUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSubscriptionInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
  }

  export type TenantUpsertWithoutSubscriptionInput = {
    update: XOR<TenantUpdateWithoutSubscriptionInput, TenantUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<TenantCreateWithoutSubscriptionInput, TenantUncheckedCreateWithoutSubscriptionInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSubscriptionInput, TenantUncheckedUpdateWithoutSubscriptionInput>
  }

  export type TenantUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    stores?: StoreUpdateManyWithoutTenantNestedInput
    consents?: DataProcessingConsentUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    stores?: StoreUncheckedUpdateManyWithoutTenantNestedInput
    consents?: DataProcessingConsentUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutConsentsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    stores?: StoreCreateNestedManyWithoutTenantInput
    subscription?: SubscriptionCreateNestedOneWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutConsentsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
    maxUsers?: number
    logoUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    stores?: StoreUncheckedCreateNestedManyWithoutTenantInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutConsentsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutConsentsInput, TenantUncheckedCreateWithoutConsentsInput>
  }

  export type TenantUpsertWithoutConsentsInput = {
    update: XOR<TenantUpdateWithoutConsentsInput, TenantUncheckedUpdateWithoutConsentsInput>
    create: XOR<TenantCreateWithoutConsentsInput, TenantUncheckedCreateWithoutConsentsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutConsentsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutConsentsInput, TenantUncheckedUpdateWithoutConsentsInput>
  }

  export type TenantUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    stores?: StoreUpdateManyWithoutTenantNestedInput
    subscription?: SubscriptionUpdateOneWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    stores?: StoreUncheckedUpdateManyWithoutTenantNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutTenantNestedInput
  }

  export type UserStoreAssignmentCreateManyUserInput = {
    id?: string
    storeId: string
    assignedAt?: Date | string
  }

  export type UserStoreAssignmentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutUserAssignmentsNestedInput
  }

  export type UserStoreAssignmentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoreAssignmentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyTenantInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreCreateManyTenantInput = {
    id?: string
    name: string
    city?: string | null
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataProcessingConsentCreateManyTenantInput = {
    id?: string
    consentType: string
    grantedAt?: Date | string
    grantedBy: string
    revokedAt?: Date | string | null
    revokedBy?: string | null
    version: string
    document?: string | null
  }

  export type UserUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeAssignments?: UserStoreAssignmentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeAssignments?: UserStoreAssignmentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tools?: StoreToolAssignmentUpdateManyWithoutStoreNestedInput
    userAssignments?: UserStoreAssignmentUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tools?: StoreToolAssignmentUncheckedUpdateManyWithoutStoreNestedInput
    userAssignments?: UserStoreAssignmentUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataProcessingConsentUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    document?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataProcessingConsentUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    document?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataProcessingConsentUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    version?: StringFieldUpdateOperationsInput | string
    document?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StoreToolAssignmentCreateManyStoreInput = {
    id?: string
    toolId: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
  }

  export type UserStoreAssignmentCreateManyStoreInput = {
    id?: string
    userId: string
    assignedAt?: Date | string
  }

  export type StoreToolAssignmentUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: ToolDefinitionUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type StoreToolAssignmentUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    toolId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StoreToolAssignmentUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    toolId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserStoreAssignmentUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStoreAssignmentsNestedInput
  }

  export type UserStoreAssignmentUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoreAssignmentUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreToolAssignmentCreateManyToolInput = {
    id?: string
    storeId: string
    isActive?: boolean
    assignedAt?: Date | string
    config?: string | null
  }

  export type StoreToolAssignmentUpdateWithoutToolInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
    store?: StoreUpdateOneRequiredWithoutToolsNestedInput
  }

  export type StoreToolAssignmentUncheckedUpdateWithoutToolInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StoreToolAssignmentUncheckedUpdateManyWithoutToolInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    config?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}