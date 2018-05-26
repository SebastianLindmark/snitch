//
//  Created by Mingliang Chen on 18/3/9.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//
const Logger = require('./logger');

const NodeTransSession = require('./node_trans_session');
const context = require('./node_core_ctx');
const fs = require('fs');
const _ = require('lodash');
const mkdirp = require('mkdirp');

class NodeTransServer {
  constructor(config) {
    this.config = config;
    this.transSessions = new Map();
  }

  run() {
    try {
      mkdirp.sync(this.config.http.mediaroot);
      fs.accessSync(this.config.http.mediaroot, fs.constants.W_OK);
    } catch (error) {
      Logger.error(`Node Media Trans Server startup failed. MediaRoot:${this.config.http.mediaroot} cannot be written.`);
      return;
    }
  
    try {
      fs.accessSync(this.config.trans.ffmpeg, fs.constants.X_OK);
    }catch(error) {
      Logger.error(`Node Media Trans Server startup failed. ffmpeg:${this.config.trans.ffmpeg} cannot be executed.`);
      return;
    }

    let i = this.config.trans.tasks.length;
    let apps = '';
    while (i--) {
      apps += this.config.trans.tasks[i].app;
      apps += ' ';
    }
    context.nodeEvent.on('postPublish', this.onPostPublish.bind(this));
    context.nodeEvent.on('donePublish', this.onDonePublish.bind(this));
    Logger.log(`Node Media Trans Server started for apps: [ ${apps}] , MediaRoot: ${this.config.http.mediaroot}`);
  }

  onPostPublish(id, streamPath, args) {
    console.log("On post Publish")
    let regRes = /\/(.*)\/(.*)/gi.exec(streamPath);
    let [app, stream] = _.slice(regRes, 1);
    let i = this.config.trans.tasks.length;
    console.log(i)
    while (i--) {
      let conf = this.config.trans.tasks[i];
      conf.port = this.config.rtmp.port;
      conf.ffmpeg = this.config.trans.ffmpeg;
      conf.mediaroot = this.config.http.mediaroot;
      conf.streamPath = streamPath;
      conf.stream = stream;
      conf.args = args;
      console.log(conf.app)
      console.log(app)
      if (true || app === conf.app) {
        let session = new NodeTransSession(conf);
        this.transSessions.set(id, session);
        session.on('end', () => {
          this.transSessions.delete(id);
        });
        console.log("About to run the TransSession")
        session.run();
      }
    }
  }

  onDonePublish(id, streamPath, args) {
    let session = this.transSessions.get(id);
    if (session) {
      session.end();
    }
  }
}

module.exports = NodeTransServer;
