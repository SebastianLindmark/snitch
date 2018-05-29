const NodeMediaServer = require('./node-media-server');
var models = require("./db_helpers/models");
var stream = require("./db_helpers/stream_sequelize");
var VOD = require("./db_helpers/vod_sequelize");

const config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    http: {
      port: 8080,
      mediaroot: './media',
      allow_origin: '*'
    },

    trans: {
      ffmpeg: 'C:/ffmpeg/bin/ffmpeg.exe',
      tasks: [
        {
          /*app: 'live',
          ac: 'aac',
          mp4: true,
          mp4Flags: '[movflags=faststart]'*/

          app: 'live',
          ac: 'aac',
          hls: true,
          hlsFlags: '[hls_time=10:hls_list_size=0]',
          dash: false,
          dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
        }
      ]
    }
  };

var nms = new NodeMediaServer(config)
function onStreamBegin(id,streamPath, args){
  var key = streamPath.split('/')[2]
  models.StreamKey.find({where : {key : key}}).then(function(streamkey){
    if(streamkey !== null){
      return streamkey.getUser()  
    }else{
      throw ["StreamKey does not exist!"]
    }    
  }).then(function(user){
    return stream.set_stream_online(user)
  }).then(function(res){
    //We need to decrement viewers by one because the node-media-server "adds" a viewer automatically to the stream outside of our control. 
    return onViewerLeave(id,streamPath,args) 
  }).catch(function(err){
    console.log(err)
  })

  
};

function onStreamEnd(id, streamPath, args){
  streamPath = streamPath.split('/')[2]
  models.StreamKey.find({where : {key : streamPath}}).then(function(streamkey){
    return streamkey.getUser()
  }).then(function(user){
    return stream.set_stream_offline(user)
  }).catch(function(err){
    console.log(err)
  })
};


function onViewerEnter(id, streamPath, args){
  streamPath = streamPath.split('/')[2]
  models.StreamKey.find({where : {key : streamPath}}).then(function(streamkey){
    return streamkey.getUser()
  }).then(function(user){
    return stream.add_viewer_to_stream(user)
  }).catch(function(err){
    console.log(err)
  })
};

function onViewerLeave(id, streamPath, args){
  streamPath = streamPath.split('/')[2]
  models.StreamKey.find({where : {key : streamPath}
  }).then(function(streamkey){
    return streamkey.getUser()
  }).then(function(user){
    return stream.remove_viewer_from_stream(user)
  }).catch(function(err){
    console.log(err)
  })
};


module.exports = {

    start : function () {
          
        nms.on('postPublish',onStreamBegin);
        //nms.on('donePublish',onStreamEnd);
        nms.on('donePublish', onStreamEnd); //There is a bug in nms where the StreamPath is set to empty before the callback is invoked.
        //Fix this by navigating to node_rtmp_session.js, within the function onDeleteStream() create a temp variable to store the streamId.

        nms.on('postPlay', onViewerEnter);
        nms.on('donePlay', onViewerLeave);
        nms.on('fileSaved', function(streamKey,rootPath){
          streamKey = streamKey.split('/')[2]
          VOD.save_vod(streamKey,rootPath)
        })

        nms.run();  

    },

    stop : function(){
        nms.stop();
    }



}