declare const require: any;
export const environment = {
  production: true,
    appVersion: require('../../package.json').version,
  apiUrl: 'https://api.portal.coopersystem.com.br/api/v1'
};
