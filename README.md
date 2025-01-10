# updater
Простой аппарат для автообновления ваших любимых библиотек !

<p align="center">
    <a href="https://github.com/FOCKUSTY/updater/blob/main/LICENSE">
        <img alt="FOCKUSTY updater" src="https://img.shields.io/github/license/fockusty/updater?style=flat-square">
    </a>
    <a href="https://github.com/FOCKUSTY/updater">
        <img alt="FOCKUSTY updater" src="https://img.shields.io/github/languages/top/fockusty/updater?style=flat-square">
    </a>
    <a href="https://github.com/FOCKUSTY/updater">
        <img alt="FOCKUSTY updater" src="https://img.shields.io/github/stars/fockusty/updater?style=flat-square">
    </a>
</p>

<p align="center">
    <a href="https://github.com/FOCKUSTY/updater">
        <img alt="FOCKUSTY updater" src="https://img.shields.io/badge/fockusty-updater-purple?style=flat-square">
    </a>
    <a href="https://img.shields.io/github/issues/fockusty/updater">
        <img alt="updater version" src="https://img.shields.io/github/issues/fockusty/updater?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/fock-updater">
        <img alt="updater version" src="https://img.shields.io/npm/v/fock-updater.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/fock-updater">
        <img alt="Weekly Downloads" src="https://img.shields.io/npm/dw/fock-updater?style=flat-square">
    </a>
</p>

## Скачивание
```
npm install --save-dev fock-updater@latest
```
или
```
npm install -g fock-updater@latest
```

## Инструкция
- Создание config-файла: `fockupdater --config`
- Запуск программы: `fockupdater` или `fockupdater --libs "a,b,c"`

## config-файл
```json
{
    "node_dir": "./node_modules",
    
    "libs": [
        "f-formatter"
    ]updater
}
```

### Информация о файле
- Формат файла: `json`
- `node_dir` - Путь от вашей root-папки до папки node_modules.
- `libs` - Названия библиотек, которые Вы хотите обновить.

### Вопросы
- Что если будет несоответствия типов? - Ошибка и остановка программы.
- Что если библиотеки не существует? - Ошибка и остановка программы.
- Что если библиотека не будет установлена? - Мы любезно обновим это в Вашем `package.json`!

## Другие вопросы
- Что если моей проблемы тут нет? - Создайте [обсуждение](https://github.com/FOCKUSTY/updater/issues/new/choose), Вам обязательно помогут!
- Что если мне нужно связаться с Вами? - Присоеднияйтесь к нам в [Discord](https://discord.gg/5MJrRjzPec)!

<p align="center">
    <a href="https://github.com/FOCKUSTY/updater">
        <img alt="The Void" src="../assets/tvc.png">
    </a>
</p>