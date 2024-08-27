/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(connect)` | `/(connect)/` | `/(connect)/Connect` | `/(connect)/userGuideHeadset` | `/(connect)/userGuideServer` | `/(home)` | `/(home)/` | `/(home)/cognitiveTraining` | `/(home)/index.d` | `/(home)/introToLD` | `/(home)/introToSystem` | `/(home)/lucidDream` | `/(home)/nap` | `/(home)/overnight` | `/(home)/playVR` | `/(home)/stayAwake` | `/(home)/uninterruptedSleep` | `/(home)/videoGuideHeadset` | `/(journal)` | `/(journal)/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/(connect)` | `/(tabs)/(connect)/` | `/(tabs)/(connect)/Connect` | `/(tabs)/(connect)/userGuideHeadset` | `/(tabs)/(connect)/userGuideServer` | `/(tabs)/(home)` | `/(tabs)/(home)/` | `/(tabs)/(home)/cognitiveTraining` | `/(tabs)/(home)/index.d` | `/(tabs)/(home)/introToLD` | `/(tabs)/(home)/introToSystem` | `/(tabs)/(home)/lucidDream` | `/(tabs)/(home)/nap` | `/(tabs)/(home)/overnight` | `/(tabs)/(home)/playVR` | `/(tabs)/(home)/stayAwake` | `/(tabs)/(home)/uninterruptedSleep` | `/(tabs)/(home)/videoGuideHeadset` | `/(tabs)/(journal)` | `/(tabs)/(journal)/` | `/(tabs)/Connect` | `/(tabs)/cognitiveTraining` | `/(tabs)/index.d` | `/(tabs)/introToLD` | `/(tabs)/introToSystem` | `/(tabs)/lucidDream` | `/(tabs)/nap` | `/(tabs)/overnight` | `/(tabs)/playVR` | `/(tabs)/stayAwake` | `/(tabs)/uninterruptedSleep` | `/(tabs)/userGuideHeadset` | `/(tabs)/userGuideServer` | `/(tabs)/videoGuideHeadset` | `/Connect` | `/_sitemap` | `/cognitiveTraining` | `/index.d` | `/introToLD` | `/introToSystem` | `/lucidDream` | `/modal` | `/nap` | `/overnight` | `/playVR` | `/stayAwake` | `/uninterruptedSleep` | `/userGuideHeadset` | `/userGuideServer` | `/videoGuideHeadset`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
