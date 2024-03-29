import { getStreamerPublicKey } from "./config";

export function getSchema() {
  return `
collection Streamer {
  id: string;

  @read
  @delegate
  publicKey: PublicKey;

  constructor() {
    if (!ctx.publicKey) {
      throw error('You must sign the tx to create a stream');
    }

    if (ctx.publicKey.toHex() != "${getStreamerPublicKey()}") {
      throw error("You're not the resident DJ");
    }

    this.id = ctx.publicKey.toHex();
    this.publicKey = ctx.publicKey;
  }

  @call(publicKey)
  del() {
    selfdestruct();
  }
}

@public
collection Song {
  id: string;
  title: string;
  artist: string;
  filename: string;
  duration: number;
  owner: Streamer;

  constructor(cid: string, title: string, artist: string, filename: string, duration: number, owner: Streamer) {
    if (!ctx.publicKey) {
      throw error('You must sign the tx to create a song');
    }

    if (ctx.publicKey != owner.publicKey) {
      throw error('You must be the owner of the song');
    }
    
    this.id = cid;
    this.title = title;
    this.artist = artist;
    this.filename = filename;
    this.duration = duration;
    this.owner = owner;
  }
}

@public
collection Playlist {
  id: string;
  songs: Song[];

  @delegate
  owner: Streamer;

  constructor(id: string, songs: Song[], owner: Streamer) {
    if (!ctx.publicKey) {
      throw error('You must sign the tx to create a playlist');
    }

    if (ctx.publicKey != owner.publicKey) {
      throw error('You must be the owner of the playlist');
    }
    
    this.id = id;
    this.songs = songs;
    this.owner = owner;
  }
  
  @call(owner)
  setSongs(songs: Song[]) {
    this.songs = songs;
  }
}

@read
collection ActivePlaylist {
  id: string;
  playing: boolean;
  startTimestamp: number;
  playlist?: Playlist;
  
  @delegate
  owner: Streamer;

  constructor(owner: Streamer) {
    if (!ctx.publicKey) {
      throw error('You must sign the tx to create an active playlist');
    }

    if (ctx.publicKey != owner.publicKey) {
      throw error('You must be the owner of the active playlist');
    }
    
    this.id = '1';
    this.playing = false;
    this.startTimestamp = 0;
    this.owner = owner;
  }

  @call(owner)
  play(newActivePlaylist: Playlist, startTimestamp: number) {
    this.playlist = newActivePlaylist;
    this.startTimestamp = startTimestamp;
    this.playing = true;
  }

  @call(owner)
  stop() {
    this.playing = false;
  }
}
`;
}
