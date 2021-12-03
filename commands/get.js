const KeyManager = require('../lib/KeyManager');
const FileManager = require('../lib/FileManager');
const CryptocompareAPI = require('../lib/CryptocompareAPI');
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');
const { isDateValid } = require('../utils/isDateValid');
const { dateToEpochTime } = require('../utils/dateToEpochTime');

let tokenInfo = {};
let tokenList = [];

const get = {
  async value(cmd) {
    if(cmd.args.length == 0){
      const parentCmdLen = cmd.parent.args.length;
      try {
        keyManager = new KeyManager();
        const key = keyManager.getKey();
  
        fileManager = new FileManager();
        const file = fileManager.getFile();
  
        const api = new CryptocompareAPI(key);

        if(parentCmdLen == 1){
          fs.createReadStream(file)
          .pipe(csv())
          .on('data', data => {
            if (!tokenList.includes(data.token)) {
              tokenList.push(data.token);
            }
            if (!tokenInfo[data.token]) {
              tokenInfo[data.token] =
                data.transaction_type === 'DEPOSIT'
                  ? Number(data.amount)
                  : Number(-data.amount);
            } else {
              tokenInfo[data.token] =
                data.transaction_type === 'DEPOSIT'
                  ? Number(tokenInfo[data.token]) + Number(data.amount)
                  : Number(tokenInfo[data.token]) - Number(data.amount);
            }
          })
          .on('end', async () => {
            if (Object.keys(tokenInfo).length === 0) {
                console.error('No transactions data in the the file');
                return;
            } else {
              let res = await api.multiCryptoToUSD(tokenList.join(","));
              for (let [token, amount] of Object.entries(tokenInfo)) {
                tokenInfo[token] = amount * (res[token].USD);
              }
              console.log('Token portfolio in USD');
              console.log(tokenInfo);
            }            
          })
          .on('error', err => console.log(err));         
        }
        if(parentCmdLen == 5){
          if(isDateValid(cmd.date)){
            let endTimestamp = dateToEpochTime(cmd.date);
            fs.createReadStream(file)
            .pipe(csv())
            .on('data', data => {
              if (
                data.token.toUpperCase() === cmd.token.toUpperCase() &&
                data.timestamp <= endTimestamp
              ){
                if (!tokenInfo[data.token]) {
                  tokenInfo[data.token] =
                    data.transaction_type === 'DEPOSIT'
                      ? Number(data.amount)
                      : Number(-data.amount);
                } else {
                  tokenInfo[data.token] =
                    data.transaction_type === 'DEPOSIT'
                      ? Number(tokenInfo[data.token]) + Number(data.amount)
                      : Number(tokenInfo[data.token]) - Number(data.amount);
                }
              }
            })
            .on('end', async () => {
              if (Object.keys(tokenInfo).length === 0) {
                  console.error('No transactions data in the the file');
                  return;
              } else {
                for (let [token, amount] of Object.entries(tokenInfo)) {
                  tokenInfo[token] = amount * (await api.cryptoToUSDate(token, endTimestamp));
                }
                console.log('Token portfolio in USD, Token: '+ cmd.token + ', Date: '+ cmd.date);
                console.log(tokenInfo);
              }            
            })
            .on('error', err => console.log(err));
          } else{
            console.error("Date is not valid!".red);
          }
        } 
        if(parentCmdLen == 3){
          if(cmd.parent.args[1]==='--token'){
            fs.createReadStream(file)
            .pipe(csv())
            .on('data', data => {
              if (
                data.token.toUpperCase() === cmd.token.toUpperCase()){
                if (!tokenInfo[data.token]) {
                  tokenInfo[data.token] =
                    data.transaction_type === 'DEPOSIT'
                      ? Number(data.amount)
                      : Number(-data.amount);
                } else {
                  tokenInfo[data.token] =
                    data.transaction_type === 'DEPOSIT'
                      ? Number(tokenInfo[data.token]) + Number(data.amount)
                      : Number(tokenInfo[data.token]) - Number(data.amount);
                }
              }
            })
            .on('end', async () => {
              if (Object.keys(tokenInfo).length === 0) {
                  console.error('No transactions data in the the file');
                  return;
              } else {
                for (let [token, amount] of Object.entries(tokenInfo)) {
                  tokenInfo[token] = amount * (await api.cryptoToUSD(token));
                }
                console.log('Token portfolio in USD, Token: '+ cmd.token + ', Date: '+ cmd.date);
                console.log(tokenInfo);
              }            
            })
            .on('error', err => console.log(err));
          }
          if(cmd.parent.args[1]==='--date'){
            if(isDateValid(cmd.date)){
              let endTimestamp = dateToEpochTime(cmd.date);
              fs.createReadStream(file)
              .pipe(csv())
              .on('data', data => {
                if (data.timestamp <= endTimestamp){
                  if (!tokenInfo[data.token]) {
                    tokenInfo[data.token] =
                      data.transaction_type === 'DEPOSIT'
                        ? Number(data.amount)
                        : Number(-data.amount);
                  } else {
                    tokenInfo[data.token] =
                      data.transaction_type === 'DEPOSIT'
                        ? Number(tokenInfo[data.token]) + Number(data.amount)
                        : Number(tokenInfo[data.token]) - Number(data.amount);
                  }
                }
              })
              .on('end', async () => {
                if (Object.keys(tokenInfo).length === 0) {
                    console.error('No transactions data in the the file');
                    return;
                } else {
                  for (let [token, amount] of Object.entries(tokenInfo)) {
                    tokenInfo[token] = amount * (await api.cryptoToUSDate(token, endTimestamp));
                  }
                  console.log('Token portfolio in USD, on Date: '+ cmd.date);
                  console.log(tokenInfo);
                }            
              })
              .on('error', err => console.log(err));
            } else{
              console.error("Date is not valid!".red);
            }
          }
        }
      }
      catch (err) {
        console.error(err.message.red);
      }
    } else {
      console.error("Please, check command help!".red);
    }





/*
      fs.createReadStream(file)
      .pipe(csv())
      .on('data', data => {
        console.log(data);
      })
      .on('end', async () => {
      }
      )
      .on('error', err => console.log(err));

      const priceOutputData = await api.cryptoToUSD(cmd.token, cmd.date);

      console.log(priceOutputData);
      */

  }
};

module.exports = get;