import axios, { AxiosInstance } from 'axios'

/**
 * ApiService Class
 */
class ApiService {
  private api: AxiosInstance

  /**
   * constructor function
   * @param {String} baseUrl API base URL
   */
  constructor(private baseUrl: string, headers?: Record<string, unknown>) {
    this.api = axios.create({
      baseURL: baseUrl,
      timeout: 40000,
      headers,
    })
  }

  /**
   * fetch data from endpoint
   * @param {String} endpoint url endpoint to access
   */
  async getData(endpoint: string): Promise<any> {
    return this.api.get(endpoint).then(({ data }) => data)
  }

  async post(endpoint: string, data: unknown): Promise<any> {
    return this.api.post(endpoint, data).then(({ data }) => data)
  }
}

export default ApiService
