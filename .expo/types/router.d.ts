/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/Notices` | `/(tabs)/calendar` | `/(tabs)/message-teacher` | `/(tabs)/view-homework` | `/Notices` | `/_sitemap` | `/calendar` | `/message-teacher` | `/view-homework`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
