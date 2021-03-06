function setupVideoWithUrls(pAudioUrl, pVideoUrl) {
  var videoTag = document.getElementById("my-video");
  var myMediaSource = new MediaSource();
  var url = URL.createObjectURL(myMediaSource);
  videoTag.src = url;

  myMediaSource.addEventListener('sourceopen', function(e) {

    var videoSourceBuffer = myMediaSource
        .addSourceBuffer('video/mp4; codecs="avc1.4d4028"');
    fetch(pVideoUrl).then(function(response) {
      return response.arrayBuffer();
    }).then(function(videoData) {
      
      videoSourceBuffer.appendBuffer(videoData);
    });

    fetch(pAudioUrl).then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.arrayBuffer();
    }).then(function(audioData) {
      var audioSourceBuffer = myMediaSource
        .addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');
      audioSourceBuffer.appendBuffer(audioData);
    }).catch(function(err) {
      console.log(err);
    });
  }, false);
}

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

function fetchRedditData(fromUrl, callback) {
  fetch(fromUrl + '.json').then(function(response) {
    try {
      return response.json()
    } catch (err) {
      console.log(err);
    }
  }).then(function(json) {
    try {
      var videoUrl = json[0].data.children[0].data.media.reddit_video.fallback_url;
      videoUrl = videoUrl.substring(0, videoUrl.indexOf("?"));
      let audioUrl = videoUrl.substring(0, videoUrl.lastIndexOf("/")) + "/audio";
      callback(videoUrl, audioUrl);
    } catch (err) {
      console.log(err)
    }
  });
}

function start() {
  var url_string = window.location.href
  console.log(url_string)
  var url = new URL(url_string);
  var c = url.searchParams.get("v");

  fetchRedditData(c, function(video, audio) {
    console.log("action go")
    setupVideoWithUrls(proxyUrl + audio, proxyUrl + video);
  });
}

