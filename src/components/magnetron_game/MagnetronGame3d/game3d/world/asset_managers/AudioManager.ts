import * as THREE from "three"

const audioPathPrefix = "/audio"

export enum MagAudio {
    BACKGROUND = "BACKGROUND",
    BACKGROUND_SIMULATION = "BACKGROUND_SIMULATION",
}

const audioPathByName: { [K in MagAudio]: string } = {
    [MagAudio.BACKGROUND]: audioPathPrefix + "/background.mp3",
    [MagAudio.BACKGROUND_SIMULATION]: audioPathPrefix + "/simulate-background.mp3",
}

export class AudioManager {
    readonly loadedAudio: { [K in MagAudio]?: AudioBuffer } = {}
    readonly playingAudio: { [K in MagAudio]?: THREE.Audio } = {}
    readonly audioLoader = new THREE.AudioLoader()
    readonly audioListener: THREE.AudioListener

    constructor(listener: THREE.AudioListener) {
        this.audioListener = listener
    }

    private loadAudio = (name: MagAudio) =>
        new Promise<AudioBuffer>((resolve, reject) => {
            const audioPath = audioPathByName[name]
            if (!audioPath) {
                reject("Invalid audio name: " + name)
            }
            this.audioLoader.load(
                audioPath,
                (buffer) => resolve(buffer),
                () => {},
                () => reject("Could not load audio: " + audioPath),
            )
        })

    public playAudio = (name: MagAudio, volume: number = 0.5, loop: boolean = false) => {
        const loadedAudioBuffer = this.loadedAudio[name]
        if (loadedAudioBuffer) {
            const audio = new THREE.Audio(this.audioListener)
            audio.setBuffer(loadedAudioBuffer)
            audio.setLoop(loop)
            audio.setVolume(volume)
            if (audio.getLoop()) {
                this.stopAudio(name)
                this.playingAudio[name] = audio
            }
            audio.play()
        } else {
            this.loadAudio(name)
                .then((audioBuffer) => {
                    this.loadedAudio[name] = audioBuffer
                    this.playAudio(name, volume, loop)
                })
                .catch((err) => console.log("Could not load audio:", err))
        }
    }

    public stopAudio = (name: MagAudio) => {
        const existingAudio = this.playingAudio[name]
        if (existingAudio) {
            existingAudio.stop()
        }
    }
}
