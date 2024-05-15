import userJoinAudio from '../../../audios/user_enter.mp3';
import userLeaveAudio from '../../../audios/user_leave.mp3';
import nextMatchAudio from '../../../audios/next_match.mp3';
import { useState } from 'react';


const useAudios = () => {
    const [canPlayAudio, setCanPlayAudio] = useState<boolean>(false)

    const playAudio = (audioMedia: string) => {
        setCanPlayAudio((canPlay) => {
            if(canPlay){
                const audio = new Audio(audioMedia);
                audio.volume=0.2
                audio.play();
            }
            return canPlay
        })
    }

    const userJoinSound = () => {
        playAudio(userJoinAudio)
    };
    
      const userLeaveSound = () => {
        playAudio(userLeaveAudio)
      };

      const nextMatchSound = () => {
        playAudio(nextMatchAudio)
      };


    return {
        userJoinSound,
        userLeaveSound,
        nextMatchSound,
        setCanPlayAudio
    }
}

export default useAudios