import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * ApiService Class
 */
class ApiService {
  private api: AxiosInstance;

  /**
   * constructor function
   * @param {String} baseUrl API base URL
   */
  constructor(private baseUrl: string) {
    this.api = axios.create({
      baseURL: baseUrl,
      timeout: 40000,
    });
  }

  /**
   * fetch data from endpoint
   * @param {String} endpoint url endpoint to access
   */
  async getData(endpoint: string): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get(endpoint);
    return response.data;
  }
}

export default ApiService;
