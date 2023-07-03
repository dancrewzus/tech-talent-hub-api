export interface HttpAdapter {
  get<T>(url: String): Promise<T>;
}