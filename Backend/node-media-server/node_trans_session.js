//
//  Created by Mingliang Chen on 18/3/9.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//
const Logger = require('./logger');
const context = require('./node_core_ctx');

const EventEmitter = require('events');
const { spawn } = require('child_process');
const dateFormat = require('dateformat');
const mkdirp = require('mkdirp');
const fs = require('fs');

const path = require('path')

var random = require("random-key");

class NodeTransSession extends EventEmitter {
  constructor(conf) {
    super();
    this.conf = conf;
  }

  run() {
    let vc = 'copy';
    let ac = this.conf.args.ac == 10 ? 'copy' : this.conf.ac ? this.conf.ac : 'aac';
    let videoID = random.generate(10); //TODO check if this ID is used
    let inPath = 'rtmp://localhost:' + this.conf.port + this.conf.streamPath;
    let ouPath = `${this.conf.mediaroot}/${this.conf.app}/${this.conf.stream}/${videoID}`;
    let mapStr = '';
    if (this.conf.mp4) {
      this.conf.mp4Flags = this.conf.mp4Flags ? this.conf.mp4Flags : '';
      let now = new Date();
      let mp4FileName = dateFormat('yyyy-mm-dd-HH-MM') + '.mp4';
      let mapMp4 = `${this.conf.mp4Flags}${ouPath}/${mp4FileName}|`;
      mapStr += mapMp4;
      Logger.log('[Transmuxing MP4] ' + this.conf.streamPath + ' to ' + ouPath + '/' + mp4FileName);
    }
    if (this.conf.hls) {
      this.conf.hlsFlags = this.conf.hlsFlags ? this.conf.hlsFlags : '';
      let hlsFileName = 'index.m3u8';
      let mapHls = `${this.conf.hlsFlags}${ouPath}/${hlsFileName}|`;
      mapStr += mapHls;
      Logger.log('[Transmuxing HLS] ' + this.conf.streamPath + ' to ' + ouPath + '/' + hlsFileName);
    }
    if (this.conf.dash) {
      this.conf.dashFlags = this.conf.dashFlags ? this.conf.dashFlags : '';
      let dashFileName = 'index.mpd';
      let mapDash = `${this.conf.dashFlags}${ouPath}/${dashFileName}`;
      mapStr += mapDash;
      Logger.log('[Transmuxing DASH] ' + this.conf.streamPath + ' to ' + ouPath + '/' + dashFileName);
    }
    mkdirp.sync(ouPath);
    let argv = ['-y', '-fflags', 'nobuffer', '-analyzeduration', '1000000', '-i', inPath, '-c:v', vc, '-c:a', ac, '-f', 'tee', '-map', '0:a?', '-map', '0:v?' ,'-y','-an',mapStr];
  
    var pathToModule = require.resolve('module');
  
    let paths = __dirname + '/.' + ouPath
    paths = path.normalize(paths);

    let gifArgv = ['-i', inPath, '-vf', 'fps=fps=1/10','-update','1', paths + "\\image.png"]
    
    context.nodeEvent.emit('videoFileCreated',this.conf.streamPath,ouPath.substring(7));

    this.ffmpeg_exec2 = spawn(this.conf.ffmpeg, gifArgv);
    this.ffmpeg_exec2.on('error', (e) => {
      Logger.debug(e);
    });

    this.ffmpeg_exec2.stdout.on('data', (data) => {
      Logger.debug(`ERRORRRR：${data}`);
    });

    this.ffmpeg_exec2.stderr.on('data', (data) => {
      Logger.debug(`ERREEROROR：${data}`);
    });

    this.ffmpeg_exec2.on('close', (code) => {
      Logger.log('[Transmuxing end] ' + this.conf.streamPath);
    })



    // Logger.debug(argv.toString());
    this.ffmpeg_exec = spawn(this.conf.ffmpeg, argv);
    this.ffmpeg_exec.on('error', (e) => {
      Logger.debug(e);
    });

    this.ffmpeg_exec.stdout.on('data', (data) => {
      Logger.debug(`ERRORRRR：${data}`);
    });

    this.ffmpeg_exec.stderr.on('data', (data) => {
      Logger.debug(`ERREEROROR：${data}`);
    });

    this.ffmpeg_exec.on('close', (code) => {
      Logger.log('[Transmuxing end] ' + this.conf.streamPath);

      //Substring to remove ./media path.
      context.nodeEvent.emit('fileSaved',this.conf.streamPath, ouPath.substring(7), "index.m3u8");
      this.emit('end');
      fs.readdir(ouPath, function (err, files) {
        if (!err) {
          files.forEach((filename) => {
            if (filename.endsWith('.ts')
              || filename.endsWith('.m3u8')
              || filename.endsWith('.mpd')
              || filename.endsWith('.m4s')) {
              //fs.unlinkSync(ouPath + '/' + filename);
            }
          })
        }
      });
    });
  }

  end() {
    // this.ffmpeg_exec.kill('SIGINT');
    this.ffmpeg_exec.stdin.write('q');
  }
}

module.exports = NodeTransSession;