/*
 * Copyright © 2016-2022 Dell Inc. or its subsidiaries.
 * All Rights Reserved.
 */
const PROXY_CONFIG = [
  {

    // add your endpoint prefix(es) below
    context: [
      '/api'
    ],
    target:'http://localhost:8080/',
    //target: 'https://<your-space-here>-api-gateway.cfd.isus.emc.com/',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    headers: {
       'Content-Type':  'application/json',
    }
  }
];

module.exports = PROXY_CONFIG;
