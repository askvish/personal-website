import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-music-player',
  imports: [],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css',
})
export default class MusicPlayerComponent implements AfterViewInit {
  // Select all the elements in the HTML page
  // and assign them to a variable
  now_playing!: Element | null;
  track_art!: Element | null;
  track_name!: Element | null;
  track_artist!: Element | null;

  playpause_btn!: Element | null;
  next_btn!: Element | null;
  prev_btn!: Element | null;

  seek_slider!: Element | null;
  volume_slider!: Element | null;
  curr_time!: Element | null;
  total_duration!: Element | null;

  // Specify globally used values
  track_index = 0;
  isPlaying = false;
  updateTimer: any;

  // Create the audio element for the player
  curr_track = document.createElement('audio');

  constructor() {
    // Load the first track in the tracklist
    this.loadTrack(this.track_index);
  }
  ngAfterViewInit(): void {
    // Select all the elements in the HTML page
    // and assign them to a variable
    this.now_playing = document.querySelector('.now-playing');
    this.track_art = document.querySelector('.track-art');
    this.track_name = document.querySelector('.track-name');
    this.track_artist = document.querySelector('.track-artist');

    this.playpause_btn = document.querySelector('.playpause-track');
    this.next_btn = document.querySelector('.next-track');
    this.prev_btn = document.querySelector('.prev-track');

    this.seek_slider = document.querySelector('.seek_slider');
    this.volume_slider = document.querySelector('.volume_slider');
    this.curr_time = document.querySelector('.current-time');
    this.total_duration = document.querySelector('.total-duration');
  }

  // Define the list of tracks that have to be played
  track_list = [
    {
      name: 'Dilbar Dilbar',
      artist: 'Nora Fatehi',
      image: 'public/assets/image/Dilbar Dilbar.jpg',
      path: 'public/assets/songs/Dilbar Dilbar.mp3',
    },
    {
      name: 'Dil Galti Kar Baitha Hai',
      artist: 'Mony Roy',
      image: 'public/assets/image/Dil Galti Kar Baitha Hai.jpg',
      path: 'public/assets/songs/Dil Galti Kar Baitha Hai.mp3',
    },
    {
      name: 'Gali gali',
      artist: 'Mony Roy',
      image: 'public/assets/image/Gali gali.jpg',
      path: 'public/assets/songs/Gali gali.mp3',
    },
    {
      name: 'Laila Main Laila',
      artist: 'Sunny Leaone',
      image: 'public/assets/image/Laila Main Laila.jpg',
      path: 'public/assets/songs/Laila Main Laila.mp3',
    },
  ];

  loadTrack(track_index: number) {
    // Clear the previous seek timer
    clearInterval(this.updateTimer);
    this.resetValues();

    // Load a new track
    this.curr_track.src = this.track_list[track_index].path;
    this.curr_track.load();

    // Update details of the track
    if (this.track_art) {
      (this.track_art as HTMLElement).style.backgroundImage =
        'url(' + this.track_list[track_index].image + ')';
    }
    if (this.track_name) {
      this.track_name.textContent = this.track_list[track_index].name;
    }
    if (this.track_artist) {
      this.track_artist.textContent = this.track_list[track_index].artist;
    }
    if (this.now_playing) {
      this.now_playing.textContent =
        'PLAYING ' + (track_index + 1) + ' OF ' + this.track_list.length;
    }

    // Set an interval of 1000 milliseconds
    // for updating the seek slider
    this.updateTimer = setInterval(() => this.seekUpdate(), 1000);

    // Move to the next track if the current finishes playing
    // using the 'ended' event
    this.curr_track.addEventListener('ended', () => this.nextTrack());

    // Apply a random background color
    this.random_bg_color();
  }

  random_bg_color() {
    // Get a random number between 64 to 256
    // (for getting lighter colors)
    let red = Math.floor(Math.random() * 256) + 64;
    let green = Math.floor(Math.random() * 256) + 64;
    let blue = Math.floor(Math.random() * 256) + 64;

    // Construct a color withe the given values
    let bgColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';

    // Set the background to the new color
    document.body.style.background = bgColor;
  }

  // Function to reset all values to their default
  resetValues() {
    if (this.curr_time) {
      this.curr_time.textContent = '00:00';
    }
    if (this.total_duration) {
      this.total_duration.textContent = '00:00';
    }
    if (this.seek_slider) {
      (this.seek_slider as HTMLInputElement).value = '0';
    }
  }

  playpauseTrack() {
    // Switch between playing and pausing
    // depending on the current state
    if (!this.isPlaying) this.playTrack();
    else this.pauseTrack();
  }

  playTrack() {
    // Play the loaded track
    this.curr_track.play();
    this.isPlaying = true;

    // Replace icon with the pause icon
    if (this.playpause_btn) {
      this.playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    }
  }

  pauseTrack() {
    // Pause the loaded track
    this.curr_track.pause();
    this.isPlaying = false;

    // Replace icon with the play icon
    if (this.playpause_btn) {
      this.playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
    }
  }

  nextTrack() {
    // Go back to the first track if the
    // current one is the last in the track list
    if (this.track_index < this.track_list.length - 1) this.track_index += 1;
    else this.track_index = 0;

    // Load and play the new track
    this.loadTrack(this.track_index);
    this.playTrack();
  }

  prevTrack() {
    // Go back to the last track if the
    // current one is the first in the track list
    if (this.track_index > 0) this.track_index -= 1;
    else this.track_index = this.track_list.length - 1;

    // Load and play the new track
    this.loadTrack(this.track_index);
    this.playTrack();
  }
  seekTo() {
    // Calculate the seek position by the
    // percentage of the seek slider
    // and get the relative duration to the track
    let seekto = this.seek_slider
      ? this.curr_track.duration *
        ((this.seek_slider as HTMLInputElement).valueAsNumber / 100)
      : 0;

    // Set the current track position to the calculated seek position
    this.curr_track.currentTime = seekto;
  }

  setVolume() {
    // Set the volume according to the
    // percentage of the volume slider set
    if (this.volume_slider) {
      this.curr_track.volume =
        (this.volume_slider as HTMLInputElement).valueAsNumber / 100;
    }
  }

  seekUpdate() {
    let seekPosition = 0;

    // Check if the current track duration is a legible number
    if (!isNaN(this.curr_track.duration)) {
      seekPosition =
        this.curr_track.currentTime * (100 / this.curr_track.duration);
      if (this.seek_slider) {
        (this.seek_slider as HTMLInputElement).value = seekPosition.toString();
      }

      // Calculate current and total duration in minutes and seconds
      let currentMinutes = Math.floor(this.curr_track.currentTime / 60);
      let currentSeconds = Math.floor(this.curr_track.currentTime % 60);
      let durationMinutes = Math.floor(this.curr_track.duration / 60);
      let durationSeconds = Math.floor(this.curr_track.duration % 60);

      // Format time to always have two digits
      const formattedCurrentMinutes =
        currentMinutes < 10 ? '0' + currentMinutes : currentMinutes.toString();
      const formattedCurrentSeconds =
        currentSeconds < 10 ? '0' + currentSeconds : currentSeconds.toString();
      const formattedDurationMinutes =
        durationMinutes < 10
          ? '0' + durationMinutes
          : durationMinutes.toString();
      const formattedDurationSeconds =
        durationSeconds < 10
          ? '0' + durationSeconds
          : durationSeconds.toString();

      // Update the displayed time values
      if (this.curr_time) {
        this.curr_time.textContent = `${formattedCurrentMinutes}:${formattedCurrentSeconds}`;
      }
      if (this.total_duration) {
        this.total_duration.textContent = `${formattedDurationMinutes}:${formattedDurationSeconds}`;
      }
    }
  }
}
