<img alt="coopersystem" src="https://raw.githubusercontent.com/cesarhfborges/pontocooper/master/resources/icon.png" width="128"/>

# CooperSystem
## Aplicativo Ponto Eletrônico

## download

<a id="raw-url" href="https://github.com/cesarhfborges/pontocooper/raw/master/apk/portal-coopersystem.apk" download>
Download Android</a>

## Requisitos
Angular e ionic instalados de forma global
```
npm install --global @angular/cli
npm install --global @ionic/cli
```
Opcionalmente pode usar o gerenciador de pacotes Yarn ao npm
```
npm install --global yarn
```

## Rodando a aplicação
Para rodar o projeto existem algumas formas de executar que tem algumas distinções

Antes de mais nada para rodar adequadamente o projeto é necessário seguir os seguintes passos.

##### Instalar as dependências
```
npm install
ionic build
npx cap sync
```
1
#### Rodando o código no navegador
```
npm start
ou
npm run start
```

#### Rodando o código no emulador ou dispositivo
Para fazer deploy no emulador ou diretamente no dispositivo, (atenção: é necessário que os drivers ADB estejam instalados e o dispositivo esteja conectado ao computador e com modo depuração ativo e permitido).
```
npm run android-run
```
Para fazer deploy e etc usando o android studio
```
npm run android-open
```

Caso queira o deploy diretamente no emulador ou em dispositivo físico com live-reload, esta opção vai subir um servidor local e apontar a webview do aplicativo para este servidor assim possibilitando um live reload. 
```
npm run android-run-live
```

Para fazer gerar o apk em modo development
```
npm run android-build
```

Para fazer gerar o apk em modo production
```
npm run android-build-production
```


## Deploy da aplicação

```
ionic capacitor build android --prod
```

## Resolvendo Problemas

Caso esteja tendo problemas no gradle build
```
npx cap update
```

Caso esteja tendo problema de build relacionado a dependências basta usar o seguinte comando.

```
npx jetify
npx cap sync android
```
