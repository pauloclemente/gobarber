export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>
  invalidade(key: string): Promise<void>
  recover<T>(key: string): Promise<T | null>
  invalidadePrefix(prefix: string): Promise<void>
}
