ideServices.service('TrackService', ['ProjectService', 'Type', function (ProjectService, Type) {
    function Track(name,index,src,loop){
        this.name = name||'新声音'
        this.index = index || 0
        this.src = src||''
        this.loop = loop || false
    }

    var tracks = []

    this.getNewTrack = function(){
        return new Track()
    }


    this.getTrackByIndex = function(idx){
        if(idx>=0 && idx < tracks.length){
            return tracks[idx]
        }else{
            return null
        }
    }

    this.updateTrackByIndex = function(idx,track){
        if(idx>=0 && idx < tracks.length){
            tracks[idx] = track
        }
    }

    this.deleteTrackByIndex = function(idx){
        if(idx>=0 && idx < tracks.length){
            tracks.splice(idx,1)
        }
    }

    this.appendTrack = function(track){
        tracks.push(track)
    }

    this.getAllTracks = function(){
        return tracks
    }

    this.setTracks = function(_tracks){
        tracks = _tracks
    }

}])