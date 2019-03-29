/* eslint-disable no-var */
const fs = require('fs');
const cmd = require('node-cmd');
const mysql = require('promise-mysql');

const Promise = require('bluebird');
const copyFile = require('fs-copy-file');

const mongo = require('./mongo_log_service');
const agent = require('./mongo_agent_service');

var utils = {
  async moveFile(src, dst) {
    copyFile(src, dst, err => {
      if (err) throw err;

      console.log('source.txt was copied to destination.txt');
    });
  },

  // addToELK(index, data) {
  //   return client.index({
  //     type: '_doc',
  //     index,
  //     body: data,
  //   });
  // },

  saveToPcap(s1) {
    let s = s1.replace('0x', '0');
    s = s.replace(':', '');
    const data = s.split(' ');
    for (let i = 1; i < data.length; i += 1) {
      let tmp = data[i];
      if (tmp.length > 2) {
        tmp = `${tmp.slice(0, 2)} ${tmp.slice(2)}`;
      }
      data[i] = tmp;
    }
    data[0] = data[0].slice(1);
    let res = '';
    for (let i = 0; i < data.length; i += 1) {
      res = `${res + data[i]} `;
    }
    return `${res}\n`;
  },

  pushPcapToELK(fileName) {
    cmd.run(`python3 src/server/pushPcap.py`);
  },

  async detection(fileName) {
    cmd.run(`sudo src/server/pcap_handle/script_run.sh ${fileName}`);
  },

  reconstructionFileFromPcap(fileName) {
    const datetime = new Date();
    const dir = `/media/ais/Data/re_file/${datetime}`;
    fs.mkdirSync(dir);
    cmd.run(`sudo foremost -i behaviour.pcap -o ${dir}`);
  },

  convertToPcap(fileName) {
    const datetime = new Date();
    const newFilename = `/media/ais/Data/pcap/${datetime}.pcap`;
    this.moveFile('behaviour.pcap', newFilename);
    const data = fs.readFileSync(fileName, 'utf8');
    const sentences = data.split('\n');
    for (let i = 0; i < sentences.length; i += 1) {
      const sentence = sentences[i];
      if (sentence.indexOf('Done') !== -1) {
        break;
      }
      if (sentence.indexOf('0x0') !== -1) {
        const res = this.saveToPcap(sentence);
        fs.appendFileSync('text2pcap.txt', res);
      }
    }
    cmd.get('text2pcap text2pcap.txt behaviour.pcap', (err, dat, stderr) => {
      try {
        fs.unlinkSync('tcpdump.txt');
        fs.unlinkSync('text2pcap.txt');
        utils.pushPcapToELK('behaviour.pcap');
        utils.detection('behaviour.pcap');
        utils.reconstructionFileFromPcap('behaviour.pcap');
      } catch {
        console.log('error type 1');
      }
    });
  },

  storeMD5(ip, data) {
    fs.appendFileSync('md5.txt', data.toString());
    let sentences = [];
    if (data.toString().indexOf('Done') !== -1) {
      const content = fs.readFileSync('md5.txt', 'utf8');
      sentences = content.split('\n');
    } else {
      return data;
    }
    let pos = 0;
    // eslint-disable-next-line no-shadow
    for (let i = 0; i < sentences.length; i += 1) {
      if (sentences[i].indexOf('done_ps') !== -1) {
        pos = i + 1;
        break;
      }
      // eslint-disable-next-line no-shadow
      const tmp = sentences[i];
      if (tmp.indexOf('PID USER       VSZ STAT COMMAND') !== -1) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const dataToMongo = {
        ip: ip.substring(ip.lastIndexOf(':') + 1),
        timestamp: Date.now(),
        listOfPID: sentences[i],
      };
      mongo.push('agent-pid', dataToMongo);
    }
    for (let i = 0; i < sentences.length; i += 1) {
      if (sentences[i].indexOf('Done') !== -1) break;
      const tmp = sentences[i].split('  ');
      if (tmp.length > 2) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const md5 = tmp[0];
      const fileName = tmp[1];
      // console.log(ip);
      const dataToMongo = {
        ip: ip.substring(ip.lastIndexOf(':') + 1),
        timestamp: Date.now(),
        file: fileName,
        md5,
      };
      mongo.push('agent-pid', dataToMongo);
    }
    fs.unlinkSync('md5.txt');
    return data;
  },

  storeSyscall(ip, data) {
    let sentences = [];
    let PID = '';
    fs.appendFileSync('syscall.txt', data.toString());
    if (data.toString().indexOf('PID') !== -1) {
      const content = fs.readFileSync('syscall.txt', 'utf8');
      sentences = content.split('\n');
      for (let i = sentences.length - 1; i >= 0; i -= 1) {
        if (sentences[i].indexOf('PID') !== -1) {
          PID = sentences[i].substr(sentences[i].indexOf('PID') + 5, -1);
          break;
        }
      }
    } else {
      return data;
    }
    console.log(PID);
    for (let i = 0; i < sentences.length; i += 1) {
      if (sentences[i].indexOf('PID') !== -1) break;
      const dataToMongo = {
        ip: ip.substring(ip.lastIndexOf(':') + 1),
        timestamp: Date.now(),
        pid: parseInt(PID),
        cmdline: '',
        syscall: sentences[i],
      };
      mongo.push('agent-syscall', dataToMongo);
    }
    fs.unlinkSync('syscall.txt');
    return data;
  },

  async storePcap(data) {
    fs.appendFileSync('tcpdump.txt', data.toString());
    if (data.toString().indexOf('Done') !== -1) {
      this.convertToPcap('tcpdump.txt');
    }
    return data.toString();
  },

  storeData(ip, task, data) {
    let response = null;
    if (task === '1') {
      response = this.storeMD5(ip, data);
    } else if (task === '2') {
      response = this.storePcap(data);
    } else if (task === '3') {
      response = this.storeSyscall(ip, data);
    }
    return response;
  },

  addClient(L, c) {
    for (let i = 0; i < L.length; i += 1) {
      const tmp = L[i];
      if (tmp.ip.toString().includes(tmp.ip.toString())) {
        L.splice(i, 1);
        break;
      }
    }
    c.ip = c.ip.toString().substring(c.ip.toString().search('f:') + 2);
    L.push(c);
    return L;
  },

  getTask(L, sName) {
    for (let i = 0; i < L.length; i += 1) {
      if (L[i].address === sName) {
        return L[i].currentTask;
      }
    }
    return null;
  },

  async getListOfClients() {
    const listOfDevices = await agent.get_list_client();
    const res = [];
    for (let i = 0; i < listOfDevices.length; i += 1) {
      res.push({
        socket: '',
        address: '',
        ip: listOfDevices[i].ip,
        port: '',
        active: false,
        currentTask: '',
      });
    }
    return res;
  },
};

module.exports = utils;
