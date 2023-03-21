/**
 @description -  Rules for cross origin resource sharing
*/

export default {
  /** *************************************************************************
   *                                                                          *
   * Which methods should be allowed for CORS requests? This is only used in  *
   * response to preflight requests                                           *
   *                                                                          *
   ************************************************************************** */

  methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
  /** *************************************************************************
   *                                                                          *
   * Which headers should be allowed for CORS requests?                       *
   *                                                                          *
   ************************************************************************** */
  headers: '*', // Allows all headers
  /** *************************************************************************
   *                                                                          *
   * Which domains which are allowed CORS access? This can be a               *
   * comma-delimited list of hosts (beginning with http:// or https://) or    *
   * "*" to allow all domains CORS access.                                    *
   *                                                                          *
   ************************************************************************** */

  origins: '*', // Allows all origins
}
