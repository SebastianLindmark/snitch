const NodeMediaServer = require('./node-media-server');
var models = require("./db_helpers/models");
var stream = require("./db_helpers/stream_sequelize");
var VOD = require("./db_helpers/vod_sequelize");
const path = require('path')

const { spawn } = require('child_process');

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
  console.log("STREAM PATH " + streamPath)
  var key = streamPath.split('/')[2]
  models.StreamKey.find({where : {key : key}}).then(function(streamkey){
    if(streamkey !== null){
      return streamkey.getUser()  
    }else{
      throw ["StreamKey does not exist!"]
    }    
  }).then(function(user){
    return stream.set_stream_online(user)
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

function onFileSaved(streamKey, rootPath, file_name){

  var filePath = rootPath + "/" + file_name
  var fileInUrl =Globals.BASE_URL + filePath;
  
  let paths = __dirname + '/../' + 'Backend/media/.' + rootPath + "/video.gif"
  paths = path.normalize(paths)

  let argv = ['-t','100' ,'-i' ,fileInUrl , '-r','2', '-vf', 'scale=640:-1', paths]

  streamKey = streamKey.split('/')[2]
  VOD.save_vod(streamKey,filePath, rootPath)

  this.ffmpeg_exec = spawn(config.trans.ffmpeg, argv);
  this.ffmpeg_exec.on('error', (e) => {
    console.log("errror")
    console.log(e)
    
  });

}


function onVideoFileCreated(streamKey, root_path){
    streamKey = streamKey.split('/')[2]
    models.StreamKey.find({where : {key : streamKey}}).then(function(streamkey){
      return streamkey.getUser()
    }).then(function(user){
      return stream.update_stream_url(user,root_path)
    }).then(function(result){
    }).catch(function(err){
      console.log("Received error " + err)
    })
    
    
}


module.exports = {

    start : function () {
          
        nms.on('postPublish',onStreamBegin);
        //nms.on('donePublish',onStreamEnd);
        nms.on('donePublish', onStreamEnd);

        nms.on('postPlay', onViewerEnter);
        nms.on('donePlay', onViewerLeave);
        nms.on('fileSaved', onFileSaved);
        nms.on('videoFileCreated', onVideoFileCreated);

        nms.run();  

    },

    stop : function(){
        nms.stop();
    }



}