
import { useEffect, useState } from "react";
import { socket } from "../../../socket";
const useTimer = () => {
    const [timer, setTimer] = useState(40);


    useEffect(() => {
        socket.on("room:timer", (data: any) => {
            if (data >= 0) {
              setTimer(data);
            } else {
              setTimer(0);
            }
          });

          return () => {
            socket.off("room:timer");
          }
    }, [])

    const percentage = Math.max(0, timer * 100 / 40);

    return {
        percentage
    }
}

export default useTimer