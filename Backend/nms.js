const NodeMediaServer = require('node-media-server');

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
    }
  };

var nms = new NodeMediaServer(config)


function onStreamBegin(id,streamPath, args){
    console.log("HELLO " + streamPath);
};

function onStreamEnd(id, streamPath, args){

};




module.exports = {

    start : function () {
        nms.run();    
        
          // This is called on stream publish
          //nms.on('postPublish', (id, StreamPath, args) => {
          //  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
          //});

          nms.on('postPublish',onStreamBegin);
          nms.on('donePublish',onStreamEnd)
          //This is called on stream end
          nms.on('donePublish', (id, StreamPath, args) => {
            console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
          });
    },

    stop : function(){
        nms.stop();
    }



}